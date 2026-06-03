import { createFileRoute } from '@tanstack/react-router'

import { CalcSummaryResult } from '~/components/sandbox/CalcSummaryResult'
import { SandboxPokemonPanel } from '~/components/sandbox/SandboxPokemonPanel'
import { VsParseInput } from '~/components/sandbox/VsParseInput'

const IndexPage = () => (
  <div className="mx-auto flex max-w-[1400px] flex-col gap-3 py-4">
    <header className="flex flex-wrap items-baseline gap-x-3">
      <h1 className="from-accent via-primary via-70% to-red inline-block bg-linear-to-br bg-clip-text text-3xl leading-tight font-bold text-transparent sm:text-4xl">
        Gale Wings
      </h1>
      <p className="text-text-muted text-sm font-medium">
        The fastest (probably) VGC calculator
      </p>
    </header>
    <VsParseInput />
    <CalcSummaryResult />
    <div className="grid grid-cols-[repeat(auto-fit,minmax(236px,1fr))] gap-4">
      <SandboxPokemonPanel side="attacker" />
      <SandboxPokemonPanel side="defender" />
    </div>
  </div>
)

export const Route = createFileRoute('/')({
  component: IndexPage,
})
