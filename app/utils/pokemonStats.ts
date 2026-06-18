import type { CalcParameters, ChampionsPokemon, StatKey } from '~/types'

import { toCalcPokemon } from '@dj-meyers/gale-wings/calc'

export const STAT_KEYS: readonly StatKey[] = [
  'hp',
  'atk',
  'def',
  'spa',
  'spd',
  'spe',
] as const

export const MAX_SP_PER_STAT = 32
export const MAX_TOTAL_SP = 66
export const SP_STEP = 1

const RAW_STATS_PARAMS: CalcParameters = {
  move: '',
  teraType: '',
  boosts: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
  status: '',
  isCrit: false,
  abilityOn: false,
  boostedStat: '',
}

export const rawStatsFor = (pokemon: ChampionsPokemon) => {
  try {
    return toCalcPokemon(pokemon, RAW_STATS_PARAMS).rawStats
  } catch {
    return null
  }
}
