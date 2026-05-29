import { PokemonNameField } from '~/components/calculator/PokemonInfoSection/PokemonNameField'
import { PokemonNotesField } from '~/components/calculator/PokemonInfoSection/PokemonNotesField'
import { PokemonWithItemIcon } from '~/components/icons/PokemonWithItemIcon'
import { usePokemonStats } from '~/hooks/calc/usePokemonStats'

export const PokemonInfoNameNotes = () => {
  const { pokemon } = usePokemonStats()
  const { species, item } = pokemon

  return (
    <>
      <div className="mb-3 flex items-center gap-6">
        <div className="-mt-2">
          <PokemonWithItemIcon item={item} species={species} />
        </div>
        <PokemonNameField />
      </div>
      <PokemonNotesField />
    </>
  )
}
