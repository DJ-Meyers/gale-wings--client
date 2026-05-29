import type {
  ChampionsAbility,
  ChampionsItem,
  ChampionsMove,
  ChampionsSpecies,
} from '@dj-meyers/galewings/types'

import { useNamedQuery } from '~/hooks/useNamedQuery'
import { useTRPC } from '~/trpc/client'

// Static, immutable lists — cache forever. Matches `app/data/prefetch.ts`.
const FOREVER = { staleTime: Infinity, gcTime: Infinity } as const

// User-driven search results — moderate freshness window.
const SEARCH_STALE = { staleTime: 5 * 60_000 } as const

interface SearchOptions {
  limit?: number
}

/**
 * Static list of every species in the regulation pool. Cached forever.
 * Pair with `app/data/prefetch.ts` which warms this at boot.
 */
export const useListSpecies = () => {
  const trpc = useTRPC()
  return useNamedQuery<ChampionsSpecies[]>(
    trpc.data.listSpecies.queryOptions(undefined, FOREVER),
    'species',
  )
}

/**
 * Static list of every move. Cached forever.
 */
export const useListMoves = () => {
  const trpc = useTRPC()
  return useNamedQuery<ChampionsMove[]>(
    trpc.data.listMoves.queryOptions(undefined, FOREVER),
    'moves',
  )
}

/**
 * Static list of every legal item. Cached forever.
 */
export const useListItems = () => {
  const trpc = useTRPC()
  return useNamedQuery<ChampionsItem[]>(
    trpc.data.listItems.queryOptions(undefined, FOREVER),
    'items',
  )
}

/**
 * Static list of every ability. Cached forever.
 */
export const useListAbilities = () => {
  const trpc = useTRPC()
  return useNamedQuery<ChampionsAbility[]>(
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
  return useNamedQuery<ChampionsAbility[]>(
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
  return useNamedQuery<ChampionsMove[]>(
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
  return useNamedQuery<ChampionsSpecies[]>(
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
  return useNamedQuery<ChampionsMove[]>(
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
  return useNamedQuery<ChampionsItem[]>(
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
  return useNamedQuery<ChampionsAbility[]>(
    trpc.data.searchAbilities.queryOptions(
      { query, species, limit: opts.limit },
      SEARCH_STALE,
    ),
    'searchAbilities',
  )
}
