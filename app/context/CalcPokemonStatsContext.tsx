import { createContext } from 'react'

import type { ChampionsPokemon, StatKey } from '~/types'

export interface CalcPokemonStatsContextValue {
  pokemon: ChampionsPokemon
  speciesAbilities: string[]
  name: string
  notes: string
  compact?: boolean
  collapsibleMoves?: boolean
  onSpeciesChange: (species: string) => void
  onNatureChange: (nature: string) => void
  onAbilityChange: (ability: string) => void
  onItemChange: (item: string) => void
  onStatPointChange: (stat: StatKey, value: number) => void
  onNameChange?: (name: string) => void
  onNotesChange?: (notes: string) => void
  onMoveChange?: (slot: number, move: string) => void
  moveOverride?: {
    value: string
    onChange: (move: string) => void
    disabled?: boolean
    options?: string[]
  }
}

export const CalcPokemonStatsContext =
  createContext<CalcPokemonStatsContextValue | null>(null)
export const CalcPokemonStatsProvider = CalcPokemonStatsContext.Provider
