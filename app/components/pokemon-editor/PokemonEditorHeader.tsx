import { PokemonIcon } from '~/components/icons/PokemonIcon'
import { Button } from '~/components/ui/Button'

interface PokemonEditorHeaderProps {
  species: string
  displayName: string
  slug: string
  onSave?: () => void
  saveDisabled?: boolean
  isSaving?: boolean
  error?: string
}

export const PokemonEditorHeader = ({
  species,
  displayName,
  slug,
  onSave,
  saveDisabled = true,
  isSaving = false,
  error,
}: PokemonEditorHeaderProps) => {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <PokemonIcon
          className="relative inline-block h-12 w-12 overflow-hidden rounded"
          species={species}
        />
        <div>
          <h1 className="text-2xl font-bold">{displayName}</h1>
          <p className="text-text-dim text-xs">/{slug}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button disabled={saveDisabled} onClick={onSave}>
          {isSaving ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </div>
  )
}
