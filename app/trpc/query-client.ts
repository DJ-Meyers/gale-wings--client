import { QueryClient } from '@tanstack/react-query'

// Module-level singleton — created once per page load. The prefetch
// helper in app/data/prefetch.ts and the React provider in __root.tsx
// share this instance.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      retry: (n, e) => {
        const code = (e as { data?: { code?: string } })?.data?.code
        if (code === 'UNAUTHORIZED' || code === 'NOT_FOUND') return false
        return n < 2
      },
    },
  },
})
