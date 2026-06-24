import { useForm } from '@tanstack/react-form'

import type { ChampionsPokemon } from '~/types'

export interface PokemonEditorFormValues {
  name: string
  notes: string
  pokemon: ChampionsPokemon
}

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
    onSubmit: async ({ value }) => {
      await onSubmit?.(value)
    },
  })

export type PokemonEditorFormApi = ReturnType<typeof usePokemonEditorForm>
