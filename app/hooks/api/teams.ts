import { useQueryClient } from '@tanstack/react-query'

import { useNamedMutation } from '~/hooks/useNamedMutation'
import { useNamedQuery } from '~/hooks/useNamedQuery'
import { useTRPC } from '~/trpc/client'

export const useTeamList = () => {
  const trpc = useTRPC()
  return useNamedQuery(trpc.team.list.queryOptions(), 'teams')
}

export const useCreateTeam = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  return useNamedMutation(
    trpc.team.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.team.list.queryKey() })
      },
    }),
    'createTeam',
  )
}

export const useDeleteTeam = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  return useNamedMutation(
    trpc.team.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.team.list.queryKey() })
        queryClient.invalidateQueries({
          queryKey: trpc.pokemon.listAll.queryKey(),
        })
      },
    }),
    'deleteTeam',
  )
}
