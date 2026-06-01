import type {
  FieldConditions,
  ParseInputResult,
} from '@dj-meyers/gale-wings/types'

import { useNamedQuery } from '~/hooks/useNamedQuery'
import { useTRPC } from '~/trpc/client'

// Static, immutable lists — cache forever. Matches `app/data/prefetch.ts`.
const FOREVER = { staleTime: Infinity, gcTime: Infinity } as const

// User-driven search results — moderate freshness window.
const SEARCH_STALE = { staleTime: 5 * 60_000 } as const

// Input-deterministic parse results — cache key already encodes the answer,
// so re-fetch never needs to fire. Default gcTime lets stale inputs evict.
const PARSE_CACHE = { staleTime: Infinity } as const

interface SearchOptions {
  limit?: number
}

// Mirrors `parseVsInput`'s return shape in gale-wings--api/packages/server/src/parser/parser.ts.
// Not re-exported through @dj-meyers/gale-wings/types; safe to mirror because the
// three fields are themselves @dj-meyers/gale-wings exports.
export interface VsParseResult {
  attacker: ParseInputResult
  defender: ParseInputResult
  fieldConditions: FieldConditions
}

/**
 * Static list of every Champions-legal species for the current regulation,
 * narrowly typed as the regulation's literal union (e.g. `'Incineroar' |
 * 'Flutter Mane' | …`). Use this for autocomplete and teambuilder dropdowns.
 *
 * Cached forever. Pair with `app/data/prefetch.ts` which warms this at boot.
 */
export const useListChampionsSpecies = () => {
  const trpc = useTRPC()
  return useNamedQuery(
    trpc.data.listChampionsSpecies.queryOptions(undefined, FOREVER),
    'species',
  )
}

/**
 * Static list of every dex species (typed `string[]`). Use only when the
 * caller needs unrestricted species (sandbox calc against arbitrary mons,
 * imports from external sources, etc.). Most UI surfaces should use
 * `useListChampionsSpecies` instead.
 */
export const useListAllSpecies = () => {
  const trpc = useTRPC()
  return useNamedQuery(
    trpc.data.listAllSpecies.queryOptions(undefined, FOREVER),
    'species',
  )
}

/**
 * Static list of every move. Cached forever.
 */
export const useListMoves = () => {
  const trpc = useTRPC()
  return useNamedQuery(
    trpc.data.listMoves.queryOptions(undefined, FOREVER),
    'moves',
  )
}

/**
 * Static list of every legal item. Cached forever.
 */
export const useListItems = () => {
  const trpc = useTRPC()
  return useNamedQuery(
    trpc.data.listItems.queryOptions(undefined, FOREVER),
    'items',
  )
}

/**
 * Static list of every ability. Cached forever.
 */
export const useListAbilities = () => {
  const trpc = useTRPC()
  return useNamedQuery(
    trpc.data.listAbilities.queryOptions(undefined, FOREVER),
    'abilities',
  )
}

/**
 * Per-species ability lookup (typically 1–3 entries). Returns [] for an
 * unknown species. Disabled while `species` is empty.
 */
export const useSpeciesAbilities = (species: string) => {
  const trpc = useTRPC()
  return useNamedQuery(
    trpc.data.speciesAbilities.queryOptions(
      { species },
      { ...FOREVER, enabled: Boolean(species) },
    ),
    'speciesAbilities',
  )
}

/**
 * Strict per-species learnable-moves lookup. Returns the move pool for the
 * given species, or [] for an unknown species. Disabled while `species`
 * is empty.
 *
 * For the composite "fall back to all moves when no species" behaviour,
 * use `useLearnableMoves` from `~/hooks/useLearnableMoves`.
 */
export const useLearnableMovesForSpecies = (species: string) => {
  const trpc = useTRPC()
  return useNamedQuery(
    trpc.data.learnableMoves.queryOptions(
      { species },
      { ...FOREVER, enabled: Boolean(species) },
    ),
    'learnableMoves',
  )
}

/**
 * Substring/prefix search over the species pool. 5-minute stale window.
 */
export const useSearchSpecies = (query: string, opts: SearchOptions = {}) => {
  const trpc = useTRPC()
  return useNamedQuery(
    trpc.data.searchSpecies.queryOptions(
      { query, limit: opts.limit },
      SEARCH_STALE,
    ),
    'searchSpecies',
  )
}

/**
 * Substring/prefix search over the move pool. 5-minute stale window.
 */
export const useSearchMoves = (query: string, opts: SearchOptions = {}) => {
  const trpc = useTRPC()
  return useNamedQuery(
    trpc.data.searchMoves.queryOptions(
      { query, limit: opts.limit },
      SEARCH_STALE,
    ),
    'searchMoves',
  )
}

/**
 * Substring/prefix search over the item pool. 5-minute stale window.
 */
export const useSearchItems = (query: string, opts: SearchOptions = {}) => {
  const trpc = useTRPC()
  return useNamedQuery(
    trpc.data.searchItems.queryOptions(
      { query, limit: opts.limit },
      SEARCH_STALE,
    ),
    'searchItems',
  )
}

/**
 * Substring/prefix search over abilities. If `species` is supplied, the
 * search pool is restricted to that species' abilities; otherwise the
 * full ability list is searched. 5-minute stale window.
 */
export const useSearchAbilities = (
  query: string,
  species?: string,
  opts: SearchOptions = {},
) => {
  const trpc = useTRPC()
  return useNamedQuery(
    trpc.data.searchAbilities.queryOptions(
      { query, species, limit: opts.limit },
      SEARCH_STALE,
    ),
    'searchAbilities',
  )
}

/**
 * Showdown-style "X vs Y" parse. Returns attacker + defender ParseInputResults
 * and merged fieldConditions. Disabled while `input` is empty.
 *
 * The caller is responsible for debouncing — the home-page textarea passes a
 * debounced value so each keystroke doesn't fire a request.
 */
export const useParseVs = (input: string) => {
  const trpc = useTRPC()
  return useNamedQuery(
    trpc.parser.parseVs.queryOptions(
      { input },
      { ...PARSE_CACHE, enabled: Boolean(input) },
    ),
    'parseVs',
  )
}
