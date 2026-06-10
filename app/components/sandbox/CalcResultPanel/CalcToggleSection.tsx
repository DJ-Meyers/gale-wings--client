import { type ReactNode } from 'react'

import {
  AuroraVeilIcon,
  CritIcon,
  ElectricTerrainIcon,
  FriendGuardIcon,
  GrassyTerrainIcon,
  HelpingHandIcon,
  LightScreenIcon,
  MistyTerrainIcon,
  PsychicTerrainIcon,
  ReflectIcon,
  WeatherIcon,
} from '~/components/icons'
import { ToggleIconButton } from '~/components/ui/ToggleIconButton'
import { useSandboxStore } from '~/sandbox/store'
import type { FieldConditions } from '~/types'

import { CalcExtraToggles } from './CalcExtraToggles'

type Weather = NonNullable<FieldConditions['weather']>
type Terrain = NonNullable<FieldConditions['terrain']>
type MitigationKey =
  | 'isReflect'
  | 'isLightScreen'
  | 'isAuroraVeil'
  | 'isFriendGuard'

const WEATHER_OPTS: Weather[] = ['Sun', 'Rain', 'Sand', 'Snow']
const TERRAIN_OPTS: Terrain[] = ['Electric', 'Grassy', 'Psychic', 'Misty']

const TERRAIN_ICONS: Record<Terrain, () => ReactNode> = {
  Electric: ElectricTerrainIcon,
  Grassy: GrassyTerrainIcon,
  Psychic: PsychicTerrainIcon,
  Misty: MistyTerrainIcon,
}

const MITIGATION_OPTS: { key: MitigationKey; label: string; Icon: () => ReactNode }[] = [
  { key: 'isReflect', label: 'Reflect (defender)', Icon: ReflectIcon },
  { key: 'isLightScreen', label: 'Light Screen (defender)', Icon: LightScreenIcon },
  { key: 'isAuroraVeil', label: 'Aurora Veil (defender)', Icon: AuroraVeilIcon },
  { key: 'isFriendGuard', label: 'Friend Guard (defender)', Icon: FriendGuardIcon },
]

export const CalcToggleSection = () => {
  const weather = useSandboxStore((s) => s.fieldConditions.weather)
  const terrain = useSandboxStore((s) => s.fieldConditions.terrain)
  const attackerSide = useSandboxStore((s) => s.fieldConditions.attackerSide)
  const defenderSide = useSandboxStore((s) => s.fieldConditions.defenderSide)
  const isCrit = useSandboxStore((s) => s.attackerCalcParameters.isCrit)
  const setWeather = useSandboxStore((s) => s.setWeather)
  const setTerrain = useSandboxStore((s) => s.setTerrain)
  const setAttackerParams = useSandboxStore((s) => s.setAttackerParams)
  const toggleAttackerSide = useSandboxStore((s) => s.toggleAttackerSide)
  const toggleDefenderSide = useSandboxStore((s) => s.toggleDefenderSide)

  return (
    <div className="border-border mt-3 border-t pt-3">
      <div className="mx-auto grid w-fit grid-cols-1 items-start gap-x-6 gap-y-3 sm:grid-cols-[repeat(2,auto)] md:grid-cols-[repeat(4,auto)]">
        <div className="flex flex-col gap-0.5">
          <span className="text-text-muted text-xs font-medium tracking-wide uppercase">
            Boosts
          </span>
          <div className="flex items-center gap-0.5">
            <ToggleIconButton
              active={!!isCrit}
              label="Critical Hit"
              onClick={() => setAttackerParams({ isCrit: !isCrit })}
            >
              <CritIcon />
            </ToggleIconButton>
            <ToggleIconButton
              active={!!attackerSide?.isHelpingHand}
              label="Helping Hand (attacker)"
              onClick={() => toggleAttackerSide('isHelpingHand')}
            >
              <HelpingHandIcon />
            </ToggleIconButton>
            <CalcExtraToggles />
          </div>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-text-muted text-xs font-medium tracking-wide uppercase">
            Mitigation
          </span>
          <div className="flex items-center gap-0.5">
            {MITIGATION_OPTS.map(({ key, label, Icon }) => (
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
        <div className="flex flex-col gap-0.5">
          <span className="text-text-muted text-xs font-medium tracking-wide uppercase">
            Weather
          </span>
          <div className="flex items-center gap-0.5">
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
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-text-muted text-xs font-medium tracking-wide uppercase">
            Terrain
          </span>
          <div className="flex items-center gap-0.5">
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
        </div>
      </div>
    </div>
  )
}
