import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { PokemonIcon } from '~/components/icons/PokemonIcon'
import { useListLibrary } from '~/hooks/api/pokemon'
import { useDebouncedValue } from '~/hooks/useDebouncedValue'

type SortBy = 'recent' | 'name' | 'species'

const SEARCH_DEBOUNCE_MS = 200

const PokemonLibraryPage = () => {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortBy>('recent')
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS)
  const { library, isLibraryPending, libraryError } = useListLibrary({
    search: debouncedSearch || undefined,
    sortBy,
  })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Pokémon</h1>
        <Link
          className="text-primary hover:text-primary-hover text-sm"
          to="/pokemon/new"
        >
          + New Pokémon
        </Link>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <input
          className="bg-surface border-border flex-1 rounded border px-3 py-1.5 text-sm"
          placeholder="Search by name, species, item, or ability…"
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

      {isLibraryPending ? (
        <p className="text-text-dim text-sm">Loading…</p>
      ) : libraryError ? (
        <p className="text-sm text-red-500">
          Failed to load library: {libraryError.message}
        </p>
      ) : !library || library.length === 0 ? (
        <p className="text-text-dim text-sm">
          {debouncedSearch
            ? `No templates match "${debouncedSearch}".`
            : 'No library templates yet. Save a build from a team, or create one with +New Pokémon.'}
        </p>
      ) : (
        <ul className="border-border divide-border divide-y border-y">
          {library.map((p) => (
            <li key={p.id}>
              <Link
                className="bg-surface hover:bg-detail-bg flex items-center gap-3 px-3 py-2 transition-colors"
                params={{ slug: p.slug }}
                to="/pokemon/$slug"
              >
                <PokemonIcon
                  className="bg-detail-bg relative inline-block h-10 w-10 shrink-0 overflow-hidden rounded"
                  species={p.species}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-text-heading truncate text-sm font-medium">
                    {p.name || p.species}
                  </p>
                  {p.name && (
                    <p className="text-text-dim truncate text-xs">
                      {p.species}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/pokemon/')({
  component: PokemonLibraryPage,
})
