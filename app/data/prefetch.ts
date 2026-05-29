import { trpcProxy } from '~/trpc/proxy'
import { queryClient } from '~/trpc/query-client'

// Static data the API treats as process-lifetime-immutable (plan §2.9):
// species, moves, items, abilities. Cached forever — never refetched.
const FOREVER = { staleTime: Infinity, gcTime: Infinity } as const

// Kick off the four static-data fetches in parallel. Fire-and-forget
// from main.tsx so the first useQuery() call in any route either hits
// a warm cache or waits on the already-in-flight request rather than
// firing a duplicate (Q11a).
export const prefetchStaticData = (): Promise<unknown> =>
  Promise.all([
    queryClient.prefetchQuery(
      trpcProxy.data.listSpecies.queryOptions(undefined, FOREVER),
    ),
    queryClient.prefetchQuery(
      trpcProxy.data.listMoves.queryOptions(undefined, FOREVER),
    ),
    queryClient.prefetchQuery(
      trpcProxy.data.listItems.queryOptions(undefined, FOREVER),
    ),
    queryClient.prefetchQuery(
      trpcProxy.data.listAbilities.queryOptions(undefined, FOREVER),
    ),
  ])
