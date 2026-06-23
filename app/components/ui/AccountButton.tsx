import { Show, UserButton } from '@clerk/react'
import { Link } from '@tanstack/react-router'

const linkClass =
  'text-text-dim hover:text-text text-sm font-medium [&.active]:text-text'

export const AccountButton = () => (
  <>
    <Show when="signed-out">
      <Link className={linkClass} to="/sign-in">
        Sign in
      </Link>
    </Show>
    <Show when="signed-in">
      <UserButton userProfileMode="navigation" userProfileUrl="/account" />
    </Show>
  </>
)
