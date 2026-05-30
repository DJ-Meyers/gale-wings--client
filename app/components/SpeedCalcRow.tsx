import { FavoriteButton } from '~/components/FavoriteButton'
import { WindIcon } from '~/components/icons'
import { PokemonWithItemIcon } from '~/components/icons/PokemonWithItemIcon'
import { useSpeedCalc, type SpeedTier } from '~/hooks/calc/useSpeedCalc'
import { useSandboxStore } from '~/sandbox/store'

const TIER_COLORS: Record<SpeedTier, string> = {
  faster: 'text-ko-no-2hko',
  tie: 'text-ko-guaranteed-2hko',
  slower: 'text-ko-guaranteed-ohko',
}

interface Properties {
  calcId: string
}

export const SpeedCalcRow = ({ calcId }: Properties) => {
  const calc = useSandboxStore((s) => s.calcs[calcId])
  const toggleFavorite = useSandboxStore((s) => s.toggleFavorite)
  const setOpponentBoost = useSandboxStore((s) => s.setOpponentBoost)
  const toggleDefenderSide = useSandboxStore((s) => s.toggleDefenderSide)
  const removeCalc = useSandboxStore((s) => s.removeCalc)
  const { opponentSpeed, tier, opponentHasTailwind } = useSpeedCalc(calcId)

  const { opponent } = calc
  const speBoost = calc.opponentCalcParameters.boosts.spe

  return (
    <div className="bg-surface mb-2 overflow-hidden rounded-md shadow-sm">
      <div className="flex h-14 items-center gap-2 px-3 select-none">
        <FavoriteButton
          isFavorite={calc.isFavorite}
          onClick={() => toggleFavorite(calcId)}
        />
        <PokemonWithItemIcon
          className="-mt-2"
          item={opponent.item}
          species={opponent.species}
        />
        <span className="flex-1 truncate text-sm">{opponent.species}</span>
        <select
          className={`bg-surface border-border w-12 shrink-0 rounded border px-0.5 py-0.5 text-center text-xs focus:outline-none ${speBoost === 0 ? 'text-text-faint' : 'text-text'}`}
          title="Opponent speed boost"
          value={speBoost}
          onChange={(e) =>
            setOpponentBoost(calcId, 'spe', Number(e.target.value))
          }
        >
          {[6, 5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5, -6].map((v) => (
            <option key={v} value={v}>
              {v >= 0 ? `+${v}` : String(v)}
            </option>
          ))}
        </select>
        <button
          className={`shrink-0 cursor-pointer border-none bg-none px-0.5 leading-none ${opponentHasTailwind ? 'opacity-100' : 'opacity-30'}`}
          title="Toggle opponent tailwind"
          onClick={() => toggleDefenderSide(calcId, 'isTailwind')}
        >
          <WindIcon />
        </button>
        <span
          className={`shrink-0 text-sm font-semibold tabular-nums ${TIER_COLORS[tier]}`}
        >
          {opponentSpeed}
        </span>
        <button
          className="text-text-faint hover:text-error shrink-0 cursor-pointer border-none bg-none px-1 text-lg leading-none"
          onClick={() => removeCalc(calcId)}
        >
          &times;
        </button>
      </div>
    </div>
  )
}
