import { UserProfile } from '@clerk/react'
import { createFileRoute } from '@tanstack/react-router'

const AccountPage = () => (
  <div className="flex justify-center py-8">
    <UserProfile />
  </div>
)

export const Route = createFileRoute('/_authenticated/account')({
  component: AccountPage,
})
