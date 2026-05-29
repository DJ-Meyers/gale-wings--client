import { Typeahead } from '~/components/fields/Typeahead'
import { useListSpecies } from '~/hooks/api/data'

interface Properties {
  value: string
  onChange: (species: string) => void
}

export const PokemonSelectField = ({ value, onChange }: Properties) => {
  const { species } = useListSpecies()
  return (
    <Typeahead
      label="Pokemon"
      options={species ?? []}
      placeholder="Search Pokemon..."
      value={value}
      onChange={onChange}
    />
  )
}
