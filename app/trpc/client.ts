import type { AppRouter } from '@dj-meyers/gale-wings--api-types'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { createTRPCContext } from '@trpc/tanstack-react-query'
import superjson from 'superjson'

export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<AppRouter>()

type ClerkGlobal = {
  session?: { getToken: () => Promise<string | null> }
}

const getAuthHeader = async (): Promise<Record<string, string>> => {
  if (import.meta.env.VITE_DEV_BYPASS_AUTH === 'true') {
    return { authorization: 'Bearer dev-bypass' }
  }
  const clerk = (window as unknown as { Clerk?: ClerkGlobal }).Clerk
  const token = await clerk?.session?.getToken()
  return token ? { authorization: `Bearer ${token}` } : {}
}

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${import.meta.env.VITE_API_URL}/api/trpc`,
      transformer: superjson,
      headers: getAuthHeader,
    }),
  ],
})
