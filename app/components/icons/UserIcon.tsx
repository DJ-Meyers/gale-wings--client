export const UserIcon = ({ className }: { className?: string }) => (
  <svg
    aria-hidden="true"
    className={className ?? 'h-4 w-4'}
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
    <path d="M12 14c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" />
  </svg>
)
