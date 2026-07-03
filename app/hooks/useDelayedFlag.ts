import { useEffect, useState } from 'react'

/**
 * Defers a boolean turning *on* by `delayMs`, but turns *off* immediately.
 *
 * Use for busy/disabled/loading indicators that would otherwise flash during
 * fast operations: the result only reports `true` once `active` has stayed true
 * continuously past the delay, so a quick op (e.g. an optimistic mutation)
 * never trips it, while a genuinely slow one still surfaces — and clears the
 * instant it finishes, with no trailing lag (unlike a symmetric debounce).
 */
export const useDelayedFlag = (active: boolean, delayMs: number): boolean => {
  const [delayed, setDelayed] = useState(false)
  useEffect(() => {
    if (!active) {
      setDelayed(false)
      return
    }
    const id = setTimeout(() => setDelayed(true), delayMs)
    return () => clearTimeout(id)
  }, [active, delayMs])
  return delayed
}
