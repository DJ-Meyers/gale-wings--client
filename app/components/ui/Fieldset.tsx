import type { ReactNode } from 'react'

interface Properties {
  legend: string
  className?: string
  children: ReactNode
}

export const Fieldset = ({ legend, className, children }: Properties) => (
  <fieldset
    className={`border-border-section flex flex-wrap gap-x-2.5 gap-y-1 rounded border px-2 pt-1 pb-1.5 ${className ?? ''}`}
  >
    <legend className="text-text-dim px-1 text-[0.7rem] font-semibold">
      {legend}
    </legend>
    {children}
  </fieldset>
)
