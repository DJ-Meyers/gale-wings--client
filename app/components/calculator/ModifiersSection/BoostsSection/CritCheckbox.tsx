import { CheckboxField } from '~/components/fields/CheckboxField'
import { useModifiers } from '~/hooks/calc/useModifiers'

interface Properties {
  side: 'player' | 'opponent'
}

export const CritCheckbox = ({ side }: Properties) => {
  const { isCrit, toggleCrit } = useModifiers(side)

  return (
    <CheckboxField
      checked={isCrit}
      className="h-6"
      label="Crit"
      onChange={toggleCrit}
    />
  )
}
