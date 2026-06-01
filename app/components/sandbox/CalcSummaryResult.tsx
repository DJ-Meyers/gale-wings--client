import { useDeferredValue, useMemo, type ReactNode } from 'react'

import {
  KO_TIER_COLORS_OFFENSIVE,
  classifyKoTier,
} from '~/calc/classify-ko-range'
import { computeDamage, type CalcSide } from '~/calc/compute-damage'
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
import { useSandboxStore } from '~/sandbox/store'
import type { FieldConditions } from '~/types'

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

// Items that boost a Pokémon's damage output (move-power multipliers and
// species-locked stat doublers). Megastones and utility items (Choice Scarf,
// Sitrus Berry, Assault Vest, Focus Sash, Leftovers, etc.) are omitted.
const POWER_BOOSTING_ITEMS: ReadonlySet<string> = new Set([
  'Choice Band',
  'Choice Specs',
  'Light Ball',
  'Thick Club',
  'Deep Sea Tooth',
  'Life Orb',
  'Expert Belt',
  'Muscle Band',
  'Wise Glasses',
  'Punching Glove',
  'Loaded Dice',
  'Metronome',
  'Charcoal',
  'Mystic Water',
  'Miracle Seed',
  'Magnet',
  'Twisted Spoon',
  'Black Belt',
  'Black Glasses',
  'Sharp Beak',
  'Poison Barb',
  'Soft Sand',
  'Hard Stone',
  'Silver Powder',
  'Spell Tag',
  'Metal Coat',
  'Dragon Fang',
  'Never-Melt Ice',
  'Silk Scarf',
  'Sea Incense',
  'Wave Incense',
  'Rose Incense',
  'Odd Incense',
  'Rock Incense',
  'Soul Dew',
  'Adamant Orb',
  'Adamant Crystal',
  'Lustrous Orb',
  'Lustrous Globe',
  'Griseous Orb',
  'Griseous Core',
  'Draco Plate',
  'Dread Plate',
  'Earth Plate',
  'Fist Plate',
  'Flame Plate',
  'Icicle Plate',
  'Insect Plate',
  'Iron Plate',
  'Meadow Plate',
  'Mind Plate',
  'Pixie Plate',
  'Sky Plate',
  'Splash Plate',
  'Spooky Plate',
  'Stone Plate',
  'Toxic Plate',
  'Zap Plate',
])

const powerItem = (item: string | undefined): string =>
  item && POWER_BOOSTING_ITEMS.has(item) ? `${item} ` : ''

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
    className={`cursor-pointer rounded-sm text-2xl leading-none transition duration-100 ease-out [&>span]:transition [&>span]:duration-100 [&>span]:ease-out ${
      active
        ? '[&>span]:ring-1 [&>span]:ring-white [&>span]:ring-inset'
        : 'opacity-40 hover:opacity-100'
    }`}
  >
    {children}
  </button>
)

const FieldToggles = () => {
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

export const CalcSummaryResult = () => {
  const attacker = useSandboxStore((s) => s.attacker)
  const defender = useSandboxStore((s) => s.defender)
  const attackerParams = useSandboxStore((s) => s.attackerCalcParameters)
  const defenderParams = useSandboxStore((s) => s.defenderCalcParameters)
  const fieldConditions = useSandboxStore((s) => s.fieldConditions)

  const attackerDeferred = useDeferredValue(attacker)
  const defenderDeferred = useDeferredValue(defender)
  const attackerParamsDeferred = useDeferredValue(attackerParams)
  const defenderParamsDeferred = useDeferredValue(defenderParams)
  const fieldConditionsDeferred = useDeferredValue(fieldConditions)

  const result = useMemo(() => {
    const atkSide: CalcSide = {
      pokemon: attackerDeferred,
      params: attackerParamsDeferred,
    }
    const defSide: CalcSide = {
      pokemon: defenderDeferred,
      params: defenderParamsDeferred,
    }
    return computeDamage(
      atkSide,
      defSide,
      attackerParamsDeferred.move,
      fieldConditionsDeferred,
    )
  }, [
    attackerDeferred,
    defenderDeferred,
    attackerParamsDeferred,
    defenderParamsDeferred,
    fieldConditionsDeferred,
  ])

  return (
    <div className="border-border bg-bg rounded-sm border p-3">
      {result ? (
        <>
          <div className="text-text-heading mb-2 text-sm font-medium">
            {powerItem(attacker.item)}
            {attacker.species} {attackerParams.move} vs{' '}
            {powerItem(defender.item)}
            {defender.species}
          </div>
          <div
            className={`text-2xl font-bold tabular-nums ${KO_TIER_COLORS_OFFENSIVE[classifyKoTier(result)]}`}
          >
            {formatRange(result.range, result.defenderMaxHp)}
          </div>
          <div className="text-text-muted mt-1 text-sm tabular-nums">
            {result.range[0]} to {result.range[1]} damage out of{' '}
            {result.defenderMaxHp} HP
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
