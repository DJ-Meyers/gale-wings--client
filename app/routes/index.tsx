import { createFileRoute } from '@tanstack/react-router'

import { CalcSummaryResult } from '~/components/sandbox/CalcSummaryResult'
import { SandboxPokemonPanel } from '~/components/sandbox/SandboxPokemonPanel'
import { VsParseInput } from '~/components/sandbox/VsParseInput'

const IndexPage = () => (
  <div className="mx-auto flex max-w-[1400px] flex-col gap-3 py-4">
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
