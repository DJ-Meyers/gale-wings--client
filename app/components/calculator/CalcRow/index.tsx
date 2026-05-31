import { CalcModal } from '~/components/calculator/CalcRow/CalcModal'
import { CalcSummaryRow } from '~/components/calculator/CalcRow/CalcSummaryRow'
import { CalcRowContext } from '~/context/CalcRowContext'
import type { CalcRowMode } from '~/calc/types'

interface Properties {
  calcId: string
  mode: CalcRowMode
}

export const CalcRow = ({ calcId, mode }: Properties) => (
  <CalcRowContext.Provider value={{ calcId, mode }}>
    <CalcSummaryRow />
    <CalcModal />
  </CalcRowContext.Provider>
)
