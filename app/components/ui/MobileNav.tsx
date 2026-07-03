import { Show, useUser } from '@clerk/react'
import { Link } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

import lunatoneIcon from '~/assets/lunatone.png'
import pikachuIcon from '~/assets/pikachu.png'
import PokeballPartyIcon from '~/assets/pokeball-party.svg?react'
import solrockIcon from '~/assets/solrock.png'
import { useTheme } from '~/hooks/useTheme'

// Below the `md` breakpoint the inline nav plus the account/theme controls
// crowd the header and force "Gale Wings" to wrap, so everything collapses
// into this single right-aligned hamburger menu. Order: Account, nav links,
// then the theme toggle. Closes on link tap, outside click, or Escape.
const rowClass =
  'text-text-dim hover:text-text hover:bg-surface-hover [&.active]:text-text flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm font-medium'

// Fixed leading icon slot so labels align whether or not a row has an icon.
const iconSlot = 'flex h-5 w-5 shrink-0 items-center justify-center'

export const MobileNav = () => {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { user } = useUser()
  const { mode, toggleMode } = useTheme()
  const isDark = mode === 'dark'

  useEffect(() => {
    if (!open) return

    const handlePointer = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  return (
    <div ref={containerRef} className="relative md:hidden">
      <button
        aria-expanded={open}
        aria-label={open ? 'Close menu' : 'Open menu'}
        className={`hamburger hamburger--squeeze${open ? ' is-active' : ''}`}
        type="button"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="hamburger-box">
          <span className="hamburger-inner" />
        </span>
      </button>

      {open && (
        <div
          className="border-border bg-surface absolute right-0 top-full z-20 mt-2 flex min-w-44 flex-col gap-1 rounded-md border p-2 shadow-md"
          onClick={() => setOpen(false)}
        >
          <Show when="signed-out">
            <Link className={rowClass} to="/sign-in">
              <span aria-hidden="true" className={iconSlot} />
              Sign in
            </Link>
          </Show>
          <Show when="signed-in">
            <Link className={rowClass} to="/account">
              <span className={iconSlot}>
                {user?.imageUrl && (
                  <img
                    alt=""
                    aria-hidden="true"
                    className="h-5 w-5 rounded-full object-cover"
                    src={user.imageUrl}
                  />
                )}
              </span>
              Account
            </Link>
          </Show>

          <Link className={rowClass} to="/teams">
            <span className={iconSlot}>
              <PokeballPartyIcon aria-hidden="true" className="h-5 w-5" />
            </span>
            Teams
          </Link>
          <Link className={rowClass} to="/pokemon">
            <span className={iconSlot}>
              <img
                alt=""
                aria-hidden="true"
                className="h-5 w-5 object-contain"
                src={pikachuIcon}
              />
            </span>
            Pokémon
          </Link>

          <button
            className={`${rowClass} cursor-pointer`}
            type="button"
            onClick={(event) => {
              // Keep the menu open so the theme change is visible in place.
              event.stopPropagation()
              toggleMode()
            }}
          >
            <span className={iconSlot}>
              <img
                alt=""
                aria-hidden="true"
                className="h-5 w-5 object-contain"
                src={isDark ? solrockIcon : lunatoneIcon}
              />
            </span>
            Toggle theme
          </button>
        </div>
      )}
    </div>
  )
}
