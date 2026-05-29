import { FieldLabel } from '~/components/fields/FieldLabel'

interface Properties {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  className?: string
  label?: string
}

export const TextAreaField = ({
  value,
  onChange,
  placeholder,
  rows,
  className,
  label,
}: Properties) => (
  <div>
    {label && <FieldLabel>{label}</FieldLabel>}
    <textarea
      className={className}
      placeholder={placeholder}
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
)
