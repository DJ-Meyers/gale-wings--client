interface Properties<T extends string> {
  label: string
  options: readonly T[]
  value: T | undefined
  onChange: (value: T | undefined) => void
}

export const FieldConditionSelect = <T extends string>({
  label,
  options,
  value,
  onChange,
}: Properties<T>) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    onChange((e.target.value || undefined) as T | undefined)

  return (
    <label className="flex items-center gap-1.5">
      <span className="text-text-dim text-[0.7rem] font-semibold">{label}</span>
      <select
        className="border-border bg-surface focus:border-primary rounded border px-1 py-0.5 text-xs focus:outline-none"
        value={value ?? ''}
        onChange={handleChange}
      >
        <option value="">(none)</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}
