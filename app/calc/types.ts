import type {
  CalcParameters,
  ChampionsPokemon,
  FieldConditions,
  StatKey,
} from '~/types'

export type CalcMode = 'offensive' | 'defensive' | 'speed'

export type CalcRowMode = Exclude<CalcMode, 'speed'>

export type StatBoostKey = Exclude<StatKey, 'hp'>

export type RuinKey =
  | 'isBeadsOfRuin'
  | 'isSwordOfRuin'
  | 'isTabletsOfRuin'
  | 'isVesselOfRuin'

export type AttackerSideKey = keyof NonNullable<FieldConditions['attackerSide']>

export type DefenderSideKey = keyof NonNullable<FieldConditions['defenderSide']>

export interface Calc {
  id: string
  type: CalcMode
  name: string
  notes: string
  opponent: ChampionsPokemon
  playerCalcParameters: CalcParameters
  opponentCalcParameters: CalcParameters
  fieldConditions: FieldConditions
  isFavorite: boolean
}

export interface CalcStoreState {
  player: ChampionsPokemon
  calcs: Record<string, Calc>
  calcOrder: string[]
  expandedCalcId: string | null
}

export interface CalcStoreActions {
  setPlayer: (patch: Partial<ChampionsPokemon>) => void
  patchCalc: (id: string, patch: Partial<Calc>) => void
  replaceCalc: (id: string, calc: Calc) => void
  setOpponent: (id: string, patch: Partial<ChampionsPokemon>) => void
  setPlayerParams: (id: string, patch: Partial<CalcParameters>) => void
  setOpponentParams: (id: string, patch: Partial<CalcParameters>) => void
  setPlayerBoost: (id: string, stat: StatBoostKey, value: number) => void
  setOpponentBoost: (id: string, stat: StatBoostKey, value: number) => void
  setFieldConditions: (id: string, patch: FieldConditions) => void
  setWeather: (id: string, weather: FieldConditions['weather']) => void
  setTerrain: (id: string, terrain: FieldConditions['terrain']) => void
  toggleRuin: (id: string, key: RuinKey) => void
  toggleAttackerSide: (id: string, key: AttackerSideKey) => void
  toggleDefenderSide: (id: string, key: DefenderSideKey) => void
  addCalc: (calc: Calc) => void
  removeCalc: (id: string) => void
  setExpandedId: (id: string | null) => void
  toggleFavorite: (id: string) => void
}

export type CalcStore = CalcStoreState & CalcStoreActions
