export const CritIcon = ({ className }: { className?: string }) => (
  <svg
    className={className ?? 'h-4 w-4'}
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
)
