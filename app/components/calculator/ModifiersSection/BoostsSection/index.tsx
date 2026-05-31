import { CritCheckbox } from '~/components/calculator/ModifiersSection/BoostsSection/CritCheckbox'
import { StatBoostField } from '~/components/calculator/ModifiersSection/BoostsSection/StatBoostField'
import { Fieldset } from '~/components/ui/Fieldset'
import { useModifiers } from '~/hooks/calc/useModifiers'

import type { StatBoostKey } from '~/sandbox/types'

interface Properties {
  side: 'player' | 'opponent'
}

const BOOSTABLE_STATS: { stat: StatBoostKey; label: string }[] = [
  { stat: 'atk', label: 'Atk' },
  { stat: 'def', label: 'Def' },
  { stat: 'spa', label: 'SpA' },
  { stat: 'spd', label: 'SpD' },
  { stat: 'spe', label: 'Spe' },
]

export const BoostsSection = ({ side }: Properties) => {
  const { showCrit } = useModifiers(side)

  return (
    <Fieldset className="justify-around" legend="Boosts">
      {BOOSTABLE_STATS.map(({ stat, label }) => (
        <StatBoostField key={stat} label={label} side={side} stat={stat} />
      ))}
      {showCrit && <CritCheckbox side={side} />}
    </Fieldset>
  )
}
