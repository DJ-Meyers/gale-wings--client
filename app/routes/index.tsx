import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'

import { CalcRow } from '~/components/calculator/CalcRow'
import { SpeedCalcRow } from '~/components/SpeedCalcRow'
import { useSandboxStore } from '~/sandbox/store'
import type { CalcRowMode, SandboxCalc } from '~/sandbox/types'

const SandboxLayout = () => {
  const playerSpecies = useSandboxStore((s) => s.player.species)
  const calcOrder = useSandboxStore((s) => s.calcOrder)
  const calcs = useSandboxStore((s) => s.calcs)

  const { offensive, defensive, speed } = useMemo(() => {
    const offensive: SandboxCalc[] = []
    const defensive: SandboxCalc[] = []
    const speed: SandboxCalc[] = []
    for (const id of calcOrder) {
      const c = calcs[id]
      if (c.type === 'offensive') offensive.push(c)
      else if (c.type === 'defensive') defensive.push(c)
      else speed.push(c)
    }
    return { offensive, defensive, speed }
  }, [calcOrder, calcs])

  return (
    <div className="mx-auto max-w-[1400px] py-6">
      <header className="mb-4">
        <h1 className="text-3xl font-bold">Galewings</h1>
        <p className="text-text-muted text-sm">
          VGC damage calculator sandbox — {playerSpecies}-led.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <CalcColumn label="Offensive" mode="offensive" calcs={offensive} />
        <CalcColumn label="Defensive" mode="defensive" calcs={defensive} />
        <SpeedColumn label="Speed" calcs={speed} />
      </div>
    </div>
  )
}

const CalcColumn = ({
  label,
  mode,
  calcs,
}: {
  label: string
  mode: CalcRowMode
  calcs: SandboxCalc[]
}) => (
  <div className="min-w-0">
    <h2 className="text-text-heading border-primary mb-3 border-b-2 pb-1 text-base">
      {label}
    </h2>
    {calcs.map((calc) => (
      <CalcRow key={calc.id} calcId={calc.id} mode={mode} />
    ))}
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
      <SpeedCalcRow key={calc.id} calcId={calc.id} />
    ))}
  </div>
)

const IndexPage = () => <SandboxLayout />

export const Route = createFileRoute('/')({
  component: IndexPage,
})
