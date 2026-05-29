import { createFileRoute } from '@tanstack/react-router'

const IndexPage = () => (
  <div className="py-12 text-center">
    <h1 className="mb-3 text-4xl font-bold">Galewings</h1>
    <p className="text-text-muted mx-auto mb-6 max-w-[600px] text-lg">
      A VGC damage calculator built for teambuilding.
    </p>
    <button
      className="bg-primary hover:bg-primary-hover rounded px-5 py-2 font-semibold text-white"
      type="button"
    >
      Get Started
    </button>
  </div>
)

export const Route = createFileRoute('/')({
  component: IndexPage,
})
