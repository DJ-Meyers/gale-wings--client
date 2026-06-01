export const SwapIcon = ({ className }: { className?: string }) => (
  <svg
    className={className ?? 'h-4 w-4'}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M4 8h16" />
    <path d="M16 4l4 4-4 4" />
    <path d="M20 16H4" />
    <path d="M8 12l-4 4 4 4" />
  </svg>
)
