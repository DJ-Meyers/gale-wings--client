import { Button } from '~/components/ui/Button'

interface TeamPokemonCardProps {
  pokemon: {
    species: string
    name: string | null
  }
}

export const TeamPokemonCard = ({ pokemon }: TeamPokemonCardProps) => {
  return (
    <li className="bg-surface border-border rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <div className="bg-detail-bg h-14 w-14 shrink-0 rounded" />
        <div className="min-w-0 flex-1">
          <p className="text-text-heading truncate text-sm font-semibold">
            {pokemon.name || pokemon.species}
          </p>
          {pokemon.name && (
            <p className="text-text-dim truncate text-xs">{pokemon.species}</p>
          )}
          <Button className="mt-2" disabled size="sm" variant="tertiary">
            Edit
          </Button>
        </div>
      </div>
    </li>
  )
}
