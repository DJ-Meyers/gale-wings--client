import type { CSSProperties } from 'react'
import type { StatKey } from '~/types'

// Each chip exposes two hues to the CSS (see .stat-chip in index.css): --stat is
// the pastel used for the value text, --stat-fill is the darker same-hue fill the
// chip uses in light mode (where the pastels are unreadable as text on white).
// The var() references are spelled out as literals (not built from `stat`) so
// Tailwind's source scan keeps the theme variables instead of tree-shaking them.
const STAT_STYLES: Record<
  StatKey,
  { label: string; color: string; fill: string }
> = {
  hp: { label: 'HP', color: 'var(--color-stat-hp)', fill: 'var(--color-stat-hp-fill)' },
  atk: { label: 'Atk', color: 'var(--color-stat-atk)', fill: 'var(--color-stat-atk-fill)' },
  def: { label: 'Def', color: 'var(--color-stat-def)', fill: 'var(--color-stat-def-fill)' },
  spa: { label: 'SpA', color: 'var(--color-stat-spa)', fill: 'var(--color-stat-spa-fill)' },
  spd: { label: 'SpD', color: 'var(--color-stat-spd)', fill: 'var(--color-stat-spd-fill)' },
  spe: { label: 'Spe', color: 'var(--color-stat-spe)', fill: 'var(--color-stat-spe-fill)' },
}

export const StatDisplay = ({
  stat,
  sp,
  total,
  natureMod,
  className,
  variant = 'compact',
  flushRight = false,
}: {
  stat: StatKey
  sp?: number
  total: number | null
  natureMod?: '+' | '-'
  className?: string
  variant?: 'compact' | 'labeled'
  flushRight?: boolean
}) => {
  const { label, color, fill } = STAT_STYLES[stat]
  const suffix = natureMod ?? ''
  const radiusClass = flushRight ? 'rounded-l' : 'rounded'
  const labeledSizeClass = flushRight ? 'h-[32px] w-[34px] shrink-0' : 'size-[34px] shrink-0'

  return (
    <div
      className={`stat-chip flex flex-col items-center justify-center px-2 py-1.5 ${radiusClass} ${variant === 'labeled' ? labeledSizeClass : ''} ${className ?? ''}`}
      style={{ '--stat': color, '--stat-fill': fill } as CSSProperties}
    >
      {variant === 'labeled' ? (
        <>
          <span className="text-text text-[8px] leading-tight">
            {label}
          </span>
          <span className="stat-chip-value text-[10px] leading-tight font-semibold">
            {total ?? '?'}
          </span>
        </>
      ) : (
        <>
          <span className="stat-chip-value text-[10px] leading-tight font-semibold">
            {total ?? '?'}
          </span>
          <span className="text-text text-[8px] leading-tight">
            {/* With points, show them (e.g. "252+"); with none but a nature
                modifier, show the stat name + sign (e.g. "Atk+", "SpA-") rather
                than a bare "0+"; otherwise just the stat name. */}
            {sp ? `${sp}${suffix}` : suffix ? `${label}${suffix}` : label}
          </span>
        </>
      )}
    </div>
  )
}
