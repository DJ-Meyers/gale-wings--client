import { CheckboxField } from '~/components/fields/CheckboxField'

interface Properties {
  label: string
  checked: boolean
  onChange: () => void
}

export const FieldConditionCheckbox = ({
  label,
  checked,
  onChange,
}: Properties) => (
  <CheckboxField
    checked={checked}
    className="h-6"
    label={label}
    onChange={() => onChange()}
  />
)
