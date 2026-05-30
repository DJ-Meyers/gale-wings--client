import { CheckboxField } from '~/components/fields/CheckboxField'
import { useModifiers } from '~/hooks/calc/useModifiers'

interface Properties {
  side: 'player' | 'opponent'
}

export const CritCheckbox = ({ side }: Properties) => {
  const { isCrit, toggleCrit } = useModifiers(side)

  return (
    <div className="flex items-center">
      <CheckboxField checked={isCrit} label="Crit" onChange={toggleCrit} />
    </div>
  )
}
