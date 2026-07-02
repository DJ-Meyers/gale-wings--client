import type { SVGProps } from 'react'

const ChevronBase = ({
  points,
  className,
  ...props
}: SVGProps<SVGSVGElement> & { points: string }) => (
  <svg
    className={className ?? 'h-4 w-4'}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    {...props}
  >
    <polyline points={points} />
  </svg>
)

export const ChevronUpIcon = (props: SVGProps<SVGSVGElement>) => (
  <ChevronBase points="18 15 12 9 6 15" {...props} />
)

export const ChevronDownIcon = (props: SVGProps<SVGSVGElement>) => (
  <ChevronBase points="6 9 12 15 18 9" {...props} />
)
