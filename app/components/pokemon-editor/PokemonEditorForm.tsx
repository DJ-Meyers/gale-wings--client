import { PokemonInfoSelectors } from '~/components/calculator/PokemonInfoSection/PokemonInfoSelectors'
import { PokemonInfoStatPointInputs } from '~/components/calculator/PokemonInfoSection/PokemonInfoStatPointInputs'
import { PokemonNameField } from '~/components/calculator/PokemonInfoSection/PokemonNameField'
import { PokemonNotesField } from '~/components/calculator/PokemonInfoSection/PokemonNotesField'
import { CalcPokemonStatsProvider } from '~/context/CalcPokemonStatsContext'
import { useSpeciesAbilities } from '~/hooks/api/data'
import type { ChampionsPokemon, StatKey } from '~/types'

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
    <CalcPokemonStatsProvider
      value={{
        pokemon,
        speciesAbilities: speciesAbilities ?? [],
        name,
        notes,
        collapsibleMoves: false,
        onSpeciesChange: (species) =>
          onPokemonChange({
            species: species as ChampionsPokemon['species'],
          }),
        onNatureChange: (nature) =>
          onPokemonChange({
            nature: nature as ChampionsPokemon['nature'],
          }),
        onAbilityChange: (ability) =>
          onPokemonChange({
            ability: ability as ChampionsPokemon['ability'],
          }),
        onItemChange: (item) =>
          onPokemonChange({
            item: (item || undefined) as ChampionsPokemon['item'],
          }),
        onStatPointChange: (stat: StatKey, value) =>
          onPokemonChange({
            statPoints: { ...pokemon.statPoints, [stat]: value },
          }),
        onNameChange,
        onNotesChange,
        onMoveChange: (slot, move) => {
          const moves = [...pokemon.moves] as string[]
          moves[slot] = move
          onPokemonChange({
            moves: moves.filter(Boolean) as ChampionsPokemon['moves'],
          })
        },
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
  )
}
