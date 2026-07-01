import { useState } from 'react'

import { PokemonSelectField } from '~/components/fields/PokemonSelectField'
import { PokemonIcon } from '~/components/icons/PokemonIcon'
import { Button } from '~/components/ui/Button'
import { useListAllPokemon } from '~/hooks/api/pokemon'

type Mode = 'new' | 'library'

interface AddTeamPokemonCardProps {
  isPending: boolean
  isPickPending: boolean
  existingPokemonIds: string[]
  onAdd: (species: string, onSuccess: () => void) => void
  onPickExisting: (pokemonId: string, onSuccess: () => void) => void
}

export const AddTeamPokemonCard = ({
  isPending,
  isPickPending,
  existingPokemonIds,
  onAdd,
  onPickExisting,
}: AddTeamPokemonCardProps) => {
  const [isAdding, setIsAdding] = useState(false)
  const [mode, setMode] = useState<Mode>('new')
  const [draftSpecies, setDraftSpecies] = useState('')
  const { allPokemon, isAllPokemonPending, allPokemonError } =
    useListAllPokemon()

  const reset = () => {
    setIsAdding(false)
    setMode('new')
    setDraftSpecies('')
  }

  const excluded = new Set(existingPokemonIds)
  const pickable = (allPokemon ?? []).filter(
    ({ pokemon: p }) => !excluded.has(p.id),
  )

  return (
    <li className="bg-surface border-border rounded-lg border p-4">
      {isAdding ? (
        <div className="flex flex-col gap-2">
          <div className="border-border flex gap-1 rounded border p-0.5 text-xs">
            <button
              className={`flex-1 rounded px-2 py-1 ${mode === 'new' ? 'bg-primary text-white' : 'text-text-dim hover:text-text'}`}
              type="button"
              onClick={() => setMode('new')}
            >
              New
            </button>
            <button
              className={`flex-1 rounded px-2 py-1 ${mode === 'library' ? 'bg-primary text-white' : 'text-text-dim hover:text-text'}`}
              type="button"
              onClick={() => setMode('library')}
            >
              Library
            </button>
          </div>

          {mode === 'new' ? (
            <>
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
            </>
          ) : (
            <>
              <div className="max-h-48 overflow-y-auto">
                {isAllPokemonPending ? (
                  <p className="text-text-dim py-2 text-xs">Loading…</p>
                ) : allPokemonError ? (
                  <p className="py-2 text-xs text-red-500">
                    Failed to load library: {allPokemonError.message}
                  </p>
                ) : pickable.length === 0 ? (
                  <p className="text-text-dim py-2 text-xs">
                    No available Pokémon in your library.
                  </p>
                ) : (
                  <ul className="divide-border divide-y">
                    {pickable.map(({ pokemon: p }) => (
                      <li key={p.id}>
                        <button
                          className="hover:bg-detail-bg flex w-full items-center gap-2 px-1 py-1.5 text-left disabled:opacity-50"
                          disabled={isPickPending}
                          type="button"
                          onClick={() => onPickExisting(p.id, reset)}
                        >
                          <PokemonIcon
                            className="bg-detail-bg relative inline-block h-8 w-8 shrink-0 overflow-hidden rounded"
                            species={p.species}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-medium">
                              {p.name || p.species}
                            </p>
                            {p.name && (
                              <p className="text-text-dim truncate text-[0.6875rem]">
                                {p.species}
                              </p>
                            )}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex justify-end">
                <Button size="sm" variant="secondary" onClick={reset}>
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      ) : (
        <button
          className="text-text-dim hover:text-text border-border hover:border-primary flex h-full w-full items-center justify-center rounded border border-dashed py-6 text-sm"
          type="button"
          onClick={() => {
            setIsAdding(true)
            setMode('new')
            setDraftSpecies('')
          }}
        >
          + Add Pokémon
        </button>
      )}
    </li>
  )
}
