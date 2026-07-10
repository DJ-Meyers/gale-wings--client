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
//
// `ability` is a special case: api-types 0.10.0 returns `Ability | undefined`
// for freshly-created pokemon (the DB stores '' until the user picks one).
// Accept '' as a placeholder so toFormValues can hydrate the form with an
// "unset" value, then `.refine` against it so the form's canSubmit stays false
// until the user picks a real ability — Save is correctly disabled for fresh
// pokemon and re-enables once a valid ability is selected.
// IVs are locked at 31 (see toCalcPokemon's PERFECT_IVS default) and level at
// 50, so neither is an editable form field — omit ivs from the base shape.
const formPokemonSchema = looseChampionsPokemonSchema.omit({ ivs: true }).extend({
  nature: looseChampionsPokemonSchema.shape.nature.unwrap(),
  ability: z
    .union([looseChampionsPokemonSchema.shape.ability, z.literal('')])
    .refine((v) => v !== '', { message: 'Ability is required' }),
  statPoints: z.record(statKeySchema, z.number()),
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
