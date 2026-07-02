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
      onSuccess: (_data, { teamId }) => {
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
