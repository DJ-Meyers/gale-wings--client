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
    collapsibleMoves,
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
      <PokemonSelectField value={species} onChange={onSpeciesChange} />
      <NatureSelectField value={nature} onChange={onNatureChange} />
      <AbilitySelectField
        speciesAbilities={speciesAbilities}
        value={ability}
        onChange={onAbilityChange}
      />
      <ItemSelectField value={item ?? ''} onChange={onItemChange} />
      {moveFields &&
        (collapsibleMoves ? (
          <details className="mt-1">
            <summary className="text-text-dim cursor-pointer text-xs font-semibold select-none">
              Moves
            </summary>
            <div className="mt-1">{moveFields}</div>
          </details>
        ) : (
          moveFields
        ))}
    </div>
  )
}
