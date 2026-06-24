import { useStore } from '@tanstack/react-form'

import { AbilitySelectField } from '~/components/fields/AbilitySelectField'
import { ItemSelectField } from '~/components/fields/ItemSelectField'
import { NatureSelectField } from '~/components/fields/NatureSelectField'
import { PokemonSelectField } from '~/components/fields/PokemonSelectField'
import { useSpeciesAbilities } from '~/hooks/api/data'
import type { ChampionsPokemon } from '~/types'

import { SectionHeading } from './SectionHeading'
import type { PokemonEditorFormApi } from './usePokemonEditorForm'

interface AttributesSectionProps {
  form: PokemonEditorFormApi
}

export const AttributesSection = ({ form }: AttributesSectionProps) => {
  const species = useStore(form.store, (s) => s.values.pokemon.species)
  const { speciesAbilities } = useSpeciesAbilities(species)

  return (
    <section className="flex flex-col">
      <SectionHeading>Attributes</SectionHeading>
      <form.Field name="pokemon.species">
        {(field) => (
          <PokemonSelectField
            value={field.state.value}
            onChange={(v) =>
              field.handleChange(v as ChampionsPokemon['species'])
            }
          />
        )}
      </form.Field>
      <form.Field name="pokemon.nature">
        {(field) => (
          <NatureSelectField
            value={field.state.value}
            onChange={(v) => field.handleChange(v as ChampionsPokemon['nature'])}
          />
        )}
      </form.Field>
      <form.Field name="pokemon.ability">
        {(field) => (
          <AbilitySelectField
            speciesAbilities={speciesAbilities ?? []}
            value={field.state.value}
            onChange={(v) =>
              field.handleChange(v as ChampionsPokemon['ability'])
            }
          />
        )}
      </form.Field>
      <form.Field name="pokemon.item">
        {(field) => (
          <ItemSelectField
            value={field.state.value ?? ''}
            onChange={(v) =>
              field.handleChange((v || undefined) as ChampionsPokemon['item'])
            }
          />
        )}
      </form.Field>
    </section>
  )
}
