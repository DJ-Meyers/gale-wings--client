import {
  looseChampionsPokemonSchema,
  statKeySchema,
} from '@dj-meyers/gale-wings/schemas'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'

// looseChampionsPokemonSchema wraps `nature` and each `statPoints` value in
// ZodDefault, which makes the schema's input type accept `undefined` for those
// fields. The form's values type is strict (we always pre-fill them), so we
// rebuild the pokemon schema without the defaults — the schema's input type
// then matches the form's value type and Standard Schema validation lines up.
const formPokemonSchema = looseChampionsPokemonSchema.extend({
  nature: looseChampionsPokemonSchema.shape.nature.unwrap(),
  statPoints: z.record(statKeySchema, z.number()),
  ivs: z.record(statKeySchema, z.number()).optional(),
})

export const pokemonEditorFormSchema = z.object({
  name: z.string(),
  notes: z.string(),
  pokemon: formPokemonSchema,
})

export type PokemonEditorFormValues = z.infer<typeof pokemonEditorFormSchema>

interface PokemonEditorFormOptions {
  defaultValues: PokemonEditorFormValues
  onSubmit?: (values: PokemonEditorFormValues) => void | Promise<void>
}

export const usePokemonEditorForm = ({
  defaultValues,
  onSubmit,
}: PokemonEditorFormOptions) =>
  useForm({
    defaultValues,
    validators: {
      onChange: pokemonEditorFormSchema,
      onSubmit: pokemonEditorFormSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit?.(value)
    },
  })

export type PokemonEditorFormApi = ReturnType<typeof usePokemonEditorForm>
