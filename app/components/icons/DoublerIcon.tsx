import { IconChip } from './IconChip'

// Generic "×2" toggle for moves that double in power when a battle-history
// condition the calc can't see is met (Avalanche, Assurance, Stomping Tantrum,
// …). One chip stands in for every such condition — the specific trigger lives
// in the toggle's tooltip. No chip-level `title`: this always renders inside a
// ToggleIconButton, whose `title` carries the move-specific trigger text; a
// chip title here would shadow it on hover.
export const DoublerIcon = () => (
  <IconChip color="#EA580C" className="text-white">
    <span className="text-[0.72em] font-bold tracking-tight tabular-nums">
      2×
    </span>
  </IconChip>
)
