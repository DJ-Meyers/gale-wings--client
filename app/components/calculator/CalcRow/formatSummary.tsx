import { toID } from '@smogon/calc'
import type { ReactNode } from 'react'

import {
  AuroraVeilIcon,
  ElectricTerrainIcon,
  GrassyTerrainIcon,
  LightScreenIcon,
  MistyTerrainIcon,
  PsychicTerrainIcon,
  ReflectIcon,
  RuinIcon,
  TypeIcon,
  WeatherIcon,
  WindIcon,
} from '~/components/icons'
import { PokemonWithItemIcon } from '~/components/icons/PokemonWithItemIcon'
import { gen } from '~/data/gen'
import type { CalcSide, DamageCalcResult } from '~/calc/compute-damage'
import type { FieldConditions, StatKey } from '~/types'

const STATUS_SUMMARY: Record<string, string> = {
  brn: 'Burn',
  par: 'Para',
  psn: 'Poison',
  tox: 'Toxic',
  slp: 'Sleep',
  frz: 'Freeze',
}

const ATK_STAT_LABEL: Record<string, string> = {
  atk: 'Atk',
  spa: 'SpA',
}

const DEF_STAT_LABEL: Record<string, string> = {
  def: 'Def',
  spd: 'SpD',
}

const isStatusRelevantForAttacker = (
  status: string,
  moveName: string,
  ability: string,
): boolean => {
  const moveId = toID(moveName)
  const abilityId = toID(ability)
  const moveData = gen.moves.get(toID(moveName))
  if (status === 'brn' && moveData?.category === 'Physical') return true
  if (['guts', 'flareboost', 'toxicboost', 'quickfeet'].includes(abilityId))
    return true
  if (moveId === 'facade') return true
  if (status === 'par' && (moveId === 'electroball' || moveId === 'gyroball'))
    return true
  return false
}

const isStatusRelevantForDefender = (
  status: string,
  moveName: string,
): boolean => {
  const moveId = toID(moveName)
  if (moveId === 'hex') return true
  if ((status === 'psn' || status === 'tox') && moveId === 'venoshock')
    return true
  return false
}

const getKoTierColor = (
  koChance: string,
  mode: 'offensive' | 'defensive',
): string => {
  const invert = mode === 'defensive'
  if (koChance.includes('guaranteed OHKO'))
    return invert ? 'text-ko-no-2hko' : 'text-ko-guaranteed-ohko'
  if (koChance.includes('OHKO'))
    return invert ? 'text-ko-chance-2hko' : 'text-ko-chance-ohko'
  if (koChance.includes('guaranteed 2HKO')) return 'text-ko-guaranteed-2hko'
  if (koChance.includes('2HKO'))
    return invert ? 'text-ko-chance-ohko' : 'text-ko-chance-2hko'
  return invert ? 'text-ko-guaranteed-ohko' : 'text-ko-no-2hko'
}

