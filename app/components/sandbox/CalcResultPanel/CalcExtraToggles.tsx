import { type ReactNode, useEffect, useRef, useState } from 'react'

import { isSpreadMove } from '~/calc/is-spread-move'
import type { ConditionId } from '~/calc/move-conditions'
import { relevantConditions } from '~/calc/move-conditions'
import {
  DoublerIcon,
  HeadstoneIcon,
  RageFistIcon,
  SingleTargetIcon,
} from '~/components/icons'
import { ToggleIconButton } from '~/components/ui/ToggleIconButton'
import { useSandboxStore } from '~/sandbox/store'

// One icon per condition. Kept here (not in the registry) so move-conditions
// stays React-free.
const ICONS: Record<ConditionId, () => ReactNode> = {
  doubled: DoublerIcon,
  alliesFainted: HeadstoneIcon,
  timesHit: RageFistIcon,
}

// A ToggleIconButton-styled trigger that shows its numeric value as a corner
// badge and opens a dropdown of min..max on click. Active (and badged) when
// the value is above the neutral 0.
const CountControl = ({
  value,
  min,
  max,
  label,
  icon,
  onChange,
}: {
  value: number
  min: number
  max: number
  label: string
  icon: ReactNode
  onChange: (n: number) => void
}) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const options = Array.from({ length: max - min + 1 }, (_, i) => min + i)

  return (
    <div ref={ref} className="relative">
      <ToggleIconButton
        active={value > 0}
        label={`${label}: ${value}`}
        onClick={() => setOpen((o) => !o)}
      >
        {icon}
      </ToggleIconButton>
      <span className="bg-surface text-text-heading border-border pointer-events-none absolute -top-1 -right-1 min-w-4 rounded-full border px-1 text-center text-[0.65rem] leading-4 font-semibold tabular-nums">
        {value}
      </span>
      {open && (
        <div
          role="menu"
          className="bg-surface border-border absolute top-full left-1/2 z-10 mt-1 flex -translate-x-1/2 flex-col gap-0.5 rounded-md border p-1 shadow-md"
        >
          {options.map((n) => (
            <button
              key={n}
              type="button"
              role="menuitemradio"
              aria-checked={n === value}
              onClick={() => {
                onChange(n)
                setOpen(false)
              }}
              className={`min-w-7 rounded-sm px-2 py-0.5 text-center text-sm tabular-nums ${
                n === value
                  ? 'bg-accent/15 text-text-heading font-semibold'
                  : 'text-text hover:bg-text-muted/10'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// The contextual attacker-only toggles that share the Boosts row: the Single
// Target spread override plus variable-power state @smogon/calc can't derive
// (allies fainted, times hit, …). Each piece renders only when it applies —
// Single Target only for spread moves, conditions only for moves/abilities that
// need them — so this contributes nothing for an ordinary single-target move.
// Returns a fragment so the toggles sit inline next to Crit / Helping Hand.
export const CalcExtraToggles = () => {
  const move = useSandboxStore((s) => s.attackerCalcParameters.move)
  const ability = useSandboxStore((s) => s.attacker.ability)
  const abilityOverride = useSandboxStore(
    (s) => s.attackerCalcParameters.abilityOverride,
  )
  const conditions = useSandboxStore((s) => s.attackerConditions)
  const setConditions = useSandboxStore((s) => s.setAttackerConditions)
  const isSingleTarget = useSandboxStore((s) => s.isSingleTarget)
  const toggleSingleTarget = useSandboxStore((s) => s.toggleSingleTarget)

  const effectiveAbility = abilityOverride || ability
  const controls = relevantConditions(move, effectiveAbility)
  const moveIsSpread = isSpreadMove(move)

  return (
    <>
      {moveIsSpread && (
        <ToggleIconButton
          active={isSingleTarget}
          label="Single Target (no spread reduction)"
          onClick={toggleSingleTarget}
        >
          <SingleTargetIcon />
        </ToggleIconButton>
      )}
      {controls.map((control) => {
        const Icon = ICONS[control.id]
        if (control.kind === 'toggle') {
          return (
            <ToggleIconButton
              key={control.id}
              active={!!conditions[control.id]}
              label={control.label}
              onClick={() =>
                setConditions({ [control.id]: !conditions[control.id] })
              }
            >
              <Icon />
            </ToggleIconButton>
          )
        }
        const value = conditions[control.id]
        return (
          <CountControl
            key={control.id}
            value={typeof value === 'number' ? value : 0}
            min={control.min}
            max={control.max}
            label={control.label}
            icon={<Icon />}
            onChange={(n) => setConditions({ [control.id]: n })}
          />
        )
      })}
    </>
  )
}
