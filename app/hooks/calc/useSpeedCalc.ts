import { computeEffectiveSpeed } from '~/calc/calc-speed'
import type { CalcSide } from '~/calc/compute-damage'
import { useSandboxStore } from '~/sandbox/store'

export type SpeedTier = 'faster' | 'tie' | 'slower'

export const useSpeedCalc = (calcId: string) => {
  const player = useSandboxStore((s) => s.player)
  const calc = useSandboxStore((s) => s.calcs[calcId])

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
