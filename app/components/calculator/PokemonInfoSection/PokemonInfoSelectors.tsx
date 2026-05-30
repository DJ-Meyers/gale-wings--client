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
    onSpeciesChange,
    onNatureChange,
    onAbilityChange,
    onItemChange,
    onMoveChange,
  } = usePokemonStats()
  const { species, nature, ability, item, moves } = pokemon

  const { learnableMoves } = useLearnableMoves(species)

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
      {onMoveChange && (
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
      )}
    </div>
  )
}
