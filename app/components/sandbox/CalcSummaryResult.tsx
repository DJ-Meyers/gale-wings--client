import { useDeferredValue, useEffect, useMemo, useState } from 'react'

import {
  KO_TIER_COLORS_OFFENSIVE,
  classifyKoTier,
} from '~/calc/classify-ko-range'
import { computeDamage, type CalcSide } from '~/calc/compute-damage'
import { useSandboxStore } from '~/sandbox/store'

import { CalcToggleSection } from './CalcResultPanel/CalcToggleSection'

// Items that boost a Pokémon's damage output (move-power multipliers and
// species-locked stat doublers). Megastones and utility items (Choice Scarf,
// Sitrus Berry, Assault Vest, Focus Sash, Leftovers, etc.) are omitted.
const POWER_BOOSTING_ITEMS: ReadonlySet<string> = new Set([
  'Choice Band',
  'Choice Specs',
  'Light Ball',
  'Thick Club',
  'Deep Sea Tooth',
  'Life Orb',
  'Expert Belt',
  'Muscle Band',
  'Wise Glasses',
  'Punching Glove',
  'Loaded Dice',
  'Metronome',
  'Charcoal',
  'Mystic Water',
  'Miracle Seed',
  'Magnet',
  'Twisted Spoon',
  'Black Belt',
  'Black Glasses',
  'Sharp Beak',
  'Poison Barb',
  'Soft Sand',
  'Hard Stone',
  'Silver Powder',
  'Spell Tag',
  'Metal Coat',
  'Dragon Fang',
  'Never-Melt Ice',
  'Silk Scarf',
  'Sea Incense',
  'Wave Incense',
  'Rose Incense',
  'Odd Incense',
  'Rock Incense',
  'Soul Dew',
  'Adamant Orb',
  'Adamant Crystal',
  'Lustrous Orb',
  'Lustrous Globe',
  'Griseous Orb',
  'Griseous Core',
  'Draco Plate',
  'Dread Plate',
  'Earth Plate',
  'Fist Plate',
  'Flame Plate',
  'Icicle Plate',
  'Insect Plate',
  'Iron Plate',
  'Meadow Plate',
  'Mind Plate',
  'Pixie Plate',
  'Sky Plate',
  'Splash Plate',
  'Spooky Plate',
  'Stone Plate',
  'Toxic Plate',
  'Zap Plate',
])

const powerItem = (item: string | undefined): string =>
  item && POWER_BOOSTING_ITEMS.has(item) ? `${item} ` : ''

// Items that boost a Pokémon's defensive outcome in the calc — flat damage
// reducers (Assault Vest), single-hit survivability (Focus Sash), and the
// type-resist berries (one-time half-damage on a super-effective hit).
const DEFENSE_BOOSTING_ITEMS: ReadonlySet<string> = new Set([
  'Assault Vest',
  'Focus Sash',
  'Babiri Berry',
  'Charti Berry',
  'Chilan Berry',
  'Chople Berry',
  'Coba Berry',
  'Colbur Berry',
  'Haban Berry',
  'Kasib Berry',
  'Kebia Berry',
  'Occa Berry',
  'Passho Berry',
  'Payapa Berry',
  'Rindo Berry',
  'Roseli Berry',
  'Shuca Berry',
  'Tanga Berry',
  'Wacan Berry',
  'Yache Berry',
])

const defenseItem = (item: string | undefined): string =>
  item && DEFENSE_BOOSTING_ITEMS.has(item) ? `${item} ` : ''

// Left-edge accent color of the result card, matched to the KO tier so the
// outcome is legible at a glance before reading any text.
const KO_TIER_ACCENT_OFFENSIVE: Record<number, string> = {
  0: 'border-l-ko-guaranteed-ohko',
  1: 'border-l-ko-chance-ohko',
  2: 'border-l-ko-guaranteed-2hko',
  3: 'border-l-ko-chance-2hko',
  4: 'border-l-ko-no-2hko',
  5: 'border-l-border',
}

