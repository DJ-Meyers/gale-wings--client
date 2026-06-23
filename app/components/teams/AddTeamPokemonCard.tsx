import { useState } from 'react'

import { PokemonSelectField } from '~/components/fields/PokemonSelectField'
import { Button } from '~/components/ui/Button'

interface AddTeamPokemonCardProps {
  isPending: boolean
  onAdd: (species: string, onSuccess: () => void) => void
}

export const AddTeamPokemonCard = ({
  isPending,
  onAdd,
}: AddTeamPokemonCardProps) => {
  const [isAdding, setIsAdding] = useState(false)
  const [draftSpecies, setDraftSpecies] = useState('')

  const reset = () => {
    setIsAdding(false)
    setDraftSpecies('')
  }

  return (
    <li className="bg-surface border-border rounded-lg border p-4">
      {isAdding ? (
        <div className="flex flex-col gap-2">
          <PokemonSelectField
            compact
            value={draftSpecies}
            onChange={setDraftSpecies}
          />
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="secondary" onClick={reset}>
              Cancel
            </Button>
            <Button
              disabled={!draftSpecies.trim() || isPending}
              size="sm"
              onClick={() => {
                const species = draftSpecies.trim()
                if (!species) return
                onAdd(species, reset)
              }}
            >
              Add
            </Button>
          </div>
        </div>
      ) : (
        <button
          className="text-text-dim hover:text-text border-border hover:border-primary flex h-full w-full items-center justify-center rounded border border-dashed py-6 text-sm"
          type="button"
          onClick={() => {
            setIsAdding(true)
            setDraftSpecies('')
          }}
        >
          + Add Pokémon
        </button>
      )}
    </li>
  )
}
