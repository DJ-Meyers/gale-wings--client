import {
  useQuery,
  useSuspenseQuery,
  type DefinedInitialDataOptions,
  type UndefinedInitialDataOptions,
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
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends readonly unknown[] = readonly unknown[],
  Name extends string = string,
>(options:
    | UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>
    | DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>, name: Name): NamedQueryResult<TData, TError, Name> => {
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
  }) as unknown as NamedQueryResult<TData, TError, Name>
};

/**
 * Wraps `useSuspenseQuery` and remaps its return properties under a descriptive name.
 *
 * The `{name}` property is `TData` (not `TData | undefined`) since suspense
 * guarantees data is available.
 */
export const useSuspenseNamedQuery = <
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends readonly unknown[] = readonly unknown[],
  Name extends string = string,
>(options: UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, name: Name): SuspenseNamedQueryResult<TData, TError, Name> => {
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
  }) as unknown as SuspenseNamedQueryResult<TData, TError, Name>
};
