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

const inputClass =
  'bg-slate text-text focus:ring-(--field-accent)/30 min-w-16 flex-1 rounded-r px-2 py-1.5 text-sm focus:ring-2 focus:outline-none'

export const StatFieldRow = ({
  stat,
  sp,
  rawStat,
  natureMod,
  onStatPointChange,
}: Properties) => (
  <div className="flex min-w-[98px] flex-1 basis-[calc(33.333%-0.5rem)] items-center">
    <StatDisplay
      flushRight
      natureMod={natureMod}
      stat={stat}
      total={rawStat}
      variant="labeled"
    />
    <NumberField
      className={inputClass}
      max={MAX_SP_PER_STAT}
      min={0}
      step={SP_STEP}
      value={sp}
      onChange={onStatPointChange}
    />
  </div>
)
