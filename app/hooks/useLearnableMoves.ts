import { useLearnableMovesForSpecies, useListMoves } from '~/hooks/api/data'

/**
 * Composite hook: returns the per-species learnable-moves pool if a species
 * is selected, falling back to the full move list when species is empty.
 * Either branch returns the same named-query shape so callers can
 * destructure `{ learnableMoves, isLearnableMovesPending, ... }` without
 * caring which source supplied them.
 *
 * Both underlying queries are always invoked (Rules of Hooks), with the
 * per-species query gated on `enabled: !!species` inside
 * `useLearnableMovesForSpecies`.
 */
export const useLearnableMoves = (species: string) => {
  const all = useListMoves()
  const learnable = useLearnableMovesForSpecies(species)

  const hasSpecies = Boolean(species)
  const learnableMoves = hasSpecies ? learnable.learnableMoves : all.moves
  const isLearnableMovesPending = hasSpecies
    ? learnable.isLearnableMovesPending
    : all.isMovesPending
  const isLearnableMovesLoading = hasSpecies
    ? learnable.isLearnableMovesLoading
    : all.isMovesLoading
  const isLearnableMovesFetching = hasSpecies
    ? learnable.isLearnableMovesFetching
    : all.isMovesFetching
  const isLearnableMovesError = hasSpecies
    ? learnable.isLearnableMovesError
    : all.isMovesError
  const learnableMovesError = hasSpecies
    ? learnable.learnableMovesError
    : all.movesError

  return {
    learnableMoves,
    isLearnableMovesPending,
    isLearnableMovesLoading,
    isLearnableMovesFetching,
    isLearnableMovesError,
    learnableMovesError,
  }
}
