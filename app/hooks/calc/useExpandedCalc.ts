import { useSandboxStore } from '~/sandbox/store'

export const useExpandedCalc = () => {
  const expandedId = useSandboxStore((s) => s.expandedCalcId)
  const setExpandedId = useSandboxStore((s) => s.setExpandedId)
  return { expandedId, setExpandedId }
}
