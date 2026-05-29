// TODO: swap for `statBoostValueSchema` from @dj-meyers/galewings/schemas
// once it lands as a public export; derive the array from its bounds.
const BOOST_VALUES = [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6]

interface Properties {
  value: number
  onChange: (value: number) => void
  className?: string
}

export const BoostSelectField = ({
  value,
  onChange,
  className,
}: Properties) => (
  <select
    className={className}
    value={value}
    onChange={(e) => onChange(Number(e.target.value))}
  >
    {BOOST_VALUES.map((v) => (
      <option key={v} value={v}>
        {v > 0 ? `+${v}` : v === 0 ? '--' : String(v)}
      </option>
    ))}
  </select>
)
