import { createFileRoute } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'

import { Button } from '~/components/ui/Button'
import { ConfirmDialog } from '~/components/ui/ConfirmDialog'
import { useCreateTeam, useDeleteTeam, useTeamList } from '~/hooks/api/teams'

const MAX_TEAM_NAME = 24

const TeamsPage = () => {
  const { teams, isTeamsPending, teamsError } = useTeamList()
  const { createTeam, isCreateTeamPending } = useCreateTeam()
  const { deleteTeam, isDeleteTeamPending } = useDeleteTeam()
  const [newName, setNewName] = useState('')
  const [pendingDelete, setPendingDelete] = useState<
    { id: string; name: string } | null
  >(null)

  const handleCreate = (event: FormEvent) => {
    event.preventDefault()
    const name = newName.trim()
    if (!name || name.length > MAX_TEAM_NAME) return
    createTeam(
      { name },
      {
        onSuccess: () => {
          setNewName('')
        },
      },
    )
  }

  const handleConfirmDelete = () => {
    if (!pendingDelete) return
    deleteTeam(
      { id: pendingDelete.id },
      {
        onSuccess: () => setPendingDelete(null),
      },
    )
  }

  return (
    <div className="py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Teams</h1>
        <form className="flex gap-2" onSubmit={handleCreate}>
          <input
            className="bg-surface border-border rounded border px-3 py-1.5 text-sm"
            maxLength={MAX_TEAM_NAME}
            placeholder="New team name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Button
            disabled={
              isCreateTeamPending ||
              newName.trim().length === 0 ||
              newName.trim().length > MAX_TEAM_NAME
            }
            type="submit"
          >
            Create
          </Button>
        </form>
      </div>

      {isTeamsPending ? (
        <p className="text-text-dim text-sm">Loading…</p>
      ) : teamsError ? (
        <p className="text-sm text-red-500">
          Failed to load teams: {teamsError.message}
        </p>
      ) : !teams || teams.length === 0 ? (
        <p className="text-text-dim text-sm">
          No teams yet. Create one to get started.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <li
              key={team.id}
              className="bg-surface border-border rounded-lg border p-4"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <h2 className="text-text-heading text-lg font-semibold">
                  {team.name}
                </h2>
                <Button
                  size="sm"
                  variant="tertiary"
                  onClick={() =>
                    setPendingDelete({ id: team.id, name: team.name })
                  }
                >
                  Delete
                </Button>
              </div>
              <p className="text-text-dim text-xs">
                Updated {new Date(team.updatedAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        cancelLabel="Cancel"
        confirmLabel={isDeleteTeamPending ? 'Deleting…' : 'Delete team'}
        description={
          pendingDelete
            ? `Delete "${pendingDelete.name}"? Pokémon on this team will stay in your library.`
            : ''
        }
        destructive
        open={pendingDelete !== null}
        title="Delete team"
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/teams')({
  component: TeamsPage,
})
