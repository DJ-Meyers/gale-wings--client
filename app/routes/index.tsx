import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

import { CalcRow } from '~/components/calculator/CalcRow'
import { makeCalc } from '~/sandbox/defaults'
import { useSandboxStore } from '~/sandbox/store'

const SandboxSmokeTest = () => {
  const calcOrder = useSandboxStore((s) => s.calcOrder)
  const calcs = useSandboxStore((s) => s.calcs)
  const addCalc = useSandboxStore((s) => s.addCalc)

  useEffect(() => {
    if (calcOrder.length === 0) {
      addCalc(makeCalc('offensive'))
    }
  }, [calcOrder.length, addCalc])

  return (
    <div className="mx-auto max-w-6xl py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Galewings</h1>
        <p className="text-text-muted text-sm">
          VGC damage calculator sandbox.
        </p>
      </header>
      {calcOrder.map((id) => {
        const calc = calcs[id]
        if (calc.type === 'speed') return null
        return <CalcRow key={id} calcId={id} mode={calc.type} />
      })}
    </div>
  )
}

const IndexPage = () => <SandboxSmokeTest />

export const Route = createFileRoute('/')({
  component: IndexPage,
})
