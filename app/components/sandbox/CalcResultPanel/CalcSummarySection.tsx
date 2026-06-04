import { useDeferredValue, useEffect, useMemo, useState } from 'react'

import {
  KO_TIER_COLORS_OFFENSIVE,
  classifyKoTier,
} from '~/calc/classify-ko-range'
import { computeDamage, type CalcSide } from '~/calc/compute-damage'
import { DEFENSE_BOOSTING_ITEMS, POWER_BOOSTING_ITEMS } from '~/constants'
import { useSandboxStore } from '~/sandbox/store'

const powerItem = (item: string | undefined): string =>
  item && POWER_BOOSTING_ITEMS.has(item) ? `${item} ` : ''

const defenseItem = (item: string | undefined): string =>
  item && DEFENSE_BOOSTING_ITEMS.has(item) ? `${item} ` : ''

const formatRange = (range: [number, number], maxHp: number): string => {
  const lo = ((range[0] / maxHp) * 100).toFixed(1)
  const hi = ((range[1] / maxHp) * 100).toFixed(1)
  return `${lo}% – ${hi}%`
}

export const CalcSummarySection = () => {
  const attacker = useSandboxStore((s) => s.attacker)
  const defender = useSandboxStore((s) => s.defender)
  const attackerParams = useSandboxStore((s) => s.attackerCalcParameters)
  const defenderParams = useSandboxStore((s) => s.defenderCalcParameters)
  const fieldConditions = useSandboxStore((s) => s.fieldConditions)
  const isSingleTarget = useSandboxStore((s) => s.isSingleTarget)
  const setKoTier = useSandboxStore((s) => s.setKoTier)

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

  // Publish the displayed KO tier so the parent panel can color its accent;
  // null while the skeleton is up or there's no result, matching the text.
  const accentTier = ready && result ? koTier : null
  useEffect(() => {
    setKoTier(accentTier)
  }, [accentTier, setKoTier])

  if (!ready) {
    return (
      <div aria-hidden className="animate-pulse">
        {/* Mirrors the real result rows so the card height stays fixed:
            title · damage range · KO-chance · damage-out-of-HP. */}
        <div className="bg-text-muted/20 mb-2 h-5 w-44 rounded" />
        <div className="bg-text-muted/20 h-9 w-40 rounded md:h-10" />
        <div className="bg-text-muted/15 mt-1 h-5 w-28 rounded" />
        <div className="bg-text-muted/15 mt-1 h-5 w-52 rounded" />
      </div>
    )
  }

  if (!result) {
    return (
      <div className="text-text-muted text-sm">
        {attackerParams.move
          ? 'Calc unavailable — check species/move/ability are in the current regulation.'
          : 'Pick an attacking move to see the damage range.'}
      </div>
    )
  }

  return (
    <>
      <div className="text-text-heading mb-2 text-sm font-medium">
        {powerItem(attacker.item)}
        {attacker.species} {attackerParams.move} vs {defenseItem(defender.item)}
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
  )
}
