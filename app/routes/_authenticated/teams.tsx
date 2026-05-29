import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { useTRPC } from '~/trpc/client'

const TeamsPage = () => {
  const trpc = useTRPC()
  const me = useQuery(trpc.user.me.queryOptions())

  return (
    <div className="py-8">
      <h1 className="mb-4 text-2xl font-bold">Teams</h1>
      <pre className="bg-surface rounded p-4 text-sm">
        {me.isPending ? 'Loading user.me…' : null}
        {me.error ? `Error: ${me.error.message}` : null}
        {me.data ? JSON.stringify(me.data, null, 2) : null}
      </pre>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/teams')({
  component: TeamsPage,
})
