import { useMemo } from 'react'

import { Typeahead } from '~/components/fields/Typeahead'
import { useListAbilities } from '~/hooks/api/data'

interface Properties {
  value: string
  onChange: (ability: string) => void
  speciesAbilities?: string[]
}

export const AbilitySelectField = ({
  value,
  onChange,
  speciesAbilities = [],
}: Properties) => {
  const { abilities } = useListAbilities()

  const options = useMemo(() => {
    const all = abilities ?? []
    const speciesSet = new Set(speciesAbilities)
    const rest = all.filter((a) => !speciesSet.has(a))
    return [...speciesAbilities, ...rest]
  }, [abilities, speciesAbilities])

  return (
    <Typeahead
      label="Ability"
      options={options}
      placeholder="Search abilities..."
      value={value}
      onChange={onChange}
    />
  )
}
