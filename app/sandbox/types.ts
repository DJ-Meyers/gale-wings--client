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
  fieldConditions: FieldConditions
  isSingleTarget: boolean
}

export interface SandboxActions {
  setInput: (input: string) => void
  applyParseResult: (result: VsParseResult) => void
  setAttacker: (patch: Partial<ChampionsPokemon>) => void
  setDefender: (patch: Partial<ChampionsPokemon>) => void
  setAttackerParams: (patch: Partial<CalcParameters>) => void
  setDefenderParams: (patch: Partial<CalcParameters>) => void
  setAttackerBoost: (stat: StatBoostKey, value: number) => void
  setDefenderBoost: (stat: StatBoostKey, value: number) => void
  setFieldConditions: (patch: FieldConditions) => void
  setWeather: (weather: FieldConditions['weather']) => void
  setTerrain: (terrain: FieldConditions['terrain']) => void
  toggleRuin: (key: RuinKey) => void
  toggleAttackerSide: (key: AttackerSideKey) => void
  toggleDefenderSide: (key: DefenderSideKey) => void
  toggleSingleTarget: () => void
}

export type SandboxStore = SandboxState & SandboxActions
