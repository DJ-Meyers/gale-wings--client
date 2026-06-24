import { AttributesSection } from './AttributesSection'
import { IdentitySection } from './IdentitySection'
import { MovesSection } from './MovesSection'
import { StatPointsSection } from './StatPointsSection'
import type { PokemonEditorFormApi } from './usePokemonEditorForm'

export {
  usePokemonEditorForm,
  type PokemonEditorFormApi,
  type PokemonEditorFormValues,
} from './usePokemonEditorForm'

interface PokemonEditorFormProps {
  form: PokemonEditorFormApi
}

export const PokemonEditorForm = ({ form }: PokemonEditorFormProps) => (
  <div className="bg-surface flex flex-col gap-6 rounded-lg p-5 shadow-md">
    <IdentitySection form={form} />
    <AttributesSection form={form} />
    <MovesSection form={form} />
    <StatPointsSection form={form} />
  </div>
)
