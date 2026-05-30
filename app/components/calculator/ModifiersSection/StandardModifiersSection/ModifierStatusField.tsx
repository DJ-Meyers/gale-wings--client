import { ModifierFieldWrapper } from '~/components/calculator/ModifiersSection/StandardModifiersSection/ModifierFieldWrapper'
import { Typeahead } from '~/components/fields/Typeahead'
import { STATUS_LABELS, STATUS_VALUES } from '~/constants'
import { useModifiers } from '~/hooks/calc/useModifiers'

interface Properties {
  side: 'player' | 'opponent'
}

export const ModifierStatusField = ({ side }: Properties) => {
  const { status, setStatus } = useModifiers(side)

  return (
    <ModifierFieldWrapper>
      <Typeahead
        allowEmpty
        className="!mb-0"
        emptyLabel="(none)"
        getLabel={(v) => STATUS_LABELS[v] ?? v}
        label="Status"
        options={STATUS_VALUES}
        placeholder="Search status..."
        value={status}
        onChange={setStatus}
      />
    </ModifierFieldWrapper>
  )
}
