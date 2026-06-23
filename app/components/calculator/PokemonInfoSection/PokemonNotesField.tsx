import { TextAreaField } from '~/components/fields/TextAreaField'

interface PokemonNotesFieldProps {
  value: string
  onChange: (notes: string) => void
}

export const PokemonNotesField = ({
  value,
  onChange,
}: PokemonNotesFieldProps) => (
  <div className="mb-3">
    <TextAreaField
      className="border-border bg-surface focus:border-primary focus:ring-primary/20 w-full resize-y rounded border px-2 py-1.5 text-sm focus:ring-2 focus:outline-none"
      label="Notes"
      placeholder="Notes..."
      rows={2}
      value={value}
      onChange={onChange}
    />
  </div>
)
