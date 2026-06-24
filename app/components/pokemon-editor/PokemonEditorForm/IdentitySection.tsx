import { TextAreaField } from '~/components/fields/TextAreaField'
import { TextField } from '~/components/fields/TextField'

import { SectionHeading } from './SectionHeading'
import type { PokemonEditorFormApi } from './usePokemonEditorForm'

const nameInputClass =
  'border-border bg-surface focus:border-primary focus:ring-primary/20 w-full rounded border px-2 py-1.5 text-sm focus:ring-2 focus:outline-none'

const notesInputClass =
  'border-border bg-surface focus:border-primary focus:ring-primary/20 w-full resize-y rounded border px-2 py-1.5 text-sm focus:ring-2 focus:outline-none'

interface IdentitySectionProps {
  form: PokemonEditorFormApi
}

export const IdentitySection = ({ form }: IdentitySectionProps) => (
  <section>
    <SectionHeading>Identity</SectionHeading>
    <form.Field name="name">
      {(field) => (
        <TextField
          className={nameInputClass}
          label="Name"
          placeholder="e.g. Standard Ursh"
          value={field.state.value}
          onChange={field.handleChange}
        />
      )}
    </form.Field>
    <form.Field name="notes">
      {(field) => (
        <TextAreaField
          className={notesInputClass}
          label="Notes"
          placeholder="Notes..."
          rows={2}
          value={field.state.value}
          onChange={field.handleChange}
        />
      )}
    </form.Field>
  </section>
)
