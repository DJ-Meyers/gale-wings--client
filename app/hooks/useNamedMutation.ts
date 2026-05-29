import {
  useMutation,
  type UseMutateAsyncFunction,
  type UseMutateFunction,
  type UseMutationOptions,
} from '@tanstack/react-query'

type NamedMutationResult<
  TData,
  TError,
  TVariables,
  TContext,
  Name extends string,
> = {
  [K in Name]: UseMutateFunction<TData, TError, TVariables, TContext>
} & {
  [K in `${Name}Async`]: UseMutateAsyncFunction<
    TData,
    TError,
    TVariables,
    TContext
  >
} & {
  [K in `is${Capitalize<Name>}Pending`]: boolean
} & {
  [K in `is${Capitalize<Name>}Success`]: boolean
} & {
  [K in `is${Capitalize<Name>}Error`]: boolean
} & {
  [K in `${Name}Error`]: TError | null
} & {
  [K in `${Name}Data`]: TData | undefined
} & {
  [K in `reset${Capitalize<Name>}`]: () => void
}

/**
 * Wraps `useMutation` and remaps its return properties under a descriptive name.
 *
 * ## Two-tier callback model
 *
 * React Query fires mutation callbacks in a defined order:
 *
 * 1. **`mutationOptions({ onSuccess })`** — hook-level, runs first, on every invocation.
 *    Wrapper hooks in `app/hooks/api/` use this for **invalidation and data-consistency
 *    side effects** that must always happen regardless of call site.
 *
 * 2. **`mutate(vars, { onSuccess })`** — caller-level, runs second, per-call.
 *    Components use this for **UI side effects** — navigation, toasts, form resets,
 *    closing dialogs, clearing local state.
 *
 * This separation means consumers never need to think about cache invalidation;
 * the wrapper hook handles it. Consumers only handle what happens in _their_ UI.
 *
 * @example
 * ```ts
 * // In app/hooks/api/team.ts — hook owns invalidation
 * export const useCreateTeam = () => {
 *   const trpc = useTRPC()
 *   const queryClient = useQueryClient()
 *   return useNamedMutation(
 *     trpc.team.create.mutationOptions({
 *       onSuccess: () => {
 *         queryClient.invalidateQueries({ queryKey: trpc.team.list.queryKey() })
 *       },
 *     }),
 *     'createTeam',
 *   )
 * }
 *
 * // In a component — caller handles UI effects only
 * const { createTeam } = useCreateTeam()
 * createTeam({ name }, {
 *   onSuccess: (team) => {
 *     navigate({ to: '/teams/$teamSlug', params: { teamSlug: team.slug } })
 *   },
 * })
 * ```
 */
export const useNamedMutation = <
  TData = unknown,
  TError = Error,
  TVariables = void,
  TContext = unknown,
  Name extends string = string,
>(options: UseMutationOptions<TData, TError, TVariables, TContext>, name: Name): NamedMutationResult<TData, TError, TVariables, TContext, Name> => {
  const mutation = useMutation(options)
  const capitalized = name[0].toUpperCase() + name.slice(1)

  return {
    [name]: mutation.mutate,
    [`${name}Async`]: mutation.mutateAsync,
    [`is${capitalized}Pending`]: mutation.isPending,
    [`is${capitalized}Success`]: mutation.isSuccess,
    [`is${capitalized}Error`]: mutation.isError,
    [`${name}Error`]: mutation.error,
    [`${name}Data`]: mutation.data,
    [`reset${capitalized}`]: mutation.reset,
  } as NamedMutationResult<TData, TError, TVariables, TContext, Name>
};
