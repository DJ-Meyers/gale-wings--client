import { Link } from '@tanstack/react-router'

import { ThemeToggle } from '~/components/ui/ThemeToggle'

// Shared page chrome. Matches the container the root previously applied so no
// page's effective width changes; pages keep their own inner padding/widths.
const CONTAINER = 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8'

interface Properties {
  children: React.ReactNode
}

export const Layout = ({ children }: Properties) => (
  <div className="flex min-h-screen flex-col">
    <header>
      <div className={`${CONTAINER} flex items-center justify-between gap-2 py-3`}>
        <Link
          to="/"
          className="from-accent via-primary via-80% to-red light:bg-linear-to-tl inline-block bg-linear-to-br bg-clip-text text-2xl leading-tight font-bold text-transparent"
        >
          Gale Wings
        </Link>
        <ThemeToggle />
      </div>
    </header>

    <main className={`${CONTAINER} flex-1`}>{children}</main>

    <footer className="mt-auto">
      <div className={`${CONTAINER} py-6`} />
    </footer>
  </div>
)
