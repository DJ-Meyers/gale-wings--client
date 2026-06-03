import { Field, Move, calculate, toID } from '@smogon/calc'

import type { FieldConditions } from '@dj-meyers/gale-wings/types'

import { isSpreadMove } from '~/calc/is-spread-move'
import { gen, hasSpecies, toSmogonName } from '~/data/gen'
import type { CalcParameters, ChampionsPokemon } from '~/types'
import { toCalcPokemon } from '~/utils/championsPokemon'

// One side of a damage calc: the Pokémon row plus the per-side scenario
// parameters (tera, boosts, status, isCrit, etc.).
export type CalcSide = {
  pokemon: ChampionsPokemon
  params: CalcParameters
}

export type DamageCalcResult = {
  desc: string
  range: [number, number]
  koChance: string
  defenderMaxHp: number
}

// Paradox abilities (Protosynthesis, Quark Drive) activate from weather
// or terrain. The plan defers explicit abilityOn UI (Q7), so callers
// don't toggle it themselves — this derives it.
//
// Booster Energy is the canonical third trigger for both abilities,
// but it isn't in the current Champions regulation's `legalItems` list
// (vgc-2026-m-a). When it returns, also re-enable the commented checks
// below — the rest of the wiring stays identical.
export const shouldActivateAbility = (
  pokemon: ChampionsPokemon,
  params: CalcParameters,
  field: FieldConditions,
): boolean => {
  if (params.abilityOn) return true
  const ability = params.abilityOverride ?? pokemon.ability
  if (
    ability === 'Protosynthesis' &&
    field.weather === 'Sun'
    // || pokemon.item === 'Booster Energy'   // re-enable when item returns to legalItems
  )
    return true
  if (
    ability === 'Quark Drive' &&
    field.terrain === 'Electric'
    // || pokemon.item === 'Booster Energy'   // re-enable when item returns to legalItems
  )
    return true
  return false
}

// Wrapper around @smogon/calc's calculate. Plan §6.6, §7 step 9.
// - Takes per-side Pokémon + calc parameters (D1/D2).
// - Routes attacker isCrit into Move construction (D4/D5).
// - Defaults boostedStat to 'auto' when Paradox is active and no
//   explicit pick was made (matches TailRoom's behaviour).
// - Hardcodes gameType: 'Doubles' (§2.8 — no field flag for it).
// - Returns null on any unknown species / move / calc error.
export type ComputeDamageOptions = {
  // When true and the move is a spread move (allAdjacent / allAdjacentFoes),
  // override the move target to 'normal' so @smogon/calc skips the 0.75×
  // spread modifier — i.e. the result for "what if this Heat Wave only hit
  // one Pokémon".
  isSingleTarget?: boolean
}

export const computeDamage = (
  attacker: CalcSide,
  defender: CalcSide,
  moveName: string,
  field: FieldConditions,
  options: ComputeDamageOptions = {},
): DamageCalcResult | null => {
  try {
    if (!hasSpecies(toSmogonName(attacker.pokemon.species))) return null
    if (!hasSpecies(toSmogonName(defender.pokemon.species))) return null
    if (!gen.moves.get(toID(moveName))) return null

    const atkAbilityOn = shouldActivateAbility(
      attacker.pokemon,
      attacker.params,
      field,
    )
    const defAbilityOn = shouldActivateAbility(
      defender.pokemon,
      defender.params,
      field,
    )

    const atkParams: CalcParameters = {
      ...attacker.params,
      abilityOn: atkAbilityOn,
      boostedStat: atkAbilityOn
        ? attacker.params.boostedStat || 'auto'
        : '',
    }
    const defParams: CalcParameters = {
      ...defender.params,
      abilityOn: defAbilityOn,
      boostedStat: defAbilityOn
        ? defender.params.boostedStat || 'auto'
        : '',
    }

    const atkPoke = toCalcPokemon(attacker.pokemon, atkParams)
    const defPoke = toCalcPokemon(defender.pokemon, defParams)

    const move = new Move(gen, moveName, {
      isCrit: attacker.params.isCrit || undefined,
      overrides:
        options.isSingleTarget && isSpreadMove(moveName)
          ? { target: 'normal' }
          : undefined,
    })

    const calcField = new Field({
      gameType: 'Doubles',
      weather: field.weather,
      terrain: field.terrain,
      isGravity: field.isGravity,
      isMagicRoom: field.isMagicRoom,
      isWonderRoom: field.isWonderRoom,
      isBeadsOfRuin: field.isBeadsOfRuin,
      isSwordOfRuin: field.isSwordOfRuin,
      isTabletsOfRuin: field.isTabletsOfRuin,
      isVesselOfRuin: field.isVesselOfRuin,
      attackerSide: field.attackerSide,
      defenderSide: field.defenderSide,
    })

    const result = calculate(gen, atkPoke, defPoke, move, calcField)
    const range = result.range() as [number, number]
    const defenderMaxHp = defPoke.maxHP()

    // Immunities (no-damage hits) make @smogon/calc's desc() and kochance()
    // throw, so short-circuit before calling them.
    if (range[1] === 0) {
      return { desc: '', range, koChance: '', defenderMaxHp }
    }

    return {
      desc: result.desc(),
      range,
      koChance: result.kochance()?.text ?? '',
      defenderMaxHp,
    }
  } catch {
    return null
  }
}
