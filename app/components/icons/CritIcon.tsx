export const CritIcon = () => (
  <span
    className="mx-[0.1em] inline-flex items-center justify-center rounded-sm align-[-0.15em] text-white"
    style={{ backgroundColor: '#F59E0B', width: '1.3em', height: '1.3em' }}
    title="Critical Hit"
  >
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
  </span>
)
