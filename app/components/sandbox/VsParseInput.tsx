import { useEffect } from 'react'

import { CalculatorIcon } from '~/components/icons'
import { useParseVs } from '~/hooks/api/data'
import { useDebouncedValue } from '~/hooks/useDebouncedValue'
import { useSandboxStore } from '~/sandbox/store'

const PARSE_DEBOUNCE_MS = 300

export const VS_PARSE_INPUT_CLASS =
  'bg-slate border-l-primary border-l-4 focus:ring-primary/30 focus:ring-2 focus:outline-none w-full rounded-sm py-1.5 pr-8 pl-2 font-mono text-sm'

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
        className="text-text-heading text-xl font-medium"
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
        <CalculatorIcon className="text-text-muted pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2" />
      </div>
      {parseVsError && (
        <div className="text-xs text-red-600">
          Parse failed: {parseVsError.message}
        </div>
      )}
    </div>
  )
}
