import { ModifierFieldWrapper } from '~/components/calculator/ModifiersSection/StandardModifiersSection/ModifierFieldWrapper'
import { Typeahead } from '~/components/fields/Typeahead'
import { TYPE_NAMES } from '~/data/constants/types'
import { useModifiers } from '~/hooks/calc/useModifiers'

interface Properties {
  side: 'player' | 'opponent'
}

export const ModifierTeraField = ({ side }: Properties) => {
  const { teraType, setTeraType } = useModifiers(side)

  return (
    <ModifierFieldWrapper>
      <Typeahead
        allowEmpty
        className="!mb-0"
        emptyLabel="(none)"
        label="Tera Type"
        options={TYPE_NAMES}
        placeholder="Search types..."
        value={teraType}
        onChange={setTeraType}
      />
    </ModifierFieldWrapper>
  )
}
