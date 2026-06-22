import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState, type FormEvent } from 'react'

import { Button } from '~/components/ui/Button'
import {
  usePokemonByTeam,
  useTeamBySlug,
  useUpdateTeam,
} from '~/hooks/api/teams'

const MAX_TEAM_NAME = 24
const SLOTS = [0, 1, 2, 3, 4, 5] as const

const TeamDetailPage = () => {
  const { slug } = Route.useParams()
  const navigate = useNavigate()
  const { team, isTeamPending, teamError } = useTeamBySlug(slug)
  const { teamPokemon } = usePokemonByTeam(team?.id)
  const { updateTeam, isUpdateTeamPending } = useUpdateTeam()
  const [isRenaming, setIsRenaming] = useState(false)
  const [draftName, setDraftName] = useState('')

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

  const slotMap = new Map(
    (teamPokemon ?? []).map((entry) => [entry.slot, entry.pokemon]),
  )

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
        {SLOTS.map((slot) => {
          const pokemon = slotMap.get(slot)
          return (
            <li
              key={slot}
              className="bg-surface border-border rounded-lg border p-4"
            >
              {pokemon ? (
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
              ) : (
                <button
                  className="text-text-dim hover:text-text border-border hover:border-primary flex h-full w-full items-center justify-center rounded border border-dashed py-6 text-sm"
                  disabled
                  type="button"
                >
                  + Add Pokémon
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/teams/$slug')({
  component: TeamDetailPage,
})
