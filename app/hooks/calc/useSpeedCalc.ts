import { computeEffectiveSpeed } from '~/calc/calc-speed'
import type { CalcSide } from '~/calc/compute-damage'
import { useCalcStore } from '~/calc/store'

export type SpeedTier = 'faster' | 'tie' | 'slower'

export const useSpeedCalc = (calcId: string) => {
  const player = useCalcStore((s) => s.player)
  const calc = useCalcStore((s) => s.calcs[calcId])

  const playerSide: CalcSide = {
    pokemon: player,
    params: calc.playerCalcParameters,
  }
  const opponentSide: CalcSide = {
    pokemon: calc.opponent,
    params: calc.opponentCalcParameters,
  }

  const playerHasTailwind = !!calc.fieldConditions.attackerSide?.isTailwind
  const opponentHasTailwind = !!calc.fieldConditions.defenderSide?.isTailwind

  const playerSpeed = computeEffectiveSpeed(
    playerSide,
    calc.fieldConditions,
    playerHasTailwind,
  )
  const opponentSpeed = computeEffectiveSpeed(
    opponentSide,
    calc.fieldConditions,
    opponentHasTailwind,
  )

  const tier: SpeedTier =
    opponentSpeed > playerSpeed
      ? 'faster'
      : opponentSpeed < playerSpeed
        ? 'slower'
        : 'tie'

  return {
    playerSpeed,
    opponentSpeed,
    tier,
    opponentHasTailwind,
  }
}
