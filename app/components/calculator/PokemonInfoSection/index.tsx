import { PokemonInfoNameNotes } from '~/components/calculator/PokemonInfoSection/PokemonInfoNameNotes'
import { PokemonInfoParseInput } from '~/components/calculator/PokemonInfoSection/PokemonInfoParseInput'
import { PokemonInfoSelectors } from '~/components/calculator/PokemonInfoSection/PokemonInfoSelectors'
import { PokemonInfoStatPointInputs } from '~/components/calculator/PokemonInfoSection/PokemonInfoStatPointInputs'
import type { ChampionsPokemon, StatKey } from '~/types'

interface PokemonInfoSectionProps {
  pokemon: ChampionsPokemon
  speciesAbilities: string[]
  name: string
  notes: string
  compact?: boolean
  collapsibleMoves?: boolean
  moveOverride?: {
    value: string
    onChange: (move: string) => void
    disabled?: boolean
    options?: string[]
  }
  onSpeciesChange: (species: string) => void
  onNatureChange: (nature: string) => void
  onAbilityChange: (ability: string) => void
  onItemChange: (item: string) => void
  onStatPointChange: (stat: StatKey, value: number) => void
  onNameChange: (name: string) => void
  onNotesChange: (notes: string) => void
  onMoveChange?: (slot: number, move: string) => void
}

export const PokemonInfoSection = ({
  pokemon,
  speciesAbilities,
  name,
  notes,
  compact,
  collapsibleMoves,
  moveOverride,
  onSpeciesChange,
  onNatureChange,
  onAbilityChange,
  onItemChange,
  onStatPointChange,
  onNameChange,
  onNotesChange,
  onMoveChange,
}: PokemonInfoSectionProps) => (
  <div
    className={
      compact ? 'flex-1' : 'bg-surface flex-1 rounded-lg p-5 shadow-md'
    }
  >
    <PokemonInfoNameNotes
      name={name}
      notes={notes}
      pokemon={pokemon}
      onNameChange={onNameChange}
      onNotesChange={onNotesChange}
    />
    <PokemonInfoParseInput />
    <PokemonInfoSelectors
      collapsibleMoves={collapsibleMoves}
      compact={compact}
      moveOverride={moveOverride}
      pokemon={pokemon}
      speciesAbilities={speciesAbilities}
      onAbilityChange={onAbilityChange}
      onItemChange={onItemChange}
      onMoveChange={onMoveChange}
      onNatureChange={onNatureChange}
      onSpeciesChange={onSpeciesChange}
    />
    <PokemonInfoStatPointInputs
      compact={compact}
      pokemon={pokemon}
      onStatPointChange={onStatPointChange}
    />
  </div>
)
