import { useSyncExternalStore } from 'react'

export const THEME_MODE_KEY = 'galewings:theme-mode'

export type ThemeMode = 'light' | 'dark'

const systemPrefersDark = () =>
  window.matchMedia('(prefers-color-scheme: dark)')

const subscribe = (callback: () => void) => {
  const handler = (e: StorageEvent) => {
    if (e.key === THEME_MODE_KEY) callback()
  }
  window.addEventListener('storage', handler)
  // Track OS preference too, so an unset preference follows the system live.
  const mq = systemPrefersDark()
  mq.addEventListener('change', callback)
  return () => {
    window.removeEventListener('storage', handler)
    mq.removeEventListener('change', callback)
  }
}

// An explicit stored choice wins; otherwise fall back to the OS preference.
// This mirrors the inline boot script in index.html.
const getSnapshot = (): ThemeMode => {
  const stored = localStorage.getItem(THEME_MODE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return systemPrefersDark().matches ? 'dark' : 'light'
}

const getServerSnapshot = (): ThemeMode => 'dark'

export const useTheme = () => {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const setMode = (next: ThemeMode) => {
    localStorage.setItem(THEME_MODE_KEY, next)
    // Same-tab listeners don't receive the native storage event, so replay it.
    window.dispatchEvent(
      new StorageEvent('storage', { key: THEME_MODE_KEY, newValue: next }),
    )
  }

  const toggleMode = () => setMode(mode === 'light' ? 'dark' : 'light')

  return { mode, setMode, toggleMode }
}
