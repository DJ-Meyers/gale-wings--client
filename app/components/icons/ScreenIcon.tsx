const darken = (hex: string, amount: number): string => {
  const r = Math.max(0, Number.parseInt(hex.slice(1, 3), 16) - amount)
  const g = Math.max(0, Number.parseInt(hex.slice(3, 5), 16) - amount)
  const b = Math.max(0, Number.parseInt(hex.slice(5, 7), 16) - amount)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

const WHITE = '#FFFFFF'
const WHITE_MID = darken(WHITE, 45)
const WHITE_DARK = darken(WHITE, 90)

const ScreenIcon = ({ bg, title }: { bg: string; title: string }) => (
  <span
    className="mx-[0.1em] inline-flex items-center justify-center rounded-sm align-[-0.15em]"
    style={{ backgroundColor: bg, width: '1.3em', height: '1.3em' }}
    title={title}
  >
    <svg
      className="h-[1em] w-[1em]"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 64 64"
    >
      <polygon
        fill={WHITE_DARK}
        fillOpacity="0.7"
        points="32,12 56,8 56,54 32,50"
        stroke={WHITE_DARK}
        strokeWidth="1"
      />
      <polygon
        fill={WHITE_MID}
        fillOpacity="0.7"
        points="20,7 46,2 46,60 20,55"
        stroke={WHITE_MID}
        strokeWidth="1"
      />
      <polygon
        fill={WHITE}
        fillOpacity="0.7"
        points="8,5 36,0 36,64 8,59"
        stroke={WHITE}
        strokeWidth="1"
      />
    </svg>
  </span>
)

export const ReflectIcon = () => <ScreenIcon bg="#F0D060" title="Reflect" />
export const LightScreenIcon = () => (
  <ScreenIcon bg="#C8A2C8" title="Light Screen" />
)
export const AuroraVeilIcon = () => (
  <ScreenIcon bg="#9BD8F0" title="Aurora Veil" />
)
