import { Pokemon } from '@smogon/calc'

import { gen, speciesOverride, toSmogonName } from '~/data/gen'
import type { CalcParameters, ChampionsPokemon } from '~/types'
import { statPointsToEvs } from '~/utils/statPointConversion'

// Champions battles are level-50 doubles (plan §2.8 / Q9). The Pokemon
// row does not carry a level field — clamping here keeps the boundary
// honest.
const CHAMPIONS_LEVEL = 50

// IVs default to 31 across the board when the pokemon does not specify
// per-stat values. Matches the API column default (plan §1).
const PERFECT_IVS = {
  hp: 31,
  atk: 31,
  def: 31,
  spa: 31,
  spd: 31,
  spe: 31,
} as const

// Map a Champions Pokémon row + per-side calc parameters onto an
// @smogon/calc Pokemon. Replaces TailRoom's `as Pokemon['x']` casts —
// the post-alignment shared schemas are tight literal unions that
// assign cleanly to @smogon/calc.
//
// Plan §6.6. Sentinel '' values are normalised to undefined at the boundary.
export const toCalcPokemon = (
  pokemon: ChampionsPokemon,
  params: CalcParameters,
): Pokemon => {
  const smogonName = toSmogonName(pokemon.species)
  return new Pokemon(gen, smogonName, {
    level: CHAMPIONS_LEVEL,
    nature: pokemon.nature,
    ability: params.abilityOverride ?? pokemon.ability,
    item: pokemon.item || undefined,
    evs: statPointsToEvs(pokemon.statPoints),
    ivs: pokemon.ivs ?? PERFECT_IVS,
    teraType: params.teraType || undefined,
    boosts: params.boosts,
    status: params.status || undefined,
    abilityOn: params.abilityOn,
    boostedStat: params.boostedStat || undefined,
    overrides: speciesOverride(smogonName),
  })
}
