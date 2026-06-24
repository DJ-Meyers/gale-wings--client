import {
  MutationCache,
  QueryCache,
  QueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'

declare module '@tanstack/react-query' {
  interface Register {
    queryMeta: { silentError?: boolean }
    mutationMeta: { silentError?: boolean }
  }
}

const errorMessage = (err: unknown): string => {
  if (err && typeof err === 'object' && 'message' in err) {
    const msg = (err as { message?: unknown }).message
    if (typeof msg === 'string' && msg.length > 0) return msg
  }
  return 'Something went wrong'
}

const errorCode = (err: unknown): string | undefined => {
  const data = (err as { data?: { code?: unknown } } | null)?.data
  return typeof data?.code === 'string' ? data.code : undefined
}

// Module-level singleton — created once per page load. The prefetch
// helper in app/data/prefetch.ts and the React provider in __root.tsx
// share this instance.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      retry: (n, e) => {
        const code = errorCode(e)
        if (code === 'UNAUTHORIZED' || code === 'NOT_FOUND') return false
        return n < 2
      },
    },
  },
  queryCache: new QueryCache({
    onError: (err, query) => {
      if (query.meta?.silentError) return
      // UNAUTHORIZED is handled by the route guard / sign-in redirect; toasting
      // it on every protected-procedure failure would spam the user during
      // sign-out.
      if (errorCode(err) === 'UNAUTHORIZED') return
      toast.error(errorMessage(err))
    },
  }),
  mutationCache: new MutationCache({
    onError: (err, _vars, _ctx, mutation) => {
      if (mutation.meta?.silentError) return
      if (errorCode(err) === 'UNAUTHORIZED') return
      toast.error(errorMessage(err))
    },
  }),
})
