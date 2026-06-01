export const CalculatorIcon = ({ className }: { className?: string }) => (
  <svg
    className={className ?? 'h-4 w-4'}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <rect height="20" rx="2" width="16" x="4" y="2" />
    <rect fill="currentColor" height="3" width="8" x="8" y="5" />
    <path d="M8 12h.01" />
    <path d="M12 12h.01" />
    <path d="M16 12h.01" />
    <path d="M8 15h.01" />
    <path d="M12 15h.01" />
    <path d="M16 15h.01" />
    <path d="M8 18h.01" />
    <path d="M12 18h.01" />
    <path d="M16 18h.01" />
  </svg>
)
