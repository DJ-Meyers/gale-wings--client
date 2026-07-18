import { toID } from '@smogon/calc'
import { Link } from '@tanstack/react-router'
import type { CSSProperties } from 'react'

import {
  ChevronDownIcon,
  ChevronUpIcon,
  AddToLibraryIcon,
  EditIcon,
  MoveTypeIcon,
  PokemonWithItemIcon,
  XIcon,
} from '~/components/icons'
import { StatDisplay } from '~/components/pokemon/StatDisplay'
import { Button } from '~/components/ui/Button'
import type { EntryFieldChanges } from '~/context/TeamDraftContext'
import { typeColor } from '~/data/constants/typeColors'
import { gen } from '@dj-meyers/gale-wings/calc'
import type { ChampionsPokemon } from '~/types'
import { natureModifier, rawStatsFor, STAT_KEYS } from '~/utils/pokemonStats'

// The team query returns full DB rows, where `ability` is optional (unset until
// the pokemon is edited) — looser than ChampionsPokemon, so relax it here.
export type TeamPokemon = Omit<ChampionsPokemon, 'ability'> & {
  ability?: ChampionsPokemon['ability']
  id: string
  slug: string
  name: string | null
}

interface TeamPokemonCardProps {
  pokemon: TeamPokemon
  // Slug of the owning team, for the nested edit link (/teams/$slug/$pokemonSlug).
  teamSlug: string
  // Zero-based position within the team and the team's size; the slot label and
  // the reorder-button edge states are derived from these.
  index: number
  teamSize: number
  isBusy: boolean
  onMoveUp: () => void
  onMoveDown: () => void
  onRemove: () => void
  // Snapshot this pokemon into the library as a template. Omit to hide the
  // action (only offered for already-persisted pokemon). Runs immediately.
  onSaveToLibrary?: () => void
  // A draft entry not yet persisted (added this session): shows an "Unsaved" tag.
  unsaved?: boolean
  // This pokemon has unsaved changes (added or edited since the last save):
  // gives the card a blue border so pending edits are visible from the roster.
  changed?: boolean
  // Which specific fields changed since the last save, to blue-highlight the
  // exact ability / move / stat that differs. Omitted for a newly-added entry
  // (there's no saved baseline to diff — the whole card is new).
  changes?: EntryFieldChanges
}

const MOVE_SLOTS = [0, 1, 2, 3]

// Blue outline marking a field that changed since the last save. Inset so it
// doesn't nudge the tight card layout.
const CHANGED_RING = 'ring-1 ring-inset ring-blue'

export const TeamPokemonCard = ({
  pokemon,
  teamSlug,
  index,
  teamSize,
  isBusy,
  onMoveUp,
  onMoveDown,
  onRemove,
  onSaveToLibrary,
  unsaved = false,
  changed = false,
  changes,
}: TeamPokemonCardProps) => {
  const slotNumber = index + 1
  const isFirst = index === 0
  const isLast = index === teamSize - 1
  const stats = rawStatsFor(pokemon as ChampionsPokemon)
  const nature = gen.natures.get(toID(pokemon.nature))

  return (
    <li
      className={`bg-surface flex h-[210px] min-w-[300px] flex-col justify-between rounded-lg border p-4 transition-colors duration-200 ${
        changed ? 'border-blue' : 'border-border'
      }`}
    >
      <div className="-mt-2 flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex flex-col items-center">
            <button
              aria-label="Move up"
              className="text-text-muted hover:text-text inline-flex cursor-pointer items-center justify-center disabled:opacity-50 disabled:hover:text-text-muted"
              disabled={isFirst || isBusy}
              title="Move up"
              type="button"
              onClick={onMoveUp}
            >
              <ChevronUpIcon className="h-3.5 w-3.5" />
            </button>
            <span className="text-text-dim text-xs font-semibold">
              #{slotNumber}
            </span>
            <button
              aria-label="Move down"
              className="text-text-muted hover:text-text inline-flex cursor-pointer items-center justify-center disabled:opacity-50 disabled:hover:text-text-muted"
              disabled={isLast || isBusy}
              title="Move down"
              type="button"
              onClick={onMoveDown}
            >
              <ChevronDownIcon className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="min-w-0">
            <p className="text-text-heading flex items-center gap-1.5 truncate text-sm font-semibold">
              {pokemon.name || pokemon.species}
              {unsaved && (
                <span className="bg-slate text-text-dim shrink-0 rounded px-1 py-0.5 text-[0.625rem] font-medium">
                  Unsaved
                </span>
              )}
            </p>
            {pokemon.name && (
              <p className="text-text-dim truncate text-xs">
                {pokemon.species}
              </p>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {onSaveToLibrary && (
            <Button
              aria-label="Save to library"
              className="!bg-green hover:!bg-pale-green !text-white"
              disabled={isBusy}
              icon={AddToLibraryIcon}
              size="sm"
              title="Save to library"
              variant="tertiary"
              onClick={onSaveToLibrary}
            />
          )}
          <Link
            aria-label="Edit"
            className="bg-blue hover:bg-pale-blue inline-flex cursor-pointer items-center justify-center rounded p-1.5 text-white"
            params={{ slug: teamSlug, pokemonSlug: pokemon.slug }}
            title="Edit"
            to="/teams/$slug/$pokemonSlug"
          >
            <EditIcon className="h-3.5 w-3.5" />
          </Link>
          <Button
            aria-label="Remove from team"
            className="!bg-red hover:!bg-red/80 !text-white"
            disabled={isBusy}
            icon={XIcon}
            size="sm"
            title="Remove from team"
            variant="tertiary"
            onClick={onRemove}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* The ability/moves column is a touch taller than the 72px sprite, so
            bottom-align just the sprite: its bottom edge (and the item badge
            pinned to it) then line up with the moves' bottom edge. */}
        <PokemonWithItemIcon
          className="self-end"
          item={pokemon.item}
          itemClassName={changes?.item ? CHANGED_RING : undefined}
          size="lg"
          species={pokemon.species}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div
            className={`bg-neutral-chip truncate rounded px-1.5 py-1 text-[10px] font-medium text-white ${
              changes?.ability ? CHANGED_RING : ''
            }`}
            title={pokemon.ability || undefined}
          >
            Ability: {pokemon.ability || '—'}
          </div>
          <div className="grid grid-cols-2 gap-1">
            {MOVE_SLOTS.map((slot) => {
              const move = pokemon.moves[slot]
              const ring = changes?.moves.has(slot) ? CHANGED_RING : ''
              if (!move) {
                return (
                  <span
                    key={slot}
                    className={`bg-neutral-chip rounded px-1.5 py-1 text-[10px] font-medium text-white ${ring}`}
                  >
                    —
                  </span>
                )
              }
              const type = gen.moves.get(toID(move))?.type
              return (
                <span
                  key={slot}
                  className={`move-chip truncate rounded px-1.5 py-1 text-[10px] font-medium text-white ${ring}`}
                  style={{ '--type-bg': typeColor(type) } as CSSProperties}
                  title={move}
                >
                  {type && type !== '???' && <MoveTypeIcon type={type} />}
                  {move}
                </span>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-1">
        {STAT_KEYS.map((stat) => (
          <StatDisplay
            key={stat}
            className={`flex-1 ${changes?.stats.has(stat) ? CHANGED_RING : ''}`}
            natureMod={natureModifier(nature, stat)}
            sp={pokemon.statPoints[stat]}
            stat={stat}
            total={stats?.[stat] ?? null}
          />
        ))}
      </div>
    </li>
  )
}
