import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import type { PokemonEditorFormValues } from '~/components/pokemon-editor/PokemonEditorForm'
import type { TeamPokemon } from '~/components/teams/TeamPokemonCard'
import { STAT_KEYS } from '~/utils/pokemonStats'

export const MAX_TEAM_SIZE = 6

// A pokemon-shaped DB row (a team pokemon from listByTeam or a library
// template from listLibrary) — enough to seed an editor draft.
type PokemonRow = TeamPokemon & {
  notes?: string | null
  teamId?: string | null
}

// One roster slot in the team draft. Every entry carries the FULL editable
// build (so the child editor and the atomic team Save share one source of
// truth). `pokemonId` is present iff the entry is already persisted on the team;
// added entries only get an id after Save. `slug` addresses the entry in the
// `/teams/$slug/$pokemonSlug` URL (server slug for existing; species-slug for
// added — unique because of the Species Clause). `key` is the stable React /
// lookup id.
export interface DraftEntry {
  key: string
  pokemonId?: string
  slug: string
  values: PokemonEditorFormValues
}

const slugify = (name: string): string =>
  name
    .toLowerCase()
    .trim()
    .replaceAll(/[^\w\s-]/g, '')
    .replaceAll(/[\s_]+/g, '-')
    .replaceAll(/-+/g, '-')
    .replaceAll(/^-|-$/g, '')

const ZERO_EVS = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }

// Row → editor form values (mirrors toFormValues in pokemon_.$slug.tsx).
const rowToValues = (row: PokemonRow): PokemonEditorFormValues => ({
  name: row.name ?? '',
  notes: row.notes ?? '',
  pokemon: {
    species: row.species,
    nature: row.nature || 'Serious',
    ability: row.ability ?? '',
    item: row.item || undefined,
    statPoints: row.statPoints,
    moves: row.moves ?? [],
  },
})

const emptyValues = (species: string): PokemonEditorFormValues => ({
  name: '',
  notes: '',
  pokemon: {
    // The picker only yields legal species names; narrow the runtime string to
    // the form's literal-union species type.
    species: species as PokemonEditorFormValues['pokemon']['species'],
    nature: 'Serious',
    ability: '',
    item: undefined,
    statPoints: { ...ZERO_EVS },
    moves: [],
  },
})

// A roster entry in the shape team.saveLayout expects (build fields flattened).
const toSaveEntry = (e: DraftEntry) => {
  const { name, notes, pokemon: p } = e.values
  const build = {
    name,
    notes,
    species: p.species,
    nature: p.nature,
    ability: p.ability,
    item: p.item,
    moves: p.moves.filter(Boolean),
    statPoints: p.statPoints,
  }
  return e.pokemonId
    ? ({ kind: 'existing', pokemonId: e.pokemonId, ...build } as const)
    : ({ kind: 'new', ...build } as const)
}

const speciesKey = (e: DraftEntry) =>
  e.values.pokemon.species.trim().toLowerCase()

// A comparison-only view of an entry: exactly the fields that get saved, in a
// stable shape. Dirty detection diffs this rather than the raw form values, so
// cosmetic re-normalizations that don't change what would be saved — statPoints
// key order, empty trailing move slots, `item: undefined` vs. an absent key,
// name whitespace — never register as edits. (Without this, focusing the team
// name field and blurring it, or merely opening a pokemon's editor, could flip
// the draft to "dirty" and wrongly trip the unsaved-changes guard.)
const canonicalEntry = (e: DraftEntry) => {
  const { name, notes, pokemon: p } = e.values
  return {
    id: e.pokemonId ?? null,
    name: name.trim(),
    notes: notes ?? '',
    species: p.species,
    nature: p.nature,
    ability: p.ability ?? '',
    item: p.item ?? '',
    moves: (p.moves ?? []).filter(Boolean),
    stats: STAT_KEYS.map((k) => p.statPoints?.[k] ?? 0),
  }
}

// Per-entry canonical string, for both the whole-draft signature and the
// per-pokemon "changed since save" check (see dirtyKeys).
const entrySignature = (e: DraftEntry) => JSON.stringify(canonicalEntry(e))

// Stable string identity of the draft, for dirty detection (order-sensitive).
const signature = (name: string, entries: DraftEntry[]) =>
  JSON.stringify({ name: name.trim(), list: entries.map(canonicalEntry) })

interface TeamDraftContextValue {
  name: string
  setName: (v: string) => void
  entries: DraftEntry[]
  canAdd: boolean
  speciesOnTeam: Set<string>
  addNew: (species: string) => void
  addFromTemplate: (template: PokemonRow) => void
  removeEntry: (key: string) => void
  swapEntry: (index: number, direction: -1 | 1) => void
  updateEntryValues: (key: string, values: PokemonEditorFormValues) => void
  findBySlug: (slug: string) => DraftEntry | undefined
  isDirty: boolean
  // Keys of entries with unsaved changes: added this session, or edited away
  // from the server baseline. Drives the roster's per-card "changed" glow.
  dirtyKeys: Set<string>
  toSaveRoster: () => ReturnType<typeof toSaveEntry>[]
}

