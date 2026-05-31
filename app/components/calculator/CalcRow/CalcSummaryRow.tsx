import { formatSummary } from '~/components/calculator/CalcRow/formatSummary'
import { FavoriteButton } from '~/components/FavoriteButton'
import { useCalcRowContext } from '~/context/CalcRowContext'
import { useCalcRow } from '~/hooks/calc/useCalcRow'
import { useExpandedCalc } from '~/hooks/calc/useExpandedCalc'
import { useCalcStore } from '~/calc/store'

export const CalcSummaryRow = () => {
  const { calcId, mode } = useCalcRowContext()
  const { calc, attackerSide, defenderSide, result } = useCalcRow(calcId, mode)
  const { setExpandedId } = useExpandedCalc()
  const removeCalc = useCalcStore((s) => s.removeCalc)
  const toggleFavorite = useCalcStore((s) => s.toggleFavorite)

  const defenderMaxHp = result?.defenderMaxHp ?? 1
  const summary = formatSummary(
    attackerSide,
    defenderSide,
    mode,
    result,
    defenderMaxHp,
    calc.fieldConditions,
  )

  return (
    <div className="bg-surface mb-2 overflow-hidden rounded-md shadow-sm">
      <div
        className="hover:bg-hover-bg flex h-14 cursor-pointer items-center gap-2 px-3 select-none"
        onClick={() => setExpandedId(calcId)}
      >
        <FavoriteButton
          isFavorite={calc.isFavorite}
          onClick={() => toggleFavorite(calcId)}
        />
        <span
          className={`min-w-0 flex-1 text-sm ${result ? '' : 'text-text-dim italic'}`}
        >
          {summary}
        </span>
        <button
          className="text-text-faint hover:text-error shrink-0 cursor-pointer border-none bg-none px-1 text-lg leading-none"
          onClick={(e) => {
            e.stopPropagation()
            removeCalc(calcId)
          }}
        >
          &times;
        </button>
      </div>
    </div>
  )
}
