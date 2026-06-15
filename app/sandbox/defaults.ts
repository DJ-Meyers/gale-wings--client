import { defaultCalcParameters, defaultFieldConditions } from '~/calc/defaults'
import type { ParsedPokemon } from '@dj-meyers/gale-wings/types'
import type { MoveConditions } from '~/calc/move-conditions'
import type { CalcParameters, ChampionsPokemon, FieldConditions } from '~/types'

export const defaultSandboxAttacker: ChampionsPokemon = {
  species: 'Basculegion',
  nature: 'Adamant',
  ability: 'Adaptability',
  statPoints: { hp: 0, atk: 32, def: 0, spa: 0, spd: 0, spe: 0 },
  moves: ['Last Respects'],
}

export const defaultSandboxDefender: ChampionsPokemon = {
  species: 'Charizard-Mega-Y',
  nature: 'Modest',
  ability: 'Drought',
  item: 'Charizardite Y',
  statPoints: { hp: 24, atk: 0, def: 14, spa: 17, spd: 0, spe: 0 },
  moves: ['Heat Wave'],
}

const cloneCalcParameters = (): CalcParameters => ({
  ...defaultCalcParameters,
  boosts: { ...defaultCalcParameters.boosts },
})

// ParsedPokemon → ChampionsPokemon. Missing fields fall back to `fallback`,
// except species-tied fields (ability, item, moves, statPoints) are cleared
// when the parsed species differs from the fallback — mirroring the manual
// species-change reset in SandboxPokemonPanel so a Charizardite Y from the
// previous attacker doesn't follow Sneasler into the slot. Nature is not
// species-tied and is allowed to carry over.
// Parser may return wider types (ParseableAbility ⊃ ChampionsAbility, alias
// species not in the regulation pool); per Q10 loose-validation philosophy we
// cast and let downstream tolerate. The calc engine and editors already handle
// off-pool values gracefully.
export const parsedToPokemon = (
  parsed: ParsedPokemon,
  fallback: ChampionsPokemon,
): ChampionsPokemon => {
  const species = (parsed.species ??
    fallback.species) as ChampionsPokemon['species']
  const speciesChanged = parsed.species != null && species !== fallback.species
  return {
    species,
    nature: (parsed.nature ?? fallback.nature) as ChampionsPokemon['nature'],
    ability: (parsed.ability ??
      (speciesChanged ? '' : fallback.ability)) as ChampionsPokemon['ability'],
    item: (parsed.item ??
      (speciesChanged ? undefined : fallback.item)) as ChampionsPokemon['item'],
    statPoints: parsed.statPoints
      ? { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0, ...parsed.statPoints }
      : speciesChanged
        ? { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
        : { ...fallback.statPoints },
    moves: (parsed.move
      ? [parsed.move]
      : speciesChanged
        ? []
        : [...fallback.moves]) as ChampionsPokemon['moves'],
  }
}

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

// ParsedPokemon → MoveConditions. The explicit variable-power tokens the parser
// captures (`150BP`, `5 hits`, an allies-fainted count) seed the same per-side
// condition state the manual toggles drive, so a typed input and a clicked
// toggle reach the calc by one path. Each field guards on `!== undefined` so an
// absent token stays absent (the neutral case) rather than pinning a value.
export const parsedToConditions = (parsed: ParsedPokemon): MoveConditions => ({
  ...(parsed.basePowerOverride !== undefined && {
    basePowerOverride: parsed.basePowerOverride,
  }),
  ...(parsed.hits !== undefined && { hits: parsed.hits }),
  ...(parsed.alliesFainted !== undefined && {
    alliesFainted: parsed.alliesFainted,
  }),
})

export const makeDefaultSandboxState = () => ({
  input: '32+ Basc LR3 vs 24/14 ZardY',
  attacker: { ...defaultSandboxAttacker },
  defender: { ...defaultSandboxDefender },
  attackerCalcParameters: {
    ...cloneCalcParameters(),
    move: defaultSandboxAttacker.moves[0] as CalcParameters['move'],
  },
  defenderCalcParameters: {
    ...cloneCalcParameters(),
    move: defaultSandboxDefender.moves[0] as CalcParameters['move'],
  },
  attackerConditions: { alliesFainted: 3 },
  defenderConditions: {},
  fieldConditions: { ...defaultFieldConditions } satisfies FieldConditions,
  isSingleTarget: false,
  koTier: null,
})
