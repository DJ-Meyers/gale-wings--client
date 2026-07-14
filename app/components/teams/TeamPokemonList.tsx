import { useAutoAnimate } from '@formkit/auto-animate/react'

import { AddTeamPokemonCard } from '~/components/teams/AddTeamPokemonCard'
import {
  TeamPokemonCard,
  type TeamPokemon,
} from '~/components/teams/TeamPokemonCard'
import { useTeamDraft, type DraftEntry } from '~/context/TeamDraftContext'

interface TeamPokemonListProps {
  // Slug of the owning team, for the nested per-pokemon edit links.
  teamSlug: string
  // Disables per-card controls (e.g. while a save is in flight).
  disabled?: boolean
  // Snapshot an already-persisted team pokemon into the library (server call).
  onSaveToLibrary: (pokemonId: string) => void
}

// A draft entry carries the full build as editor-form values, whose types are
// looser than TeamPokemon: string fields instead of literal unions, and a
// *partial* statPoints record (keys may be absent) vs. TeamPokemon's full six.
// This cast is runtime-safe because the only consumer that requires all six
// keys is stat math via rawStatsFor, which wraps the calc in try/catch and
// returns null on a missing key (StatDisplay renders blank) rather than
// throwing. So a single cast here can't crash the card.
const toCardPokemon = (e: DraftEntry): TeamPokemon =>
  ({
    id: e.key,
    slug: e.slug,
    name: e.values.name,
    species: e.values.pokemon.species,
    nature: e.values.pokemon.nature,
    ability: e.values.pokemon.ability || undefined,
    item: e.values.pokemon.item,
    moves: e.values.pokemon.moves,
    statPoints: e.values.pokemon.statPoints,
  }) as unknown as TeamPokemon

export const TeamPokemonList = ({
  teamSlug,
  disabled = false,
  onSaveToLibrary,
}: TeamPokemonListProps) => {
  const { entries, canAdd, swapEntry, removeEntry } = useTeamDraft()

  // Animates the FLIP transition on reorder. Paired with the stable per-entry
  // key below so auto-animate tracks each card's identity across swaps.
  const [listRef] = useAutoAnimate<HTMLUListElement>()

  return (
    <ul
      ref={listRef}
      className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3"
    >
      {entries.map((entry, index) => (
        <TeamPokemonCard
          key={entry.key}
          index={index}
          isBusy={disabled}
          pokemon={toCardPokemon(entry)}
          teamSize={entries.length}
          teamSlug={teamSlug}
          unsaved={!entry.pokemonId}
          onMoveDown={() => swapEntry(index, 1)}
          onMoveUp={() => swapEntry(index, -1)}
          onRemove={() => removeEntry(entry.key)}
          onSaveToLibrary={
            entry.pokemonId
              ? () => onSaveToLibrary(entry.pokemonId!)
              : undefined
          }
        />
      ))}
      {canAdd && <AddTeamPokemonCard />}
    </ul>
  )
}
