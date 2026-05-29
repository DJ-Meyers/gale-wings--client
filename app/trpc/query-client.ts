import { QueryClient } from '@tanstack/react-query'

export const createQueryClient = () =>
  new QueryClient({
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
