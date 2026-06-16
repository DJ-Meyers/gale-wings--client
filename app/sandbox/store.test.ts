import { beforeEach, describe, expect, it } from 'vitest'

import type { VsParseResult } from '~/hooks/api/data'

import { makeDefaultSandboxState } from './defaults'
import { useSandboxStore } from './store'

const reset = () => useSandboxStore.setState(makeDefaultSandboxState())

const get = () => useSandboxStore.getState()

const makeParseResult = (overrides: Partial<VsParseResult> = {}): VsParseResult => ({
  attacker: { pokemon: {}, errors: [] },
  defender: { pokemon: {}, errors: [] },
  fieldConditions: {},
  ...overrides,
})

describe('useSandboxStore', () => {
  beforeEach(() => reset())

  it('setInput updates the input string', () => {
    get().setInput('Iron Hands vs Garchomp')
    expect(get().input).toBe('Iron Hands vs Garchomp')
  })

  it('applyParseResult replaces attacker/defender/params/field from the parse', () => {
    get().applyParseResult(
      makeParseResult({
        attacker: {
          pokemon: {
            species: 'Basculegion',
            nature: 'Adamant',
            ability: 'Adaptability',
            item: 'Choice Scarf',
            statPoints: { hp: 32, atk: 32 },
            move: 'Wave Crash',
            teraType: 'Grass',
            boosts: { atk: 1 },
            isCrit: true,
          },
          errors: [],
        },
        defender: {
          pokemon: {
            species: 'Garchomp',
            nature: 'Jolly',
            ability: 'Rough Skin',
            statPoints: { hp: 0 },
            boosts: { def: -1 },
          },
          errors: [],
        },
        fieldConditions: {
          weather: 'Sun',
          terrain: 'Psychic',
          defenderSide: { isReflect: true },
        },
      }),
    )

    const s = get()
    expect(s.attacker.species).toBe('Basculegion')
    expect(s.attacker.ability).toBe('Adaptability')
    expect(s.attacker.item).toBe('Choice Scarf')
    expect(s.attacker.statPoints.hp).toBe(32)
    expect(s.attacker.statPoints.atk).toBe(32)
    expect(s.attacker.statPoints.spe).toBe(0)
    expect(s.attacker.moves).toEqual(['Wave Crash'])

    expect(s.attackerCalcParameters.move).toBe('Wave Crash')
    expect(s.attackerCalcParameters.teraType).toBe('Grass')
    expect(s.attackerCalcParameters.boosts.atk).toBe(1)
    expect(s.attackerCalcParameters.boosts.spe).toBe(0)
    expect(s.attackerCalcParameters.isCrit).toBe(true)

    expect(s.defender.species).toBe('Garchomp')
    expect(s.defenderCalcParameters.boosts.def).toBe(-1)

    expect(s.fieldConditions.weather).toBe('Sun')
    expect(s.fieldConditions.terrain).toBe('Psychic')
    expect(s.fieldConditions.defenderSide?.isReflect).toBe(true)
  })

  it('applyParseResult seeds variable-power conditions from the parse', () => {
    get().applyParseResult(
      makeParseResult({
        attacker: {
          pokemon: {
            species: 'Basculegion',
            move: 'Last Respects',
            basePowerOverride: 150,
            alliesFainted: 2,
          },
          errors: [],
        },
        defender: {
          pokemon: { species: 'Garchomp', hits: 5 },
          errors: [],
        },
      }),
    )
    const s = get()
    expect(s.attackerConditions).toEqual({
      basePowerOverride: 150,
      alliesFainted: 2,
    })
    expect(s.defenderConditions).toEqual({ hits: 5 })
  })

  it('applyParseResult clears stale conditions when the parse carries no tokens', () => {
    get().setAttackerConditions({ basePowerOverride: 150 })
    expect(get().attackerConditions.basePowerOverride).toBe(150)
    get().applyParseResult(
      makeParseResult({
        attacker: { pokemon: { species: 'Basculegion' }, errors: [] },
      }),
    )
    expect(get().attackerConditions).toEqual({})
  })

  it('applyParseResult falls back to existing pokemon fields when species is unchanged', () => {
    const before = get().attacker
    get().applyParseResult(
      makeParseResult({
        attacker: { pokemon: { species: before.species }, errors: [] },
      }),
    )
    const after = get().attacker
    expect(after.species).toBe(before.species)
    expect(after.nature).toBe(before.nature)
    expect(after.ability).toBe(before.ability)
    expect(after.item).toBe(before.item)
  })

  it('applyParseResult clears species-tied fields when the species changes', () => {
    // Give the attacker a species-tied item, then parse a different species
    // without one — the item must not carry over.
    get().setAttacker({ item: 'Charizardite Y' })
    const before = get().attacker
    expect(before.item).toBe('Charizardite Y')
    get().applyParseResult(
      makeParseResult({
        attacker: { pokemon: { species: 'Sneasler' }, errors: [] },
      }),
    )
    const after = get().attacker
    expect(after.species).toBe('Sneasler')
    expect(after.item).toBeUndefined()
    expect(after.ability).toBe('')
    expect(after.moves).toEqual([])
    expect(after.statPoints).toEqual({
      hp: 0,
      atk: 0,
      def: 0,
      spa: 0,
      spd: 0,
      spe: 0,
    })
    // Nature is not species-tied and carries over.
    expect(after.nature).toBe(before.nature)
  })

  it('setAttacker and setDefender patch the right side', () => {
    get().setAttacker({ species: 'Basculegion' })
    get().setDefender({ nature: 'Bold' })
    expect(get().attacker.species).toBe('Basculegion')
    expect(get().defender.nature).toBe('Bold')
    expect(get().attacker.nature).not.toBe('Bold')
  })

  it('setAttackerParams and setDefenderParams write to the right side', () => {
    get().setAttackerParams({ move: 'Wave Crash', isCrit: true })
    expect(get().attackerCalcParameters.move).toBe('Wave Crash')
    expect(get().attackerCalcParameters.isCrit).toBe(true)
    expect(get().defenderCalcParameters.move).toBe('Heat Wave')

    get().setDefenderParams({ teraType: 'Fairy' })
    expect(get().defenderCalcParameters.teraType).toBe('Fairy')
    expect(get().attackerCalcParameters.teraType).toBe('')
  })

  it('setAttackerBoost and setDefenderBoost set per-side stat boosts independently', () => {
    get().setAttackerBoost('atk', 2)
    expect(get().attackerCalcParameters.boosts.atk).toBe(2)
    expect(get().defenderCalcParameters.boosts.atk).toBe(0)

    get().setDefenderBoost('spe', -1)
    expect(get().defenderCalcParameters.boosts.spe).toBe(-1)
    expect(get().attackerCalcParameters.boosts.atk).toBe(2)
  })

  it('setFieldConditions wholesale replaces, setWeather/setTerrain patch a slot', () => {
    get().setFieldConditions({ weather: 'Sun', terrain: 'Electric' })
    expect(get().fieldConditions).toEqual({ weather: 'Sun', terrain: 'Electric' })

    get().setWeather('Rain')
    expect(get().fieldConditions.weather).toBe('Rain')
    expect(get().fieldConditions.terrain).toBe('Electric')

    get().setTerrain('Grassy')
    expect(get().fieldConditions.terrain).toBe('Grassy')
  })

  it('toggleRuin flips a ruin flag in place', () => {
    get().toggleRuin('isBeadsOfRuin')
    expect(get().fieldConditions.isBeadsOfRuin).toBe(true)
    get().toggleRuin('isBeadsOfRuin')
    expect(get().fieldConditions.isBeadsOfRuin).toBe(false)
  })

  it('toggleAttackerSide and toggleDefenderSide flip nested side flags independently', () => {
    get().toggleAttackerSide('isTailwind')
    get().toggleDefenderSide('isReflect')
    expect(get().fieldConditions.attackerSide?.isTailwind).toBe(true)
    expect(get().fieldConditions.defenderSide?.isReflect).toBe(true)

    get().toggleAttackerSide('isTailwind')
    expect(get().fieldConditions.attackerSide?.isTailwind).toBe(false)
    expect(get().fieldConditions.defenderSide?.isReflect).toBe(true)
  })

  it('swapAttackerDefender exchanges attacker/defender and their params', () => {
    get().setAttacker({ species: 'Basculegion', item: 'Choice Scarf' })
    get().setDefender({ species: 'Charizard-Mega-Y', item: 'Charizardite Y' })
    get().setAttackerParams({ move: 'Wave Crash' })
    get().setDefenderParams({ teraType: 'Fire' })

    get().swapAttackerDefender()

    expect(get().attacker.species).toBe('Charizard-Mega-Y')
    expect(get().attacker.item).toBe('Charizardite Y')
    expect(get().defender.species).toBe('Basculegion')
    expect(get().defender.item).toBe('Choice Scarf')
    expect(get().attackerCalcParameters.teraType).toBe('Fire')
    expect(get().defenderCalcParameters.move).toBe('Wave Crash')
  })
})
