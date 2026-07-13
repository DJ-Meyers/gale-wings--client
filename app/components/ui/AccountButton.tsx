import { Show, UserButton } from '@clerk/react'
import { Link } from '@tanstack/react-router'

const signInAvatarClass =
  'border-border bg-surface text-text-dim hover:border-text-dim hover:text-text block h-7 w-7 rounded-full border transition-colors [&.active]:text-text'

export const AccountButton = () => (
  <>
    <Show when="signed-out">
      <Link aria-label="Sign in" className={signInAvatarClass} to="/sign-in">
        <span className="sr-only">Sign in</span>
      </Link>
    </Show>
    <Show when="signed-in">
      <UserButton userProfileMode="navigation" userProfileUrl="/account" />
    </Show>
  </>
)
