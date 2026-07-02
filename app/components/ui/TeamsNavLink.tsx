import { Link } from '@tanstack/react-router'

export const TeamsNavLink = () => (
  <Link
    className="text-text-dim hover:text-text text-sm font-medium [&.active]:text-text"
    to="/teams"
  >
    Teams
  </Link>
)
