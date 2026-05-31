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
  const { parseVs, isParseVsPending, parseVsError } = useParseVs(debouncedInput)

  useEffect(() => {
    if (parseVs) applyParseResult(parseVs)
  }, [parseVs, applyParseResult])

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="vs-input" className="text-text-heading text-sm font-medium">
        Vs input
      </label>
      <textarea
        id="vs-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="252+ Atk Choice Band Tinkaton Gigaton Hammer vs. 252 HP / 4 Def Iron Hands"
        rows={3}
        className="border-border bg-background w-full rounded-sm border p-2 font-mono text-sm"
      />
      <div className="text-text-muted text-xs">
        {debouncedInput && isParseVsPending && <span>Parsing…</span>}
        {parseVsError && (
          <span className="text-red-600">
            Parse failed: {parseVsError.message}
          </span>
        )}
        {!debouncedInput && <span>Type a Showdown-style "X vs. Y" calc.</span>}
      </div>
    </div>
  )
}

const IndexPage = () => (
  <div className="mx-auto flex max-w-[1400px] flex-col gap-4 py-6">
    <header>
      <h1 className="text-3xl font-bold">Galewings</h1>
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
