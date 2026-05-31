import { FieldConditionCheckbox } from '~/components/calculator/FieldConditionsSection/FieldConditionCheckbox'
import { Fieldset } from '~/components/ui/Fieldset'
import { useFieldConditions } from '~/hooks/calc/useFieldConditions'

export const DefenderSideSection = () => {
  const { defenderSide, toggleDefenderSide } = useFieldConditions()

  return (
    <Fieldset className="justify-around" legend="Defender Side">
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
    </Fieldset>
  )
}
