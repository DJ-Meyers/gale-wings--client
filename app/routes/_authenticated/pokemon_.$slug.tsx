import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { PokemonInfoSelectors } from '~/components/calculator/PokemonInfoSection/PokemonInfoSelectors'
import { PokemonInfoStatPointInputs } from '~/components/calculator/PokemonInfoSection/PokemonInfoStatPointInputs'
import { PokemonNameField } from '~/components/calculator/PokemonInfoSection/PokemonNameField'
import { PokemonNotesField } from '~/components/calculator/PokemonInfoSection/PokemonNotesField'
import { PokemonIcon } from '~/components/icons/PokemonIcon'
import { Button } from '~/components/ui/Button'
import { CalcPokemonStatsProvider } from '~/context/CalcPokemonStatsContext'
import { useSpeciesAbilities } from '~/hooks/api/data'
import type { ChampionsPokemon, StatKey } from '~/types'

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
  const { speciesAbilities } = useSpeciesAbilities(draft.species)

  return (
    <div className="py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <PokemonIcon
            className="relative inline-block h-12 w-12 overflow-hidden rounded"
            species={draft.species}
          />
          <div>
            <h1 className="text-2xl font-bold">{name || draft.species}</h1>
            <p className="text-text-dim text-xs">/{slug}</p>
          </div>
        </div>
        <Button disabled>Save</Button>
      </div>

      <CalcPokemonStatsProvider
        value={{
          pokemon: draft,
          speciesAbilities: speciesAbilities ?? [],
          name,
          notes,
          collapsibleMoves: false,
          onSpeciesChange: (species) =>
            setDraft((d) => ({
              ...d,
              species: species as ChampionsPokemon['species'],
            })),
          onNatureChange: (nature) =>
            setDraft((d) => ({
              ...d,
              nature: nature as ChampionsPokemon['nature'],
            })),
          onAbilityChange: (ability) =>
            setDraft((d) => ({
              ...d,
              ability: ability as ChampionsPokemon['ability'],
            })),
          onItemChange: (item) =>
            setDraft((d) => ({
              ...d,
              item: (item || undefined) as ChampionsPokemon['item'],
            })),
          onStatPointChange: (stat: StatKey, value) =>
            setDraft((d) => ({
              ...d,
              statPoints: { ...d.statPoints, [stat]: value },
            })),
          onNameChange: setName,
          onNotesChange: setNotes,
          onMoveChange: (slot, move) =>
            setDraft((d) => {
              const moves = [...d.moves]
              moves[slot] = move
              return {
                ...d,
                moves: moves.filter(Boolean) as ChampionsPokemon['moves'],
              }
            }),
        }}
      >
        <div className="bg-surface flex flex-col gap-6 rounded-lg p-5 shadow-md">
          <section>
            <h2 className="text-text-dim mb-3 text-sm font-semibold uppercase">
              Identity
            </h2>
            <PokemonNameField />
            <PokemonNotesField />
          </section>

          <section>
            <h2 className="text-text-dim mb-3 text-sm font-semibold uppercase">
              Build
            </h2>
            <PokemonInfoSelectors />
          </section>

          <section>
            <h2 className="text-text-dim mb-3 text-sm font-semibold uppercase">
              Stat points
            </h2>
            <PokemonInfoStatPointInputs />
          </section>
        </div>
      </CalcPokemonStatsProvider>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/pokemon_/$slug')({
  component: PokemonEditorPage,
})
