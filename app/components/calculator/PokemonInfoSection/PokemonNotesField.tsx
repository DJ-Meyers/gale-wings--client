import { TextAreaField } from '~/components/fields/TextAreaField'
import { usePokemonStats } from '~/hooks/calc/usePokemonStats'

export const PokemonNotesField = () => {
  const { notes, onNotesChange } = usePokemonStats()

  if (!onNotesChange) return null

  return (
    <div className="mb-3">
      <TextAreaField
        className="border-border bg-surface focus:border-primary focus:ring-primary/20 w-full resize-y rounded border px-2 py-1.5 text-sm focus:ring-2 focus:outline-none"
        label="Notes"
        placeholder="Notes..."
        rows={2}
        value={notes}
        onChange={onNotesChange}
      />
    </div>
  )
}
