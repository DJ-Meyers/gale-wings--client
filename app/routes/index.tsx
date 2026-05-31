import { createFileRoute, Link } from '@tanstack/react-router'

const IndexPage = () => (
  <div className="mx-auto max-w-[1400px] py-6">
    <header className="mb-4">
      <h1 className="text-3xl font-bold">Galewings</h1>
      <p className="text-text-muted text-sm">
        VGC damage calculator. Text-to-Pokémon vs-input lands here in a follow-up.
      </p>
    </header>
    <p className="text-sm">
      The legacy calculator sandbox now lives at{' '}
      <Link to="/sandbox" className="underline">
        /sandbox
      </Link>
      .
    </p>
  </div>
)

export const Route = createFileRoute('/')({
  component: IndexPage,
})
