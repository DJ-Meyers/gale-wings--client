import type { KoTier } from '~/calc/classify-ko-range'
import type { MoveConditions } from '~/calc/move-conditions'
import type {
  AttackerSideKey,
  DefenderSideKey,
  RuinKey,
  StatBoostKey,
} from '~/calc/types'
import type { VsParseResult } from '~/hooks/api/data'
import type { CalcParameters, ChampionsPokemon, FieldConditions } from '~/types'

export interface SandboxState {
  input: string
  attacker: ChampionsPokemon
  defender: ChampionsPokemon
  attackerCalcParameters: CalcParameters
  defenderCalcParameters: CalcParameters
  // History-dependent variable-power state per side (allies fainted, times
  // hit, …). Stored symmetrically so a swap preserves it, but only the
  // attacker's is consumed by the calc and surfaced in the UI.
  attackerConditions: MoveConditions
  defenderConditions: MoveConditions
  fieldConditions: FieldConditions
  isSingleTarget: boolean
  // The KO tier currently shown in the result, published by CalcSummarySection
  // so the parent CalcResultPanel can color its left-edge accent without
  // knowing how the calc is run. Null while loading or when there's no result.
  koTier: KoTier | null
}

export interface SandboxActions {
  setInput: (input: string) => void
  applyParseResult: (result: VsParseResult) => void
  setAttacker: (patch: Partial<ChampionsPokemon>) => void
  setDefender: (patch: Partial<ChampionsPokemon>) => void
  setAttackerParams: (patch: Partial<CalcParameters>) => void
  setDefenderParams: (patch: Partial<CalcParameters>) => void
  setAttackerConditions: (patch: Partial<MoveConditions>) => void
  setDefenderConditions: (patch: Partial<MoveConditions>) => void
  setAttackerBoost: (stat: StatBoostKey, value: number) => void
  setDefenderBoost: (stat: StatBoostKey, value: number) => void
  setFieldConditions: (patch: FieldConditions) => void
  setWeather: (weather: FieldConditions['weather']) => void
  setTerrain: (terrain: FieldConditions['terrain']) => void
  toggleRuin: (key: RuinKey) => void
  toggleAttackerSide: (key: AttackerSideKey) => void
  toggleDefenderSide: (key: DefenderSideKey) => void
  toggleSingleTarget: () => void
  swapAttackerDefender: () => void
  setKoTier: (koTier: KoTier | null) => void
}

export type SandboxStore = SandboxState & SandboxActions
