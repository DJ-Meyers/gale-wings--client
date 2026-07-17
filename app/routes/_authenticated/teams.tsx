import { Link, createFileRoute } from '@tanstack/react-router'
import { useMemo, useState, type FormEvent } from 'react'

import { PokemonWithItemIcon } from '~/components/icons'
import { Button } from '~/components/ui/Button'
import {
  useCreateTeam,
  useListPokemonByTeam,
  useListTeams,
} from '~/hooks/api/teams'

const MAX_TEAM_NAME = 24
// A full team is six pokemon; cards always render six slots so their height
// stays constant and partial teams read as "3 of 6" rather than shrinking.
const TEAM_SIZE = 6

// Compact last-updated stamp for the card corner: "h:mmam/pm @ m/d/yy".
const formatUpdatedAt = (value: string | Date) => {
  const d = new Date(value)
  const pad = (n: number) => String(n).padStart(2, '0')
  const hours = d.getHours()
  const meridiem = hours < 12 ? 'am' : 'pm'
  const hour12 = hours % 12 || 12
  return `${hour12}:${pad(d.getMinutes())}${meridiem} @ ${
    d.getMonth() + 1
  }/${d.getDate()}/${pad(d.getFullYear() % 100)}`
}

type TeamListItem = NonNullable<ReturnType<typeof useListTeams>['teams']>[number]

// A single team card in the grid. Owns its own roster fetch so each card can
// preview its pokemon; kept as a component (not an inline map) so the
// per-team query hook obeys the rules of hooks.
const TeamCard = ({ team }: { team: TeamListItem }) => {
  const { teamPokemon } = useListPokemonByTeam(team.id)
  // Fixed six-length array: filled from the slot-sorted roster, `null` where a
  // slot is empty so we can reserve space and drop a placeholder in its place.
  const slots = useMemo(() => {
    const roster = [...(teamPokemon ?? [])].sort((a, b) => a.slot - b.slot)
    return Array.from({ length: TEAM_SIZE }, (_, i) => roster[i]?.pokemon ?? null)
  }, [teamPokemon])

  return (
    <li className="bg-surface border-border hover:border-primary rounded-lg border transition-colors">
      <Link className="block p-4" params={{ slug: team.slug }} to="/teams/$slug">
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <h2 className="text-text-heading text-lg font-semibold">
            {team.name}
          </h2>
          <span className="text-text-dim shrink-0 text-xs whitespace-nowrap">
            {formatUpdatedAt(team.updatedAt)}
          </span>
        </div>
        {/* Roster preview: two rows of three larger icons; the grid's own gap
            owns spacing (the `lg` variant carries no inline margin). Empty
            slots keep a placeholder so the grid stays a fixed 2×3. */}
        <div className="mt-3 grid grid-cols-3 justify-items-center gap-2">
          {slots.map((pokemon, i) =>
            pokemon ? (
              <PokemonWithItemIcon
                key={pokemon.id}
                item={pokemon.item}
                size="lg"
                species={pokemon.species}
              />
            ) : (
              <div
                key={`empty-${i}`}
                aria-hidden
                className="border-border h-[72px] w-[72px] rounded border border-dashed"
              />
            ),
          )}
        </div>
        {team.tags && team.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {team.tags.map((tag) => (
              <span
                key={tag}
                className="bg-slate text-text-dim rounded px-1.5 py-0.5 text-[10px] font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>
    </li>
  )
}

const TeamsPage = () => {
  const { teams, isTeamsPending, teamsError } = useListTeams()
  const { createTeam, isCreateTeamPending } = useCreateTeam()
  const [newName, setNewName] = useState('')

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

  return (
    <div>
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
            <TeamCard key={team.id} team={team} />
          ))}
        </ul>
      )}
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/teams')({
  component: TeamsPage,
})
