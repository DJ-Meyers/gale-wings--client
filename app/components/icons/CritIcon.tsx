import { IconChip } from './IconChip'

export const CritIcon = () => (
  <IconChip color="#F59E0B" title="Critical Hit" className="text-white">
    <svg
      className="h-[1em] w-[1em]"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="7" />
      <path d="M12 2 V5" />
      <path d="M12 19 V22" />
      <path d="M2 12 H5" />
      <path d="M19 12 H22" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  </IconChip>
)
