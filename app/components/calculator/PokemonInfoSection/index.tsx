import { PokemonInfoNameNotes } from '~/components/calculator/PokemonInfoSection/PokemonInfoNameNotes'
import { PokemonInfoParseInput } from '~/components/calculator/PokemonInfoSection/PokemonInfoParseInput'
import { PokemonInfoSelectors } from '~/components/calculator/PokemonInfoSection/PokemonInfoSelectors'
import { PokemonInfoStatPointInputs } from '~/components/calculator/PokemonInfoSection/PokemonInfoStatPointInputs'
import { usePokemonStats } from '~/hooks/calc/usePokemonStats'

export const PokemonInfoSection = () => {
  const { compact } = usePokemonStats()

  return (
    <div
      className={
        compact ? 'flex-1' : 'bg-surface flex-1 rounded-lg p-5 shadow-md'
      }
    >
      <PokemonInfoNameNotes />
      <PokemonInfoParseInput />
      <PokemonInfoSelectors />
      <PokemonInfoStatPointInputs />
    </div>
  )
}
