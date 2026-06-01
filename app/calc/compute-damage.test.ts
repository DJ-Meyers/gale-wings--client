import { describe, expect, it } from 'vitest'

import type { FieldConditions } from '@dj-meyers/gale-wings/types'

import {
  computeDamage,
  shouldActivateAbility,
} from '~/calc/compute-damage'
import type { CalcParameters, ChampionsPokemon } from '~/types'

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

const floette: ChampionsPokemon = {
  species: 'Floette-Eternal',
  nature: 'Modest',
  ability: 'Flower Veil',
  item: 'Leftovers',
  statPoints: { hp: 4, atk: 0, def: 0, spa: 32, spd: 0, spe: 24 },
  moves: [],
}

const incineroar: ChampionsPokemon = {
  species: 'Incineroar',
  nature: 'Careful',
  ability: 'Intimidate',
  item: 'Leftovers',
  statPoints: { hp: 30, atk: 3, def: 12, spa: 0, spd: 17, spe: 4 },
  moves: [],
}

describe('computeDamage', () => {
  it('produces a non-null result for a valid attacker/defender/move', () => {
    const r = computeDamage(
      { pokemon: floette, params: baseParams },
      { pokemon: incineroar, params: baseParams },
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
    // species is intentionally invalid; the schema literal union won't
    // accept it, so cast through unknown to bypass the type narrowing.
    const fake = {
      ...incineroar,
      species: 'Pikachuuuu',
    } as unknown as ChampionsPokemon
    const r = computeDamage(
      { pokemon: fake, params: baseParams },
      { pokemon: incineroar, params: baseParams },
      'Moonblast',
      emptyField,
    )
    expect(r).toBeNull()
  })

  it('returns null for an unknown move', () => {
    const r = computeDamage(
      { pokemon: floette, params: baseParams },
      { pokemon: incineroar, params: baseParams },
      'Notamoveatall',
      emptyField,
    )
    expect(r).toBeNull()
  })

  it('routes attacker isCrit into Move construction — crit deals ≥ non-crit', () => {
    const noCrit = computeDamage(
      { pokemon: floette, params: baseParams },
      { pokemon: incineroar, params: baseParams },
      'Moonblast',
      emptyField,
    )
    const crit = computeDamage(
      { pokemon: floette, params: { ...baseParams, isCrit: true } },
      { pokemon: incineroar, params: baseParams },
      'Moonblast',
      emptyField,
    )
    expect(crit).not.toBeNull()
    expect(noCrit).not.toBeNull()
    expect(crit!.range[1]).toBeGreaterThan(noCrit!.range[1])
  })

  it('hardcodes gameType: Doubles — same calc still works under doubles spread reduction', () => {
    const r = computeDamage(
      { pokemon: floette, params: baseParams },
      { pokemon: incineroar, params: baseParams },
      'Dazzling Gleam',
      emptyField,
    )
    expect(r).not.toBeNull()
    expect(r!.range[0]).toBeGreaterThan(0)
  })

  it('isSingleTarget removes the spread modifier on a spread move', () => {
    const spread = computeDamage(
      { pokemon: floette, params: baseParams },
      { pokemon: incineroar, params: baseParams },
      'Dazzling Gleam',
      emptyField,
    )
    const single = computeDamage(
      { pokemon: floette, params: baseParams },
      { pokemon: incineroar, params: baseParams },
      'Dazzling Gleam',
      emptyField,
      { isSingleTarget: true },
    )
    expect(spread).not.toBeNull()
    expect(single).not.toBeNull()
    // Spread modifier is 0.75× in doubles, so removing it should bump damage.
    expect(single!.range[1]).toBeGreaterThan(spread!.range[1])
  })

  it('isSingleTarget is a no-op for non-spread moves', () => {
    const normal = computeDamage(
      { pokemon: floette, params: baseParams },
      { pokemon: incineroar, params: baseParams },
      'Moonblast',
      emptyField,
    )
    const flagged = computeDamage(
      { pokemon: floette, params: baseParams },
      { pokemon: incineroar, params: baseParams },
      'Moonblast',
      emptyField,
      { isSingleTarget: true },
    )
    expect(normal).not.toBeNull()
    expect(flagged).not.toBeNull()
    expect(flagged!.range).toEqual(normal!.range)
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
    // Flutter Mane is the canonical Protosynthesis user but isn't in the
    // current Champions regulation's species literal — cast through
    // unknown so the type narrowing doesn't reject it.
    const flutterMane = {
      species: 'Flutter Mane',
      nature: 'Timid',
      ability: 'Protosynthesis',
      item: 'Leftovers',
      statPoints: { hp: 4, atk: 0, def: 0, spa: 32, spd: 0, spe: 24 },
      moves: [],
    } as unknown as ChampionsPokemon
    expect(
      shouldActivateAbility(flutterMane, baseParams, { weather: 'Sun' }),
    ).toBe(true)
  })

  it('does NOT activate Protosynthesis outside Sun (Booster Energy disabled — see compute-damage.ts note)', () => {
    const flutterMane = {
      species: 'Flutter Mane',
      nature: 'Timid',
      ability: 'Protosynthesis',
      item: 'Leftovers',
      statPoints: { hp: 4, atk: 0, def: 0, spa: 32, spd: 0, spe: 24 },
      moves: [],
    } as unknown as ChampionsPokemon
    expect(shouldActivateAbility(flutterMane, baseParams, emptyField)).toBe(
      false,
    )
  })

  it('activates Quark Drive on Electric terrain', () => {
    // Iron Hands is the canonical Quark Drive user but isn't in the
    // current Champions regulation's species literal — cast through
    // unknown so the type narrowing doesn't reject it.
    const ironHands = {
      species: 'Iron Hands',
      nature: 'Adamant',
      ability: 'Quark Drive',
      item: 'Leftovers',
      statPoints: { hp: 16, atk: 32, def: 4, spa: 0, spd: 8, spe: 0 },
      moves: [],
    } as unknown as ChampionsPokemon
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
