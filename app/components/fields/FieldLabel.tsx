interface Properties {
  children: React.ReactNode
}

export const FIELD_LABEL_CLASS =
  'text-text-muted mb-1 block text-xs font-semibold'

export const FieldLabel = ({ children }: Properties) => (
  <label className={FIELD_LABEL_CLASS}>{children}</label>
)
