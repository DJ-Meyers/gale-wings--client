import { useAutoAnimate } from '@formkit/auto-animate/react'
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
import { useDelayedFlag } from '~/hooks/useDelayedFlag'

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
  // Animates the FLIP transition when reorder swaps two cards. Paired with the
  // stable `key={pokemon.id}` below so auto-animate tracks each card's identity.
  const [listRef] = useAutoAnimate<HTMLUListElement>()

  const populated = teamPokemon ?? []
  const nextSlot = populated.length
  const canAdd = nextSlot < MAX_TEAM_SIZE
  // Reorder is optimistic and usually resolves in a frame or two, so gate its
  // disable behind a short delay — otherwise the buttons flash disabled on
  // every swap. Removal stays immediate (destructive, and refetch-bound).
  const isReorderBusy = useDelayedFlag(isReorderPokemonPending, 200)
  const isBusy = isRemovePokemonFromTeamPending || isReorderBusy

  const swapWithNeighbor = (index: number, direction: -1 | 1) => () => {
    const neighborIndex = index + direction
    if (neighborIndex < 0 || neighborIndex >= populated.length) return
    const order = populated.map(({ pokemon }) => pokemon.id)
    const tmp = order[index]
    order[index] = order[neighborIndex]
    order[neighborIndex] = tmp
    reorderPokemon({ teamId, order })
  }

  const requestRemove = (pokemonId: string, name: string) => () =>
    setPendingRemove({ pokemonId, name })

  const dismissRemove = () => setPendingRemove(null)

  const confirmRemove = () => {
    if (!pendingRemove) return
    removePokemonFromTeam(
      { pokemonId: pendingRemove.pokemonId, teamId },
      { onSettled: dismissRemove },
    )
  }

  const handleAdd = (species: string, onSuccess: () => void) =>
    createPokemon({ teamId, slot: nextSlot, species }, { onSuccess })

  const handlePickExisting = (pokemonId: string, onSuccess: () => void) =>
    addPokemonToTeam({ pokemonId, teamId, slot: nextSlot }, { onSuccess })

  return (
    <>
      <ul
        ref={listRef}
        className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3"
      >
        {populated.map(({ pokemon }, index) => (
          <TeamPokemonCard
            key={pokemon.id}
            index={index}
            isBusy={isBusy}
            pokemon={pokemon}
            teamSize={populated.length}
            onMoveDown={swapWithNeighbor(index, 1)}
            onMoveUp={swapWithNeighbor(index, -1)}
            onRemove={requestRemove(
              pokemon.id,
              pokemon.name || pokemon.species,
            )}
          />
        ))}
        {canAdd && (
          <AddTeamPokemonCard
            existingPokemonIds={populated.map(({ pokemon: p }) => p.id)}
            isPending={isCreatePokemonPending}
            isPickPending={isAddPokemonToTeamPending}
            onAdd={handleAdd}
            onPickExisting={handlePickExisting}
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
        onCancel={dismissRemove}
        onConfirm={confirmRemove}
      />
    </>
  )
}
