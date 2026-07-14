import type { InferDataFromTag } from '@tanstack/react-query'

import { trpcProxy } from '~/trpc/proxy'
import { queryClient } from '~/trpc/query-client'

// Cache helpers for pokemon.* query keys. See app/trpc/cache/teams.ts for the
// singleton/DataTag rationale and the test-visibility caveat.

// Seed payload type inferred from the DataTag the listByTeam key carries.
type PokemonByTeam = InferDataFromTag<
  unknown,
  ReturnType<typeof trpcProxy.pokemon.listByTeam.queryKey>
>

export const invalidatePokemonById = (id: string) =>
  queryClient.invalidateQueries({
    queryKey: trpcProxy.pokemon.get.queryKey({ id }),
  })

// Wildcard: invalidate every cached pokemon getBySlug entry.
export const invalidateAllPokemonBySlug = () =>
  queryClient.invalidateQueries({
    queryKey: trpcProxy.pokemon.getBySlug.queryKey(),
  })

export const invalidatePokemonByTeam = (teamId: string) =>
  queryClient.invalidateQueries({
    queryKey: trpcProxy.pokemon.listByTeam.queryKey({ teamId }),
  })

export const invalidatePokemonLibrary = () =>
  queryClient.invalidateQueries({
    queryKey: trpcProxy.pokemon.listLibrary.queryKey(),
  })

// Seed (setQueryData) — prime a team's roster from a server result so the page
// resolves from cache without a flash.
export const seedPokemonByTeam = (teamId: string, pokemon: PokemonByTeam) =>
  queryClient.setQueryData(
    trpcProxy.pokemon.listByTeam.queryKey({ teamId }),
    pokemon,
  )

export const removePokemonByTeam = (teamId: string) =>
  queryClient.removeQueries({
    queryKey: trpcProxy.pokemon.listByTeam.queryKey({ teamId }),
  })
