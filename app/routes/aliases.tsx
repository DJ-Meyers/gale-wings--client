import { createFileRoute } from '@tanstack/react-router'

import { AliasSearch } from '~/components/aliases/AliasSearch'

const AliasesPage = () => (
  <div className="mx-auto max-w-[900px]">
    <header className="mb-4">
      <h1 className="text-3xl font-bold">Aliases</h1>
      <p className="text-text-muted text-sm">
        Search any move, item, or species by its name or a shorthand alias.
      </p>
    </header>
    <AliasSearch />
  </div>
)

export const Route = createFileRoute('/aliases')({
  component: AliasesPage,
})
