import { Show, UserButton } from '@clerk/react'
import { Link } from '@tanstack/react-router'

import { UserIcon } from '~/components/icons'

const signInAvatarClass =
  'border-border bg-surface text-text-dim hover:border-text-dim hover:text-text flex h-7 w-7 items-center justify-center rounded-full border transition-colors [&.active]:text-text'

export const AccountButton = () => (
  <>
    <Show when="signed-out">
      <Link aria-label="Sign in" className={signInAvatarClass} to="/sign-in">
        <UserIcon className="h-4 w-4" />
        <span className="sr-only">Sign in</span>
      </Link>
    </Show>
    <Show when="signed-in">
      <UserButton userProfileMode="navigation" userProfileUrl="/account" />
    </Show>
  </>
)
