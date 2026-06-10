import { IconChip } from './IconChip'

// Allies fainted (Last Respects / Supreme Overlord).
export const HeadstoneIcon = () => (
  <IconChip color="#64748B" title="Allies fainted" className="text-white">
    <svg
      className="h-[1em] w-[1em]"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M7 19V11a5 5 0 0 1 10 0v8" />
      <path d="M5 19h14" />
      <path d="M12 9v4M10 11h4" />
    </svg>
  </IconChip>
)
