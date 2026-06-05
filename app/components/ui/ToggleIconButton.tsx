import { type ReactNode } from 'react'

// A square icon-chip toggle: the child is an IconChip (a colored badge). When
// active it gets a white inset ring plus a soft glow; when off it dims; when
// disabled it greys out. Used for the field-condition toggles in the calc
// result.
export const ToggleIconButton = ({
  active,
  label,
  onClick,
  disabled = false,
  children,
}: {
  active: boolean
  label: string
  onClick: () => void
  disabled?: boolean
  children: ReactNode
}) => (
  <button
    type="button"
    title={label}
    aria-label={label}
    aria-pressed={active}
    disabled={disabled}
    onClick={onClick}
    className={`rounded-sm text-2xl leading-none transition duration-100 ease-out [&>span]:transition [&>span]:duration-100 [&>span]:ease-out ${
      disabled
        ? 'cursor-not-allowed opacity-20 grayscale [&>span]:!bg-neutral-500'
        : active
          ? 'cursor-pointer [&>span]:shadow-[0_0_9px_1px_rgba(247,249,251,0.55)] [&>span]:ring-1 [&>span]:ring-white [&>span]:ring-inset'
          : 'cursor-pointer opacity-40 hover:opacity-100'
    }`}
  >
    {children}
  </button>
)
