import sunIcon from '~/assets/weather/Harsh_sunlight_icon_SV.png'
import { MoonIcon } from '~/components/icons'
import { useTheme } from '~/hooks/useTheme'

export const ThemeToggle = () => {
  const { mode, toggleMode } = useTheme()
  const isDark = mode === 'dark'
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode'

  // A filled rounded-square chip matching the calc-result toggles, colored by
  // the icon it shows: pale orange behind the sun (dark mode), the result-panel
  // surface tone behind the moon (light mode).
  const chipClass = isDark
    ? 'bg-pale-orange hover:bg-pale-orange/80 text-white'
    : 'bg-surface hover:bg-surface-hover text-text'

  return (
    <button
      aria-label={label}
      className={`inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm transition-colors ${chipClass}`}
      title={label}
      type="button"
      onClick={toggleMode}
    >
      {isDark ? (
        <img
          alt=""
          aria-hidden="true"
          className="h-4 w-4 object-contain"
          src={sunIcon}
        />
      ) : (
        <MoonIcon className="h-4 w-4" />
      )}
    </button>
  )
}
