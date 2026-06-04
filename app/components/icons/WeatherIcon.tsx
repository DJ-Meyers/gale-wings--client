import type { FieldConditions } from '@dj-meyers/gale-wings/types'

import sunIcon from '~/assets/weather/Harsh_sunlight_icon_SV.png'
import rainIcon from '~/assets/weather/Rain_icon_SV.png'
import sandIcon from '~/assets/weather/Sandstorm_icon_SV.png'
import snowIcon from '~/assets/weather/Snow_icon_SV.png'

import { IconChip } from './IconChip'

type Weather = FieldConditions['weather']

const WEATHER_DATA: Record<
  string,
  { icon: string; bg: string; label: string }
> = {
  Sun: { icon: sunIcon, bg: '#D4891C', label: 'Sun' },
  Rain: { icon: rainIcon, bg: '#74ACF5', label: 'Rain' },
  Sand: { icon: sandIcon, bg: '#D1C17D', label: 'Sand' },
  Snow: { icon: snowIcon, bg: '#81DFF7', label: 'Snow' },
}

export const WeatherIcon = ({ weather }: { weather: Weather }) => {
  if (!weather) return null
  const data = WEATHER_DATA[weather]
  if (!data) return null
  return (
    <IconChip color={data.bg} title={data.label}>
      <img
        alt={data.label}
        className="h-[1em] w-[1em] object-contain"
        src={data.icon}
      />
    </IconChip>
  )
}
