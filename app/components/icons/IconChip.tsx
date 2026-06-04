import { type CSSProperties, type ReactNode } from 'react'

// Shared badge wrapper for the toggle icons: a rounded color chip sized to the
// surrounding text. `color` sets both the fill and the `--icon-glow` variable
// that the active-toggle glow reads (see ToggleIconButton in components/ui),
// so the glow always matches the chip's color.
export const IconChip = ({
  color,
  title,
  className = '',
  children,
}: {
  color: string
  title: string
  className?: string
  children: ReactNode
}) => (
  <span
    className={`mx-[0.1em] inline-flex items-center justify-center rounded-sm align-[-0.15em] ${className}`}
    style={
      {
        backgroundColor: color,
        '--icon-glow': color,
        width: '1.3em',
        height: '1.3em',
      } as CSSProperties
    }
    title={title}
  >
    {children}
  </span>
)
