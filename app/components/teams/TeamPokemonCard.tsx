import { Link } from '@tanstack/react-router'

import { PokemonIcon } from '~/components/icons/PokemonIcon'

interface TeamPokemonCardProps {
  pokemon: {
    species: string
    name: string | null
    slug: string
  }
}

export const TeamPokemonCard = ({ pokemon }: TeamPokemonCardProps) => {
  return (
    <li className="bg-surface border-border rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <PokemonIcon
          className="bg-detail-bg relative inline-block h-14 w-14 shrink-0 overflow-hidden rounded"
          species={pokemon.species}
        />
        <div className="min-w-0 flex-1">
          <p className="text-text-heading truncate text-sm font-semibold">
            {pokemon.name || pokemon.species}
          </p>
          {pokemon.name && (
            <p className="text-text-dim truncate text-xs">{pokemon.species}</p>
          )}
          <Link
            className="text-primary hover:text-primary-hover mt-2 inline-block text-xs"
            params={{ slug: pokemon.slug }}
            to="/pokemon/$slug"
          >
            Edit
          </Link>
        </div>
      </div>
    </li>
  )
}
