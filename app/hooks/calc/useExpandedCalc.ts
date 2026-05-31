import { useCalcStore } from '~/calc/store'

export const useExpandedCalc = () => {
  const expandedId = useCalcStore((s) => s.expandedCalcId)
  const setExpandedId = useCalcStore((s) => s.setExpandedId)
  return { expandedId, setExpandedId }
}
