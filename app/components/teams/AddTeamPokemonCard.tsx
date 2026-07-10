import { useState } from 'react'

import { PokemonSelectField } from '~/components/fields/PokemonSelectField'
import { PokemonIcon } from '~/components/icons/PokemonIcon'
import { Button } from '~/components/ui/Button'
import { useTeamDraft } from '~/context/TeamDraftContext'
import { useListLibrary } from '~/hooks/api/pokemon'

type Mode = 'new' | 'library'

// Staged into the shared team draft (no server call). "New" starts a blank
// build from a species; "Library" clones a detached template's build. A team
// can't hold two of the same species (Species Clause), so on-team species are
// filtered/blocked here.
export const AddTeamPokemonCard = () => {
  const { addNew, addFromTemplate, speciesOnTeam } = useTeamDraft()
  const [isAdding, setIsAdding] = useState(false)
  const [mode, setMode] = useState<Mode>('new')
  const [draftSpecies, setDraftSpecies] = useState('')
  const { library, isLibraryPending, libraryError } = useListLibrary()

  const reset = () => {
    setIsAdding(false)
    setMode('new')
    setDraftSpecies('')
  }

  // Species already on the team can't be added again.
  const pickable = (library ?? []).filter(
    (p) => !speciesOnTeam.has(p.species.trim().toLowerCase()),
  )
  const draftDup = speciesOnTeam.has(draftSpecies.trim().toLowerCase())

  return (
    <li className="relative h-[210px] min-w-[300px]">
      {isAdding ? (
        // Overlay the fixed-height card rather than growing it: a constant card
        // height keeps the list's auto-animate (reorder / add) from animating
        // this control's size. The panel floats over the cards below, so the
        // species Typeahead dropdown isn't clipped.
        <div className="bg-surface border-border absolute inset-x-0 top-0 z-30 flex min-h-full flex-col gap-2 rounded-lg border p-4 shadow-lg">
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
              {draftDup && (
                <p className="text-xs text-red-500">
                  Already on this team (one per species).
                </p>
              )}
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="secondary" onClick={reset}>
                  Cancel
                </Button>
                <Button
                  disabled={!draftSpecies.trim() || draftDup}
                  size="sm"
                  onClick={() => {
                    const species = draftSpecies.trim()
                    if (!species || draftDup) return
                    addNew(species)
                    reset()
                  }}
                >
                  Add
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="max-h-48 overflow-y-auto">
                {isLibraryPending ? (
                  <p className="text-text-dim py-2 text-xs">Loading…</p>
                ) : libraryError ? (
                  <p className="py-2 text-xs text-red-500">
                    Failed to load library: {libraryError.message}
                  </p>
                ) : pickable.length === 0 ? (
                  <p className="text-text-dim py-2 text-xs">
                    No available templates in your library.
                  </p>
                ) : (
                  <ul className="divide-border divide-y">
                    {pickable.map((p) => (
                      <li key={p.id}>
                        <button
                          className="hover:bg-detail-bg flex w-full items-center gap-2 px-1 py-1.5 text-left disabled:opacity-50"
                          type="button"
                          onClick={() => {
                            addFromTemplate(p)
                            reset()
                          }}
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
          className="bg-surface text-text-dim hover:text-text border-border hover:border-primary flex h-full w-full items-center justify-center rounded-lg border border-dashed text-sm"
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
