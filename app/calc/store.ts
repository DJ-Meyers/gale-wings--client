import { create } from 'zustand'

import { CALC_FIXTURES, CALC_PLAYER } from './fixtures'
import type { Calc, CalcStore, CalcStoreState } from './types'

const updateCalc = (
  state: CalcStoreState,
  id: string,
  fn: (calc: Calc) => Calc,
): CalcStoreState => {
  const existing = state.calcs[id]
  if (!existing) return state
  return { ...state, calcs: { ...state.calcs, [id]: fn(existing) } }
}

export const useCalcStore = create<CalcStore>((set) => ({
  player: CALC_PLAYER,
  calcs: Object.fromEntries(CALC_FIXTURES.map((c) => [c.id, c])),
  calcOrder: CALC_FIXTURES.map((c) => c.id),
  expandedCalcId: null,

  setPlayer: (patch) =>
    set((state) => ({ ...state, player: { ...state.player, ...patch } })),

  patchCalc: (id, patch) =>
    set((state) => updateCalc(state, id, (c) => ({ ...c, ...patch }))),

  replaceCalc: (id, calc) =>
    set((state) => updateCalc(state, id, () => calc)),

  setOpponent: (id, patch) =>
    set((state) =>
      updateCalc(state, id, (c) => ({
        ...c,
        opponent: { ...c.opponent, ...patch },
      })),
    ),

  setPlayerParams: (id, patch) =>
    set((state) =>
      updateCalc(state, id, (c) => ({
        ...c,
        playerCalcParameters: { ...c.playerCalcParameters, ...patch },
      })),
    ),

  setOpponentParams: (id, patch) =>
    set((state) =>
      updateCalc(state, id, (c) => ({
        ...c,
        opponentCalcParameters: { ...c.opponentCalcParameters, ...patch },
      })),
    ),

  setPlayerBoost: (id, stat, value) =>
    set((state) =>
      updateCalc(state, id, (c) => ({
        ...c,
        playerCalcParameters: {
          ...c.playerCalcParameters,
          boosts: { ...c.playerCalcParameters.boosts, [stat]: value },
        },
      })),
    ),

  setOpponentBoost: (id, stat, value) =>
    set((state) =>
      updateCalc(state, id, (c) => ({
        ...c,
        opponentCalcParameters: {
          ...c.opponentCalcParameters,
          boosts: { ...c.opponentCalcParameters.boosts, [stat]: value },
        },
      })),
    ),

  setFieldConditions: (id, field) =>
    set((state) =>
      updateCalc(state, id, (c) => ({ ...c, fieldConditions: field })),
    ),

  setWeather: (id, weather) =>
    set((state) =>
      updateCalc(state, id, (c) => ({
        ...c,
        fieldConditions: { ...c.fieldConditions, weather },
      })),
    ),

  setTerrain: (id, terrain) =>
    set((state) =>
      updateCalc(state, id, (c) => ({
        ...c,
        fieldConditions: { ...c.fieldConditions, terrain },
      })),
    ),

  toggleRuin: (id, key) =>
    set((state) =>
      updateCalc(state, id, (c) => ({
        ...c,
        fieldConditions: {
          ...c.fieldConditions,
          [key]: !c.fieldConditions[key],
        },
      })),
    ),

  toggleAttackerSide: (id, key) =>
    set((state) =>
      updateCalc(state, id, (c) => {
        const side = c.fieldConditions.attackerSide ?? {}
        return {
          ...c,
          fieldConditions: {
            ...c.fieldConditions,
            attackerSide: { ...side, [key]: !side[key] },
          },
        }
      }),
    ),

  toggleDefenderSide: (id, key) =>
    set((state) =>
      updateCalc(state, id, (c) => {
        const side = c.fieldConditions.defenderSide ?? {}
        return {
          ...c,
          fieldConditions: {
            ...c.fieldConditions,
            defenderSide: { ...side, [key]: !side[key] },
          },
        }
      }),
    ),

  addCalc: (calc) =>
    set((state) => ({
      ...state,
      calcs: { ...state.calcs, [calc.id]: calc },
      calcOrder: [...state.calcOrder, calc.id],
    })),

  removeCalc: (id) =>
    set((state) => {
      const { [id]: _removed, ...rest } = state.calcs
      return {
        ...state,
        calcs: rest,
        calcOrder: state.calcOrder.filter((cid) => cid !== id),
        expandedCalcId:
          state.expandedCalcId === id ? null : state.expandedCalcId,
      }
    }),

  setExpandedId: (id) => set((state) => ({ ...state, expandedCalcId: id })),

  toggleFavorite: (id) =>
    set((state) =>
      updateCalc(state, id, (c) => ({ ...c, isFavorite: !c.isFavorite })),
    ),
}))
