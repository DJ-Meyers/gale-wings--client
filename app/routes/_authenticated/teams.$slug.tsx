import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState, type FormEvent } from 'react'

import { PokemonSelectField } from '~/components/fields/PokemonSelectField'
import { Button } from '~/components/ui/Button'
import { useCreatePokemon } from '~/hooks/api/pokemon'
import {
  useGetTeamBySlug,
  useListPokemonByTeam,
  useUpdateTeam,
} from '~/hooks/api/teams'

const MAX_TEAM_NAME = 24
const MAX_TEAM_SIZE = 6

const TeamDetailPage = () => {
  const { slug } = Route.useParams()
  const navigate = useNavigate()
  const { team, isTeamPending, teamError } = useGetTeamBySlug(slug)
  const { teamPokemon } = useListPokemonByTeam(team?.id)
  const { updateTeam, isUpdateTeamPending } = useUpdateTeam()
  const { createPokemon, isCreatePokemonPending } = useCreatePokemon()
  const [isRenaming, setIsRenaming] = useState(false)
  const [draftName, setDraftName] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [draftSpecies, setDraftSpecies] = useState('')

  useEffect(() => {
    if (team && !isRenaming) setDraftName(team.name)
  }, [team, isRenaming])

  if (isTeamPending) {
    return <p className="text-text-dim py-8 text-sm">Loading…</p>
  }
  if (teamError) {
    return (
      <p className="py-8 text-sm text-red-500">
        Failed to load team: {teamError.message}
      </p>
    )
  }
  if (!team) {
    return <p className="text-text-dim py-8 text-sm">Team not found.</p>
  }

  const handleRenameSubmit = (event: FormEvent) => {
    event.preventDefault()
    const name = draftName.trim()
    if (!name || name.length > MAX_TEAM_NAME || name === team.name) {
      setIsRenaming(false)
      return
    }
    updateTeam(
      { id: team.id, name },
      {
        onSuccess: (updated) => {
          setIsRenaming(false)
          if (updated && updated.slug !== slug) {
            navigate({
              to: '/teams/$slug',
              params: { slug: updated.slug },
              replace: true,
            })
          }
        },
      },
    )
  }

  const populated = teamPokemon ?? []
  const nextSlot = populated.length
  const canAdd = nextSlot < MAX_TEAM_SIZE

  return (
    <div className="py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        {isRenaming ? (
          <form className="flex flex-1 gap-2" onSubmit={handleRenameSubmit}>
            <input
              autoFocus
              className="bg-surface border-border rounded border px-3 py-1.5 text-2xl font-bold"
              maxLength={MAX_TEAM_NAME}
              value={draftName}
              onBlur={() => setIsRenaming(false)}
              onChange={(e) => setDraftName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setDraftName(team.name)
                  setIsRenaming(false)
                }
              }}
            />
            <Button disabled={isUpdateTeamPending} type="submit">
              Save
            </Button>
          </form>
        ) : (
          <>
            <button
              className="text-2xl font-bold"
              type="button"
              onClick={() => setIsRenaming(true)}
            >
              {team.name}
            </button>
            <Button variant="secondary" onClick={() => setIsRenaming(true)}>
              Rename
            </Button>
          </>
        )}
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {populated.map(({ slot, pokemon }) => (
          <li
            key={slot}
            className="bg-surface border-border rounded-lg border p-4"
          >
            <div className="flex items-center gap-3">
              <div className="bg-detail-bg h-14 w-14 shrink-0 rounded" />
              <div className="min-w-0 flex-1">
                <p className="text-text-heading truncate text-sm font-semibold">
                  {pokemon.name || pokemon.species}
                </p>
                {pokemon.name && (
                  <p className="text-text-dim truncate text-xs">
                    {pokemon.species}
                  </p>
                )}
                <Button
                  className="mt-2"
                  disabled
                  size="sm"
                  variant="tertiary"
                >
                  Edit
                </Button>
              </div>
            </div>
          </li>
        ))}
        {canAdd && (
          <li className="bg-surface border-border rounded-lg border p-4">
            {isAdding ? (
              <div className="flex flex-col gap-2">
                <PokemonSelectField
                  compact
                  value={draftSpecies}
                  onChange={setDraftSpecies}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setIsAdding(false)
                      setDraftSpecies('')
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={!draftSpecies.trim() || isCreatePokemonPending}
                    size="sm"
                    onClick={() => {
                      const species = draftSpecies.trim()
                      if (!species) return
                      createPokemon(
                        { teamId: team.id, slot: nextSlot, species },
                        {
                          onSuccess: () => {
                            setIsAdding(false)
                            setDraftSpecies('')
                          },
                        },
                      )
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
        )}
      </ul>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/teams/$slug')({
  component: TeamDetailPage,
})
