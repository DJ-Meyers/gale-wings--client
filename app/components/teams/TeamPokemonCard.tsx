import { toID } from '@smogon/calc'
import { Link } from '@tanstack/react-router'
import type { CSSProperties } from 'react'

import {
  ChevronDownIcon,
  ChevronUpIcon,
  EditIcon,
  PokemonWithItemIcon,
  TrashIcon,
} from '~/components/icons'
import { StatDisplay } from '~/components/pokemon/StatDisplay'
import { Button } from '~/components/ui/Button'
import { typeColor } from '~/data/constants/typeColors'
import { gen } from '@dj-meyers/gale-wings/calc'
import type { ChampionsPokemon, StatKey } from '~/types'
import { rawStatsFor, STAT_KEYS } from '~/utils/pokemonStats'

// The team query returns full DB rows, where `ability` is optional (unset until
// the pokemon is edited) — looser than ChampionsPokemon, so relax it here.
type TeamPokemon = Omit<ChampionsPokemon, 'ability'> & {
  ability?: ChampionsPokemon['ability']
  slug: string
  name: string | null
}

interface TeamPokemonCardProps {
  pokemon: TeamPokemon
  // Zero-based position within the team and the team's size; the slot label and
  // the reorder-button edge states are derived from these.
  index: number
  teamSize: number
  isBusy: boolean
  onMoveUp: () => void
  onMoveDown: () => void
  onRemove: () => void
}

const MOVE_SLOTS = [0, 1, 2, 3]

export const TeamPokemonCard = ({
  pokemon,
  index,
  teamSize,
  isBusy,
  onMoveUp,
  onMoveDown,
  onRemove,
}: TeamPokemonCardProps) => {
  const slotNumber = index + 1
  const isFirst = index === 0
  const isLast = index === teamSize - 1
  const stats = rawStatsFor(pokemon as ChampionsPokemon)
  const nature = gen.natures.get(toID(pokemon.nature))
  const natureModFor = (stat: StatKey): '+' | '-' | undefined =>
    nature?.plus === stat ? '+' : nature?.minus === stat ? '-' : undefined

  return (
    <li className="bg-surface border-border flex h-[210px] min-w-[300px] flex-col justify-between rounded-lg border p-4">
      <div className="-mt-2 flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex flex-col items-center">
            <button
              aria-label="Move up"
              className="text-text-muted hover:text-text inline-flex cursor-pointer items-center justify-center disabled:opacity-50 disabled:hover:text-text-muted"
              disabled={isFirst || isBusy}
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
              type="button"
              onClick={onMoveDown}
            >
              <ChevronDownIcon className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="min-w-0">
            <p className="text-text-heading truncate text-sm font-semibold">
              {pokemon.name || pokemon.species}
            </p>
            {pokemon.name && (
              <p className="text-text-dim truncate text-xs">
                {pokemon.species}
              </p>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Link
            aria-label="Edit"
            className="bg-blue hover:bg-pale-blue inline-flex cursor-pointer items-center justify-center rounded p-1.5 text-white"
            params={{ slug: pokemon.slug }}
            to="/pokemon/$slug"
          >
            <EditIcon className="h-3.5 w-3.5" />
          </Link>
          <Button
            aria-label="Remove from team"
            className="!bg-red hover:!bg-red/80 !text-white"
            disabled={isBusy}
            icon={TrashIcon}
            size="sm"
            variant="tertiary"
            onClick={onRemove}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <PokemonWithItemIcon
          item={pokemon.item}
          size="lg"
          species={pokemon.species}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div
            className="bg-slate light:bg-light-gray truncate rounded px-1.5 py-1 text-[10px] font-medium text-white"
            title={pokemon.ability || undefined}
          >
            Ability: {pokemon.ability || '—'}
          </div>
          <div className="grid grid-cols-2 gap-1">
            {MOVE_SLOTS.map((slot) => {
              const move = pokemon.moves[slot]
              if (!move) {
                return (
                  <span
                    key={slot}
                    className="bg-slate light:bg-light-gray rounded px-1.5 py-1 text-[10px] font-medium text-white"
                  >
                    —
                  </span>
                )
              }
              const type = gen.moves.get(toID(move))?.type
              return (
                <span
                  key={slot}
                  className="move-chip truncate rounded px-1.5 py-1 text-[10px] font-medium text-white"
                  style={{ '--type-bg': typeColor(type) } as CSSProperties}
                  title={move}
                >
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
            className="flex-1"
            natureMod={stat === 'hp' ? undefined : natureModFor(stat)}
            sp={pokemon.statPoints[stat]}
            stat={stat}
            total={stats?.[stat] ?? null}
          />
        ))}
      </div>
    </li>
  )
}
