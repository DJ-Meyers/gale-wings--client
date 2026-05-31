import { useCalcRowContext } from '~/context/CalcRowContext'
import { useCalcStore } from '~/calc/store'

export const useFieldConditions = () => {
  const { calcId } = useCalcRowContext()
  const fc = useCalcStore((s) => s.calcs[calcId].fieldConditions)
  const setWeather = useCalcStore((s) => s.setWeather)
  const setTerrain = useCalcStore((s) => s.setTerrain)
  const toggleRuin = useCalcStore((s) => s.toggleRuin)
  const toggleAttackerSide = useCalcStore((s) => s.toggleAttackerSide)
  const toggleDefenderSide = useCalcStore((s) => s.toggleDefenderSide)

  return {
    weather: fc.weather,
    terrain: fc.terrain,
    isBeadsOfRuin: !!fc.isBeadsOfRuin,
    isSwordOfRuin: !!fc.isSwordOfRuin,
    isTabletsOfRuin: !!fc.isTabletsOfRuin,
    isVesselOfRuin: !!fc.isVesselOfRuin,
    attackerSide: fc.attackerSide ?? {},
    defenderSide: fc.defenderSide ?? {},
    setWeather: (weather: Parameters<typeof setWeather>[1]) =>
      setWeather(calcId, weather),
    setTerrain: (terrain: Parameters<typeof setTerrain>[1]) =>
      setTerrain(calcId, terrain),
    toggleRuin: (key: Parameters<typeof toggleRuin>[1]) =>
      toggleRuin(calcId, key),
    toggleAttackerSide: (key: Parameters<typeof toggleAttackerSide>[1]) =>
      toggleAttackerSide(calcId, key),
    toggleDefenderSide: (key: Parameters<typeof toggleDefenderSide>[1]) =>
      toggleDefenderSide(calcId, key),
  }
}
