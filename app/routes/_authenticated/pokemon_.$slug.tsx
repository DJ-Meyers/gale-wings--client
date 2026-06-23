import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { PokemonEditorForm } from '~/components/pokemon-editor/PokemonEditorForm'
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
  const [draft, setDraft] = useState<ChampionsPokemon>(STUB_DRAFT)
  const [name, setName] = useState('Ember')
  const [notes, setNotes] = useState('')

  return (
    <div className="py-8">
      <PokemonEditorHeader
        displayName={name || draft.species}
        slug={slug}
        species={draft.species}
      />
      <PokemonEditorForm
        name={name}
        notes={notes}
        pokemon={draft}
        onNameChange={setName}
        onNotesChange={setNotes}
        onPokemonChange={(patch) => setDraft((d) => ({ ...d, ...patch }))}
      />
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/pokemon_/$slug')({
  component: PokemonEditorPage,
})
