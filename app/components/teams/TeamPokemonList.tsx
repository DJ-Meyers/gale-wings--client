import { useState } from 'react'

import { AddTeamPokemonCard } from '~/components/teams/AddTeamPokemonCard'
import { TeamPokemonCard } from '~/components/teams/TeamPokemonCard'
import { ConfirmDialog } from '~/components/ui/ConfirmDialog'
import {
  useAddPokemonToTeam,
  useCreatePokemon,
  useRemovePokemonFromTeam,
  useReorderPokemon,
} from '~/hooks/api/pokemon'
import { useListPokemonByTeam } from '~/hooks/api/teams'

const MAX_TEAM_SIZE = 6

interface TeamPokemonListProps {
  // Ownership of `teamId` is assumed already verified by the parent page (which
  // gates on a loaded, owned team before rendering this). `teamName` is only
  // used for the removal confirmation copy.
  teamId: string
  teamName: string
}

export const TeamPokemonList = ({ teamId, teamName }: TeamPokemonListProps) => {
  const { teamPokemon } = useListPokemonByTeam(teamId)
  const { createPokemon, isCreatePokemonPending } = useCreatePokemon()
  const { removePokemonFromTeam, isRemovePokemonFromTeamPending } =
    useRemovePokemonFromTeam()
  const { reorderPokemon, isReorderPokemonPending } = useReorderPokemon()
  const { addPokemonToTeam, isAddPokemonToTeamPending } = useAddPokemonToTeam()
  const [pendingRemove, setPendingRemove] = useState<{
    pokemonId: string
    name: string
  } | null>(null)

  const populated = teamPokemon ?? []
  const nextSlot = populated.length
  const canAdd = nextSlot < MAX_TEAM_SIZE
  const isBusy = isRemovePokemonFromTeamPending || isReorderPokemonPending

  const swapWithNeighbor = (index: number, direction: -1 | 1) => {
    const neighborIndex = index + direction
    if (neighborIndex < 0 || neighborIndex >= populated.length) return
    const order = populated.map(({ pokemon }) => pokemon.id)
    const tmp = order[index]
    order[index] = order[neighborIndex]
    order[neighborIndex] = tmp
    reorderPokemon({ teamId, order })
  }

  return (
    <>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3">
        {populated.map(({ slot, pokemon }, index) => (
          <TeamPokemonCard
            key={slot}
            isBusy={isBusy}
            isFirst={index === 0}
            isLast={index === populated.length - 1}
            pokemon={pokemon}
            slotNumber={index + 1}
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
              createPokemon({ teamId, slot: nextSlot, species }, { onSuccess })
            }
            onPickExisting={(pokemonId, onSuccess) =>
              addPokemonToTeam(
                { pokemonId, teamId, slot: nextSlot },
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
            ? `Remove ${pendingRemove.name} from ${teamName}? The Pokémon stays in your library and remains linked to any other teams.`
            : ''
        }
        destructive
        open={pendingRemove !== null}
        title="Remove from team"
        onCancel={() => setPendingRemove(null)}
        onConfirm={() => {
          if (!pendingRemove) return
          removePokemonFromTeam(
            { pokemonId: pendingRemove.pokemonId, teamId },
            { onSettled: () => setPendingRemove(null) },
          )
        }}
      />
    </>
  )
}
