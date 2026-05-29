import type { CalcParameters } from '~/types'

import type { StatBoostKey } from '~/sandbox/types'

import { useCalc } from './useCalc'

type Side = 'player' | 'opponent'

export const useModifiers = (side: Side) => {
  const {
    calc,
    mode,
    onPlayerParamsUpdate,
    onOpponentParamsUpdate,
    onPlayerBoost,
    onOpponentBoost,
  } = useCalc()

  const params =
    side === 'player' ? calc.playerCalcParameters : calc.opponentCalcParameters
  const updateParams =
    side === 'player' ? onPlayerParamsUpdate : onOpponentParamsUpdate
  const updateBoost = side === 'player' ? onPlayerBoost : onOpponentBoost

  const isAttacker =
    (side === 'player' && mode === 'offensive') ||
    (side === 'opponent' && mode === 'defensive')

  const setMove = (move: string) =>
    updateParams({ move: move as CalcParameters['move'] })
  const setTeraType = (teraType: string) =>
    updateParams({ teraType: teraType as CalcParameters['teraType'] })
  const setStatus = (status: string) =>
    updateParams({ status: status as CalcParameters['status'] })
  const toggleCrit = (checked: boolean) => updateParams({ isCrit: checked })
  const setBoost = (stat: StatBoostKey, value: number) =>
    updateBoost(stat, value)

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
