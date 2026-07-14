import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState, type FormEvent } from 'react'

import { FIELD_LABEL_CLASS } from '~/components/fields/FieldLabel'
import { CheckIcon, SaveIcon, TrashIcon } from '~/components/icons'
import { TeamPokemonList } from '~/components/teams/TeamPokemonList'
import { Button } from '~/components/ui/Button'
import { ConfirmDialog } from '~/components/ui/ConfirmDialog'
import {
  useDeleteTeam,
  useGetTeamBySlug,
  useUpdateTeam,
} from '~/hooks/api/teams'
import { useDelayedFlag } from '~/hooks/useDelayedFlag'
import { useTimedFlag } from '~/hooks/useTimedFlag'
import { useTRPC } from '~/trpc/client'

const MAX_TEAM_NAME = 24

const TeamDetailPage = () => {
  const { slug } = Route.useParams()
  const navigate = useNavigate()
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const { team, isTeamPending, teamError } = useGetTeamBySlug(slug)
  const { updateTeam, isUpdateTeamPending } = useUpdateTeam()
  const { deleteTeam, isDeleteTeamPending } = useDeleteTeam()
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const [draftName, setDraftName] = useState('')
  // Only surface "Saving…" if the save is genuinely slow — a fast update would
  // otherwise flash the label. Disabled still tracks the immediate pending flag.
  const showSaving = useDelayedFlag(isUpdateTeamPending, 200)
  // Briefly confirm a successful save with a "Done" pop on the button.
  const [justSaved, markSaved] = useTimedFlag(1600)

  // Seed / re-sync the field from the server name (also picks up the renamed
  // value after a successful save). Typing doesn't change team.name, so the
  // draft isn't clobbered mid-edit.
  const teamName = team?.name
  useEffect(() => {
    if (teamName) setDraftName(teamName)
  }, [teamName])

  if (isTeamPending) {
    return <p className="text-text-dim text-sm">Loading…</p>
  }
  if (teamError) {
    return (
      <p className="text-sm text-red-500">
        Failed to load team: {teamError.message}
      </p>
    )
  }
  if (!team) {
    return <p className="text-text-dim text-sm">Team not found.</p>
  }

  const handleConfirmDelete = () => {
    deleteTeam(
      { id: team.id },
      {
        onSuccess: () => {
          setIsConfirmingDelete(false)
          navigate({ to: '/teams' })
        },
      },
    )
  }

  // Show the "Done" confirmation only while the field still matches what was
  // saved — the moment the user edits again, revert to the "Save" affordance.
  const showDone = justSaved && draftName.trim() === team.name

  const handleRenameSubmit = (event: FormEvent) => {
    event.preventDefault()
    const name = draftName.trim()
    if (!name || name.length > MAX_TEAM_NAME || name === team.name) return
    updateTeam(
      { id: team.id, name },
      {
        onSuccess: (updated) => {
          markSaved()
          if (updated && updated.slug !== slug) {
            // Navigate to the renamed slug, then drop the now-orphaned old-slug
            // entry once its detail page has unmounted. Clearing it any earlier
            // would refetch a slug the page is still observing and cache the
            // null miss for the 30s staleTime.
            void navigate({
              to: '/teams/$slug',
              params: { slug: updated.slug },
              replace: true,
            }).then(() => {
              queryClient.removeQueries({
                queryKey: trpc.team.getBySlug.queryKey({ slug }),
              })
            })
          }
        },
      },
    )
  }

  return (
    <div>
      <form
        className="mb-6 flex items-end gap-4"
        onSubmit={handleRenameSubmit}
      >
        <div className="min-w-0 flex-1 space-y-1">
          <label className={FIELD_LABEL_CLASS} htmlFor="team-name">
            Team name
          </label>
          <input
            className="bg-slate border-l-primary focus:ring-primary focus:shadow-[0_0_22px_-4px_var(--color-primary)] block w-full max-w-[250px] rounded border-l-4 px-2 py-1.5 text-sm font-semibold transition-shadow duration-150 focus:ring-2 focus:outline-none"
            id="team-name"
            maxLength={MAX_TEAM_NAME}
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
          />
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            aria-label={showDone ? 'Saved' : 'Save'}
            className={`!bg-green hover:!bg-pale-green !text-white ${showDone ? 'done-pop !opacity-100' : ''}`}
            disabled={
              isUpdateTeamPending ||
              !draftName.trim() ||
              draftName.trim() === team.name
            }
            icon={showDone ? CheckIcon : SaveIcon}
            type="submit"
            variant="tertiary"
          >
            <span className="hidden md:inline">
              {showSaving ? 'Saving…' : showDone ? 'Done' : 'Save'}
            </span>
          </Button>
          <Button
            aria-label="Delete team"
            className="!bg-red hover:!bg-red/80 !text-white"
            icon={TrashIcon}
            type="button"
            variant="tertiary"
            onClick={() => setIsConfirmingDelete(true)}
          >
            <span className="hidden md:inline">Delete Team</span>
          </Button>
        </div>
      </form>

      <TeamPokemonList teamId={team.id} teamName={team.name} />

      <ConfirmDialog
        cancelLabel="Cancel"
        confirmLabel={isDeleteTeamPending ? 'Deleting…' : 'Delete team'}
        description={`Delete "${team.name}"? Pokémon on this team will stay in your library.`}
        destructive
        open={isConfirmingDelete}
        title="Delete team"
        onCancel={() => setIsConfirmingDelete(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/teams_/$slug')({
  component: TeamDetailPage,
})
