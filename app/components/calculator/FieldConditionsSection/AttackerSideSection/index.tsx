import { FieldConditionCheckbox } from '~/components/calculator/FieldConditionsSection/FieldConditionCheckbox'
import { Fieldset } from '~/components/ui/Fieldset'
import { useFieldConditions } from '~/hooks/calc/useFieldConditions'

export const AttackerSideSection = () => {
  const { attackerSide, toggleAttackerSide } = useFieldConditions()

  return (
    <Fieldset className="flex-1 justify-around" legend="Attacker Side">
      <FieldConditionCheckbox
        checked={!!attackerSide.isHelpingHand}
        label="Helping Hand"
        onChange={() => toggleAttackerSide('isHelpingHand')}
      />
      <FieldConditionCheckbox
        checked={!!attackerSide.isTailwind}
        label="Tailwind"
        onChange={() => toggleAttackerSide('isTailwind')}
      />
    </Fieldset>
  )
}
