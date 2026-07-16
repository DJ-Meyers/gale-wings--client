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

/**
 * The nature's effect on a stat: '+' if it raises the stat, '-' if it lowers it,
 * or undefined otherwise. Neutral natures (e.g. Serious, Hardy) name the SAME
 * stat as their boost and drop, so they cancel out and get no sign — the
 * `raises === lowers` check returns undefined for both "raises and lowers" and
 * "neither".
 */
export const natureModifier = (
  nature: { plus?: string; minus?: string } | undefined | null,
  stat: StatKey,
): '+' | '-' | undefined => {
  const raises = nature?.plus === stat
  const lowers = nature?.minus === stat
  if (raises === lowers) return undefined
  return raises ? '+' : '-'
}

/**
 * The sub-label under a compact stat chip:
 * - with points: the points and the nature sign (e.g. "10+", "32+");
 * - no points but a nature modifier: the stat name and sign (e.g. "Atk+",
 *   "SpA-") — clearer than a bare "0+";
 * - otherwise: just the stat name (e.g. "Def").
 */
export const formatStatSubLabel = (
  sp: number | undefined,
  natureMod: '+' | '-' | undefined,
  label: string,
): string =>
  sp ? `${sp}${natureMod ?? ''}` : natureMod ? `${label}${natureMod}` : label

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
