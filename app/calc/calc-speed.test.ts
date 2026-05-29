import { describe, expect, it } from 'vitest'

import type { CalcParameters, ChampionsPokemon, FieldConditions } from '~/types'

import { computeEffectiveSpeed } from './calc-speed'

const baseParams: CalcParameters = {
  move: '',
  teraType: '',
  boosts: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
  status: '',
  isCrit: false,
  abilityOn: false,
  boostedStat: '',
}

const emptyField: FieldConditions = {}

const garchomp: ChampionsPokemon = {
  species: 'Garchomp',
  nature: 'Jolly',
  ability: 'Rough Skin',
  item: 'Leftovers',
  statPoints: { hp: 0, atk: 32, def: 0, spa: 0, spd: 0, spe: 32 },
  moves: [],
}

describe('computeEffectiveSpeed', () => {
  it('returns a positive base speed for a valid build', () => {
    const s = computeEffectiveSpeed(
      { pokemon: garchomp, params: baseParams },
      emptyField,
      false,
    )
    expect(s).toBeGreaterThan(0)
  })

  it('doubles speed under tailwind', () => {
    const base = computeEffectiveSpeed(
      { pokemon: garchomp, params: baseParams },
      emptyField,
      false,
    )
    const tw = computeEffectiveSpeed(
      { pokemon: garchomp, params: baseParams },
      emptyField,
      true,
    )
    expect(tw).toBe(Math.floor(base * 2))
  })

  it('halves speed under paralysis (no Quick Feet)', () => {
    const base = computeEffectiveSpeed(
      { pokemon: garchomp, params: baseParams },
      emptyField,
      false,
    )
    const par = computeEffectiveSpeed(
      { pokemon: garchomp, params: { ...baseParams, status: 'par' } },
      emptyField,
      false,
    )
    expect(par).toBe(Math.floor((base * 50) / 100))
  })

  it('applies +1 boost stage as 1.5x', () => {
    const base = computeEffectiveSpeed(
      { pokemon: garchomp, params: baseParams },
      emptyField,
      false,
    )
    const boosted = computeEffectiveSpeed(
      {
        pokemon: garchomp,
        params: { ...baseParams, boosts: { ...baseParams.boosts, spe: 1 } },
      },
      emptyField,
      false,
    )
    expect(boosted).toBe(Math.floor((base * 3) / 2))
  })

  it('Choice Scarf applies a 1.5x multiplier', () => {
    const base = computeEffectiveSpeed(
      { pokemon: garchomp, params: baseParams },
      emptyField,
      false,
    )
    const scarf = computeEffectiveSpeed(
      { pokemon: { ...garchomp, item: 'Choice Scarf' }, params: baseParams },
      emptyField,
      false,
    )
    expect(scarf).toBe(Math.floor((base * 6144) / 4096))
  })

  it('Chlorophyll doubles speed in Sun', () => {
    const chloropuff: ChampionsPokemon = {
      ...garchomp,
      ability: 'Chlorophyll' as ChampionsPokemon['ability'],
    }
    const base = computeEffectiveSpeed(
      { pokemon: chloropuff, params: baseParams },
      emptyField,
      false,
    )
    const sun = computeEffectiveSpeed(
      { pokemon: chloropuff, params: baseParams },
      { weather: 'Sun' },
      false,
    )
    expect(sun).toBe(Math.floor(base * 2))
  })
})
