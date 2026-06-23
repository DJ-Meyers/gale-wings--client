import { useQueryClient } from '@tanstack/react-query'

import { useNamedMutation } from '~/hooks/useNamedMutation'
import { useNamedQuery } from '~/hooks/useNamedQuery'
import { useTRPC } from '~/trpc/client'

export const useListTeams = () => {
  const trpc = useTRPC()
  return useNamedQuery(trpc.team.list.queryOptions(), 'teams')
}

export const useGetTeamBySlug = (slug: string) => {
  const trpc = useTRPC()
  return useNamedQuery(
    trpc.team.getBySlug.queryOptions({ slug }, { enabled: Boolean(slug) }),
    'team',
  )
}

export const useListPokemonByTeam = (teamId: string | undefined) => {
  const trpc = useTRPC()
  return useNamedQuery(
    trpc.pokemon.listByTeam.queryOptions(
      { teamId: teamId ?? '' },
      { enabled: Boolean(teamId) },
    ),
    'teamPokemon',
  )
}

export const useUpdateTeam = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  return useNamedMutation(
    trpc.team.update.mutationOptions({
      onSuccess: (updated) => {
        queryClient.invalidateQueries({ queryKey: trpc.team.list.queryKey() })
        queryClient.invalidateQueries({
          queryKey: trpc.team.getBySlug.queryKey(),
        })
        if (updated) {
          queryClient.invalidateQueries({
            queryKey: trpc.team.get.queryKey({ id: updated.id }),
          })
        }
      },
    }),
    'updateTeam',
  )
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
