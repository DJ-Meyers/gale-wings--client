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

// The library view: detached templates only (teamId IS NULL). Team pokemon are
// read via useListPokemonByTeam. Returns a flat pokemon[] — there are no team
// associations to fold in anymore.
export const useListLibrary = (input?: {
  search?: string
  sortBy?: 'recent' | 'name' | 'species'
}) => {
  const trpc = useTRPC()
  return useNamedQuery(trpc.pokemon.listLibrary.queryOptions(input), 'library')
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
        // A pokemon belongs to exactly one team, so invalidate only that team's
        // roster (if any) instead of every listByTeam. A template edit
        // (teamId null) refreshes the library view instead.
        if (updated.teamId) {
          queryClient.invalidateQueries({
            queryKey: trpc.pokemon.listByTeam.queryKey({
              teamId: updated.teamId,
            }),
          })
          queryClient.invalidateQueries({
            queryKey: trpc.team.history.queryKey({ teamId: updated.teamId }),
          })
        } else {
          queryClient.invalidateQueries({
            queryKey: trpc.pokemon.listLibrary.queryKey(),
          })
        }
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
      onSuccess: () => {
        // pokemon.create only ever makes a library template; team pokemon are
        // added through team.saveLayout. Refresh the library list.
        queryClient.invalidateQueries({
          queryKey: trpc.pokemon.listLibrary.queryKey(),
        })
      },
    }),
    'createPokemon',
  )
}

// Snapshot a team pokemon into the library as a detached template (build only).
export const useSaveToLibrary = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  return useNamedMutation(
    trpc.pokemon.saveToLibrary.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.pokemon.listLibrary.queryKey(),
        })
      },
    }),
    'saveToLibrary',
  )
}
