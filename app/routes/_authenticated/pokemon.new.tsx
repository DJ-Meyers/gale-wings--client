import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'

import { PokemonSelectField } from '~/components/fields/PokemonSelectField'
import { Button } from '~/components/ui/Button'
import { useCreatePokemon } from '~/hooks/api/pokemon'

const NewPokemonPage = () => {
  const navigate = useNavigate()
  const { createPokemon, isCreatePokemonPending } = useCreatePokemon()
  const [species, setSpecies] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const trimmed = species.trim()
    if (!trimmed) return
    createPokemon(
      { species: trimmed },
      {
        onSuccess: (created) => {
          if (!created) return
          navigate({
            to: '/pokemon/$slug',
            params: { slug: created.slug },
          })
        },
      },
    )
  }

  return (
    <div className="py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">New Pokémon</h1>
      </div>

      <form className="max-w-md space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label
            className="text-text-dim text-xs font-medium"
            htmlFor="species"
          >
            Species
          </label>
          <PokemonSelectField value={species} onChange={setSpecies} />
          <p className="text-text-muted text-xs">
            Creates an orphan Pokémon. You can add it to a team later.
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate({ to: '/pokemon' })}
          >
            Cancel
          </Button>
          <Button
            disabled={!species.trim() || isCreatePokemonPending}
            type="submit"
          >
            Create
          </Button>
        </div>
      </form>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/pokemon/new')({
  component: NewPokemonPage,
})
