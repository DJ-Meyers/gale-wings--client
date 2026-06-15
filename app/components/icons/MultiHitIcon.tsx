import { IconChip } from './IconChip'

// Multi-hit selector — shows the move's hit range (e.g. "2-5" for Icicle Spear,
// "1-10" for Population Bomb) in the same square chip the other toggle icons
// use, so it lines up with Doubler / Allies fainted rather than stretching the
// row. No chip-level `title`: it always renders inside a ToggleIconButton whose
// title ("Number of hits: N") a chip title would shadow on hover. The currently
// chosen count shows in the CountControl's corner badge.
export const MultiHitIcon = ({ min, max }: { min: number; max: number }) => (
  <IconChip color="#0EA5E9" className="text-white">
    <span className="text-[0.5em] leading-none font-bold tracking-tight tabular-nums">
      {min}-{max}
    </span>
  </IconChip>
)
