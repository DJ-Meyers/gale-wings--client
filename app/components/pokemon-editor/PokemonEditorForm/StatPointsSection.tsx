import { useStore } from '@tanstack/react-form'
import { useMemo } from 'react'

import { StatFieldRow } from '~/components/calculator/PokemonInfoSection/StatFieldRow'
import { FIELD_LABEL_CLASS } from '~/components/fields/FieldLabel'
import { naturesList } from '~/data/natures'
import {
  MAX_TOTAL_SP,
  STAT_KEYS,
  natureModifier,
  rawStatsFor,
} from '~/utils/pokemonStats'

import { SectionHeading } from './SectionHeading'
import type { PokemonEditorFormApi } from './usePokemonEditorForm'

const natureMap = new Map(naturesList.map((n) => [n.name, n]))

interface StatPointsSectionProps {
  form: PokemonEditorFormApi
}

export const StatPointsSection = ({ form }: StatPointsSectionProps) => {
  const pokemon = useStore(form.store, (s) => s.values.pokemon)
  const totalSp = STAT_KEYS.reduce(
    (sum, key) => sum + pokemon.statPoints[key],
    0,
  )
  const rawStats = useMemo(() => rawStatsFor(pokemon), [pokemon])
  const n = pokemon.nature ? natureMap.get(pokemon.nature) : undefined

  return (
    <section>
      <SectionHeading>Stat points</SectionHeading>
      <div className="flex flex-col gap-1">
        <div className={FIELD_LABEL_CLASS}>
          SP: {totalSp} / {MAX_TOTAL_SP}
        </div>
        <div className="flex flex-wrap gap-2">
          {STAT_KEYS.map((stat) => {
            const natureMod = natureModifier(n, stat)
            return (
              <form.Field key={stat} name={`pokemon.statPoints.${stat}`}>
                {(field) => (
                  <StatFieldRow
                    natureMod={natureMod}
                    rawStat={rawStats ? rawStats[stat] : null}
                    sp={field.state.value}
                    stat={stat}
                    onStatPointChange={field.handleChange}
                  />
                )}
              </form.Field>
            )
          })}
        </div>
      </div>
    </section>
  )
}
