import { beforeEach, describe, expect, it } from 'vitest'

import { defaultPlayer, makeCalc } from './defaults'
import { useCalcStore } from './store'
import type { Calc } from './types'

const resetStore = (calcs: Calc[] = []) => {
  useCalcStore.setState({
    player: { ...defaultPlayer },
    calcs: Object.fromEntries(calcs.map((c) => [c.id, c])),
    calcOrder: calcs.map((c) => c.id),
    expandedCalcId: null,
  })
}

const get = () => useCalcStore.getState()

describe('useCalcStore', () => {
  beforeEach(() => resetStore())

  it('setPlayer patches the shared player without touching calcs', () => {
    const calc = makeCalc('offensive')
    resetStore([calc])
    const before = get().calcs
    get().setPlayer({ species: 'Garchomp', ability: 'Rough Skin' })
    const after = get()
    expect(after.player.species).toBe('Garchomp')
    expect(after.player.ability).toBe('Rough Skin')
    expect(after.calcs).toBe(before)
  })

  it('setOpponent patches only the opponent build, not the params', () => {
    const calc = makeCalc('offensive')
    resetStore([calc])
    get().setOpponent(calc.id, { species: 'Incineroar' })
    const after = get()
    expect(after.calcs[calc.id].opponent.species).toBe('Incineroar')
    expect(after.calcs[calc.id].opponentCalcParameters).toBe(
      calc.opponentCalcParameters,
    )
  })

  it('setPlayerParams and setOpponentParams write to the right side', () => {
    const calc = makeCalc('offensive')
    resetStore([calc])
    get().setPlayerParams(calc.id, { move: 'Flare Blitz', isCrit: true })
    expect(get().calcs[calc.id].playerCalcParameters.move).toBe('Flare Blitz')
    expect(get().calcs[calc.id].playerCalcParameters.isCrit).toBe(true)
    expect(get().calcs[calc.id].opponentCalcParameters.move).toBe('')

    get().setOpponentParams(calc.id, { teraType: 'Fairy' })
    expect(get().calcs[calc.id].opponentCalcParameters.teraType).toBe('Fairy')
    expect(get().calcs[calc.id].playerCalcParameters.teraType).toBe('')
  })

  it('setPlayerBoost and setOpponentBoost set per-side stat boosts independently', () => {
    const calc = makeCalc('offensive')
    resetStore([calc])
    get().setPlayerBoost(calc.id, 'atk', 2)
    expect(get().calcs[calc.id].playerCalcParameters.boosts.atk).toBe(2)
    expect(get().calcs[calc.id].opponentCalcParameters.boosts.atk).toBe(0)

    get().setOpponentBoost(calc.id, 'spe', -1)
    expect(get().calcs[calc.id].opponentCalcParameters.boosts.spe).toBe(-1)
    expect(get().calcs[calc.id].playerCalcParameters.boosts.atk).toBe(2)
  })

  it('setFieldConditions wholesale replaces the calc fieldConditions', () => {
    const calc = makeCalc('offensive')
    resetStore([calc])
    get().setFieldConditions(calc.id, { weather: 'Sun', terrain: 'Electric' })
    expect(get().calcs[calc.id].fieldConditions).toEqual({
      weather: 'Sun',
      terrain: 'Electric',
    })
  })

  it('setWeather and setTerrain patch the named slot without disturbing others', () => {
    const calc = makeCalc('offensive')
    resetStore([calc])
    get().setWeather(calc.id, 'Sun')
    get().setTerrain(calc.id, 'Electric')
    expect(get().calcs[calc.id].fieldConditions.weather).toBe('Sun')
    expect(get().calcs[calc.id].fieldConditions.terrain).toBe('Electric')
  })

  it('toggleRuin flips a ruin flag on the targeted calc only', () => {
    const a = makeCalc('offensive')
    const b = makeCalc('defensive')
    resetStore([a, b])
    get().toggleRuin(a.id, 'isBeadsOfRuin')
    expect(get().calcs[a.id].fieldConditions.isBeadsOfRuin).toBe(true)
    expect(get().calcs[b.id].fieldConditions.isBeadsOfRuin).toBeUndefined()
    get().toggleRuin(a.id, 'isBeadsOfRuin')
    expect(get().calcs[a.id].fieldConditions.isBeadsOfRuin).toBe(false)
  })

  it('toggleAttackerSide and toggleDefenderSide flip nested side flags independently', () => {
    const calc = makeCalc('offensive')
    resetStore([calc])
    get().toggleAttackerSide(calc.id, 'isTailwind')
    get().toggleDefenderSide(calc.id, 'isReflect')
    expect(get().calcs[calc.id].fieldConditions.attackerSide?.isTailwind).toBe(
      true,
    )
    expect(get().calcs[calc.id].fieldConditions.defenderSide?.isReflect).toBe(
      true,
    )
    get().toggleAttackerSide(calc.id, 'isTailwind')
    expect(get().calcs[calc.id].fieldConditions.attackerSide?.isTailwind).toBe(
      false,
    )
    expect(get().calcs[calc.id].fieldConditions.defenderSide?.isReflect).toBe(
      true,
    )
  })

  it('addCalc appends to calcOrder, removeCalc drops by id, replaceCalc swaps the entry', () => {
    const a = makeCalc('offensive')
    const b = makeCalc('defensive')
    get().addCalc(a)
    get().addCalc(b)
    expect(get().calcOrder).toEqual([a.id, b.id])
    expect(get().calcs[a.id]).toBe(a)

    get().replaceCalc(a.id, { ...a, name: 'renamed' })
    expect(get().calcs[a.id].name).toBe('renamed')
    expect(get().calcs[b.id]).toBe(b)
    expect(get().calcOrder).toEqual([a.id, b.id])

    get().removeCalc(a.id)
    expect(get().calcOrder).toEqual([b.id])
    expect(get().calcs[a.id]).toBeUndefined()
  })

  it('patchCalc shallow-merges a partial onto the target calc', () => {
    const a = makeCalc('offensive')
    resetStore([a])
    get().patchCalc(a.id, { name: 'renamed', notes: 'a note' })
    expect(get().calcs[a.id].name).toBe('renamed')
    expect(get().calcs[a.id].notes).toBe('a note')
    expect(get().calcs[a.id].opponent).toBe(a.opponent)
  })

  it('removeCalc clears expandedCalcId when removing the expanded calc', () => {
    const a = makeCalc('offensive')
    resetStore([a])
    get().setExpandedId(a.id)
    get().removeCalc(a.id)
    expect(get().expandedCalcId).toBeNull()
  })

  it('setExpandedId sets and clears expandedCalcId', () => {
    const a = makeCalc('offensive')
    resetStore([a])
    get().setExpandedId(a.id)
    expect(get().expandedCalcId).toBe(a.id)
    get().setExpandedId(null)
    expect(get().expandedCalcId).toBeNull()
  })

  it('toggleFavorite flips isFavorite on the targeted calc only', () => {
    const a = makeCalc('offensive')
    const b = makeCalc('defensive')
    resetStore([a, b])
    get().toggleFavorite(a.id)
    expect(get().calcs[a.id].isFavorite).toBe(true)
    expect(get().calcs[b.id].isFavorite).toBe(false)
    get().toggleFavorite(a.id)
    expect(get().calcs[a.id].isFavorite).toBe(false)
  })
})
