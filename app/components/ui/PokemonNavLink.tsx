import { Link } from '@tanstack/react-router'

export const PokemonNavLink = () => (
  <Link
    className="text-text-dim hover:text-text text-base font-light [&.active]:text-text"
    to="/pokemon"
  >
    Pokémon
  </Link>
)
