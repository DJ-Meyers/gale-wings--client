interface Properties {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
}

export const CheckboxField = ({
  label,
  checked,
  onChange,
  className,
}: Properties) => (
  <label
    className={`flex cursor-pointer items-center gap-1 text-xs whitespace-nowrap ${className ?? ''}`}
  >
    <input
      checked={checked}
      className="w-auto"
      type="checkbox"
      onChange={(e) => onChange(e.target.checked)}
    />{' '}
    {label}
  </label>
)
