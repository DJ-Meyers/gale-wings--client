import { useStore } from '@tanstack/react-form'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

import { ChevronUpIcon } from '~/components/icons'
import {
  PokemonEditorForm,
  usePokemonEditorForm,
  type PokemonEditorFormValues,
} from '~/components/pokemon-editor/PokemonEditorForm'
import { useTeamDraft, type DraftEntry } from '~/context/TeamDraftContext'

// Edits one team pokemon within the shared team draft. There's no per-pokemon
// Save: changes flow live into the draft and are committed with the whole team
// via the Save button in the team header (the parent layout stays mounted, so
// the draft — and this edit — survive navigating here and back).
const TeamPokemonEditorPage = () => {
  const { slug, pokemonSlug } = Route.useParams()
  const navigate = useNavigate()
  const { findBySlug, updateEntryValues, entries } = useTeamDraft()
  const entry = findBySlug(pokemonSlug)

  // Remember which pokemon this page is editing, keyed by its stable id and its
  // species, so we can follow it if a save changes its slug (below).
  const editingRef = useRef<{ key: string; species: string } | null>(null)
  useEffect(() => {
    if (entry) {
      editingRef.current = {
        key: entry.key,
        species: entry.values.pokemon.species,
      }
    }
  }, [entry])

  // A save reseeds the draft from the server, and a pokemon's slug is derived
  // from its name (see computeRosterSlugs) — so renaming it and hitting Save
  // leaves this URL's slug stale and findBySlug empty, stranding the page on a
  // "not found". Re-resolve the same pokemon by its stable key (an existing
  // entry keeps its id) or, failing that, its species (a newly-added entry's
  // temp key is replaced with a real id on save), and swap in the new slug.
  const moved =
    !entry && editingRef.current
      ? (entries.find((e) => e.key === editingRef.current!.key) ??
        entries.find(
          (e) => e.values.pokemon.species === editingRef.current!.species,
        ))
      : undefined
  useEffect(() => {
    if (moved) {
      void navigate({
        to: '/teams/$slug/$pokemonSlug',
        params: { slug, pokemonSlug: moved.slug },
        replace: true,
      })
    }
  }, [moved, navigate, slug])

  const backLink = (
    <Link
      className="text-primary hover:text-primary-hover mb-4 inline-flex items-center gap-1 text-sm"
      params={{ slug }}
      to="/teams/$slug"
    >
      <ChevronUpIcon className="h-3.5 w-3.5 -rotate-90" />
      Back to team
    </Link>
  )

  if (!entry) {
    return (
      <div>
        {backLink}
        <p className="text-text-dim text-sm">
          {moved
            ? 'Loading…'
            : 'That Pokémon isn’t in this team’s draft.'}
        </p>
      </div>
    )
  }

  return (
    <div>
      {backLink}
      {/* key on the entry so the form re-initializes when switching pokemon */}
      <TeamPokemonEditorForm
        key={entry.key}
        entry={entry}
        onChange={updateEntryValues}
      />
    </div>
  )
}

interface TeamPokemonEditorFormProps {
  entry: DraftEntry
  onChange: (key: string, values: PokemonEditorFormValues) => void
}

const TeamPokemonEditorForm = ({
  entry,
  onChange,
}: TeamPokemonEditorFormProps) => {
  const form = usePokemonEditorForm({ defaultValues: entry.values })

  // Push edits into the shared draft as the form changes. `defaultValues` seeds
  // the form once (component is keyed by entry.key), so writing back to the
  // draft doesn't reset it — no loop.
  const values = useStore(form.store, (s) => s.values)
  useEffect(() => {
    onChange(entry.key, values)
  }, [values, entry.key, onChange])

  const displayName = entry.values.name || entry.values.pokemon.species

  return (
    <div>
      <h2 className="text-text-heading mb-3 text-lg font-semibold">
        {displayName}
      </h2>
      <PokemonEditorForm form={form} />
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/teams_/$slug/$pokemonSlug')(
  {
    component: TeamPokemonEditorPage,
  },
)
