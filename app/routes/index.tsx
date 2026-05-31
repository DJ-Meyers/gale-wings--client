import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

import { CalcSummaryResult } from '~/components/sandbox/CalcSummaryResult'
import { SandboxPokemonPanel } from '~/components/sandbox/SandboxPokemonPanel'
import { useParseVs } from '~/hooks/api/data'
import { useDebouncedValue } from '~/hooks/useDebouncedValue'
import { useSandboxStore } from '~/sandbox/store'

const PARSE_DEBOUNCE_MS = 300

const VsParseInput = () => {
  const input = useSandboxStore((s) => s.input)
  const setInput = useSandboxStore((s) => s.setInput)
  const applyParseResult = useSandboxStore((s) => s.applyParseResult)

  const debouncedInput = useDebouncedValue(input, PARSE_DEBOUNCE_MS)
  const { parseVs, parseVsError } = useParseVs(debouncedInput)

  useEffect(() => {
    if (parseVs) applyParseResult(parseVs)
  }, [parseVs, applyParseResult])

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="vs-input" className="text-text-heading text-sm font-medium">
        Vs input
      </label>
      <input
        id="vs-input"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="252+ Atk Choice Band Tinkaton Gigaton Hammer vs. 252 HP / 4 Def Iron Hands"
        className="border-border bg-background w-full rounded-sm border px-3 py-3 font-mono text-base"
      />
      {parseVsError && (
        <div className="text-xs text-red-600">
          Parse failed: {parseVsError.message}
        </div>
      )}
      {!debouncedInput && (
        <div className="text-text-muted text-xs">
          Type a Showdown-style "X vs. Y" calc.
        </div>
      )}
    </div>
  )
}

const IndexPage = () => (
  <div className="mx-auto flex max-w-[1400px] flex-col gap-4 py-6">
    <header>
      <h1 className="text-primary text-3xl font-bold">Gale Wings</h1>
      <p className="text-text-muted text-sm">
        VGC damage calculator — text-to-Pokémon vs-input.
      </p>
    </header>
    <VsParseInput />
    <CalcSummaryResult />
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <SandboxPokemonPanel side="attacker" />
      <SandboxPokemonPanel side="defender" />
    </div>
  </div>
)

export const Route = createFileRoute('/')({
  component: IndexPage,
})
