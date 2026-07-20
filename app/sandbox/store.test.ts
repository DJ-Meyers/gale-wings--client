import { beforeEach, describe, expect, it } from 'vitest'

import { PARSE_CORPUS } from '@dj-meyers/gale-wings/test-fixtures'

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

  it('applyParseResult clears stale conditions on both sides when the parse carries no tokens', () => {
    get().setAttackerConditions({ basePowerOverride: 150 })
    get().setDefenderConditions({ hits: 5 })
    expect(get().attackerConditions.basePowerOverride).toBe(150)
    expect(get().defenderConditions.hits).toBe(5)
    get().applyParseResult(
      makeParseResult({
        attacker: { pokemon: { species: 'Basculegion' }, errors: [] },
      }),
    )
    expect(get().attackerConditions).toEqual({})
    expect(get().defenderConditions).toEqual({})
  })

  // Pins the parse-driven UX: fieldConditions is REPLACED wholesale on each
  // parse, not shallow-merged. A future refactor switching to a merge would
  // silently change the UX (a manually-toggled terrain would survive a
  // subsequent parse that carries no terrain).
  it('applyParseResult replaces fieldConditions wholesale, not merging', () => {
    get().setFieldConditions({ terrain: 'Psychic', weather: 'Sun' })
    get().applyParseResult(makeParseResult({ fieldConditions: {} }))
    expect(get().fieldConditions).toEqual({})
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

  // Shared cross-repo fixture corpus. Each fixture pairs a `parseVs` input with
  // the result it should produce; here we drive `applyParseResult` with that
  // result and assert the store landed in the right shape. A fixture only
  // asserts a field the fixture itself sets — missing fields fall back to
  // prior state via `parsedToPokemon` and shouldn't be pinned per-fixture.
  // Together this covers the cross-fixture surface that Bucket 1 of the
  // test-coverage handoff calls out (side flags, field-wide flags, quiet
  // fields like nature/ability landing through the parse → store hop).
  describe('PARSE_CORPUS fixtures', () => {
    it.each(PARSE_CORPUS.map((fx) => [fx.id, fx] as const))(
      '%s applyParseResult lands fixture in the store',
      (_id, fixture) => {
        get().applyParseResult(fixture.expected)
        const s = get()
        const { attacker: a, defender: d, fieldConditions: fc } = fixture.expected

        // Pokemon-shaped fields land via parsedToPokemon.
        if (a.pokemon.species) expect(s.attacker.species).toBe(a.pokemon.species)
        if (a.pokemon.nature) expect(s.attacker.nature).toBe(a.pokemon.nature)
        if (a.pokemon.ability) expect(s.attacker.ability).toBe(a.pokemon.ability)
        if (a.pokemon.item) expect(s.attacker.item).toBe(a.pokemon.item)
        if (d.pokemon.species) expect(s.defender.species).toBe(d.pokemon.species)
        if (d.pokemon.nature) expect(s.defender.nature).toBe(d.pokemon.nature)
        if (d.pokemon.ability) expect(s.defender.ability).toBe(d.pokemon.ability)
        if (d.pokemon.item) expect(s.defender.item).toBe(d.pokemon.item)

        // Calc-shaped fields land via parsedToCalcParameters.
        if (a.pokemon.move) {
          expect(s.attackerCalcParameters.move).toBe(a.pokemon.move)
        }
        if (d.pokemon.move) {
          expect(s.defenderCalcParameters.move).toBe(d.pokemon.move)
        }
        if (a.pokemon.status !== undefined) {
          expect(s.attackerCalcParameters.status).toBe(a.pokemon.status)
        }
        if (d.pokemon.status !== undefined) {
          expect(s.defenderCalcParameters.status).toBe(d.pokemon.status)
        }
        if (a.pokemon.isCrit !== undefined) {
          expect(s.attackerCalcParameters.isCrit).toBe(a.pokemon.isCrit)
        }
        if (d.pokemon.isCrit !== undefined) {
          expect(s.defenderCalcParameters.isCrit).toBe(d.pokemon.isCrit)
        }

        // Variable-power and HP-quantity conditions land via parsedToConditions.
        if (a.pokemon.basePowerOverride !== undefined) {
          expect(s.attackerConditions.basePowerOverride).toBe(
            a.pokemon.basePowerOverride,
          )
        }
        if (d.pokemon.basePowerOverride !== undefined) {
          expect(s.defenderConditions.basePowerOverride).toBe(
            d.pokemon.basePowerOverride,
          )
        }
        if (a.pokemon.hpPercent !== undefined) {
          expect(s.attackerConditions.hpPercent).toBe(a.pokemon.hpPercent)
        }
        if (d.pokemon.hpPercent !== undefined) {
          expect(s.defenderConditions.hpPercent).toBe(d.pokemon.hpPercent)
        }
        if (a.pokemon.currentHp !== undefined) {
          expect(s.attackerConditions.currentHp).toBe(a.pokemon.currentHp)
        }
        if (d.pokemon.currentHp !== undefined) {
          expect(s.defenderConditions.currentHp).toBe(d.pokemon.currentHp)
        }
        if (a.pokemon.maxHp !== undefined) {
          expect(s.attackerConditions.maxHp).toBe(a.pokemon.maxHp)
        }
        if (d.pokemon.maxHp !== undefined) {
          expect(s.defenderConditions.maxHp).toBe(d.pokemon.maxHp)
        }

        // Field conditions are written wholesale.
        expect(s.fieldConditions).toMatchObject(fc)
      },
    )
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

    get().setDefenderParams({ status: 'brn' })
    expect(get().defenderCalcParameters.status).toBe('brn')
    expect(get().attackerCalcParameters.status).toBe('')
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
    get().setDefenderParams({ status: 'brn' })

    get().swapAttackerDefender()

    expect(get().attacker.species).toBe('Charizard-Mega-Y')
    expect(get().attacker.item).toBe('Charizardite Y')
    expect(get().defender.species).toBe('Basculegion')
    expect(get().defender.item).toBe('Choice Scarf')
    expect(get().attackerCalcParameters.status).toBe('brn')
    expect(get().defenderCalcParameters.move).toBe('Wave Crash')
  })
})
