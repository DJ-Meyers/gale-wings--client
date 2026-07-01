import { AccountButton } from '~/components/ui/AccountButton'
import { PokemonNavLink } from '~/components/ui/PokemonNavLink'
import { SiteTitle } from '~/components/ui/SiteTitle'
import { TeamsNavLink } from '~/components/ui/TeamsNavLink'
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
      <div
        className={`${CONTAINER} flex items-center justify-between gap-4 py-3`}
      >
        <div className="flex items-center gap-6">
          <SiteTitle />
          <nav className="flex items-center gap-4">
            <TeamsNavLink />
            <PokemonNavLink />
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <AccountButton />
        </div>
      </div>
    </header>

    <main className={`${CONTAINER} flex-1`}>{children}</main>

    <footer className="mt-auto">
      <div className={`${CONTAINER} py-6`} />
    </footer>
  </div>
)
