import { Field, Move, calculate, toID } from '@smogon/calc'

import type { FieldConditions } from '@dj-meyers/galewings/types'

import { gen, toSmogonName } from '~/data/gen'
import type { CalcParameters, ChampionsPokemon } from '~/types'
import { toCalcPokemon } from '~/utils/championsPokemon'

export type CalcSide = {
  build: ChampionsPokemon
  params: CalcParameters
}

export type DamageCalcResult = {
  desc: string
  range: [number, number]
  koChance: string
  defenderMaxHp: number
}

// 0 = Guaranteed OHKO, 1 = chance OHKO, …, 5 = no result.
export type KoTier = 0 | 1 | 2 | 3 | 4 | 5

export const classifyKoTier = (result: DamageCalcResult | null): KoTier => {
  if (!result || !result.koChance) return 5
  const kc = result.koChance
  if (kc.includes('guaranteed OHKO')) return 0
  if (kc.includes('OHKO')) return 1
  if (kc.includes('guaranteed 2HKO')) return 2
  if (kc.includes('2HKO')) return 3
  return 4
}

export const KO_TIER_LABELS_OFFENSIVE: Record<KoTier, string> = {
  0: 'Guaranteed OHKO',
  1: 'Chance OHKO',
  2: 'Guaranteed 2HKO',
  3: 'Chance 2HKO',
  4: '3HKO+',
  5: 'No result',
}

export const KO_TIER_LABELS_DEFENSIVE: Record<KoTier, string> = {
  0: "Guaranteed KO'd",
  1: "Chance KO'd",
  2: "Guaranteed 2HKO'd",
  3: "Chance 2HKO'd",
  4: 'Survives (3HKO+)',
  5: 'No result',
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
  build: ChampionsPokemon,
  params: CalcParameters,
  field: FieldConditions,
): boolean => {
  if (params.abilityOn) return true
  const ability = params.abilityOverride ?? build.ability
  if (
    ability === 'Protosynthesis' &&
    field.weather === 'Sun'
    // || build.item === 'Booster Energy'   // re-enable when item returns to legalItems
  )
    return true
  if (
    ability === 'Quark Drive' &&
    field.terrain === 'Electric'
    // || build.item === 'Booster Energy'   // re-enable when item returns to legalItems
  )
    return true
  return false
}

// Wrapper around @smogon/calc's calculate. Plan §6.6, §7 step 9.
// - Takes per-side build + calc parameters (D1/D2).
// - Routes attacker isCrit into Move construction (D4/D5).
// - Defaults boostedStat to 'auto' when Paradox is active and no
//   explicit pick was made (matches TailRoom's behaviour).
// - Hardcodes gameType: 'Doubles' (§2.8 — no field flag for it).
// - Returns null on any unknown species / move / calc error.
export const computeDamage = (
  attacker: CalcSide,
  defender: CalcSide,
  moveName: string,
  field: FieldConditions,
): DamageCalcResult | null => {
  try {
    if (!gen.species.get(toID(toSmogonName(attacker.build.species)))) return null
    if (!gen.species.get(toID(toSmogonName(defender.build.species)))) return null
    if (!gen.moves.get(toID(moveName))) return null

    const atkAbilityOn = shouldActivateAbility(
      attacker.build,
      attacker.params,
      field,
    )
    const defAbilityOn = shouldActivateAbility(
      defender.build,
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

    const atkPoke = toCalcPokemon(attacker.build, atkParams)
    const defPoke = toCalcPokemon(defender.build, defParams)

    const move = new Move(gen, moveName, {
      isCrit: attacker.params.isCrit || undefined,
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
    const range = result.range()
    const koChance = result.kochance()

    return {
      desc: result.desc(),
      range: range as [number, number],
      koChance: koChance?.text ?? '',
      defenderMaxHp: defPoke.maxHP(),
    }
  } catch {
    return null
  }
}
