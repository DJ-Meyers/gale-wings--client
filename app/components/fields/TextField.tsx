import { FieldLabel } from '~/components/fields/FieldLabel'

interface Properties {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  label?: string
}

export const TextField = ({
  value,
  onChange,
  placeholder,
  className,
  label,
}: Properties) => (
  <div>
    {label && <FieldLabel>{label}</FieldLabel>}
    <input
      className={className}
      placeholder={placeholder}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
)
