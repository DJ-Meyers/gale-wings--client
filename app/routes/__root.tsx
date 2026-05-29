import { QueryClientProvider } from '@tanstack/react-query'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

import '~/index.css'
import type { RouterContext } from '~/router'
import { TRPCProvider, trpcClient } from '~/trpc/client'
import { queryClient } from '~/trpc/query-client'

const RootComponent = () => (
  <QueryClientProvider client={queryClient}>
    <TRPCProvider queryClient={queryClient} trpcClient={trpcClient}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </TRPCProvider>
  </QueryClientProvider>
)

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})
