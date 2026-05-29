import { ModifierFieldWrapper } from '~/components/calculator/ModifiersSection/StandardModifiersSection/ModifierFieldWrapper'
import { MoveSelectField } from '~/components/fields/MoveSelectField'
import { useCalc } from '~/hooks/calc/useCalc'
import { useModifiers } from '~/hooks/calc/useModifiers'
import { useLearnableMoves } from '~/hooks/useLearnableMoves'

interface Properties {
  side: 'player' | 'opponent'
}

export const ModifierMoveSelector = ({ side }: Properties) => {
  const { move, setMove } = useModifiers(side)
  const { attackerSide } = useCalc()
  const learnableMoves = useLearnableMoves(attackerSide.pokemon.species)

  return (
    <ModifierFieldWrapper>
      <MoveSelectField
        className="!mb-0"
        options={learnableMoves}
        value={move}
        onChange={setMove}
      />
    </ModifierFieldWrapper>
  )
}
