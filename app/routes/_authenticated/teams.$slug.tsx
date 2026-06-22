import { createFileRoute } from '@tanstack/react-router'

import { Button } from '~/components/ui/Button'

interface StubSlot {
  slot: number
  species?: string
  name?: string
}

const stubSlots: StubSlot[] = [
  { slot: 0, species: 'Incineroar', name: 'Ember' },
  { slot: 1, species: 'Rillaboom' },
  { slot: 2, species: 'Flutter Mane', name: 'Whisper' },
  { slot: 3, species: 'Iron Hands' },
  { slot: 4 },
  { slot: 5 },
]

const TeamDetailPage = () => {
  const { slug } = Route.useParams()
  const stubName = slug
    .split('-')
    .map((p) => p[0]?.toUpperCase() + p.slice(1))
    .join(' ')

  return (
    <div className="py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{stubName || 'Team'}</h1>
        <Button variant="secondary">Rename</Button>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stubSlots.map((slot) => (
          <li
            key={slot.slot}
            className="bg-surface border-border rounded-lg border p-4"
          >
            {slot.species ? (
              <div className="flex items-center gap-3">
                <div className="bg-detail-bg h-14 w-14 shrink-0 rounded" />
                <div className="min-w-0 flex-1">
                  <p className="text-text-heading truncate text-sm font-semibold">
                    {slot.name || slot.species}
                  </p>
                  {slot.name && (
                    <p className="text-text-dim truncate text-xs">
                      {slot.species}
                    </p>
                  )}
                  <Button className="mt-2" disabled size="sm" variant="tertiary">
                    Edit
                  </Button>
                </div>
              </div>
            ) : (
              <button
                className="text-text-dim hover:text-text border-border hover:border-primary flex h-full w-full items-center justify-center rounded border border-dashed py-6 text-sm"
                type="button"
              >
                + Add Pokémon
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/teams/$slug')({
  component: TeamDetailPage,
})