export const formatSummary = (
  attackerSide: CalcSide,
  defenderSide: CalcSide,
  mode: 'offensive' | 'defensive',
  result: DamageCalcResult | null,
  defenderMaxHp: number,
  fieldConditions: FieldConditions,
): ReactNode => {
  const attacker = attackerSide.pokemon
  const defender = defenderSide.pokemon
  const attackerParams = attackerSide.params
  const defenderParams = defenderSide.params
  const moveName = attackerParams.move

  const terrainMap = {
    Grassy: <GrassyTerrainIcon />,
    Electric: <ElectricTerrainIcon />,
    Psychic: <PsychicTerrainIcon />,
    Misty: <MistyTerrainIcon />,
  } as const
  const tIcon = fieldConditions.terrain
    ? terrainMap[fieldConditions.terrain]
    : null

  if (!result) {
    if (mode === 'offensive')
      return (
        <>
          <WeatherIcon weather={fieldConditions.weather} />
          {tIcon}
          {fieldConditions.isSwordOfRuin && <RuinIcon ruin="sword" />}
          {fieldConditions.isBeadsOfRuin && <RuinIcon ruin="beads" />}
          {fieldConditions.isTabletsOfRuin && <RuinIcon ruin="tablets" />}
          {fieldConditions.isVesselOfRuin && <RuinIcon ruin="vessel" />}
          {fieldConditions.attackerSide?.isTailwind && <WindIcon flipped />}
          {moveName}{' '}
          {fieldConditions.defenderSide?.isTailwind && <WindIcon />}
          {fieldConditions.defenderSide?.isReflect && <ReflectIcon />}
          {fieldConditions.defenderSide?.isLightScreen && <LightScreenIcon />}
          {fieldConditions.defenderSide?.isAuroraVeil && <AuroraVeilIcon />}
          {defenderParams.teraType && (
            <TypeIcon typeName={defenderParams.teraType} />
          )}
          <PokemonWithItemIcon
            className="-mt-2"
            item={defender.item}
            species={defender.species}
          />
        </>
      )
    return (
      <>
        <WeatherIcon weather={fieldConditions.weather} />
        {tIcon}
        {fieldConditions.isSwordOfRuin && <RuinIcon ruin="sword" />}
        {fieldConditions.isBeadsOfRuin && <RuinIcon ruin="beads" />}
        {fieldConditions.isTabletsOfRuin && <RuinIcon ruin="tablets" />}
        {fieldConditions.isVesselOfRuin && <RuinIcon ruin="vessel" />}
        {fieldConditions.defenderSide?.isTailwind && <WindIcon flipped />}
        {fieldConditions.defenderSide?.isReflect && <ReflectIcon />}
        {fieldConditions.defenderSide?.isLightScreen && <LightScreenIcon />}
        {fieldConditions.defenderSide?.isAuroraVeil && <AuroraVeilIcon />}
        {fieldConditions.attackerSide?.isTailwind && <WindIcon />}
        {attackerParams.teraType && (
          <TypeIcon typeName={attackerParams.teraType} />
        )}
        <PokemonWithItemIcon
          className="-mt-2"
          item={attacker.item}
          species={attacker.species}
        />{' '}
        {moveName}
      </>
    )
  }

  const pct = (value: number) => ((value / defenderMaxHp) * 100).toFixed(1)
  const range = `${pct(result.range[0])}%-${pct(result.range[1])}%`
  const koMatch = result.koChance.match(/^([\d.]+)% chance to (\dHKO)$/)
  const ko = koMatch ? ` ${koMatch[1]}% ${koMatch[2]}` : ''
  const koColor = result.koChance
    ? getKoTierColor(result.koChance, mode)
    : 'text-text-faint'

  const moveData = gen.moves.get(toID(moveName))
  const isSpecial = moveData?.category === 'Special'
  const atkStat: StatKey = isSpecial ? 'spa' : 'atk'
  const defStat: StatKey = isSpecial ? 'spd' : 'def'

  const atkTeraIcon = attackerParams.teraType ? (
    <TypeIcon key="atk-tera" typeName={attackerParams.teraType} />
  ) : null
  const atkMods: ReactNode[] = []
  if (atkTeraIcon && mode === 'offensive') {
    atkMods.push(atkTeraIcon)
  }
  const atkBoost = attackerParams.boosts[atkStat as Exclude<StatKey, 'hp'>]
  if (atkBoost !== 0) {
    atkMods.push(`${atkBoost > 0 ? '+' : ''}${atkBoost}`)
  }
  if (
    attackerParams.status &&
    isStatusRelevantForAttacker(
      attackerParams.status,
      moveName,
      attacker.ability,
    )
  ) {
    atkMods.push(STATUS_SUMMARY[attackerParams.status] ?? attackerParams.status)
  }
  if (attackerParams.isCrit && !moveData?.willCrit) {
    atkMods.push('Crit')
  }
  const atkPrefix =
    atkMods.length > 0 ? (
      <>
        {atkMods.map((module_, index) => (
          <span key={index}>
            {index > 0 ? ' ' : ''}
            {module_}
          </span>
        ))}{' '}
      </>
    ) : null

  const atkNature = gen.natures.get(toID(attacker.nature))
  const atkNatureSign =
    atkNature?.plus === atkStat ? '+' : atkNature?.minus === atkStat ? '-' : ''
  const atkEvs = attacker.statPoints[atkStat]
  const atkSpread = `${atkEvs}${atkNatureSign} ${ATK_STAT_LABEL[atkStat]}`

  const nature = gen.natures.get(toID(defender.nature))
  const natureSign =
    nature?.plus === defStat ? '+' : nature?.minus === defStat ? '-' : ''
  const hpEVs = defender.statPoints.hp
  const defEVs = defender.statPoints[defStat]
  const defBoost = defenderParams.boosts[defStat as Exclude<StatKey, 'hp'>]
  const defBoostStr =
    defBoost === 0 ? '' : `${defBoost > 0 ? '+' : ''}${defBoost} `
  const defTera = defenderParams.teraType ? (
    <TypeIcon typeName={defenderParams.teraType} />
  ) : null
  const defStatusLabel =
    defenderParams.status &&
    isStatusRelevantForDefender(defenderParams.status, moveName)
      ? `${STATUS_SUMMARY[defenderParams.status] ?? defenderParams.status} `
      : ''
  const defDesc = `${defStatusLabel}${defBoostStr}${hpEVs}/${defEVs}${natureSign} ${DEF_STAT_LABEL[defStat]}`

  const weatherIcon = <WeatherIcon weather={fieldConditions.weather} />
  const defenderScreenIcons = (
    <>
      {fieldConditions.defenderSide?.isTailwind && <WindIcon />}
      {fieldConditions.defenderSide?.isReflect && <ReflectIcon />}
      {fieldConditions.defenderSide?.isLightScreen && <LightScreenIcon />}
      {fieldConditions.defenderSide?.isAuroraVeil && <AuroraVeilIcon />}
    </>
  )
  const ruinIcons = (
    <>
      {fieldConditions.isSwordOfRuin && <RuinIcon ruin="sword" />}
      {fieldConditions.isBeadsOfRuin && <RuinIcon ruin="beads" />}
      {fieldConditions.isTabletsOfRuin && <RuinIcon ruin="tablets" />}
      {fieldConditions.isVesselOfRuin && <RuinIcon ruin="vessel" />}
    </>
  )

  if (mode === 'offensive') {
    return (
      <span className="flex min-w-0 items-center gap-1">
        {weatherIcon}
        {tIcon}
        {ruinIcons}
        {fieldConditions.attackerSide?.isTailwind && <WindIcon flipped />}
        <span className="shrink-0">
          {atkPrefix}
          {moveName}
        </span>
        <span className="text-text-faint shrink-0">vs</span>
        {defenderScreenIcons}
        {defTera}
        <PokemonWithItemIcon
          className="-mt-2"
          item={defender.item}
          species={defender.species}
        />
        <span className="min-w-0">
          <div className="truncate">{defDesc}</div>
          <div className={`truncate text-xs ${koColor}`}>
            {range}
            {ko}
          </div>
        </span>
      </span>
    )
  }
  return (
    <span className="flex min-w-0 items-center gap-1">
      {weatherIcon}
      {tIcon}
      {ruinIcons}
      {fieldConditions.defenderSide?.isTailwind && <WindIcon flipped />}
      {fieldConditions.defenderSide?.isReflect && <ReflectIcon />}
      {fieldConditions.defenderSide?.isLightScreen && <LightScreenIcon />}
      {fieldConditions.defenderSide?.isAuroraVeil && <AuroraVeilIcon />}
      {fieldConditions.attackerSide?.isTailwind && <WindIcon />}
      {atkTeraIcon}
      <PokemonWithItemIcon
        className="-mt-2"
        item={attacker.item}
        species={attacker.species}
      />
      <span className="min-w-0">
        <div className="truncate">
          {atkPrefix}
          {atkSpread} {moveName}
        </div>
        <div className={`truncate text-xs ${koColor}`}>
          {range}
          {ko}
        </div>
      </span>
    </span>
  )
}