const formatRange = (range: [number, number], maxHp: number): string => {
  const lo = ((range[0] / maxHp) * 100).toFixed(1)
  const hi = ((range[1] / maxHp) * 100).toFixed(1)
  return `${lo}% – ${hi}%`
}

export const CalcSummaryResult = () => {
  const attacker = useSandboxStore((s) => s.attacker)
  const defender = useSandboxStore((s) => s.defender)
  const attackerParams = useSandboxStore((s) => s.attackerCalcParameters)
  const defenderParams = useSandboxStore((s) => s.defenderCalcParameters)
  const fieldConditions = useSandboxStore((s) => s.fieldConditions)
  const isSingleTarget = useSandboxStore((s) => s.isSingleTarget)

  const attackerDeferred = useDeferredValue(attacker)
  const defenderDeferred = useDeferredValue(defender)
  const attackerParamsDeferred = useDeferredValue(attackerParams)
  const defenderParamsDeferred = useDeferredValue(defenderParams)
  const fieldConditionsDeferred = useDeferredValue(fieldConditions)
  const isSingleTargetDeferred = useDeferredValue(isSingleTarget)

  const result = useMemo(() => {
    const atkSide: CalcSide = {
      pokemon: attackerDeferred,
      params: attackerParamsDeferred,
    }
    const defSide: CalcSide = {
      pokemon: defenderDeferred,
      params: defenderParamsDeferred,
    }
    return computeDamage(
      atkSide,
      defSide,
      attackerParamsDeferred.move,
      fieldConditionsDeferred,
      { isSingleTarget: isSingleTargetDeferred },
    )
  }, [
    attackerDeferred,
    defenderDeferred,
    attackerParamsDeferred,
    defenderParamsDeferred,
    fieldConditionsDeferred,
    isSingleTargetDeferred,
  ])

  const koTier = classifyKoTier(result)

  // Hold the result back briefly on first load so it doesn't slam in before
  // the user has oriented; later recalcs render immediately.
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 500)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className={`bg-surface mt-2 rounded-md border border-l-4 p-3.5 shadow-md ${
        ready && result ? KO_TIER_ACCENT_OFFENSIVE[koTier] : 'border-l-border'
      } border-y-border border-r-border`}
    >
      {!ready ? (
        <div aria-hidden className="animate-pulse">
          {/* Mirrors the real result rows so the card height stays fixed:
              title · damage range · KO-chance · damage-out-of-HP. */}
          <div className="bg-text-muted/20 mb-2 h-5 w-44 rounded" />
          <div className="bg-text-muted/20 h-9 w-40 rounded md:h-10" />
          <div className="bg-text-muted/15 mt-1 h-5 w-28 rounded" />
          <div className="bg-text-muted/15 mt-1 h-5 w-52 rounded" />
        </div>
      ) : result ? (
        <>
          <div className="text-text-heading mb-2 text-sm font-medium">
            {powerItem(attacker.item)}
            {attacker.species} {attackerParams.move} vs{' '}
            {defenseItem(defender.item)}
            {defender.species}
          </div>
          <div
            key={`${result.range[0]}-${result.range[1]}`}
            className={`calc-pop text-3xl font-bold tabular-nums md:text-4xl ${KO_TIER_COLORS_OFFENSIVE[koTier]}`}
          >
            {formatRange(result.range, result.defenderMaxHp)}
          </div>
          {result.koChance && (
            <div
              className={`mt-1 text-sm font-medium tabular-nums ${KO_TIER_COLORS_OFFENSIVE[koTier]}`}
            >
              {result.koChance}
            </div>
          )}
          <div className="text-text-muted mt-1 text-sm tabular-nums">
            {result.range[0]} to {result.range[1]} damage out of{' '}
            {result.defenderMaxHp} HP
          </div>
        </>
      ) : (
        <div className="text-text-muted text-sm">
          {attackerParams.move
            ? 'Calc unavailable — check species/move/ability are in the current regulation.'
            : 'Pick an attacking move to see the damage range.'}
        </div>
      )}
      <CalcToggleSection />
    </div>
  )
}
