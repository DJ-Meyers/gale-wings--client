import {
  itemAliases,
  moveAliases,
  speciesAliases,
} from '@dj-meyers/gale-wings/aliases'
import { toID } from '@smogon/calc'

export type AliasCategory = 'Move' | 'Item' | 'Species'

export interface AliasEntry {
  category: AliasCategory
  canonical: string
  aliases: readonly string[]
}

const SOURCES: ReadonlyArray<
  readonly [AliasCategory, Record<string, readonly string[]>]
> = [
  ['Move', moveAliases],
  ['Item', itemAliases],
  ['Species', speciesAliases],
]

// Flattened canonical → aliases across all three data modules, tagged with the
// category they came from. Built once at module load; the underlying data is
// static.
export const ALL_ALIASES: readonly AliasEntry[] = SOURCES.flatMap(
  ([category, data]) =>
    Object.entries(data).map(([canonical, aliases]) => ({
      category,
      canonical,
      aliases,
    })),
)

// Relevance buckets (lower is better): exact id match, then prefix, then any
// substring. Within a bucket entries stay alphabetical by canonical name.
const rank = (entry: AliasEntry, id: string): number => {
  const ids = [toID(entry.canonical), ...entry.aliases.map(toID)]
  if (ids.some((value) => value === id)) return 0
  if (ids.some((value) => value.startsWith(id))) return 1
  return 2
}

/**
 * Substring search over every alias entry. The query is normalised with the
 * same `toID` the alias system uses to resolve input (case/space/dash
 * insensitive), then matched as a substring of the canonical name *or* any
 * alias.
 *
 * This is intentionally looser than the CLI's exact-equality lookup: searching
 * `"Jet"` surfaces both an entry aliased `"Jet"` (e.g. a hypothetical "Jet
 * Punch") and `"Aqua Jet"`, whose canonical name merely contains "Jet" — the
 * latter carrying its own aliases like `"AJ"`.
 *
 * Returns [] for an empty/whitespace query. Results are sorted by relevance.
 */
export const searchAliases = (query: string): AliasEntry[] => {
  const id = toID(query)
  if (!id) return []

  return ALL_ALIASES.filter(
    ({ canonical, aliases }) =>
      toID(canonical).includes(id) ||
      aliases.some((alias) => toID(alias).includes(id)),
  ).sort((a, b) => {
    const byRank = rank(a, id) - rank(b, id)
    return byRank !== 0 ? byRank : a.canonical.localeCompare(b.canonical)
  })
}
