// Single source of truth for the calculator artwork: ./calculator.svg, which is
// also emitted as the browser favicon (referenced from index.html). The SVG uses
// currentColor, so the in-app icon stays theme-adaptive; the favicon falls back
// to the root `color` set in the file.
import CalculatorSvg from './calculator.svg?react'

export const CalculatorIcon = ({ className }: { className?: string }) => (
  <CalculatorSvg className={className ?? 'h-4 w-4'} />
)
