import type { CalcParameters } from '~/types'

import { useCalcRowContext } from '~/context/CalcRowContext'
import { useSandboxStore } from '~/sandbox/store'
import type { StatBoostKey } from '~/sandbox/types'

type Side = 'player' | 'opponent'

export const useModifiers = (side: Side) => {
  const { calcId, mode } = useCalcRowContext()
  const params = useSandboxStore((s) =>
    side === 'player'
      ? s.calcs[calcId].playerCalcParameters
      : s.calcs[calcId].opponentCalcParameters,
  )
  const setPlayerParams = useSandboxStore((s) => s.setPlayerParams)
  const setOpponentParams = useSandboxStore((s) => s.setOpponentParams)
  const setPlayerBoost = useSandboxStore((s) => s.setPlayerBoost)
  const setOpponentBoost = useSandboxStore((s) => s.setOpponentBoost)

  const updateParams =
    side === 'player' ? setPlayerParams : setOpponentParams
  const updateBoost = side === 'player' ? setPlayerBoost : setOpponentBoost

  const isAttacker =
    (side === 'player' && mode === 'offensive') ||
    (side === 'opponent' && mode === 'defensive')

  const setMove = (move: string) =>
    updateParams(calcId, { move: move as CalcParameters['move'] })
  const setTeraType = (teraType: string) =>
    updateParams(calcId, { teraType: teraType as CalcParameters['teraType'] })
  const setStatus = (status: string) =>
    updateParams(calcId, { status: status as CalcParameters['status'] })
  const toggleCrit = (checked: boolean) =>
    updateParams(calcId, { isCrit: checked })
  const setBoost = (stat: StatBoostKey, value: number) =>
    updateBoost(calcId, stat, value)

  return {
    teraType: params.teraType,
    boosts: params.boosts,
    status: params.status,
    isCrit: params.isCrit,
    move: params.move,
    showMove: isAttacker,
    showCrit: isAttacker,
    setMove,
    setTeraType,
    setStatus,
    toggleCrit,
    setBoost,
  }
}
