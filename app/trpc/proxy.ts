import type { AppRouter } from '@dj-meyers/galewings/router'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'

import { trpcClient } from '~/trpc/client'
import { queryClient } from '~/trpc/query-client'

// Imperative trpc options proxy for use outside the React tree
// (e.g. boot-time prefetch in app/data/prefetch.ts). Query keys and
// fetchers match the ones useTRPC().*.queryOptions() produces, so
// the cache slot is shared.
export const trpcProxy = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
})
