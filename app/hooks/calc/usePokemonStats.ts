import { useContext } from 'react'

import { CalcPokemonStatsContext } from '~/context/CalcPokemonStatsContext'

export const usePokemonStats = () => {
  const ctx = useContext(CalcPokemonStatsContext)
  if (!ctx)
    throw new Error(
      'usePokemonStats must be used inside CalcPokemonStatsProvider',
    )
  return ctx
}
