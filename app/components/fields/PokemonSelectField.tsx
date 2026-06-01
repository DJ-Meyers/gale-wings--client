import { Typeahead } from '~/components/fields/Typeahead'
import { useListSpecies } from '~/hooks/api/data'

interface Properties {
  value: string
  onChange: (species: string) => void
  compact?: boolean
}

export const PokemonSelectField = ({
  value,
  onChange,
  compact,
}: Properties) => {
  const { species } = useListSpecies()
  return (
    <Typeahead
      compact={compact}
      label="Pokemon"
      options={species ?? []}
      placeholder="Search Pokemon..."
      value={value}
      onChange={onChange}
    />
  )
}
