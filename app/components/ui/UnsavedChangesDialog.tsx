import { ConfirmDialog } from '~/components/ui/ConfirmDialog'
import { useSuppressUnsavedWarning } from '~/hooks/useSuppressUnsavedWarning'

interface Properties {
  open: boolean
  onDiscard: () => void
  onStay: () => void
}

export const UnsavedChangesDialog = ({
  open,
  onDiscard,
  onStay,
}: Properties) => {
  const { setSuppressed } = useSuppressUnsavedWarning()

  const handleConfirm = (checked: boolean) => {
    if (checked) setSuppressed(true)
    onDiscard()
  }

  return (
    <ConfirmDialog
      destructive
      cancelLabel="Cancel"
      checkboxLabel="Don't remind me again"
      confirmLabel="Discard"
      description="You have unsaved changes that will be lost if you close this calc."
      open={open}
      title="Unsaved changes"
      onCancel={onStay}
      onConfirmWithCheckbox={handleConfirm}
    />
  )
}
