import type { CalcParameters, ChampionsPokemon, FieldConditions } from '~/types'

import { defaultCalcParameters, defaultFieldConditions } from './defaults'
import type { SandboxCalc } from './types'

export const SANDBOX_PLAYER: ChampionsPokemon = {
  species: 'Charizard-Mega-Y',
  nature: 'Timid',
  ability: 'Drought',
  item: 'Charizardite Y',
  statPoints: { hp: 0, atk: 0, def: 0, spa: 32, spd: 0, spe: 32 },
  moves: [],
}

const basculegion2HP: ChampionsPokemon = {
  species: 'Basculegion',
  nature: 'Serious',
  ability: 'Adaptability',
  statPoints: { hp: 2, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
  moves: [],
}

const basculegionOffensive: ChampionsPokemon = {
  species: 'Basculegion',
  nature: 'Adamant',
  ability: 'Adaptability',
  statPoints: { hp: 0, atk: 32, def: 0, spa: 0, spd: 0, spe: 0 },
  moves: [],
}

const basculegionScarf: ChampionsPokemon = {
  species: 'Basculegion',
  nature: 'Jolly',
  ability: 'Swift Swim',
  item: 'Choice Scarf',
  statPoints: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 32 },
  moves: [],
}

const kingambitBulky: ChampionsPokemon = {
  species: 'Kingambit',
  nature: 'Serious',
  ability: 'Defiant',
  statPoints: { hp: 32, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
  moves: [],
}

const kingambitOffensive: ChampionsPokemon = {
  species: 'Kingambit',
  nature: 'Adamant',
  ability: 'Defiant',
  statPoints: { hp: 0, atk: 32, def: 0, spa: 0, spd: 0, spe: 0 },
  moves: [],
}

const kingambitSlow: ChampionsPokemon = {
  species: 'Kingambit',
  nature: 'Adamant',
  ability: 'Defiant',
  statPoints: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
  moves: [],
}

const tsareena: ChampionsPokemon = {
  species: 'Tsareena',
  nature: 'Serious',
  ability: 'Queenly Majesty',
  statPoints: { hp: 2, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
  moves: [],
}

const mirrorCharY: ChampionsPokemon = {
  species: 'Charizard-Mega-Y',
  nature: 'Timid',
  ability: 'Drought',
  item: 'Charizardite Y',
  statPoints: { hp: 2, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
  moves: [],
}

const aerodactyl: ChampionsPokemon = {
  species: 'Aerodactyl',
  nature: 'Serious',
  ability: 'Rock Head',
  statPoints: { hp: 0, atk: 32, def: 0, spa: 0, spd: 0, spe: 0 },
  moves: [],
}

const garchompOffensive: ChampionsPokemon = {
  species: 'Garchomp',
  nature: 'Adamant',
  ability: 'Rough Skin',
  statPoints: { hp: 0, atk: 32, def: 0, spa: 0, spd: 0, spe: 0 },
  moves: [],
}

const floetteFast: ChampionsPokemon = {
  species: 'Floette-Eternal',
  nature: 'Timid',
  ability: 'Flower Veil',
  statPoints: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 32 },
  moves: [],
}

const cloneParams = (): CalcParameters => ({
  ...defaultCalcParameters,
  boosts: { ...defaultCalcParameters.boosts },
})

const withMove = (move: string): CalcParameters => ({
  ...cloneParams(),
  move: move as CalcParameters['move'],
})

const sunField: FieldConditions = { weather: 'Sun' }

const opponentTailwind: FieldConditions = {
  defenderSide: { isTailwind: true },
}

const makeFixture = (
  id: string,
  partial: Partial<SandboxCalc> &
    Pick<SandboxCalc, 'type' | 'name' | 'opponent'>,
): SandboxCalc => ({
  id,
  notes: '',
  playerCalcParameters: cloneParams(),
  opponentCalcParameters: cloneParams(),
  fieldConditions: { ...defaultFieldConditions },
  isFavorite: false,
  ...partial,
})

export const SANDBOX_FIXTURES: SandboxCalc[] = [
  // Offensive — Mega Char Y in sun
  makeFixture('fix-off-1', {
    type: 'offensive',
    name: 'Solar Beam vs 2/0 Basculegion',
    opponent: basculegion2HP,
    playerCalcParameters: withMove('Solar Beam'),
    fieldConditions: { ...sunField },
  }),
  makeFixture('fix-off-2', {
    type: 'offensive',
    name: 'Heat Wave vs 32 HP 0 SpD Kingambit',
    opponent: kingambitBulky,
    playerCalcParameters: withMove('Heat Wave'),
    fieldConditions: { ...sunField },
  }),
  makeFixture('fix-off-3', {
    type: 'offensive',
    name: 'Weather Ball vs 2 HP Tsareena',
    opponent: tsareena,
    playerCalcParameters: withMove('Weather Ball'),
    fieldConditions: { ...sunField },
  }),
  makeFixture('fix-off-4', {
    type: 'offensive',
    name: 'Ancient Power vs 2/0 Charizard Y',
    opponent: mirrorCharY,
    playerCalcParameters: withMove('Ancient Power'),
    fieldConditions: { ...sunField },
  }),
  // Defensive — opponent attacks Mega Char Y
  makeFixture('fix-def-1', {
    type: 'defensive',
    name: '32+ Atk Basculegion Wave Crash in sun',
    opponent: basculegionOffensive,
    opponentCalcParameters: withMove('Wave Crash'),
    fieldConditions: { ...sunField },
  }),
  makeFixture('fix-def-2', {
    type: 'defensive',
    name: '32+ Atk Kingambit Sucker Punch',
    opponent: kingambitOffensive,
    opponentCalcParameters: withMove('Sucker Punch'),
  }),
  makeFixture('fix-def-3', {
    type: 'defensive',
    name: '32 Atk Aerodactyl Rock Slide',
    opponent: aerodactyl,
    opponentCalcParameters: withMove('Rock Slide'),
  }),
  makeFixture('fix-def-4', {
    type: 'defensive',
    name: '32+ Atk Garchomp Rock Slide',
    opponent: garchompOffensive,
    opponentCalcParameters: withMove('Rock Slide'),
  }),
  // Speed comparisons
  makeFixture('fix-spd-1', {
    type: 'speed',
    name: 'Max Spe Scarf Basculegion',
    opponent: basculegionScarf,
  }),
  makeFixture('fix-spd-2', {
    type: 'speed',
    name: 'Max Spe Mega Floette',
    opponent: floetteFast,
  }),
  makeFixture('fix-spd-3', {
    type: 'speed',
    name: 'Tailwind 0 Spe Kingambit',
    opponent: kingambitSlow,
    fieldConditions: { ...opponentTailwind },
  }),
]
