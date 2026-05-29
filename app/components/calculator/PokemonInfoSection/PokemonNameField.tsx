import { TextField } from '~/components/fields/TextField'
import { usePokemonStats } from '~/hooks/calc/usePokemonStats'

export const PokemonNameField = () => {
  const { name, onNameChange } = usePokemonStats()

  if (!onNameChange) return null

  return (
    <div className="min-w-0 flex-1">
      <TextField
        className="border-border bg-surface focus:border-primary focus:ring-primary/20 w-full rounded border px-2 py-1.5 text-sm focus:ring-2 focus:outline-none"
        label="Name"
        placeholder="e.g. Standard Ursh"
        value={name}
        onChange={onNameChange}
      />
    </div>
  )
}
