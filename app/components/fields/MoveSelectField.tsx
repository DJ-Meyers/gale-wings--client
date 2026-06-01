import { Typeahead } from '~/components/fields/Typeahead'
import { useListMoves } from '~/hooks/api/data'

interface Properties {
  value: string
  onChange: (move: string) => void
  className?: string
  label?: string
  options?: string[]
  disabled?: boolean
  compact?: boolean
}

export const MoveSelectField = ({
  value,
  onChange,
  className,
  label,
  options,
  disabled,
  compact,
}: Properties) => {
  const { moves } = useListMoves()
  return (
    <Typeahead
      className={className}
      compact={compact}
      disabled={disabled}
      label={label ?? 'Move'}
      options={options ?? moves ?? []}
      placeholder="Search moves..."
      value={value}
      onChange={onChange}
    />
  )
}
