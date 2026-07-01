import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { PokemonIcon } from '~/components/icons/PokemonIcon'

type SortBy = 'recent' | 'name' | 'species'

interface StubRow {
  id: string
  name: string | null
  species: string
  slug: string
  teams: Array<{ teamName: string; teamSlug: string }>
}

const STUB_ROWS: StubRow[] = [
  {
    id: '1',
    name: 'Aegis',
    species: 'Chi-Yu',
    slug: 'aegis',
    teams: [
      { teamName: 'Alpha', teamSlug: 'alpha' },
      { teamName: 'Bravo', teamSlug: 'bravo' },
    ],
  },
  {
    id: '2',
    name: null,
    species: 'Iron Bundle',
    slug: 'iron-bundle',
    teams: [{ teamName: 'Alpha', teamSlug: 'alpha' }],
  },
  {
    id: '3',
    name: 'Ceres',
    species: 'Rillaboom',
    slug: 'ceres',
    teams: [],
  },
  {
    id: '4',
    name: 'Doubler',
    species: 'Amoonguss',
    slug: 'doubler',
    teams: [{ teamName: 'Charlie', teamSlug: 'charlie' }],
  },
]

const PokemonLibraryPage = () => {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortBy>('recent')

  return (
    <div className="py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Pokémon</h1>
        <span className="text-text-dim text-xs italic">
          + New Pokémon (wires up in D2)
        </span>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <input
          className="bg-surface border-border flex-1 rounded border px-3 py-1.5 text-sm"
          placeholder="Search by name, species, item, ability, or team…"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <label className="text-text-dim flex items-center gap-2 text-xs">
          Sort
          <select
            className="bg-surface border-border rounded border px-2 py-1.5 text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
          >
            <option value="recent">Recent</option>
            <option value="name">Name</option>
            <option value="species">Species</option>
          </select>
        </label>
      </div>

      <ul className="border-border divide-border divide-y border-y">
        {STUB_ROWS.map((row) => (
          <li key={row.id}>
            <Link
              className="bg-surface hover:bg-detail-bg flex items-center gap-3 px-3 py-2 transition-colors"
              params={{ slug: row.slug }}
              to="/pokemon/$slug"
            >
              <PokemonIcon
                className="bg-detail-bg relative inline-block h-10 w-10 shrink-0 overflow-hidden rounded"
                species={row.species}
              />
              <div className="min-w-0 flex-1">
                <p className="text-text-heading truncate text-sm font-medium">
                  {row.name || row.species}
                </p>
                {row.name && (
                  <p className="text-text-dim truncate text-xs">
                    {row.species}
                  </p>
                )}
              </div>
              <div className="text-text-dim shrink-0 text-xs">
                {row.teams.length === 0 ? (
                  <span className="italic">Orphan</span>
                ) : (
                  <span>
                    {row.teams.map((t, index) => (
                      <span key={t.teamSlug}>
                        {index > 0 && ', '}
                        {t.teamName}
                      </span>
                    ))}
                  </span>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <p className="text-text-dim mt-4 text-xs italic">
        Stub data — real Pokémon list wires up in D1.
      </p>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/pokemon/')({
  component: PokemonLibraryPage,
})
