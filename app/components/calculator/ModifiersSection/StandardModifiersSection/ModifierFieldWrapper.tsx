import type { ReactNode } from 'react'

export const ModifierFieldWrapper = ({ children }: { children: ReactNode }) => (
  <div className="min-w-[120px] flex-1 basis-[120px]">{children}</div>
)
