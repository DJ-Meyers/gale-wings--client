import { Typeahead } from '~/components/fields/Typeahead'
import { useListItems } from '~/hooks/api/data'

interface Properties {
  value: string
  onChange: (item: string) => void
  compact?: boolean
}

export const ItemSelectField = ({ value, onChange, compact }: Properties) => {
  const { items } = useListItems()
  return (
    <Typeahead
      allowEmpty
      compact={compact}
      emptyLabel="(none)"
      label="Item"
      options={items ?? []}
      placeholder="Search items..."
      value={value}
      onChange={onChange}
    />
  )
}
