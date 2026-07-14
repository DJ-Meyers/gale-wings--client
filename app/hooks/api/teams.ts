import { useNamedMutation } from '~/hooks/useNamedMutation'
import { useNamedQuery } from '~/hooks/useNamedQuery'
import { removePokemonByTeam, seedPokemonByTeam } from '~/trpc/cache/pokemon'
import {
  invalidateAllTeamsBySlug,
  invalidateTeamById,
  invalidateTeamHistory,
  invalidateTeamsList,
  removeTeamById,
  removeTeamHistory,
  seedTeamBySlug,
} from '~/trpc/cache/teams'
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
  return useNamedMutation(
    trpc.team.update.mutationOptions({
      onSuccess: (updated) => {
        invalidateTeamsList()
        if (updated) {
          // Prime the renamed team's slug lookup so navigating to its new
          // detail URL resolves from cache instead of dropping the whole page
          // to a loading state. The stale old-slug entry is dropped by the
          // caller after it navigates away (see teams_.$slug.tsx) — clearing it
          // here would refetch a slug the detail page is still observing and
          // cache the null miss for the 30s staleTime.
          seedTeamBySlug(updated)
          invalidateTeamById(updated.id)
        }
      },
    }),
    'updateTeam',
  )
}

export const useSaveTeamLayout = () => {
  const trpc = useTRPC()
  return useNamedMutation(
    trpc.team.saveLayout.mutationOptions({
      // The server returns the committed team + fresh roster, so prime those
      // caches directly — the page (and a rename navigate) resolves from cache
      // without a flash. The caller reseeds its local draft from the same
      // result. See team.saveLayout in the API for the returned shape.
      onSuccess: (result) => {
        invalidateTeamsList()
        seedTeamBySlug(result.team)
        seedPokemonByTeam(result.team.id, result.pokemon)
        invalidateTeamById(result.team.id)
        // saveLayout writes audit rows (renamed / added / removed / updated),
        // so refresh this team's history like every other roster mutation.
        invalidateTeamHistory(result.team.id)
        // The library view (detached templates) is unaffected by roster edits:
        // fromLibrary clones the template without mutating it, and removals
        // delete team-owned rows, not templates.
      },
    }),
    'saveTeamLayout',
  )
}

export const useCreateTeam = () => {
  const trpc = useTRPC()
  return useNamedMutation(
    trpc.team.create.mutationOptions({
      onSuccess: () => {
        invalidateTeamsList()
        // A previously-deleted team with this same name may have left a stale
        // slug -> team entry cached (delete deliberately doesn't purge
        // getBySlug — see useDeleteTeam). Invalidate so the new team's detail
        // page resolves the slug to the new id instead of the dead one.
        invalidateAllTeamsBySlug()
      },
    }),
    'createTeam',
  )
}

export const useDeleteTeam = () => {
  const trpc = useTRPC()
  return useNamedMutation(
    trpc.team.delete.mutationOptions({
      onSuccess: (_data, { id }) => {
        invalidateTeamsList()
        // Deleting a team cascade-deletes its team-owned pokemon, but library
        // templates (teamId null) are untouched — no listLibrary invalidation.
        // Drop the deleted team's per-id caches so re-creating a team with the
        // same name doesn't briefly flash the old roster via listByTeam(oldId).
        // Deliberately DON'T touch getBySlug here: the detail page is still
        // observing it at delete time, so removing/invalidating it would refetch
        // the just-deleted slug and cache a "not found" (getBySlug returns null),
        // leaving the recreated team stuck on "team doesn't exist" for the 30s
        // staleTime. The stale slug entry is refreshed by useCreateTeam instead.
        removeTeamById(id)
        removePokemonByTeam(id)
        removeTeamHistory(id)
      },
    }),
    'deleteTeam',
  )
}
