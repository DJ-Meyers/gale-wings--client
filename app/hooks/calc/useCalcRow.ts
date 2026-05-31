import { useMemo } from 'react'

import { computeDamage, type CalcSide } from '~/calc/compute-damage'
import { useCalcStore } from '~/calc/store'
import type { CalcRowMode } from '~/calc/types'

export const useCalcRow = (calcId: string, mode: CalcRowMode) => {
  const calc = useCalcStore((s) => s.calcs[calcId])
  const player = useCalcStore((s) => s.player)

  const sides = useMemo(() => {
    const playerSide: CalcSide = {
      pokemon: player,
      params: calc.playerCalcParameters,
    }
    const opponentSide: CalcSide = {
      pokemon: calc.opponent,
      params: calc.opponentCalcParameters,
    }
    const attackerSide = mode === 'offensive' ? playerSide : opponentSide
    const defenderSide = mode === 'offensive' ? opponentSide : playerSide
    return { playerSide, opponentSide, attackerSide, defenderSide }
  }, [
    player,
    calc.opponent,
    calc.playerCalcParameters,
    calc.opponentCalcParameters,
    mode,
  ])

  const result = useMemo(
    () =>
      computeDamage(
        sides.attackerSide,
        sides.defenderSide,
        sides.attackerSide.params.move,
        calc.fieldConditions,
      ),
    [sides, calc.fieldConditions],
  )

  return { calc, mode, ...sides, result }
}
