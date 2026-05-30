import { NumberField } from '~/components/fields/NumberField'
import { StatDisplay } from '~/components/pokemon/StatDisplay'
import type { StatKey } from '~/types'

import { MAX_SP_PER_STAT, SP_STEP } from '~/utils/pokemonStats'

interface Properties {
  stat: StatKey
  sp: number
  rawStat: number | null
  natureMod?: '+' | '-'
  onStatPointChange: (value: number) => void
}

export const StatFieldRow = ({
  stat,
  sp,
  rawStat,
  natureMod,
  onStatPointChange,
}: Properties) => (
  <div className="flex min-w-[104px] flex-1 basis-[calc(33.333%-0.5rem)] items-center gap-1.5">
    <StatDisplay
      natureMod={natureMod}
      stat={stat}
      total={rawStat}
      variant="labeled"
    />
    <NumberField
      className="border-border bg-surface text-text focus:border-primary focus:ring-primary/20 min-w-16 flex-1 rounded border px-2 py-1.5 text-sm focus:ring-2 focus:outline-none"
      max={MAX_SP_PER_STAT}
      min={0}
      step={SP_STEP}
      value={sp}
      onChange={onStatPointChange}
    />
  </div>
)
