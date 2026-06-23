import { useQueryClient } from '@tanstack/react-query'

import { useNamedMutation } from '~/hooks/useNamedMutation'
import { useTRPC } from '~/trpc/client'

export const useCreatePokemon = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  return useNamedMutation(
    trpc.pokemon.create.mutationOptions({
      onSuccess: (_data, variables) => {
        if (variables.teamId) {
          queryClient.invalidateQueries({
            queryKey: trpc.pokemon.listByTeam.queryKey({
              teamId: variables.teamId,
            }),
          })
          queryClient.invalidateQueries({
            queryKey: trpc.team.history.queryKey(),
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
