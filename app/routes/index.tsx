import { createFileRoute } from '@tanstack/react-router'

import { CalcSummaryResult } from '~/components/sandbox/CalcSummaryResult'
import { SandboxPokemonPanel } from '~/components/sandbox/SandboxPokemonPanel'
import { VsParseInput } from '~/components/sandbox/VsParseInput'

const IndexPage = () => (
  <div className="mx-auto flex max-w-[1400px] flex-col gap-4 py-6">
    <header>
      <h1 className="from-red via-primary via-65% to-accent inline-block bg-linear-to-r bg-clip-text pb-2 text-7xl leading-tight font-bold text-transparent">
        Gale Wings
      </h1>
      <p className="text-white text-xl font-semibold">
        The fastest (probably) VGC calculator
      </p>
    </header>
    <VsParseInput />
    <CalcSummaryResult />
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <SandboxPokemonPanel side="attacker" />
      <SandboxPokemonPanel side="defender" />
    </div>
  </div>
)

export const Route = createFileRoute('/')({
  component: IndexPage,
})
