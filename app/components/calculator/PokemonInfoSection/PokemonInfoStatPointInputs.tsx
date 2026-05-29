import { useMemo } from 'react'

import { StatFieldRow } from '~/components/calculator/PokemonInfoSection/StatFieldRow'
import { FIELD_LABEL_CLASS } from '~/components/fields/FieldLabel'
import { naturesList } from '~/data/natures'
import { usePokemonStats } from '~/hooks/calc/usePokemonStats'
import { MAX_TOTAL_SP, STAT_KEYS, rawStatsFor } from '~/utils/pokemonStats'

const natureMap = new Map(naturesList.map((n) => [n.name, n]))

export const PokemonInfoStatPointInputs = () => {
  const { pokemon, onStatPointChange } = usePokemonStats()
  const { statPoints, nature } = pokemon

  const totalSp = STAT_KEYS.reduce((sum, key) => sum + statPoints[key], 0)
  const rawStats = useMemo(() => rawStatsFor(pokemon), [pokemon])
  const n = nature ? natureMap.get(nature) : undefined

  return (
    <div className="mt-3 flex flex-col gap-1">
      <div className={FIELD_LABEL_CLASS}>
        SP: {totalSp} / {MAX_TOTAL_SP}
      </div>
      <div className="flex flex-wrap gap-2">
        {STAT_KEYS.map((stat) => {
          const natureMod =
            n?.plus === stat ? '+' : n?.minus === stat ? '-' : undefined
          return (
            <StatFieldRow
              key={stat}
              natureMod={natureMod}
              rawStat={rawStats ? rawStats[stat] : null}
              sp={statPoints[stat]}
              stat={stat}
              onStatPointChange={(value) => onStatPointChange(stat, value)}
            />
          )
        })}
      </div>
    </div>
  )
}
