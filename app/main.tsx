import { ClerkProvider, useAuth } from '@clerk/react'
import { RouterProvider } from '@tanstack/react-router'
import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'

import { prefetchStaticData } from '~/data/prefetch'
import { getRouter } from '~/router'

const router = getRouter()

// Fire-and-forget so first useQuery() against listSpecies / listMoves /
// listItems / listAbilities either hits the warm cache or de-dupes onto
// this in-flight request rather than triggering another network round trip.
void prefetchStaticData()

const App = () => {
  const auth = useAuth()

  useEffect(() => {
    if (auth.isLoaded) {
      void router.invalidate()
    }
  }, [auth.isLoaded, auth.isSignedIn])

  if (!auth.isLoaded) return null

  return <RouterProvider router={router} context={{ auth }} />
}

createRoot(document.querySelector('#root')!).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/teams"
    >
      <App />
    </ClerkProvider>
  </StrictMode>,
)
