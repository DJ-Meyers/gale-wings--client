import { PokemonInfoSelectors } from '~/components/calculator/PokemonInfoSection/PokemonInfoSelectors'
import { PokemonInfoStatPointInputs } from '~/components/calculator/PokemonInfoSection/PokemonInfoStatPointInputs'
import { PokemonNameField } from '~/components/calculator/PokemonInfoSection/PokemonNameField'
import { PokemonNotesField } from '~/components/calculator/PokemonInfoSection/PokemonNotesField'
import { useSpeciesAbilities } from '~/hooks/api/data'
import type { ChampionsPokemon } from '~/types'

interface PokemonEditorFormProps {
  pokemon: ChampionsPokemon
  name: string
  notes: string
  onPokemonChange: (patch: Partial<ChampionsPokemon>) => void
  onNameChange: (name: string) => void
  onNotesChange: (notes: string) => void
}

export const PokemonEditorForm = ({
  pokemon,
  name,
  notes,
  onPokemonChange,
  onNameChange,
  onNotesChange,
}: PokemonEditorFormProps) => {
  const { speciesAbilities } = useSpeciesAbilities(pokemon.species)

  return (
    <div className="bg-surface flex flex-col gap-6 rounded-lg p-5 shadow-md">
      <section>
        <h2 className="text-text-dim mb-3 text-sm font-semibold uppercase">
          Identity
        </h2>
        <PokemonNameField value={name} onChange={onNameChange} />
        <PokemonNotesField value={notes} onChange={onNotesChange} />
      </section>

      <section>
        <h2 className="text-text-dim mb-3 text-sm font-semibold uppercase">
          Build
        </h2>
        <PokemonInfoSelectors
          pokemon={pokemon}
          speciesAbilities={speciesAbilities ?? []}
          onAbilityChange={(ability) =>
            onPokemonChange({
              ability: ability as ChampionsPokemon['ability'],
            })
          }
          onItemChange={(item) =>
            onPokemonChange({
              item: (item || undefined) as ChampionsPokemon['item'],
            })
          }
          onMoveChange={(slot, move) => {
            const moves = [...pokemon.moves] as string[]
            moves[slot] = move
            onPokemonChange({
              moves: moves.filter(Boolean) as ChampionsPokemon['moves'],
            })
          }}
          onNatureChange={(nature) =>
            onPokemonChange({
              nature: nature as ChampionsPokemon['nature'],
            })
          }
          onSpeciesChange={(species) =>
            onPokemonChange({
              species: species as ChampionsPokemon['species'],
            })
          }
        />
      </section>

      <section>
        <h2 className="text-text-dim mb-3 text-sm font-semibold uppercase">
          Stat points
        </h2>
        <PokemonInfoStatPointInputs
          pokemon={pokemon}
          onStatPointChange={(stat, value) =>
            onPokemonChange({
              statPoints: { ...pokemon.statPoints, [stat]: value },
            })
          }
        />
      </section>
    </div>
  )
}
