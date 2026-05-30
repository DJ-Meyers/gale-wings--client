import { useEffect, useRef, useState } from 'react'

import { Button } from '~/components/ui/Button'

interface BaseProperties {
  open: boolean
  onCancel: () => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
}

interface WithCheckboxProperties extends BaseProperties {
  checkboxLabel: string
  onConfirmWithCheckbox: (checked: boolean) => void
  onConfirm?: never
}

interface WithoutCheckboxProperties extends BaseProperties {
  checkboxLabel?: never
  onConfirm: () => void
  onConfirmWithCheckbox?: never
}

type Properties = WithCheckboxProperties | WithoutCheckboxProperties

export const ConfirmDialog = ({
  open,
  onCancel,
  title,
  description,
  confirmLabel,
  cancelLabel,
  destructive,
  checkboxLabel,
  onConfirmWithCheckbox,
  onConfirm,
}: Properties) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  const handleConfirm = () => {
    if (onConfirmWithCheckbox) {
      onConfirmWithCheckbox(checked)
    } else {
      onConfirm?.()
    }
  }

  return (
    <dialog
      className="bg-detail-bg m-auto overflow-hidden rounded-lg p-0 backdrop:bg-black/50"
      ref={dialogRef}
      onClose={onCancel}
    >
      <div className="max-w-sm p-6">
        <h2 className="text-text-heading mb-2 text-lg font-semibold">
          {title}
        </h2>
        <p className="text-text-dim mb-6 text-sm">{description}</p>
        {checkboxLabel && (
          <label className="text-text-dim mb-6 flex cursor-pointer items-center gap-2 text-sm">
            <input
              checked={checked}
              className="accent-primary"
              type="checkbox"
              onChange={(e) => setChecked(e.target.checked)}
            />
            {checkboxLabel}
          </label>
        )}
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel ?? 'Cancel'}
          </Button>
          <Button
            variant={destructive ? 'danger' : 'primary'}
            onClick={handleConfirm}
          >
            {confirmLabel ?? 'Confirm'}
          </Button>
        </div>
      </div>
    </dialog>
  )
}
