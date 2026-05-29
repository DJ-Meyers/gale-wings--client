import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo } from 'react'

import { CalcRow } from '~/components/calculator/CalcRow'
import { SpeedCalcRow } from '~/components/SpeedCalcRow'
import { SANDBOX_FIXTURES, SANDBOX_PLAYER } from '~/sandbox/fixtures'
import { SandboxProvider, useSandbox } from '~/sandbox/SandboxContext'
import type { SandboxCalc } from '~/sandbox/types'

const SandboxLayout = () => {
  const { state, dispatch } = useSandbox()

  useEffect(() => {
    if (state.calcs.length === 0) {
      dispatch({ type: 'PLAYER_UPDATE', patch: SANDBOX_PLAYER })
      for (const fixture of SANDBOX_FIXTURES) {
        dispatch({ type: 'CALC_ADD', calc: fixture })
      }
    }
  }, [state.calcs.length, dispatch])

  const offensiveCalcs = useMemo(
    () => state.calcs.filter((c) => c.type === 'offensive'),
    [state.calcs],
  )
  const defensiveCalcs = useMemo(
    () => state.calcs.filter((c) => c.type === 'defensive'),
    [state.calcs],
  )
  const speedCalcs = useMemo(
    () => state.calcs.filter((c) => c.type === 'speed'),
    [state.calcs],
  )

  return (
    <div className="mx-auto max-w-[1400px] py-6">
      <header className="mb-4">
        <h1 className="text-3xl font-bold">Galewings</h1>
        <p className="text-text-muted text-sm">
          VGC damage calculator sandbox — {state.player.species}-led.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <CalcColumn label="Offensive" calcs={offensiveCalcs} />
        <CalcColumn label="Defensive" calcs={defensiveCalcs} />
        <SpeedColumn label="Speed" calcs={speedCalcs} />
      </div>
    </div>
  )
}

const CalcColumn = ({
  label,
  calcs,
}: {
  label: string
  calcs: SandboxCalc[]
}) => (
  <div className="min-w-0">
    <h2 className="text-text-heading border-primary mb-3 border-b-2 pb-1 text-base">
      {label}
    </h2>
    {calcs.map((calc) => {
      if (calc.type === 'speed') return null
      return <CalcRow key={calc.id} calc={calc} mode={calc.type} />
    })}
  </div>
)

const SpeedColumn = ({
  label,
  calcs,
}: {
  label: string
  calcs: SandboxCalc[]
}) => (
  <div className="min-w-0">
    <h2 className="text-text-heading border-primary mb-3 border-b-2 pb-1 text-base">
      {label}
    </h2>
    {calcs.map((calc) => (
      <SpeedCalcRow key={calc.id} calc={calc} />
    ))}
  </div>
)

const IndexPage = () => (
  <SandboxProvider>
    <SandboxLayout />
  </SandboxProvider>
)

export const Route = createFileRoute('/')({
  component: IndexPage,
})
