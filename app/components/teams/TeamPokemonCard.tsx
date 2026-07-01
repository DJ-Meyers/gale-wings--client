import { Link } from '@tanstack/react-router'

import { PokemonIcon } from '~/components/icons/PokemonIcon'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  TrashIcon,
} from '~/components/icons'
import { Button } from '~/components/ui/Button'

interface TeamPokemonCardProps {
  pokemon: {
    species: string
    name: string | null
    slug: string
  }
  isFirst: boolean
  isLast: boolean
  isBusy: boolean
  onMoveUp: () => void
  onMoveDown: () => void
  onRemove: () => void
}

export const TeamPokemonCard = ({
  pokemon,
  isFirst,
  isLast,
  isBusy,
  onMoveUp,
  onMoveDown,
  onRemove,
}: TeamPokemonCardProps) => {
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
        <div className="flex flex-col gap-1">
          <Button
            aria-label="Move up"
            disabled={isFirst || isBusy}
            icon={ChevronUpIcon}
            size="sm"
            variant="tertiary"
            onClick={onMoveUp}
          />
          <Button
            aria-label="Move down"
            disabled={isLast || isBusy}
            icon={ChevronDownIcon}
            size="sm"
            variant="tertiary"
            onClick={onMoveDown}
          />
          <Button
            aria-label="Remove from team"
            disabled={isBusy}
            icon={TrashIcon}
            size="sm"
            variant="tertiary"
            onClick={onRemove}
          />
        </div>
      </div>
    </li>
  )
}
