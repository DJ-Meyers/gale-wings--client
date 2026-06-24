interface SectionHeadingProps {
  children: React.ReactNode
}

export const SectionHeading = ({ children }: SectionHeadingProps) => (
  <h2 className="text-text-dim mb-3 text-sm font-semibold uppercase">
    {children}
  </h2>
)
