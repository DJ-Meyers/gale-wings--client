import { useEffect, useRef } from 'react'

import { CalculatorIcon } from '~/components/icons'
import { useParseVs } from '~/hooks/api/data'
import { useDebouncedValue } from '~/hooks/useDebouncedValue'
import { useSandboxStore } from '~/sandbox/store'

const PARSE_DEBOUNCE_MS = 300

// Example shorthands that double as a grammar cheat-sheet for new users.
const EXAMPLES = [
  '32+ Basc LR3 vs 24/14 ZardY',
  'Max Atk glasses KG SP vs Veil MFross sun',
  '-1 32 Atk Maus PopBomb 10 vs 32/14 Incin',
  '32+ spoon Hat EForce psychic terrain vs Hera-M',
]

export const VS_PARSE_INPUT_CLASS =
  'bg-slate border-l-primary focus:ring-primary focus:shadow-[0_0_22px_-4px_var(--color-primary)] block w-full resize-none overflow-hidden rounded-md border-l-4 py-3 pr-10 pl-3.5 font-mono text-base leading-relaxed transition-shadow duration-150 focus:ring-2 focus:outline-none md:text-lg'

export const VsParseInput = () => {
  const input = useSandboxStore((s) => s.input)
  const setInput = useSandboxStore((s) => s.setInput)
  const applyParseResult = useSandboxStore((s) => s.applyParseResult)

  const debouncedInput = useDebouncedValue(input, PARSE_DEBOUNCE_MS)
  const { parseVs, parseVsError } = useParseVs(debouncedInput)

  useEffect(() => {
    if (parseVs) applyParseResult(parseVs)
  }, [parseVs, applyParseResult])

  // Auto-grow the textarea to fit its content. CSS field-sizing isn't in
  // Firefox yet, so measure scrollHeight instead — on every input change and
  // whenever the field's width changes (responsive reflow), so widening the
  // viewport collapses lines that were only wrapped at a narrower width.
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    const resize = () => {
      el.style.height = 'auto'
      el.style.height = `${el.scrollHeight}px`
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [input])

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <textarea
          ref={textareaRef}
          autoFocus
          aria-label="Quick Calc"
          id="vs-input"
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            // The calc runs on a debounce, so Enter has no submit role — keep
            // the field a single logical line instead of inserting newlines.
            if (e.key === 'Enter') e.preventDefault()
          }}
          placeholder="32+ Basc LR3 vs 24/14 ZardY"
          className={VS_PARSE_INPUT_CLASS}
        />
        <CalculatorIcon className="text-text-muted pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2" />
      </div>
      <div className="mt-2 hidden max-h-[1.625rem] flex-wrap content-start items-center gap-1.5 overflow-hidden sm:flex">
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
