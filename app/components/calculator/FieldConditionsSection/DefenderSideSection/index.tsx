import { FieldConditionCheckbox } from '~/components/calculator/FieldConditionsSection/FieldConditionCheckbox'
import { useFieldConditions } from '~/hooks/calc/useFieldConditions'

export const DefenderSideSection = () => {
  const { defenderSide, toggleDefenderSide } = useFieldConditions()

  return (
    <fieldset className="border-border-section flex flex-wrap justify-around gap-x-2.5 gap-y-1 rounded border px-2 pt-1 pb-1.5">
      <legend className="text-text-dim px-1 text-[0.7rem] font-semibold">
        Defender Side
      </legend>
      <FieldConditionCheckbox
        checked={!!defenderSide.isReflect}
        label="Reflect"
        onChange={() => toggleDefenderSide('isReflect')}
      />
      <FieldConditionCheckbox
        checked={!!defenderSide.isLightScreen}
        label="Light Screen"
        onChange={() => toggleDefenderSide('isLightScreen')}
      />
      <FieldConditionCheckbox
        checked={!!defenderSide.isAuroraVeil}
        label="Aurora Veil"
        onChange={() => toggleDefenderSide('isAuroraVeil')}
      />
      <FieldConditionCheckbox
        checked={!!defenderSide.isFriendGuard}
        label="Friend Guard"
        onChange={() => toggleDefenderSide('isFriendGuard')}
      />
      <FieldConditionCheckbox
        checked={!!defenderSide.isTailwind}
        label="Tailwind"
        onChange={() => toggleDefenderSide('isTailwind')}
      />
    </fieldset>
  )
}
