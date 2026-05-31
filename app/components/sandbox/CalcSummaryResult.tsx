import { useMemo, type ReactNode } from 'react'

import { computeDamage, type CalcSide } from '~/calc/compute-damage'
import {
  AuroraVeilIcon,
  ElectricTerrainIcon,
  GrassyTerrainIcon,
  LightScreenIcon,
  MistyTerrainIcon,
  PsychicTerrainIcon,
  ReflectIcon,
  WeatherIcon,
} from '~/components/icons'
import { useSandboxStore } from '~/sandbox/store'
import type { FieldConditions } from '~/types'

type Weather = NonNullable<FieldConditions['weather']>
type Terrain = NonNullable<FieldConditions['terrain']>
type ScreenKey = 'isReflect' | 'isLightScreen' | 'isAuroraVeil'

const WEATHER_OPTS: Weather[] = ['Sun', 'Rain', 'Sand', 'Snow']
const TERRAIN_OPTS: Terrain[] = ['Electric', 'Grassy', 'Psychic', 'Misty']

const TERRAIN_ICONS: Record<Terrain, () => ReactNode> = {
  Electric: ElectricTerrainIcon,
  Grassy: GrassyTerrainIcon,
  Psychic: PsychicTerrainIcon,
  Misty: MistyTerrainIcon,
}

const SCREEN_OPTS: { key: ScreenKey; label: string; Icon: () => ReactNode }[] = [
  { key: 'isReflect', label: 'Reflect (defender)', Icon: ReflectIcon },
  { key: 'isLightScreen', label: 'Light Screen (defender)', Icon: LightScreenIcon },
  { key: 'isAuroraVeil', label: 'Aurora Veil (defender)', Icon: AuroraVeilIcon },
]

const formatRange = (range: [number, number], maxHp: number): string => {
  const lo = ((range[0] / maxHp) * 100).toFixed(1)
  const hi = ((range[1] / maxHp) * 100).toFixed(1)
  return `${lo}% – ${hi}%`
}

const ToggleIconButton = ({
  active,
  label,
  onClick,
  children,
}: {
  active: boolean
  label: string
  onClick: () => void
  children: ReactNode
}) => (
  <button
    type="button"
    title={label}
    aria-label={label}
    aria-pressed={active}
    onClick={onClick}
    className={`rounded-sm p-1 text-2xl leading-none transition ${
      active
        ? 'ring-primary bg-primary/10 ring-2'
        : 'opacity-40 hover:opacity-100'
    }`}
  >
    {children}
  </button>
)

const FieldToggles = () => {
  const weather = useSandboxStore((s) => s.fieldConditions.weather)
  const terrain = useSandboxStore((s) => s.fieldConditions.terrain)
  const defenderSide = useSandboxStore((s) => s.fieldConditions.defenderSide)
  const setWeather = useSandboxStore((s) => s.setWeather)
  const setTerrain = useSandboxStore((s) => s.setTerrain)
  const toggleDefenderSide = useSandboxStore((s) => s.toggleDefenderSide)

  return (
    <div className="border-border mt-3 flex flex-wrap items-center gap-3 border-t pt-3">
      <div className="flex items-center gap-1">
        {WEATHER_OPTS.map((w) => (
          <ToggleIconButton
            key={w}
            active={weather === w}
            label={w}
            onClick={() => setWeather(weather === w ? undefined : w)}
          >
            <WeatherIcon weather={w} />
          </ToggleIconButton>
        ))}
      </div>
      <span className="border-border h-5 border-l" aria-hidden />
      <div className="flex items-center gap-1">
        {TERRAIN_OPTS.map((t) => {
          const Icon = TERRAIN_ICONS[t]
          return (
            <ToggleIconButton
              key={t}
              active={terrain === t}
              label={`${t} Terrain`}
              onClick={() => setTerrain(terrain === t ? undefined : t)}
            >
              <Icon />
            </ToggleIconButton>
          )
        })}
      </div>
      <span className="border-border h-5 border-l" aria-hidden />
      <div className="flex items-center gap-1">
        {SCREEN_OPTS.map(({ key, label, Icon }) => (
          <ToggleIconButton
            key={key}
            active={!!defenderSide?.[key]}
            label={label}
            onClick={() => toggleDefenderSide(key)}
          >
            <Icon />
          </ToggleIconButton>
        ))}
      </div>
    </div>
  )
}

export const CalcSummaryResult = () => {
  const attacker = useSandboxStore((s) => s.attacker)
  const defender = useSandboxStore((s) => s.defender)
  const attackerParams = useSandboxStore((s) => s.attackerCalcParameters)
  const defenderParams = useSandboxStore((s) => s.defenderCalcParameters)
  const fieldConditions = useSandboxStore((s) => s.fieldConditions)

  const result = useMemo(() => {
    const atkSide: CalcSide = { pokemon: attacker, params: attackerParams }
    const defSide: CalcSide = { pokemon: defender, params: defenderParams }
    return computeDamage(
      atkSide,
      defSide,
      attackerParams.move,
      fieldConditions,
    )
  }, [attacker, defender, attackerParams, defenderParams, fieldConditions])

  return (
    <div className="border-border bg-background rounded-sm border p-3">
      {result ? (
        <>
          <div className="text-text-heading mb-2 text-sm font-medium">
            {attackerParams.move} vs. {defender.species}
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold tabular-nums">
              {formatRange(result.range, result.defenderMaxHp)}
            </span>
            <span className="text-text-muted text-sm tabular-nums">
              ({result.range[0]} – {result.range[1]} / {result.defenderMaxHp})
            </span>
          </div>
          {result.koChance && (
            <div className="text-text-muted mt-1 text-sm">{result.koChance}</div>
          )}
          <div className="text-text-muted mt-2 font-mono text-xs">
            {result.desc}
          </div>
        </>
      ) : (
        <div className="text-text-muted text-sm">
          {attackerParams.move
            ? 'Calc unavailable — check species/move/ability are in the current regulation.'
            : 'Pick an attacking move to see the damage range.'}
        </div>
      )}
      <FieldToggles />
    </div>
  )
}
