import {
  Outlet,
  createFileRoute,
  useBlocker,
  useNavigate,
} from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

import { FIELD_LABEL_CLASS } from '~/components/fields/FieldLabel'
import { CheckIcon, SaveIcon, TrashIcon } from '~/components/icons'
import { Button } from '~/components/ui/Button'
import { ConfirmDialog } from '~/components/ui/ConfirmDialog'
import { UnsavedChangesDialog } from '~/components/ui/UnsavedChangesDialog'
import { TeamDraftProvider, useTeamDraft } from '~/context/TeamDraftContext'
import {
  useDeleteTeam,
  useGetTeamBySlug,
  useListPokemonByTeam,
  useSaveTeamLayout,
} from '~/hooks/api/teams'
import { useDelayedFlag } from '~/hooks/useDelayedFlag'
import { useSuppressUnsavedWarning } from '~/hooks/useSuppressUnsavedWarning'
import { useTimedFlag } from '~/hooks/useTimedFlag'
import { invalidatePokemonByTeam } from '~/trpc/cache/pokemon'
import { invalidateTeamBySlug, removeTeamBySlug } from '~/trpc/cache/teams'

const MAX_TEAM_NAME = 24

type LoadedTeam = NonNullable<ReturnType<typeof useGetTeamBySlug>['team']>

// Layout route: loads the team + its roster, owns the shared draft (so the
// roster view and the nested per-pokemon editor never lose edits when you
// navigate between them), and renders the always-visible header + <Outlet/>.
const TeamDetailLayout = () => {
  const { slug } = Route.useParams()
  const { team, isTeamPending, teamError } = useGetTeamBySlug(slug)
  const { teamPokemon } = useListPokemonByTeam(team?.id)

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

  return (
    <TeamDraftProvider team={team} serverRoster={teamPokemon}>
      <TeamDetailChrome slug={slug} team={team} />
    </TeamDraftProvider>
  )
}

interface TeamDetailChromeProps {
  slug: string
  team: LoadedTeam
}

const TeamDetailChrome = ({ slug, team }: TeamDetailChromeProps) => {
  const navigate = useNavigate()
  const { name, setName, isDirty, toSaveRoster } = useTeamDraft()
  const { saveTeamLayoutAsync, isSaveTeamLayoutPending } = useSaveTeamLayout()
  const { deleteTeam, isDeleteTeamPending } = useDeleteTeam()
  const { suppressed } = useSuppressUnsavedWarning()

  const [saveError, setSaveError] = useState<string | null>(null)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

  // True while our own save/delete navigation is in flight, so the
  // unsaved-changes blocker doesn't fire on the programmatic navigate/reseed.
  const savingRef = useRef(false)

  const showSaving = useDelayedFlag(isSaveTeamLayoutPending, 200)
  const [justSaved, markSaved] = useTimedFlag(1600)

  useEffect(() => {
    if (!isDirty) return
    const handler = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty])

  // Block leaving with unsaved changes — but NOT navigations that stay within
  // this team (the roster ⇄ per-pokemon editor), since the draft persists there.
  const {
    proceed,
    reset: resetBlock,
    status,
  } = useBlocker({
    shouldBlockFn: ({ next }) => {
      // Don't block navigation that stays within THIS team (roster ⇄ editor) —
      // the draft persists there. Match the exact path or a `/…` child, so a
      // sibling team whose slug merely starts with ours still blocks.
      const base = `/teams/${slug}`
      const internal =
        next.pathname === base || next.pathname.startsWith(`${base}/`)
      return isDirty && !suppressed && !savingRef.current && !internal
    },
    withResolver: true,
  })
  const showUnsaved = status === 'blocked'

  const showDone = justSaved && !isDirty
  const canSave = isDirty && Boolean(name.trim()) && !isSaveTeamLayoutPending

  const handleSave = async () => {
    if (!canSave) return
    setSaveError(null)
    savingRef.current = true
    const trimmed = name.trim()
    try {
      const result = await saveTeamLayoutAsync({
        teamId: team.id,
        expectedVersion: team.version,
        name: trimmed !== team.name ? trimmed : undefined,
        roster: toSaveRoster(),
      })
      markSaved()
      if (result.team.slug !== slug) {
        // Renamed → go to the new slug, then drop the orphaned old-slug cache
        // entry once this page has unmounted.
        await navigate({
          to: '/teams/$slug',
          params: { slug: result.team.slug },
          replace: true,
        })
        removeTeamBySlug(slug)
      }
      // The hook primes getBySlug/listByTeam and the team version bumps, so the
      // provider reseeds the draft to the saved state (real ids for new pokemon).
    } catch (error) {
      const code = (error as { data?: { code?: string } })?.data?.code
      if (code === 'CONFLICT') {
        setSaveError(
          'This team was changed in another session. The latest version has been reloaded — reapply your changes and save again.',
        )
        invalidateTeamBySlug(slug)
        invalidatePokemonByTeam(team.id)
      } else {
        setSaveError('Could not save changes. Please try again.')
      }
    } finally {
      savingRef.current = false
    }
  }

  const handleConfirmDelete = () => {
    savingRef.current = true // deleting the team makes the draft moot
    deleteTeam(
      { id: team.id },
      {
        onSuccess: () => {
          setIsConfirmingDelete(false)
          navigate({ to: '/teams' })
        },
        onError: () => {
          savingRef.current = false
        },
      },
    )
  }

  return (
    <div>
      <form
        className="mb-6 flex items-end gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          void handleSave()
        }}
      >
        <div className="min-w-0 flex-1 space-y-1">
          <label className={FIELD_LABEL_CLASS} htmlFor="team-name">
            Team name
          </label>
          <input
            className="bg-slate border-l-primary focus:ring-primary focus:shadow-[0_0_22px_-4px_var(--color-primary)] block w-full max-w-[250px] rounded border-l-4 px-2 py-1.5 text-sm font-semibold transition-shadow duration-150 focus:ring-2 focus:outline-none"
            id="team-name"
            maxLength={MAX_TEAM_NAME}
            value={name}
            onChange={(event) => {
              setSaveError(null)
              setName(event.target.value)
            }}
          />
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            aria-label={showDone ? 'Saved' : 'Save'}
            className={`!bg-green hover:!bg-pale-green !text-white ${showDone ? 'done-pop !opacity-100' : ''}`}
            disabled={!canSave}
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

      {saveError && (
        <p className="border-red/40 bg-red/10 mb-4 rounded border px-3 py-2 text-sm text-red-500">
          {saveError}
        </p>
      )}

      <Outlet />

      <ConfirmDialog
        cancelLabel="Cancel"
        confirmLabel={isDeleteTeamPending ? 'Deleting…' : 'Delete team'}
        description={`Delete "${team.name}"? Its Pokémon will be deleted too — save any builds you want to keep to your library first.`}
        destructive
        open={isConfirmingDelete}
        title="Delete team"
        onCancel={() => setIsConfirmingDelete(false)}
        onConfirm={handleConfirmDelete}
      />

      <UnsavedChangesDialog
        open={showUnsaved}
        onDiscard={() => proceed?.()}
        onStay={() => resetBlock?.()}
      />
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/teams_/$slug')({
  component: TeamDetailLayout,
})
