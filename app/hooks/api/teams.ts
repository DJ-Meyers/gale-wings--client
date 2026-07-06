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
        if (updated) {
          // Prime the renamed team's slug lookup so navigating to its new
          // detail URL resolves from cache instead of dropping the whole page
          // to a loading state. The stale old-slug entry is dropped by the
          // caller after it navigates away (see teams_.$slug.tsx) — clearing it
          // here would refetch a slug the detail page is still observing and
          // cache the null miss for the 30s staleTime.
          queryClient.setQueryData(
            trpc.team.getBySlug.queryKey({ slug: updated.slug }),
            updated,
          )
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
        // A previously-deleted team with this same name may have left a stale
        // slug -> team entry cached (delete deliberately doesn't purge
        // getBySlug — see useDeleteTeam). Invalidate so the new team's detail
        // page resolves the slug to the new id instead of the dead one.
        queryClient.invalidateQueries({
          queryKey: trpc.team.getBySlug.queryKey(),
        })
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
      onSuccess: (_data, { id }) => {
        queryClient.invalidateQueries({ queryKey: trpc.team.list.queryKey() })
        queryClient.invalidateQueries({
          queryKey: trpc.pokemon.listAll.queryKey(),
        })
        // Drop the deleted team's per-id caches so re-creating a team with the
        // same name doesn't briefly flash the old roster via listByTeam(oldId).
        // Deliberately DON'T touch getBySlug here: the detail page is still
        // observing it at delete time, so removing/invalidating it would refetch
        // the just-deleted slug and cache a "not found" (getBySlug returns null),
        // leaving the recreated team stuck on "team doesn't exist" for the 30s
        // staleTime. The stale slug entry is refreshed by useCreateTeam instead.
        queryClient.removeQueries({ queryKey: trpc.team.get.queryKey({ id }) })
        queryClient.removeQueries({
          queryKey: trpc.pokemon.listByTeam.queryKey({ teamId: id }),
        })
        queryClient.removeQueries({
          queryKey: trpc.team.history.queryKey({ teamId: id }),
        })
      },
    }),
    'deleteTeam',
  )
}
