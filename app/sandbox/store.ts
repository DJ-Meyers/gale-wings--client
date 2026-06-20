import { create } from 'zustand'

import {
  makeDefaultSandboxState,
  parsedToCalcParameters,
  parsedToConditions,
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
      // Seed the explicit variable-power tokens (`150BP`, `5 hits`, allies
      // fainted) from the parse; history-dependent toggles the parser can't see
      // start cleared and are set by the user.
      attackerConditions: parsedToConditions(result.attacker.pokemon),
      defenderConditions: parsedToConditions(result.defender.pokemon),
      fieldConditions: { ...result.fieldConditions },
      isSingleTarget: result.attacker.pokemon.isSingleTarget ?? false,
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

  setAttackerConditions: (patch) =>
    set((state) => ({
      ...state,
      attackerConditions: { ...state.attackerConditions, ...patch },
    })),

  setDefenderConditions: (patch) =>
    set((state) => ({
      ...state,
      defenderConditions: { ...state.defenderConditions, ...patch },
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

  swapAttackerDefender: () =>
    set((state) => ({
      ...state,
      attacker: state.defender,
      defender: state.attacker,
      attackerCalcParameters: state.defenderCalcParameters,
      defenderCalcParameters: state.attackerCalcParameters,
      attackerConditions: state.defenderConditions,
      defenderConditions: state.attackerConditions,
    })),

  setKoTier: (koTier) => set((state) => ({ ...state, koTier })),
}))
