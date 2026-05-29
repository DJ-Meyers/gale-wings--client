interface Properties {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  className?: string
}

export const NumberField = ({
  value,
  onChange,
  min,
  max,
  step,
  className,
}: Properties) => (
  <input
    className={className}
    max={max}
    min={min}
    step={step}
    type="number"
    value={value}
    onChange={(e) => onChange(Number(e.target.value))}
  />
)
