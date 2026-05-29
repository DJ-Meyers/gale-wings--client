import { ClerkProvider } from '@clerk/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { useState } from 'react'

import '~/index.css'
import { TRPCProvider, trpcClient } from '~/trpc/client'
import { createQueryClient } from '~/trpc/query-client'

const RootComponent = () => {
  const [queryClient] = useState(() => createQueryClient())

  return (
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/teams"
    >
      <QueryClientProvider client={queryClient}>
        <TRPCProvider queryClient={queryClient} trpcClient={trpcClient}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </TRPCProvider>
      </QueryClientProvider>
    </ClerkProvider>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})
