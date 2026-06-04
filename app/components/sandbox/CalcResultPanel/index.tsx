import { KO_TIER_ACCENT_OFFENSIVE } from '~/calc/classify-ko-range'
import { useSandboxStore } from '~/sandbox/store'

import { CalcSummarySection } from './CalcSummarySection'
import { CalcToggleSection } from './CalcToggleSection'

// Parent shell for the calc result. It only organizes and positions its two
// self-contained children — the summary (which runs the calc and renders the
// outcome) and the toggles (which edit field conditions). The one calc-derived
// value it touches is the KO tier the summary publishes to the store, used
// purely to color the left-edge accent.
export const CalcResultPanel = () => {
  const koTier = useSandboxStore((s) => s.koTier)
  const accent =
    koTier == null ? 'border-l-border' : KO_TIER_ACCENT_OFFENSIVE[koTier]

  return (
    <div
      className={`bg-surface mt-2 rounded-md border border-l-4 p-3.5 shadow-md ${accent} border-y-border border-r-border`}
    >
      <CalcSummarySection />
      <CalcToggleSection />
    </div>
  )
}
