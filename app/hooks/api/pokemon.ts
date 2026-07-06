import { useQueryClient } from '@tanstack/react-query'

import { useNamedMutation } from '~/hooks/useNamedMutation'
import { useNamedQuery } from '~/hooks/useNamedQuery'
import { useTRPC } from '~/trpc/client'

export const useGetPokemonBySlug = (slug: string) => {
  const trpc = useTRPC()
  return useNamedQuery(
    trpc.pokemon.getBySlug.queryOptions({ slug }, { enabled: Boolean(slug) }),
    'pokemon',
  )
}

export const useListAllPokemon = (input?: {
  search?: string
  sortBy?: 'recent' | 'name' | 'species'
}) => {
  const trpc = useTRPC()
  return useNamedQuery(trpc.pokemon.listAll.queryOptions(input), 'allPokemon')
}

export const useUpdatePokemon = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  return useNamedMutation(
    trpc.pokemon.update.mutationOptions({
      onSuccess: (updated) => {
        if (!updated) return
        queryClient.invalidateQueries({
          queryKey: trpc.pokemon.get.queryKey({ id: updated.id }),
        })
        queryClient.invalidateQueries({
          queryKey: trpc.pokemon.getBySlug.queryKey(),
        })
        queryClient.invalidateQueries({
          queryKey: trpc.pokemon.listByTeam.queryKey(),
        })
        queryClient.invalidateQueries({
          queryKey: trpc.pokemon.listAll.queryKey(),
        })
        queryClient.invalidateQueries({
          queryKey: trpc.team.history.queryKey(),
        })
      },
    }),
    'updatePokemon',
  )
}

export const useCreatePokemon = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  return useNamedMutation(
    trpc.pokemon.create.mutationOptions({
      onSuccess: (_data, { teamId }) => {
        if (teamId) {
          queryClient.invalidateQueries({
            queryKey: trpc.pokemon.listByTeam.queryKey({ teamId }),
          })
          queryClient.invalidateQueries({
            queryKey: trpc.team.history.queryKey({ teamId }),
          })
        }
        queryClient.invalidateQueries({
          queryKey: trpc.pokemon.listAll.queryKey(),
        })
      },
    }),
    'createPokemon',
  )
}

export const useAddPokemonToTeam = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  return useNamedMutation(
    trpc.pokemon.addToTeam.mutationOptions({
      onSuccess: (_data, { teamId }) => {
        queryClient.invalidateQueries({
          queryKey: trpc.pokemon.listByTeam.queryKey({ teamId }),
        })
        queryClient.invalidateQueries({
          queryKey: trpc.pokemon.listAll.queryKey(),
        })
        queryClient.invalidateQueries({
          queryKey: trpc.team.history.queryKey({ teamId }),
        })
      },
    }),
    'addPokemonToTeam',
  )
}

export const useRemovePokemonFromTeam = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  return useNamedMutation(
    trpc.pokemon.removeFromTeam.mutationOptions({
      onSuccess: (_data, { teamId }) => {
        queryClient.invalidateQueries({
          queryKey: trpc.pokemon.listByTeam.queryKey({ teamId }),
        })
        queryClient.invalidateQueries({
          queryKey: trpc.pokemon.listAll.queryKey(),
        })
        queryClient.invalidateQueries({
          queryKey: trpc.team.history.queryKey({ teamId }),
        })
      },
    }),
    'removePokemonFromTeam',
  )
}

export const useReorderPokemon = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  return useNamedMutation(
    trpc.pokemon.reorder.mutationOptions({
      // Optimistically reorder the cached list so the cards move the instant
      // the user clicks, driving the auto-animate swap without waiting for the
      // server round-trip. Reconciled by the onSettled invalidation.
      onMutate: async ({ teamId, order }) => {
        const queryKey = trpc.pokemon.listByTeam.queryKey({ teamId })
        await queryClient.cancelQueries({ queryKey })
        const previous = queryClient.getQueryData(queryKey)
        queryClient.setQueryData(queryKey, (old) => {
          if (!old) return old
          const byId = new Map(old.map((entry) => [entry.pokemon.id, entry]))
          return order.flatMap((id, index) => {
            const entry = byId.get(id)
            return entry ? [{ ...entry, slot: index }] : []
          })
        })
        return { previous }
      },
      onError: (_err, { teamId }, context) => {
        if (context?.previous) {
          queryClient.setQueryData(
            trpc.pokemon.listByTeam.queryKey({ teamId }),
            context.previous,
          )
        }
      },
      onSettled: (_data, _err, { teamId }) => {
        queryClient.invalidateQueries({
          queryKey: trpc.pokemon.listByTeam.queryKey({ teamId }),
        })
        queryClient.invalidateQueries({
          queryKey: trpc.team.history.queryKey({ teamId }),
        })
      },
    }),
    'reorderPokemon',
  )
}