const TeamDraftContext = createContext<TeamDraftContextValue | null>(null)

export const useTeamDraft = () => {
  const ctx = useContext(TeamDraftContext)
  if (!ctx) throw new Error('useTeamDraft must be used within a TeamDraftProvider')
  return ctx
}

interface TeamDraftProviderProps {
  // The authoritative team (its `version` keys reseeding) and its server roster.
  team: { name: string; version: number }
  serverRoster: { pokemon: PokemonRow; slot: number }[] | undefined
  children: ReactNode
}

// Owns the team-detail draft and shares it across the roster and the nested
// per-pokemon editor so navigating between them never discards edits. Reseeds
// from the server whenever the team's version changes (our own save bumps it,
// as does an external edit).
export const TeamDraftProvider = ({
  team,
  serverRoster,
  children,
}: TeamDraftProviderProps) => {
  const [name, setName] = useState(team.name)
  const [entries, setEntries] = useState<DraftEntry[]>([])
  const baselineRef = useRef<string>('')
  // Per-entry baseline signature (keyed by the seeded entry key), so the roster
  // can tell which specific pokemon changed since the last save.
  const baselineByKeyRef = useRef<Map<string, string>>(new Map())
  const tempCounter = useRef(0)
  // The version we last seeded from; reseed only when it advances so in-progress
  // edits aren't clobbered on every re-render.
  const seededVersion = useRef<number | null>(null)

  if (serverRoster && seededVersion.current !== team.version) {
    // Seed during render (idempotent per version) so children observe the draft
    // immediately, mirroring the previous local-state seeding.
    const seeded: DraftEntry[] = serverRoster.map((r) => ({
      key: r.pokemon.id,
      pokemonId: r.pokemon.id,
      slug: r.pokemon.slug,
      values: rowToValues(r.pokemon),
    }))
    seededVersion.current = team.version
    baselineRef.current = signature(team.name, seeded)
    baselineByKeyRef.current = new Map(
      seeded.map((e) => [e.key, entrySignature(e)]),
    )
    setName(team.name)
    setEntries(seeded)
  }

  const speciesOnTeam = useMemo(
    () => new Set(entries.map(speciesKey)),
    [entries],
  )

  const addNew = useCallback((species: string) => {
    const s = species.trim()
    if (!s) return
    setEntries((es) => {
      if (es.length >= MAX_TEAM_SIZE) return es
      if (es.some((e) => speciesKey(e) === s.toLowerCase())) return es
      return [
        ...es,
        { key: `tmp-${tempCounter.current++}`, slug: slugify(s), values: emptyValues(s) },
      ]
    })
  }, [])

  const addFromTemplate = useCallback((template: PokemonRow) => {
    const s = template.species.trim().toLowerCase()
    setEntries((es) => {
      if (es.length >= MAX_TEAM_SIZE) return es
      if (es.some((e) => speciesKey(e) === s)) return es
      return [
        ...es,
        {
          key: `tmp-${tempCounter.current++}`,
          slug: slugify(template.species),
          values: rowToValues(template),
        },
      ]
    })
  }, [])

  const removeEntry = useCallback((key: string) => {
    setEntries((es) => es.filter((e) => e.key !== key))
  }, [])

  const swapEntry = useCallback((index: number, direction: -1 | 1) => {
    setEntries((es) => {
      const j = index + direction
      if (j < 0 || j >= es.length) return es
      const next = [...es]
      ;[next[index], next[j]] = [next[j], next[index]]
      return next
    })
  }, [])

  const updateEntryValues = useCallback(
    (key: string, values: PokemonEditorFormValues) => {
      setEntries((es) =>
        es.map((e) => (e.key === key ? { ...e, values } : e)),
      )
    },
    [],
  )

  const findBySlug = useCallback(
    (slug: string) => entries.find((e) => e.slug === slug),
    [entries],
  )

  const isDirty = signature(name, entries) !== baselineRef.current

  // Which entries changed since the last save: added this session (no baseline
  // for the key) or edited away from their seeded server signature. Order/slot
  // changes aren't per-card dirty — a reordered-but-otherwise-identical pokemon
  // isn't "changed" — so this diffs content only, keyed by entry, not position.
  const dirtyKeys = useMemo(() => {
    const baseline = baselineByKeyRef.current
    const keys = new Set<string>()
    for (const e of entries) {
      const base = baseline.get(e.key)
      if (base === undefined || base !== entrySignature(e)) keys.add(e.key)
    }
    return keys
  }, [entries])

  const toSaveRoster = useCallback(() => entries.map(toSaveEntry), [entries])

  const value: TeamDraftContextValue = {
    name,
    setName,
    entries,
    canAdd: entries.length < MAX_TEAM_SIZE,
    speciesOnTeam,
    addNew,
    addFromTemplate,
    removeEntry,
    swapEntry,
    updateEntryValues,
    findBySlug,
    isDirty,
    dirtyKeys,
    toSaveRoster,
  }

  return (
    <TeamDraftContext.Provider value={value}>
      {children}
    </TeamDraftContext.Provider>
  )
}
