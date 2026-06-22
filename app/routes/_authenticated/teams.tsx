import { createFileRoute } from '@tanstack/react-router'

import { Button } from '~/components/ui/Button'

interface StubTeam {
  id: string
  name: string
  slug: string
  pokemonCount: number
  updatedAt: string
}

const stubTeams: StubTeam[] = [
  {
    id: '1',
    name: 'Rain Offense',
    slug: 'rain-offense',
    pokemonCount: 6,
    updatedAt: '2 hours ago',
  },
  {
    id: '2',
    name: 'Trick Room',
    slug: 'trick-room',
    pokemonCount: 6,
    updatedAt: 'yesterday',
  },
  {
    id: '3',
    name: 'Sun BO',
    slug: 'sun-bo',
    pokemonCount: 4,
    updatedAt: '3 days ago',
  },
  {
    id: '4',
    name: 'Sand HO',
    slug: 'sand-ho',
    pokemonCount: 6,
    updatedAt: 'last week',
  },
  {
    id: '5',
    name: 'Regulation H test',
    slug: 'regulation-h-test',
    pokemonCount: 2,
    updatedAt: 'last week',
  },
]

const TeamsPage = () => (
  <div className="py-8">
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold">Teams</h1>
      <Button>New team</Button>
    </div>

    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stubTeams.map((team) => (
        <li
          key={team.id}
          className="bg-surface border-border hover:border-primary cursor-pointer rounded-lg border p-4 transition-colors"
        >
          <div className="mb-2 flex items-start justify-between gap-2">
            <h2 className="text-text-heading text-lg font-semibold">
              {team.name}
            </h2>
            <span className="text-text-muted shrink-0 text-xs">
              {team.pokemonCount}/6
            </span>
          </div>
          <p className="text-text-dim text-xs">Updated {team.updatedAt}</p>
        </li>
      ))}
    </ul>
  </div>
)

export const Route = createFileRoute('/_authenticated/teams')({
  component: TeamsPage,
})
