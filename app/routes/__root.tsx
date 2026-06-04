import { QueryClientProvider } from '@tanstack/react-query'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { useLayoutEffect } from 'react'

import '~/index.css'
import { useTheme } from '~/hooks/useTheme'
import type { RouterContext } from '~/router'
import { TRPCProvider, trpcClient } from '~/trpc/client'
import { queryClient } from '~/trpc/query-client'

const RootComponent = () => {
  const { mode } = useTheme()

  // Keep the document in sync with the active mode (covers toggles in this tab
  // and theme changes propagated from other tabs). The initial paint is set by
  // the inline boot script in index.html to avoid a flash of the wrong theme.
  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-mode', mode)
  }, [mode])

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider queryClient={queryClient} trpcClient={trpcClient}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </TRPCProvider>
    </QueryClientProvider>
  )
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})
