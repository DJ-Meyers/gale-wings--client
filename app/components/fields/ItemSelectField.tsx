import { Typeahead } from '~/components/fields/Typeahead'
import { useListItems } from '~/hooks/api/data'

interface Properties {
  value: string
  onChange: (item: string) => void
}

export const ItemSelectField = ({ value, onChange }: Properties) => {
  const { items } = useListItems()
  return (
    <Typeahead
      allowEmpty
      emptyLabel="(none)"
      label="Item"
      options={items ?? []}
      placeholder="Search items..."
      value={value}
      onChange={onChange}
    />
  )
}
