import { create } from 'zustand'

import {
  makeDefaultSandboxState,
  parsedToCalcParameters,
  parsedToPokemon,
} from './defaults'
import type { SandboxStore } from './types'

export const useSandboxStore = create<SandboxStore>((set) => ({
  ...makeDefaultSandboxState(),

  setInput: (input) => set((state) => ({ ...state, input })),

  applyParseResult: (result) =>
    set((state) => ({
      ...state,
      attacker: parsedToPokemon(result.attacker.pokemon, state.attacker),
      defender: parsedToPokemon(result.defender.pokemon, state.defender),
      attackerCalcParameters: parsedToCalcParameters(result.attacker.pokemon),
      defenderCalcParameters: parsedToCalcParameters(result.defender.pokemon),
      fieldConditions: { ...result.fieldConditions },
    })),

  setAttacker: (patch) =>
    set((state) => ({ ...state, attacker: { ...state.attacker, ...patch } })),

  setDefender: (patch) =>
    set((state) => ({ ...state, defender: { ...state.defender, ...patch } })),

  setAttackerParams: (patch) =>
    set((state) => ({
      ...state,
      attackerCalcParameters: { ...state.attackerCalcParameters, ...patch },
    })),

  setDefenderParams: (patch) =>
    set((state) => ({
      ...state,
      defenderCalcParameters: { ...state.defenderCalcParameters, ...patch },
    })),

  setAttackerBoost: (stat, value) =>
    set((state) => ({
      ...state,
      attackerCalcParameters: {
        ...state.attackerCalcParameters,
        boosts: { ...state.attackerCalcParameters.boosts, [stat]: value },
      },
    })),

  setDefenderBoost: (stat, value) =>
    set((state) => ({
      ...state,
      defenderCalcParameters: {
        ...state.defenderCalcParameters,
        boosts: { ...state.defenderCalcParameters.boosts, [stat]: value },
      },
    })),

  setFieldConditions: (patch) =>
    set((state) => ({ ...state, fieldConditions: patch })),

  setWeather: (weather) =>
    set((state) => ({
      ...state,
      fieldConditions: { ...state.fieldConditions, weather },
    })),

  setTerrain: (terrain) =>
    set((state) => ({
      ...state,
      fieldConditions: { ...state.fieldConditions, terrain },
    })),

  toggleRuin: (key) =>
    set((state) => ({
      ...state,
      fieldConditions: {
        ...state.fieldConditions,
        [key]: !state.fieldConditions[key],
      },
    })),

  toggleAttackerSide: (key) =>
    set((state) => {
      const side = state.fieldConditions.attackerSide ?? {}
      return {
        ...state,
        fieldConditions: {
          ...state.fieldConditions,
          attackerSide: { ...side, [key]: !side[key] },
        },
      }
    }),

  toggleDefenderSide: (key) =>
    set((state) => {
      const side = state.fieldConditions.defenderSide ?? {}
      return {
        ...state,
        fieldConditions: {
          ...state.fieldConditions,
          defenderSide: { ...side, [key]: !side[key] },
        },
      }
    }),

  toggleSingleTarget: () =>
    set((state) => ({ ...state, isSingleTarget: !state.isSingleTarget })),
}))
