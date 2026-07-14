import type { InferDataFromTag } from '@tanstack/react-query'

import { trpcProxy } from '~/trpc/proxy'
import { queryClient } from '~/trpc/query-client'

// Cache helpers for team.* query keys. Built on the trpcProxy + queryClient
// singletons — the SAME instances the React provider wires up (see
// app/trpc/proxy.ts / __root.tsx) — so these hit the identical cache slots as
// useTRPC().*.queryKey() does in-component. Each helper does exactly ONE cache
// operation; the orchestration/"why" stays at the call site.
//
// NOTE: because these close over the module singleton, they are invisible to
// any future test that renders with its own QueryClient. None exists today; if
// one is added, reset the singleton between tests or switch to a hook factory.

// Seed payload type, inferred from the DataTag the queryKey carries — no
// RouterOutputs alias needed. NonNullable because getBySlug can resolve null
// but we only ever seed a real team (and read team.slug below).
type TeamBySlug = NonNullable<
  InferDataFromTag<unknown, ReturnType<typeof trpcProxy.team.getBySlug.queryKey>>
>

export const invalidateTeamsList = () =>
  queryClient.invalidateQueries({ queryKey: trpcProxy.team.list.queryKey() })

export const invalidateTeamById = (id: string) =>
  queryClient.invalidateQueries({
    queryKey: trpcProxy.team.get.queryKey({ id }),
  })

export const invalidateTeamBySlug = (slug: string) =>
  queryClient.invalidateQueries({
    queryKey: trpcProxy.team.getBySlug.queryKey({ slug }),
  })

// Wildcard: invalidate every cached getBySlug entry regardless of slug arg.
export const invalidateAllTeamsBySlug = () =>
  queryClient.invalidateQueries({
    queryKey: trpcProxy.team.getBySlug.queryKey(),
  })

export const invalidateTeamHistory = (teamId: string) =>
  queryClient.invalidateQueries({
    queryKey: trpcProxy.team.history.queryKey({ teamId }),
  })

// Seed (setQueryData) — prime a slug lookup so navigating to the team resolves
// from cache instead of dropping to a loading state.
export const seedTeamBySlug = (team: TeamBySlug) =>
  queryClient.setQueryData(
    trpcProxy.team.getBySlug.queryKey({ slug: team.slug }),
    team,
  )

export const removeTeamById = (id: string) =>
  queryClient.removeQueries({ queryKey: trpcProxy.team.get.queryKey({ id }) })

export const removeTeamHistory = (teamId: string) =>
  queryClient.removeQueries({
    queryKey: trpcProxy.team.history.queryKey({ teamId }),
  })

export const removeTeamBySlug = (slug: string) =>
  queryClient.removeQueries({
    queryKey: trpcProxy.team.getBySlug.queryKey({ slug }),
  })
