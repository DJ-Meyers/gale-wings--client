import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState, type FormEvent } from 'react'

import { AddTeamPokemonCard } from '~/components/teams/AddTeamPokemonCard'
import { TeamPokemonCard } from '~/components/teams/TeamPokemonCard'
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
          <TeamPokemonCard key={slot} pokemon={pokemon} />
        ))}
        {canAdd && (
          <AddTeamPokemonCard
            isPending={isCreatePokemonPending}
            onAdd={(species, onSuccess) =>
              createPokemon(
                { teamId: team.id, slot: nextSlot, species },
                { onSuccess },
              )
            }
          />
        )}
      </ul>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/teams/$slug')({
  component: TeamDetailPage,
})
