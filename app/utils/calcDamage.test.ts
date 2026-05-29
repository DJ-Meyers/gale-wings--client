import { describe, expect, it } from 'vitest'

import type { FieldConditions } from '@dj-meyers/galewings/types'

import type { CalcParameters, ChampionsPokemon } from '~/types'

import {
  classifyKoTier,
  computeDamage,
  shouldActivateAbility,
} from './calcDamage'

const baseParams: CalcParameters = {
  move: '',
  teraType: '',
  boosts: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
  status: '',
  isCrit: false,
  abilityOn: false,
  boostedStat: '',
}

const incineroar = {
  species: 'Incineroar',
  nature: 'Careful',
  ability: 'Intimidate',
  item: 'Leftovers',
  statPoints: { hp: 30, atk: 3, def: 12, spa: 0, spd: 17, spe: 4 },
  moves: [],
} as unknown as ChampionsPokemon

const ironHands = {
  species: 'Iron Hands',
  nature: 'Adamant',
  ability: 'Quark Drive',
  item: 'Leftovers',
  statPoints: { hp: 16, atk: 32, def: 4, spa: 0, spd: 8, spe: 0 },
  moves: [],
} as unknown as ChampionsPokemon

const flutterMane = {
  species: 'Flutter Mane',
  nature: 'Timid',
  ability: 'Protosynthesis',
  item: 'Leftovers',
  statPoints: { hp: 4, atk: 0, def: 0, spa: 32, spd: 0, spe: 24 },
  moves: [],
} as unknown as ChampionsPokemon

const emptyField: FieldConditions = {}

describe('computeDamage', () => {
  it('produces a non-null result for a valid attacker/defender/move', () => {
    const r = computeDamage(
      { build: flutterMane, params: baseParams },
      { build: incineroar, params: baseParams },
      'Moonblast',
      emptyField,
    )
    expect(r).not.toBeNull()
    expect(r!.range[0]).toBeGreaterThan(0)
    expect(r!.range[1]).toBeGreaterThanOrEqual(r!.range[0])
    expect(r!.defenderMaxHp).toBeGreaterThan(0)
    expect(typeof r!.desc).toBe('string')
  })

  it('returns null for an unknown species', () => {
    const fake = { ...incineroar, species: 'Pikachuuuu' } as unknown as ChampionsPokemon
    const r = computeDamage(
      { build: fake, params: baseParams },
      { build: incineroar, params: baseParams },
      'Moonblast',
      emptyField,
    )
    expect(r).toBeNull()
  })

  it('returns null for an unknown move', () => {
    const r = computeDamage(
      { build: flutterMane, params: baseParams },
      { build: incineroar, params: baseParams },
      'Notamoveatall',
      emptyField,
    )
    expect(r).toBeNull()
  })

  it('routes attacker isCrit into Move construction — crit deals ≥ non-crit', () => {
    const noCrit = computeDamage(
      { build: flutterMane, params: baseParams },
      { build: incineroar, params: baseParams },
      'Moonblast',
      emptyField,
    )
    const crit = computeDamage(
      { build: flutterMane, params: { ...baseParams, isCrit: true } },
      { build: incineroar, params: baseParams },
      'Moonblast',
      emptyField,
    )
    expect(crit).not.toBeNull()
    expect(noCrit).not.toBeNull()
    expect(crit!.range[1]).toBeGreaterThan(noCrit!.range[1])
  })

  it('hardcodes gameType: Doubles — same calc still works under doubles spread reduction', () => {
    const r = computeDamage(
      { build: flutterMane, params: baseParams },
      { build: incineroar, params: baseParams },
      'Dazzling Gleam',
      emptyField,
    )
    expect(r).not.toBeNull()
    expect(r!.range[0]).toBeGreaterThan(0)
  })
})

describe('shouldActivateAbility', () => {
  it('returns true when params.abilityOn is true', () => {
    expect(
      shouldActivateAbility(
        incineroar,
        { ...baseParams, abilityOn: true },
        emptyField,
      ),
    ).toBe(true)
  })

  it('activates Protosynthesis in Sun', () => {
    expect(
      shouldActivateAbility(flutterMane, baseParams, { weather: 'Sun' }),
    ).toBe(true)
  })

  it('does NOT activate Protosynthesis outside Sun (Booster Energy disabled — see calcDamage.ts note)', () => {
    expect(shouldActivateAbility(flutterMane, baseParams, emptyField)).toBe(
      false,
    )
  })

  it('activates Quark Drive on Electric terrain', () => {
    expect(
      shouldActivateAbility(ironHands, baseParams, { terrain: 'Electric' }),
    ).toBe(true)
  })

  it('respects abilityOverride for Paradox detection (Skill Swap / Trace / §2.3)', () => {
    expect(
      shouldActivateAbility(
        incineroar,
        { ...baseParams, abilityOverride: 'Protosynthesis' },
        { weather: 'Sun' },
      ),
    ).toBe(true)
  })
})

describe('classifyKoTier', () => {
  it('returns 5 (no result) for null', () => {
    expect(classifyKoTier(null)).toBe(5)
  })

  it('returns 5 for empty koChance', () => {
    expect(
      classifyKoTier({
        desc: '',
        range: [0, 0],
        koChance: '',
        defenderMaxHp: 0,
      }),
    ).toBe(5)
  })

  it('returns 0 for guaranteed OHKO', () => {
    expect(
      classifyKoTier({
        desc: '',
        range: [0, 0],
        koChance: 'guaranteed OHKO',
        defenderMaxHp: 0,
      }),
    ).toBe(0)
  })

  it('returns 2 for guaranteed 2HKO', () => {
    expect(
      classifyKoTier({
        desc: '',
        range: [0, 0],
        koChance: 'guaranteed 2HKO',
        defenderMaxHp: 0,
      }),
    ).toBe(2)
  })
})
