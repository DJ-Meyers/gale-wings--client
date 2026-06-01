import {
  useQuery,
  useSuspenseQuery,
  type UseQueryOptions,
  type UseSuspenseQueryOptions,
} from '@tanstack/react-query'

type NamedQueryResult<TData, TError, Name extends string> = {
  [K in Name]: TData | undefined
} & {
  [K in `is${Capitalize<Name>}Pending`]: boolean
} & {
  [K in `is${Capitalize<Name>}Loading`]: boolean
} & {
  [K in `is${Capitalize<Name>}Fetching`]: boolean
} & {
  [K in `is${Capitalize<Name>}Error`]: boolean
} & {
  [K in `${Name}Error`]: TError | null
}

type SuspenseNamedQueryResult<TData, TError, Name extends string> = {
  [K in Name]: TData
} & {
  [K in `is${Capitalize<Name>}Pending`]: boolean
} & {
  [K in `is${Capitalize<Name>}Loading`]: boolean
} & {
  [K in `is${Capitalize<Name>}Fetching`]: boolean
} & {
  [K in `is${Capitalize<Name>}Error`]: boolean
} & {
  [K in `${Name}Error`]: TError | null
}

// The four `any`s in the constraint match any TanStack-shaped options object
// (including tRPC's `UnusedSkipTokenTRPCQueryOptionsOut`, whose TQueryFnData
// is the wire type and whose TQueryKey is a branded mutable tuple — neither
// assigns to the strict `useQuery` generics in invariant positions). TData
// and TError are recovered from the options via conditional inference, so
// the result stays end-to-end typed.
type DataOf<O> = O extends UseQueryOptions<any, any, infer D, any> ? D : never
type ErrorOf<O> = O extends UseQueryOptions<any, infer E, any, any> ? E : never
type SuspenseDataOf<O> =
  O extends UseSuspenseQueryOptions<any, any, infer D, any> ? D : never
type SuspenseErrorOf<O> =
  O extends UseSuspenseQueryOptions<any, infer E, any, any> ? E : never

/**
 * Wraps `useQuery` and remaps its return properties under a descriptive name.
 *
 * Uses a Proxy to preserve React Query's tracked-property optimization —
 * only properties you destructure will trigger re-renders.
 *
 * @example
 * ```ts
 * const { team, isTeamPending, teamError } =
 *   useNamedQuery(trpc.team.getBySlug.queryOptions({ slug }), 'team')
 * ```
 */
export const useNamedQuery = <
  O extends UseQueryOptions<any, any, any, any>,
  Name extends string,
>(
  options: O,
  name: Name,
): NamedQueryResult<DataOf<O>, ErrorOf<O>, Name> => {
  const query = useQuery(options)
  const capitalized = name[0].toUpperCase() + name.slice(1)

  return new Proxy(query, {
    get: (target, prop) => {
      if (prop === name) return target.data
      if (prop === `is${capitalized}Pending`) return target.isPending
      if (prop === `is${capitalized}Loading`) return target.isLoading
      if (prop === `is${capitalized}Fetching`) return target.isFetching
      if (prop === `is${capitalized}Error`) return target.isError
      if (prop === `${name}Error`) return target.error
      return target[prop as keyof typeof target]
    },
  }) as unknown as NamedQueryResult<DataOf<O>, ErrorOf<O>, Name>
}

/**
 * Wraps `useSuspenseQuery` and remaps its return properties under a descriptive name.
 *
 * The `{name}` property is `TData` (not `TData | undefined`) since suspense
 * guarantees data is available.
 */
export const useSuspenseNamedQuery = <
  O extends UseSuspenseQueryOptions<any, any, any, any>,
  Name extends string,
>(
  options: O,
  name: Name,
): SuspenseNamedQueryResult<SuspenseDataOf<O>, SuspenseErrorOf<O>, Name> => {
  const query = useSuspenseQuery(options)
  const capitalized = name[0].toUpperCase() + name.slice(1)

  return new Proxy(query, {
    get: (target, prop) => {
      if (prop === name) return target.data
      if (prop === `is${capitalized}Pending`) return target.isPending
      if (prop === `is${capitalized}Loading`) return target.isLoading
      if (prop === `is${capitalized}Fetching`) return target.isFetching
      if (prop === `is${capitalized}Error`) return target.isError
      if (prop === `${name}Error`) return target.error
      return target[prop as keyof typeof target]
    },
  }) as unknown as SuspenseNamedQueryResult<
    SuspenseDataOf<O>,
    SuspenseErrorOf<O>,
    Name
  >
}
