import { FieldConditionCheckbox } from '~/components/calculator/FieldConditionsSection/FieldConditionCheckbox'
import { Fieldset } from '~/components/ui/Fieldset'
import { useFieldConditions } from '~/hooks/calc/useFieldConditions'

export const RuinAbilitiesSection = () => {
  const {
    isBeadsOfRuin,
    isSwordOfRuin,
    isTabletsOfRuin,
    isVesselOfRuin,
    toggleRuin,
  } = useFieldConditions()

  return (
    <Fieldset legend="Ruin Abilities">
      <FieldConditionCheckbox
        checked={isBeadsOfRuin}
        label="Beads"
        onChange={() => toggleRuin('isBeadsOfRuin')}
      />
      <FieldConditionCheckbox
        checked={isSwordOfRuin}
        label="Sword"
        onChange={() => toggleRuin('isSwordOfRuin')}
      />
      <FieldConditionCheckbox
        checked={isTabletsOfRuin}
        label="Tablets"
        onChange={() => toggleRuin('isTabletsOfRuin')}
      />
      <FieldConditionCheckbox
        checked={isVesselOfRuin}
        label="Vessel"
        onChange={() => toggleRuin('isVesselOfRuin')}
      />
    </Fieldset>
  )
}
