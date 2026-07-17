import { useState, type KeyboardEvent } from 'react'

import { FIELD_LABEL_CLASS } from '~/components/fields/FieldLabel'
import { XIcon } from '~/components/icons'
import {
  MAX_TEAM_TAGS,
  MAX_TEAM_TAG_LENGTH,
  useTeamDraft,
} from '~/context/TeamDraftContext'

// Add/remove team tags on the detail page. Tags live in the team draft, so
// edits mark the draft dirty and commit with the single team save (no separate
// mutation). Enter or comma commits the pending input; Backspace on an empty
// input removes the last tag.
export const TeamTagsEditor = () => {
  const { tags, addTag, removeTag } = useTeamDraft()
  const [draft, setDraft] = useState('')
  const atLimit = tags.length >= MAX_TEAM_TAGS

  const commit = () => {
    if (addTag(draft)) setDraft('')
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      commit()
    } else if (event.key === 'Backspace' && draft === '' && tags.length > 0) {
      removeTag(tags[tags.length - 1])
    }
  }

  return (
    <div className="min-w-0 flex-1 space-y-1.5">
      <label className={FIELD_LABEL_CLASS} htmlFor="team-tags">
        Tags
      </label>
      {/* Mirrors the Team Name field's primary left-accent + focus treatment.
          At the tag limit the field is disabled (not hidden) so it stays in
          place, with the placeholder explaining why. */}
      <input
        className="bg-slate border-l-primary focus:ring-primary focus:shadow-[0_0_16px_-6px_var(--color-primary)] block w-full max-w-[250px] rounded border-l-2 px-2 py-1 text-xs transition-shadow duration-150 focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
        disabled={atLimit}
        id="team-tags"
        maxLength={MAX_TEAM_TAG_LENGTH}
        placeholder={
          atLimit
            ? `Max ${MAX_TEAM_TAGS} tags`
            : tags.length === 0
              ? 'Add a tag…'
              : 'Add…'
        }
        value={draft}
        onBlur={commit}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={onKeyDown}
      />
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-slate inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium"
            >
              {tag}
              <button
                aria-label={`Remove ${tag}`}
                className="text-text-dim hover:text-text-heading"
                type="button"
                onClick={() => removeTag(tag)}
              >
                <XIcon className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
