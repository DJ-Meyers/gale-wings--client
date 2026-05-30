import { TerrainSelect } from '~/components/calculator/FieldConditionsSection/WeatherTerrainSection/TerrainSelect'
import { WeatherSelect } from '~/components/calculator/FieldConditionsSection/WeatherTerrainSection/WeatherSelect'
import { Fieldset } from '~/components/ui/Fieldset'

export const WeatherTerrainSection = () => (
  <Fieldset
    className="flex-1 items-center justify-around"
    legend="Field Conditions"
  >
    <WeatherSelect />
    <TerrainSelect />
  </Fieldset>
)
