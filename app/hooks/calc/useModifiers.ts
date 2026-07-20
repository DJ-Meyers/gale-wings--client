import type { CalcParameters } from '~/types'

import { useCalcRowContext } from '~/context/CalcRowContext'
import { useCalcStore } from '~/calc/store'
import type { StatBoostKey } from '~/calc/types'

type Side = 'player' | 'opponent'

export const useModifiers = (side: Side) => {
  const { calcId, mode } = useCalcRowContext()
  const params = useCalcStore((s) =>
    side === 'player'
      ? s.calcs[calcId].playerCalcParameters
      : s.calcs[calcId].opponentCalcParameters,
  )
  const setPlayerParams = useCalcStore((s) => s.setPlayerParams)
  const setOpponentParams = useCalcStore((s) => s.setOpponentParams)
  const setPlayerBoost = useCalcStore((s) => s.setPlayerBoost)
  const setOpponentBoost = useCalcStore((s) => s.setOpponentBoost)

  const updateParams =
    side === 'player' ? setPlayerParams : setOpponentParams
  const updateBoost = side === 'player' ? setPlayerBoost : setOpponentBoost

  const isAttacker =
    (side === 'player' && mode === 'offensive') ||
    (side === 'opponent' && mode === 'defensive')

  const setMove = (move: string) =>
    updateParams(calcId, { move: move as CalcParameters['move'] })
  const setStatus = (status: string) =>
    updateParams(calcId, { status: status as CalcParameters['status'] })
  const toggleCrit = (checked: boolean) =>
    updateParams(calcId, { isCrit: checked })
  const setBoost = (stat: StatBoostKey, value: number) =>
    updateBoost(calcId, stat, value)

  return {
    boosts: params.boosts,
    status: params.status,
    isCrit: params.isCrit,
    move: params.move,
    showMove: isAttacker,
    showCrit: isAttacker,
    setMove,
    setStatus,
    toggleCrit,
    setBoost,
  }
}
