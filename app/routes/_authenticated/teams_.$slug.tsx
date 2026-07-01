import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState, type FormEvent } from 'react'

import { AddTeamPokemonCard } from '~/components/teams/AddTeamPokemonCard'
import { TeamPokemonCard } from '~/components/teams/TeamPokemonCard'
import { Button } from '~/components/ui/Button'
import { ConfirmDialog } from '~/components/ui/ConfirmDialog'
import {
  useAddPokemonToTeam,
  useCreatePokemon,
  useRemovePokemonFromTeam,
  useReorderPokemon,
} from '~/hooks/api/pokemon'
import {
  useGetTeamBySlug,
  useListPokemonByTeam,
  useUpdateTeam,
} from '~/hooks/api/teams'

const MAX_TEAM_NAME = 24
const MAX_TEAM_SIZE = 6

const TeamDetailPage = () => {
  const { slug } = Route.useParams()
  const navigate = useNavigate()
  const { team, isTeamPending, teamError } = useGetTeamBySlug(slug)
  const { teamPokemon } = useListPokemonByTeam(team?.id)
  const { updateTeam, isUpdateTeamPending } = useUpdateTeam()
  const { createPokemon, isCreatePokemonPending } = useCreatePokemon()
  const { removePokemonFromTeam, isRemovePokemonFromTeamPending } =
    useRemovePokemonFromTeam()
  const { reorderPokemon, isReorderPokemonPending } = useReorderPokemon()
  const { addPokemonToTeam, isAddPokemonToTeamPending } = useAddPokemonToTeam()
  const [isRenaming, setIsRenaming] = useState(false)
  const [draftName, setDraftName] = useState('')
  const [pendingRemove, setPendingRemove] = useState<{
    pokemonId: string
    name: string
  } | null>(null)

  useEffect(() => {
    if (team && !isRenaming) setDraftName(team.name)
  }, [team, isRenaming])

  if (isTeamPending) {
    return <p className="text-text-dim py-8 text-sm">Loading…</p>
  }
  if (teamError) {
    return (
      <p className="py-8 text-sm text-red-500">
        Failed to load team: {teamError.message}
      </p>
    )
  }
  if (!team) {
    return <p className="text-text-dim py-8 text-sm">Team not found.</p>
  }

  const handleRenameSubmit = (event: FormEvent) => {
    event.preventDefault()
    const name = draftName.trim()
    if (!name || name.length > MAX_TEAM_NAME || name === team.name) {
      setIsRenaming(false)
      return
    }
    updateTeam(
      { id: team.id, name },
      {
        onSuccess: (updated) => {
          setIsRenaming(false)
          if (updated && updated.slug !== slug) {
            navigate({
              to: '/teams/$slug',
              params: { slug: updated.slug },
              replace: true,
            })
          }
        },
      },
    )
  }

  const populated = teamPokemon ?? []
  const nextSlot = populated.length
  const canAdd = nextSlot < MAX_TEAM_SIZE
  const isBusy =
    isRemovePokemonFromTeamPending || isReorderPokemonPending

  const swapWithNeighbor = (index: number, direction: -1 | 1) => {
    const neighborIndex = index + direction
    if (neighborIndex < 0 || neighborIndex >= populated.length) return
    const order = populated.map(({ pokemon }) => pokemon.id)
    const tmp = order[index]
    order[index] = order[neighborIndex]
    order[neighborIndex] = tmp
    reorderPokemon({ teamId: team.id, order })
  }

  return (
    <div className="py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        {isRenaming ? (
          <form className="flex flex-1 gap-2" onSubmit={handleRenameSubmit}>
            <input
              autoFocus
              className="bg-surface border-border rounded border px-3 py-1.5 text-2xl font-bold"
              maxLength={MAX_TEAM_NAME}
              value={draftName}
              onBlur={() => setIsRenaming(false)}
              onChange={(e) => setDraftName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setDraftName(team.name)
                  setIsRenaming(false)
                }
              }}
            />
            <Button disabled={isUpdateTeamPending} type="submit">
              Save
            </Button>
          </form>
        ) : (
          <>
            <button
              className="text-2xl font-bold"
              type="button"
              onClick={() => setIsRenaming(true)}
            >
              {team.name}
            </button>
            <Button variant="secondary" onClick={() => setIsRenaming(true)}>
              Rename
            </Button>
          </>
        )}
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {populated.map(({ slot, pokemon }, index) => (
          <TeamPokemonCard
            key={slot}
            isBusy={isBusy}
            isFirst={index === 0}
            isLast={index === populated.length - 1}
            pokemon={pokemon}
            onMoveDown={() => swapWithNeighbor(index, 1)}
            onMoveUp={() => swapWithNeighbor(index, -1)}
            onRemove={() =>
              setPendingRemove({
                pokemonId: pokemon.id,
                name: pokemon.name || pokemon.species,
              })
            }
          />
        ))}
        {canAdd && (
          <AddTeamPokemonCard
            existingPokemonIds={populated.map(({ pokemon: p }) => p.id)}
            isPending={isCreatePokemonPending}
            isPickPending={isAddPokemonToTeamPending}
            onAdd={(species, onSuccess) =>
              createPokemon(
                { teamId: team.id, slot: nextSlot, species },
                { onSuccess },
              )
            }
            onPickExisting={(pokemonId, onSuccess) =>
              addPokemonToTeam(
                { pokemonId, teamId: team.id, slot: nextSlot },
                { onSuccess },
              )
            }
          />
        )}
      </ul>

      <ConfirmDialog
        confirmLabel="Remove"
        description={
          pendingRemove
            ? `Remove ${pendingRemove.name} from ${team.name}? The Pokémon stays in your library and remains linked to any other teams.`
            : ''
        }
        destructive
        open={pendingRemove !== null}
        title="Remove from team"
        onCancel={() => setPendingRemove(null)}
        onConfirm={() => {
          if (!pendingRemove) return
          removePokemonFromTeam(
            { pokemonId: pendingRemove.pokemonId, teamId: team.id },
            { onSettled: () => setPendingRemove(null) },
          )
        }}
      />
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/teams_/$slug')({
  component: TeamDetailPage,
})
