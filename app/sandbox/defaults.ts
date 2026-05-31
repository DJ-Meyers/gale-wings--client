import { defaultCalcParameters, defaultFieldConditions } from '~/calc/defaults'
import type { ParsedPokemon } from '@dj-meyers/galewings/types'
import type { CalcParameters, ChampionsPokemon, FieldConditions } from '~/types'

export const defaultSandboxAttacker: ChampionsPokemon = {
  species: 'Incineroar',
  nature: 'Adamant',
  ability: 'Intimidate',
  statPoints: { hp: 0, atk: 32, def: 0, spa: 0, spd: 0, spe: 0 },
  moves: [],
}

export const defaultSandboxDefender: ChampionsPokemon = {
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

// ParsedPokemon → ChampionsPokemon. Missing fields fall back to `fallback`.
// Parser may return wider types (ParseableAbility ⊃ ChampionsAbility, alias
// species not in the regulation pool); per Q10 loose-validation philosophy we
// cast and let downstream tolerate. The calc engine and editors already handle
// off-pool values gracefully.
export const parsedToPokemon = (
  parsed: ParsedPokemon,
  fallback: ChampionsPokemon,
): ChampionsPokemon => ({
  species: (parsed.species ?? fallback.species) as ChampionsPokemon['species'],
  nature: (parsed.nature ?? fallback.nature) as ChampionsPokemon['nature'],
  ability: (parsed.ability ?? fallback.ability) as ChampionsPokemon['ability'],
  item: (parsed.item ?? fallback.item) as ChampionsPokemon['item'],
  statPoints: parsed.statPoints
    ? { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0, ...parsed.statPoints }
    : { ...fallback.statPoints },
  moves: (parsed.move
    ? [parsed.move]
    : [...fallback.moves]) as ChampionsPokemon['moves'],
})

// ParsedPokemon → CalcParameters. Calc-shaped fields (move, teraType, boosts,
// status, isCrit) come from the parse; missing fields fall back to the
// regulation defaults.
export const parsedToCalcParameters = (
  parsed: ParsedPokemon,
): CalcParameters => ({
  ...cloneCalcParameters(),
  move: (parsed.move ?? '') as CalcParameters['move'],
  teraType: (parsed.teraType ?? '') as CalcParameters['teraType'],
  boosts: {
    atk: 0,
    def: 0,
    spa: 0,
    spd: 0,
    spe: 0,
    ...(parsed.boosts ?? {}),
  },
  status: (parsed.status ?? '') as CalcParameters['status'],
  isCrit: parsed.isCrit ?? false,
  abilityOn: parsed.abilityOn ?? false,
  boostedStat: (parsed.boostedStat ?? '') as CalcParameters['boostedStat'],
})

export const makeDefaultSandboxState = () => ({
  input: '',
  attacker: { ...defaultSandboxAttacker },
  defender: { ...defaultSandboxDefender },
  attackerCalcParameters: cloneCalcParameters(),
  defenderCalcParameters: cloneCalcParameters(),
  fieldConditions: { ...defaultFieldConditions } as FieldConditions,
})
