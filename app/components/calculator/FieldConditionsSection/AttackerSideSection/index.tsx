import { FieldConditionCheckbox } from '~/components/calculator/FieldConditionsSection/FieldConditionCheckbox'
import { useFieldConditions } from '~/hooks/calc/useFieldConditions'

export const AttackerSideSection = () => {
  const { attackerSide, toggleAttackerSide } = useFieldConditions()

  return (
    <fieldset className="border-border-section flex flex-1 flex-wrap justify-between gap-x-2.5 gap-y-1 rounded border px-2 pt-1 pb-1.5">
      <legend className="text-text-dim px-1 text-[0.7rem] font-semibold">
        Attacker Side
      </legend>
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
    </fieldset>
  )
}
