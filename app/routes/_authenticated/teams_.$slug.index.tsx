import { createFileRoute } from '@tanstack/react-router'

import { TeamPokemonList } from '~/components/teams/TeamPokemonList'
import { useSaveToLibrary } from '~/hooks/api/pokemon'

// The team's roster, driven by the shared draft (see TeamDraftProvider in the
// parent layout). Renders inside the team detail <Outlet/>.
const TeamRosterView = () => {
  const { slug } = Route.useParams()
  const { saveToLibrary } = useSaveToLibrary()
  return (
    <TeamPokemonList
      teamSlug={slug}
      onSaveToLibrary={(pokemonId) => saveToLibrary({ pokemonId })}
    />
  )
}

export const Route = createFileRoute('/_authenticated/teams_/$slug/')({
  component: TeamRosterView,
})
