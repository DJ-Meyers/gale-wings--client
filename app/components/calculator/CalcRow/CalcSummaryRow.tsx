import { formatSummary } from '~/components/calculator/CalcRow/formatSummary'
import { FavoriteButton } from '~/components/FavoriteButton'
import { useCalc } from '~/hooks/calc/useCalc'
import { useExpandedCalc } from '~/hooks/calc/useExpandedCalc'

export const CalcSummaryRow = () => {
  const {
    calc,
    mode,
    attackerSide,
    defenderSide,
    result,
    onRemove,
    onToggleFavorite,
  } = useCalc()
  const { setExpandedId } = useExpandedCalc()

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
        onClick={() => setExpandedId(calc.id)}
      >
        <FavoriteButton
          isFavorite={calc.isFavorite}
          onClick={onToggleFavorite}
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
            onRemove()
          }}
        >
          &times;
        </button>
      </div>
    </div>
  )
}
