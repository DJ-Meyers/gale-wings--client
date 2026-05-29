import type { FieldConditions } from '~/types'

import { shouldActivateAbility, type CalcSide } from './compute-damage'
import { toCalcPokemon } from '~/utils/championsPokemon'

const WEATHER_SPEED_ABILITIES: Record<string, string> = {
  Chlorophyll: 'Sun',
  'Swift Swim': 'Rain',
  'Sand Rush': 'Sand',
  'Slush Rush': 'Snow',
}

// Effective speed including stage boosts, item and ability multipliers,
// weather/terrain triggers, paralysis, and tailwind. Caller decides
// which fieldConditions side's tailwind applies via hasTailwind.
export const computeEffectiveSpeed = (
  side: CalcSide,
  fieldConditions: FieldConditions,
  hasTailwind: boolean,
): number => {
  try {
    const { pokemon, params } = side
    const calcPokemon = toCalcPokemon(pokemon, params)
    let speed = calcPokemon.rawStats.spe

    const boost = params.boosts.spe
    if (boost > 0) {
      speed = Math.floor((speed * (2 + boost)) / 2)
    } else if (boost < 0) {
      speed = Math.floor((speed * 2) / (2 - boost))
    }

    if (hasTailwind) {
      speed = Math.floor(speed * 2)
    }

    if (pokemon.item === 'Choice Scarf') {
      speed = Math.floor((speed * 6144) / 4096)
    }

    // Iron Ball halves speed; re-enable when the item returns to
    // vgc-2026-m-a legalItems (currently the regulation literal omits it).
    // if (pokemon.item === 'Iron Ball') {
    //   speed = Math.floor((speed * 2048) / 4096)
    // }

    const weatherMatch = WEATHER_SPEED_ABILITIES[pokemon.ability]
    if (weatherMatch && fieldConditions.weather === weatherMatch) {
      speed = Math.floor(speed * 2)
    }

    if (
      pokemon.ability === 'Surge Surfer' &&
      fieldConditions.terrain === 'Electric'
    ) {
      speed = Math.floor(speed * 2)
    }

    if (
      (pokemon.ability === 'Protosynthesis' ||
        pokemon.ability === 'Quark Drive') &&
      shouldActivateAbility(pokemon, params, fieldConditions)
    ) {
      const boostedStat = params.boostedStat || 'auto'
      if (boostedStat === 'spe' || boostedStat === 'auto') {
        speed = Math.floor((speed * 6144) / 4096)
      }
    }

    if (pokemon.ability === 'Unburden' && params.abilityOn) {
      speed = Math.floor(speed * 2)
    }

    if (params.status === 'par' && pokemon.ability !== 'Quick Feet') {
      speed = Math.floor((speed * 50) / 100)
    }

    if (pokemon.ability === 'Quick Feet' && params.status) {
      speed = Math.floor((speed * 6144) / 4096)
    }

    return Math.max(0, Math.min(10_000, speed))
  } catch {
    return 0
  }
}
