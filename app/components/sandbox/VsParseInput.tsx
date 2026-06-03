import { useEffect } from 'react'

import { CalculatorIcon } from '~/components/icons'
import { useParseVs } from '~/hooks/api/data'
import { useDebouncedValue } from '~/hooks/useDebouncedValue'
import { useSandboxStore } from '~/sandbox/store'

const PARSE_DEBOUNCE_MS = 300

// Example shorthands that double as a grammar cheat-sheet for new users.
const EXAMPLES = [
  '32+ glasses KG SP vs 0/0 Reflect MFloette',
  '32+ Hat EForce vs 32/20+ Sini on psychic terrain',
  'HH 32+ Ttar-M Knock off vs Snow scarf 1 Def Vanilluxe',
]

export const VS_PARSE_INPUT_CLASS =
  'bg-slate border-l-primary focus:ring-primary focus:shadow-[0_0_22px_-4px_var(--color-primary)] w-full rounded-md border-l-4 py-3 pr-10 pl-3.5 font-mono text-base transition-shadow duration-150 focus:ring-2 focus:outline-none md:text-lg'

export const VsParseInput = () => {
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
      <label
        htmlFor="vs-input"
        className="text-text-heading text-base font-medium"
      >
        Quick Calc
      </label>
      <div className="relative">
        <input
          autoFocus
          id="vs-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="32+ Basc WC vs 17 SpA+ 24/14 Zard Y"
          className={VS_PARSE_INPUT_CLASS}
        />
        <CalculatorIcon className="text-text-muted pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2" />
      </div>
      <div className="mt-2 flex max-h-[1.625rem] flex-wrap content-start items-center gap-1.5 overflow-hidden">
        <span className="text-text-faint shrink-0 text-xs">Try:</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => setInput(ex)}
            className="bg-surface text-text-muted hover:border-primary/60 hover:text-text border-border shrink-0 cursor-pointer rounded-full border px-2.5 py-0.5 font-mono text-xs whitespace-nowrap transition-colors"
          >
            {ex}
          </button>
        ))}
      </div>
      {parseVsError && (
        <div className="text-xs text-red-600">
          Parse failed: {parseVsError.message}
        </div>
      )}
    </div>
  )
}
