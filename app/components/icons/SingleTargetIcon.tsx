import { IconChip } from './IconChip'

export const SingleTargetIcon = () => (
  <IconChip color="#8B5CF6" title="Single Target" className="text-white">
    <svg
      className="h-[1em] w-[1em]"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1"
      viewBox="0 0 24 24"
    >
      <circle cx="5" cy="6" r="3" />
      <path d="M3.5 4.5 L6.5 7.5" />
      <path d="M6.5 4.5 L3.5 7.5" />
      <circle cx="19" cy="6" r="3" fill="currentColor" />
      <circle cx="12" cy="19" r="3" fill="currentColor" />
      <path d="M10.1 15.5 L6.9 9.5" />
      <path d="M6.7 11.5 L6.9 9.5 L8.7 10.4" />
      <path d="M13.9 15.5 L17.1 9.5" />
      <path d="M15.3 10.4 L17.1 9.5 L17.3 11.5" />
    </svg>
  </IconChip>
)
