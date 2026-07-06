import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * A boolean that flips *on* when `trigger()` is called and auto-resets *off*
 * after `durationMs`. For transient feedback states — a "Done!" flash on a
 * successful save, a copied-to-clipboard tick, etc. Re-triggering restarts the
 * timer, and the pending timeout is cleared on unmount.
 */
export const useTimedFlag = (durationMs: number): [boolean, () => void] => {
  const [active, setActive] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const trigger = useCallback(() => {
    setActive(true)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setActive(false), durationMs)
  }, [durationMs])

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    },
    [],
  )

  return [active, trigger]
}
