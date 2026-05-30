import { TerrainSelect } from '~/components/calculator/FieldConditionsSection/WeatherTerrainSection/TerrainSelect'
import { WeatherSelect } from '~/components/calculator/FieldConditionsSection/WeatherTerrainSection/WeatherSelect'

export const WeatherTerrainSection = () => (
  <fieldset className="border-border-section flex flex-wrap items-center gap-x-2.5 gap-y-1 rounded border px-2 pt-1 pb-1.5">
    <legend className="text-text-dim px-1 text-[0.7rem] font-semibold">
      Field Conditions
    </legend>
    <WeatherSelect />
    <TerrainSelect />
  </fieldset>
)
