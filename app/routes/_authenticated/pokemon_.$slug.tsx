import { useStore } from '@tanstack/react-form'
import {
  createFileRoute,
  useBlocker,
  useNavigate,
} from '@tanstack/react-router'
import { useEffect, useMemo } from 'react'

import {
  PokemonEditorForm,
  usePokemonEditorForm,
  type PokemonEditorFormValues,
} from '~/components/pokemon-editor/PokemonEditorForm'
import { PokemonEditorHeader } from '~/components/pokemon-editor/PokemonEditorHeader'
import { UnsavedChangesDialog } from '~/components/ui/UnsavedChangesDialog'
import { useGetPokemonBySlug, useUpdatePokemon } from '~/hooks/api/pokemon'
import { useSuppressUnsavedWarning } from '~/hooks/useSuppressUnsavedWarning'

type LoadedPokemon = NonNullable<
  ReturnType<typeof useGetPokemonBySlug>['pokemon']
>

const toFormValues = (row: LoadedPokemon): PokemonEditorFormValues => ({
  name: row.name,
  notes: row.notes,
  pokemon: {
    species: row.species,
    nature: row.nature || 'Serious',
    ability: row.ability,
    item: row.item || undefined,
    statPoints: row.statPoints,
    moves: row.moves ?? [],
    ...(row.ivs ? { ivs: row.ivs } : {}),
  },
})

const PokemonEditorPage = () => {
  const { slug } = Route.useParams()
  const { pokemon: serverPokemon, isPokemonPending, pokemonError } =
    useGetPokemonBySlug(slug)

  if (isPokemonPending) {
    return <p className="text-text-dim py-8 text-sm">Loading…</p>
  }
  if (pokemonError) {
    return (
      <p className="py-8 text-sm text-red-500">
        Failed to load Pokémon: {pokemonError.message}
      </p>
    )
  }
  if (!serverPokemon) {
    return <p className="text-text-dim py-8 text-sm">Pokémon not found.</p>
  }

  return <PokemonEditorView slug={slug} serverPokemon={serverPokemon} />
}

interface PokemonEditorViewProps {
  slug: string
  serverPokemon: LoadedPokemon
}

const PokemonEditorView = ({ slug, serverPokemon }: PokemonEditorViewProps) => {
  const navigate = useNavigate()
  const { updatePokemon, isUpdatePokemonPending, updatePokemonError } =
    useUpdatePokemon()
  const { suppressed } = useSuppressUnsavedWarning()

  const baseline = useMemo(() => toFormValues(serverPokemon), [serverPokemon])

  const form = usePokemonEditorForm({
    defaultValues: baseline,
    onSubmit: ({ name, notes, pokemon }) => {
      const moves = pokemon.moves.filter(Boolean) as string[]
      updatePokemon(
        {
          id: serverPokemon.id,
          name,
          notes,
          species: pokemon.species,
          nature: pokemon.nature,
          ability: pokemon.ability,
          item: pokemon.item ?? '',
          moves,
          statPoints: pokemon.statPoints,
        },
        {
          onSuccess: (updated) => {
            if (updated && updated.slug !== slug) {
              navigate({
                to: '/pokemon/$slug',
                params: { slug: updated.slug },
                replace: true,
              })
            }
          },
        },
      )
    },
  })

  // Re-sync the form when a new server payload arrives (after save, after slug
  // navigation, after a refetch).
  useEffect(() => {
    form.reset(baseline)
  }, [baseline, form])

  // useBlocker + beforeunload guard on isDirty (warn about any unsaved change);
  // the Save button gates on canSubmit (dirty AND passes schema validation).
  const isDirty = useStore(form.store, (s) => s.isDirty)
  const canSubmit = useStore(form.store, (s) => s.canSubmit)

  useEffect(() => {
    if (!isDirty) return
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault()
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty])

  const { proceed, reset, status } = useBlocker({
    shouldBlockFn: () => isDirty && !suppressed,
    withResolver: true,
  })
  const showUnsaved = status === 'blocked'

  return (
    <div className="py-8">
      <form.Subscribe
        selector={(s) => ({
          name: s.values.name,
          species: s.values.pokemon.species,
        })}
      >
        {({ name, species }) => (
          <PokemonEditorHeader
            displayName={name || species}
            error={updatePokemonError?.message}
            isSaving={isUpdatePokemonPending}
            saveDisabled={!canSubmit || isUpdatePokemonPending}
            slug={slug}
            species={species}
            onSave={() => form.handleSubmit()}
          />
        )}
      </form.Subscribe>
      <PokemonEditorForm form={form} />
      <UnsavedChangesDialog
        open={showUnsaved}
        onDiscard={() => proceed?.()}
        onStay={() => reset?.()}
      />
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/pokemon_/$slug')({
  component: PokemonEditorPage,
})
