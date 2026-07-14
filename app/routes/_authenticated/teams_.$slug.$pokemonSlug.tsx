import { useStore } from '@tanstack/react-form'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

import { ChevronUpIcon } from '~/components/icons'
import {
  PokemonEditorForm,
  usePokemonEditorForm,
  type PokemonEditorFormValues,
} from '~/components/pokemon-editor/PokemonEditorForm'
import { useTeamDraft, type DraftEntry } from '~/context/TeamDraftContext'

// Edits one team pokemon within the shared team draft. There's no per-pokemon
// Save: changes flow live into the draft and are committed with the whole team
// via the Save button in the team header (the parent layout stays mounted, so
// the draft — and this edit — survive navigating here and back).
const TeamPokemonEditorPage = () => {
  const { slug, pokemonSlug } = Route.useParams()
  const { findBySlug, updateEntryValues } = useTeamDraft()
  const entry = findBySlug(pokemonSlug)

  const backLink = (
    <Link
      className="text-primary hover:text-primary-hover mb-4 inline-flex items-center gap-1 text-sm"
      params={{ slug }}
      to="/teams/$slug"
    >
      <ChevronUpIcon className="h-3.5 w-3.5 -rotate-90" />
      Back to team
    </Link>
  )

  if (!entry) {
    return (
      <div>
        {backLink}
        <p className="text-text-dim text-sm">
          That Pokémon isn’t in this team’s draft.
        </p>
      </div>
    )
  }

  return (
    <div>
      {backLink}
      {/* key on the entry so the form re-initializes when switching pokemon */}
      <TeamPokemonEditorForm
        key={entry.key}
        entry={entry}
        onChange={updateEntryValues}
      />
    </div>
  )
}

interface TeamPokemonEditorFormProps {
  entry: DraftEntry
  onChange: (key: string, values: PokemonEditorFormValues) => void
}

const TeamPokemonEditorForm = ({
  entry,
  onChange,
}: TeamPokemonEditorFormProps) => {
  const form = usePokemonEditorForm({ defaultValues: entry.values })

  // Push edits into the shared draft as the form changes. `defaultValues` seeds
  // the form once (component is keyed by entry.key), so writing back to the
  // draft doesn't reset it — no loop.
  const values = useStore(form.store, (s) => s.values)
  useEffect(() => {
    onChange(entry.key, values)
  }, [values, entry.key, onChange])

  const displayName = entry.values.name || entry.values.pokemon.species

  return (
    <div>
      <h2 className="text-text-heading mb-3 text-lg font-semibold">
        {displayName}
      </h2>
      <PokemonEditorForm form={form} />
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/teams_/$slug/$pokemonSlug')(
  {
    component: TeamPokemonEditorPage,
  },
)
