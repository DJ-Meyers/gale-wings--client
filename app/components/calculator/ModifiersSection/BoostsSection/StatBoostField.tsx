import { BoostSelectField } from '~/components/fields/BoostSelectField'
import { useModifiers } from '~/hooks/calc/useModifiers'

import type { StatBoostKey } from '~/sandbox/types'

interface Properties {
  stat: StatBoostKey
  label: string
  side: 'player' | 'opponent'
}

export const StatBoostField = ({ stat, label, side }: Properties) => {
  const { boosts, setBoost } = useModifiers(side)

  return (
    <label className="flex items-center gap-1.5">
      <span className="text-text-dim text-[0.7rem] font-semibold">{label}</span>
      <BoostSelectField
        className="border-border bg-surface focus:border-primary h-6 w-14 rounded border px-1 text-center text-xs focus:outline-none"
        value={boosts[stat]}
        onChange={(value) => setBoost(stat, value)}
      />
    </label>
  )
}
