import { useStore } from '@tanstack/react-form'

import { MoveSelectField } from '~/components/fields/MoveSelectField'
import { useLearnableMoves } from '~/hooks/useLearnableMoves'
import type { ChampionsPokemon } from '~/types'

import { SectionHeading } from './SectionHeading'
import type { PokemonEditorFormApi } from './usePokemonEditorForm'

interface MovesSectionProps {
  form: PokemonEditorFormApi
}

export const MovesSection = ({ form }: MovesSectionProps) => {
  const species = useStore(form.store, (s) => s.values.pokemon.species)
  const { learnableMoves } = useLearnableMoves(species)

  return (
    <section>
      <SectionHeading>Moves</SectionHeading>
      <form.Field name="pokemon.moves">
        {(field) => (
          <div className="flex flex-col gap-1">
            {[0, 1, 2, 3].map((slot) => (
              <MoveSelectField
                key={slot}
                label={`Move ${slot + 1}`}
                options={learnableMoves ?? []}
                value={field.state.value[slot] ?? ''}
                onChange={(m) => {
                  const moves = [...field.state.value] as string[]
                  moves[slot] = m
                  field.handleChange(
                    moves.filter(Boolean) as ChampionsPokemon['moves'],
                  )
                }}
              />
            ))}
          </div>
        )}
      </form.Field>
    </section>
  )
}
