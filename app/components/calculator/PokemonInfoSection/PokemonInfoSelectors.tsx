import { AbilitySelectField } from '~/components/fields/AbilitySelectField'
import { ItemSelectField } from '~/components/fields/ItemSelectField'
import { MoveSelectField } from '~/components/fields/MoveSelectField'
import { NatureSelectField } from '~/components/fields/NatureSelectField'
import { PokemonSelectField } from '~/components/fields/PokemonSelectField'
import { usePokemonStats } from '~/hooks/calc/usePokemonStats'
import { useLearnableMoves } from '~/hooks/useLearnableMoves'

export const PokemonInfoSelectors = () => {
  const {
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
  } = usePokemonStats()
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
