import { createContext, useContext } from 'react'

import type { CalcRowMode } from '~/calc/types'

export interface CalcRowContextValue {
  calcId: string
  mode: CalcRowMode
}

export const CalcRowContext = createContext<CalcRowContextValue | null>(null)

export const useCalcRowContext = (): CalcRowContextValue => {
  const ctx = useContext(CalcRowContext)
  if (!ctx)
    throw new Error('useCalcRowContext must be used inside CalcRowContext.Provider')
  return ctx
}
