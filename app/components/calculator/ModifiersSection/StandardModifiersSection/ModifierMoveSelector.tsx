import { ModifierFieldWrapper } from '~/components/calculator/ModifiersSection/StandardModifiersSection/ModifierFieldWrapper'
import { MoveSelectField } from '~/components/fields/MoveSelectField'
import { useCalcRowContext } from '~/context/CalcRowContext'
import { useModifiers } from '~/hooks/calc/useModifiers'
import { useLearnableMoves } from '~/hooks/useLearnableMoves'
import { useCalcStore } from '~/calc/store'

interface Properties {
  side: 'player' | 'opponent'
}

export const ModifierMoveSelector = ({ side }: Properties) => {
  const { calcId, mode } = useCalcRowContext()
  const { move, setMove } = useModifiers(side)
  const attackerSpecies = useCalcStore((s) =>
    mode === 'offensive' ? s.player.species : s.calcs[calcId].opponent.species,
  )
  const { learnableMoves } = useLearnableMoves(attackerSpecies)

  return (
    <ModifierFieldWrapper>
      <MoveSelectField
        className="!mb-0"
        options={learnableMoves ?? []}
        value={move}
        onChange={setMove}
      />
    </ModifierFieldWrapper>
  )
}
