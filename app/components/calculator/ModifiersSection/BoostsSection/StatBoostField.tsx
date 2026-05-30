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
    <div className="flex flex-col items-center gap-0.5">
      <label className="text-text-dim text-[0.7rem] font-semibold">
        {label}
      </label>
      <BoostSelectField
        className="border-border bg-surface focus:border-primary w-14 rounded border p-0.5 text-center text-xs focus:outline-none"
        value={boosts[stat]}
        onChange={(value) => setBoost(stat, value)}
      />
    </div>
  )
}
