import sunIcon from '~/assets/weather/Harsh_sunlight_icon_SV.png'
import { MoonIcon } from '~/components/icons'
import { useTheme } from '~/hooks/useTheme'

export const ThemeToggle = () => {
  const { mode, toggleMode } = useTheme()
  const isDark = mode === 'dark'
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode'

  // A filled rounded-square chip matching the calc-result toggles, colored by
  // the icon it shows: the weather-sun orange behind the sun (dark mode), the
  // result-panel surface tone behind the moon (light mode).
  const chipClass = isDark
    ? 'hover:brightness-95 text-white'
    : 'bg-surface hover:bg-surface-hover text-text'

  return (
    <button
      aria-label={label}
      className={`inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm transition-colors ${chipClass}`}
      style={isDark ? { backgroundColor: '#D4891C' } : undefined}
      title={label}
      type="button"
      onClick={toggleMode}
    >
      {isDark ? (
        <img
          alt=""
          aria-hidden="true"
          className="h-5 w-5 object-contain"
          src={sunIcon}
        />
      ) : (
        <MoonIcon className="text-text-muted h-4 w-4" />
      )}
    </button>
  )
}
