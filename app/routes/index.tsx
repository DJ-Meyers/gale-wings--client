import { createFileRoute } from '@tanstack/react-router'

import { CalcSummaryResult } from '~/components/sandbox/CalcSummaryResult'
import { SandboxPokemonPanel } from '~/components/sandbox/SandboxPokemonPanel'
import { VsParseInput } from '~/components/sandbox/VsParseInput'
import { ThemeToggle } from '~/components/ui/ThemeToggle'

const IndexPage = () => (
  <div className="mx-auto flex max-w-[1400px] flex-col gap-3 py-4">
    <header className="flex items-center justify-between gap-2">
      <h1 className="from-accent via-primary via-80% to-red light:bg-linear-to-tl inline-block bg-linear-to-br bg-clip-text text-3xl leading-tight font-bold text-transparent sm:text-4xl">
        Gale Wings
      </h1>
      <ThemeToggle />
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
