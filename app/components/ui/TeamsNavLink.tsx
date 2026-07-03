import { Link } from '@tanstack/react-router'

export const TeamsNavLink = () => (
  <Link
    className="text-text-dim hover:text-text text-base font-light [&.active]:text-text"
    to="/teams"
  >
    Teams
  </Link>
)
