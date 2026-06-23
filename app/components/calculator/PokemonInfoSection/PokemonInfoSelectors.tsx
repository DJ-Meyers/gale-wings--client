import { AbilitySelectField } from '~/components/fields/AbilitySelectField'
import { ItemSelectField } from '~/components/fields/ItemSelectField'
import { MoveSelectField } from '~/components/fields/MoveSelectField'
import { NatureSelectField } from '~/components/fields/NatureSelectField'
import { PokemonSelectField } from '~/components/fields/PokemonSelectField'
import { useLearnableMoves } from '~/hooks/useLearnableMoves'
import type { ChampionsPokemon } from '~/types'

interface PokemonInfoSelectorsProps {
  pokemon: ChampionsPokemon
  speciesAbilities: string[]
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
  onMoveChange?: (slot: number, move: string) => void
}

export const PokemonInfoSelectors = ({
  pokemon,
  speciesAbilities,
  compact,
  collapsibleMoves,
  moveOverride,
  onSpeciesChange,
  onNatureChange,
  onAbilityChange,
  onItemChange,
  onMoveChange,
}: PokemonInfoSelectorsProps) => {
  const { species, nature, ability, item, moves } = pokemon

  const { learnableMoves } = useLearnableMoves(species)

  const moveFields = onMoveChange && (
    <div className="flex flex-col gap-1">
      {[0, 1, 2, 3].map((slot) => (
        <MoveSelectField
          key={slot}
          compact={compact}
          label={`Move ${slot + 1}`}
          options={learnableMoves ?? []}
          value={moves[slot] ?? ''}
          onChange={(m) => onMoveChange(slot, m)}
        />
      ))}
    </div>
  )

  return (
    <div className="flex flex-col">
      <PokemonSelectField
        compact={compact}
        value={species}
        onChange={onSpeciesChange}
      />
      <NatureSelectField
        compact={compact}
        value={nature}
        onChange={onNatureChange}
      />
      <AbilitySelectField
        compact={compact}
        speciesAbilities={speciesAbilities}
        value={ability}
        onChange={onAbilityChange}
      />
      <ItemSelectField
        compact={compact}
        value={item ?? ''}
        onChange={onItemChange}
      />
      {moveOverride ? (
        <MoveSelectField
          compact={compact}
          disabled={moveOverride.disabled}
          options={moveOverride.options}
          value={moveOverride.value}
          onChange={moveOverride.onChange}
        />
      ) : (
        moveFields &&
        (collapsibleMoves ? (
          <details className="mt-1">
            <summary className="text-text-dim cursor-pointer text-xs font-semibold select-none">
              Moves
            </summary>
            <div className="mt-1">{moveFields}</div>
          </details>
        ) : (
          moveFields
        ))
      )}
    </div>
  )
}
