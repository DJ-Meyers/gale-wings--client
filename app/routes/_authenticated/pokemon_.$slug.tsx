import { createFileRoute } from '@tanstack/react-router'

import {
  PokemonEditorForm,
  usePokemonEditorForm,
} from '~/components/pokemon-editor/PokemonEditorForm'
import { PokemonEditorHeader } from '~/components/pokemon-editor/PokemonEditorHeader'
import type { ChampionsPokemon } from '~/types'

const STUB_DRAFT = {
  species: 'Incineroar',
  nature: 'Adamant',
  ability: 'Intimidate',
  item: 'Assault Vest',
  statPoints: { hp: 32, atk: 32, def: 0, spa: 0, spd: 2, spe: 0 },
  moves: ['Flare Blitz', 'Fake Out', 'Knock Off', 'Parting Shot'],
} as unknown as ChampionsPokemon

const PokemonEditorPage = () => {
  const { slug } = Route.useParams()
  const form = usePokemonEditorForm({
    defaultValues: {
      name: 'Ember',
      notes: '',
      pokemon: STUB_DRAFT,
    },
  })

  return (
    <div className="py-8">
      <form.Subscribe
        selector={(s) => ({
          name: s.values.name,
          species: s.values.pokemon.species,
        })}
      >
        {({ name, species }) => (
          <PokemonEditorHeader
            displayName={name || species}
            slug={slug}
            species={species}
          />
        )}
      </form.Subscribe>
      <PokemonEditorForm form={form} />
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/pokemon_/$slug')({
  component: PokemonEditorPage,
})
