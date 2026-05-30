import { useSyncExternalStore } from 'react'

export const SUPPRESS_UNSAVED_WARNING_KEY = 'galewings:suppress-unsaved-warning'

const subscribe = (callback: () => void) => {
  const handler = (e: StorageEvent) => {
    if (e.key === SUPPRESS_UNSAVED_WARNING_KEY) callback()
  }
  window.addEventListener('storage', handler)
  return () => window.removeEventListener('storage', handler)
}

const getSnapshot = () =>
  localStorage.getItem(SUPPRESS_UNSAVED_WARNING_KEY) === 'true'

const getServerSnapshot = () => false

export const useSuppressUnsavedWarning = () => {
  const suppressed = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  )

  const setSuppressed = (value: boolean) => {
    const next = value ? 'true' : 'false'
    localStorage.setItem(SUPPRESS_UNSAVED_WARNING_KEY, next)
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: SUPPRESS_UNSAVED_WARNING_KEY,
        newValue: next,
      }),
    )
  }

  return { suppressed, setSuppressed }
}
