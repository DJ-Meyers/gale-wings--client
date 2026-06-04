import { useMemo, useState } from 'react'

import { FieldLabel } from '~/components/fields/FieldLabel'
import { searchAliases, type AliasCategory } from '~/data/aliases'

const SEARCH_CLASS =
  'block w-full rounded bg-slate border border-border px-3 py-2 text-sm focus:ring-2 focus:ring-primary/30 focus:outline-none'

const CATEGORY_CLASS: Record<AliasCategory, string> = {
  Move: 'bg-stat-atk/20 text-stat-atk',
  Item: 'bg-stat-spd/20 text-stat-spd',
  Species: 'bg-stat-spe/20 text-stat-spe',
}

// Wraps the first case-insensitive occurrence of `query` in <mark>. Falls back
// to the plain string when the query doesn't appear literally (e.g. it only
// matched after toID stripped a space).
const highlight = (text: string, query: string): React.ReactNode => {
  const q = query.trim().toLowerCase()
  if (!q) return text
  const idx = text.toLowerCase().indexOf(q)
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-primary/30 text-text rounded px-0.5">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  )
}

export const AliasSearch = () => {
  const [query, setQuery] = useState('')
  const results = useMemo(() => searchAliases(query), [query])
  const trimmed = query.trim()

  return (
    <div className="flex flex-col gap-4">
      <div>
        <FieldLabel>Search a name or alias</FieldLabel>
        <input
          autoFocus
          className={SEARCH_CLASS}
          placeholder="e.g. Jet, eq, vest…"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {trimmed && results.length === 0 && (
        <p className="text-text-muted text-sm">
          No aliases match “{trimmed}”.
        </p>
      )}

      {results.length > 0 && (
        <ul className="flex flex-col gap-2">
          {results.map((entry) => (
            <li
              key={`${entry.category}:${entry.canonical}`}
              className="border-border bg-surface flex flex-col gap-2 rounded border p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${CATEGORY_CLASS[entry.category]}`}
                >
                  {entry.category}
                </span>
                <span className="text-text font-semibold">
                  {highlight(entry.canonical, query)}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {entry.aliases.map((alias) => (
                  <span
                    key={alias}
                    className="border-border bg-slate text-text-dim rounded border px-1.5 py-0.5 text-xs"
                  >
                    {highlight(alias, query)}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
