import type { CalcParameters, ChampionsPokemon, FieldConditions } from '~/types'

import type { Calc, CalcMode } from './types'

export const defaultCalcParameters: CalcParameters = {
  move: '',
  teraType: '',
  boosts: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
  status: '',
  isCrit: false,
  abilityOn: false,
  boostedStat: '',
}

export const defaultFieldConditions: FieldConditions = {}

export const defaultPlayer: ChampionsPokemon = {
  species: 'Incineroar',
  nature: 'Careful',
  ability: 'Intimidate',
  statPoints: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
  moves: [],
}

export const defaultOpponent: ChampionsPokemon = {
  species: 'Garchomp',
  nature: 'Jolly',
  ability: 'Rough Skin',
  statPoints: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
  moves: [],
}

const cloneCalcParameters = (): CalcParameters => ({
  ...defaultCalcParameters,
  boosts: { ...defaultCalcParameters.boosts },
})

export const makeCalc = (type: CalcMode): Calc => ({
  id: crypto.randomUUID(),
  type,
  name: '',
  notes: '',
  opponent: { ...defaultOpponent },
  playerCalcParameters: cloneCalcParameters(),
  opponentCalcParameters: cloneCalcParameters(),
  fieldConditions: { ...defaultFieldConditions },
  isFavorite: false,
})
