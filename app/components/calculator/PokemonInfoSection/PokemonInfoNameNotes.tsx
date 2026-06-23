import { PokemonNameField } from '~/components/calculator/PokemonInfoSection/PokemonNameField'
import { PokemonNotesField } from '~/components/calculator/PokemonInfoSection/PokemonNotesField'
import { PokemonWithItemIcon } from '~/components/icons/PokemonWithItemIcon'
import type { ChampionsPokemon } from '~/types'

interface PokemonInfoNameNotesProps {
  pokemon: ChampionsPokemon
  name: string
  notes: string
  onNameChange: (name: string) => void
  onNotesChange: (notes: string) => void
}

export const PokemonInfoNameNotes = ({
  pokemon,
  name,
  notes,
  onNameChange,
  onNotesChange,
}: PokemonInfoNameNotesProps) => {
  const { species, item } = pokemon

  return (
    <>
      <div className="mb-3 flex items-center gap-6">
        <div className="-mt-2">
          <PokemonWithItemIcon item={item} species={species} />
        </div>
        <PokemonNameField value={name} onChange={onNameChange} />
      </div>
      <PokemonNotesField value={notes} onChange={onNotesChange} />
    </>
  )
}
