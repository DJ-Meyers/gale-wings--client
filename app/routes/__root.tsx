import { Outlet, createRootRoute } from '@tanstack/react-router'

import '~/index.css'

const RootComponent = () => (
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <Outlet />
  </div>
)

export const Route = createRootRoute({
  component: RootComponent,
})
