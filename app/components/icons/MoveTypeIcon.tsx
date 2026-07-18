import type { gen } from '@dj-meyers/gale-wings/calc'

import bugIcon from '~/assets/types/bug.png'
import darkIcon from '~/assets/types/dark.png'
import dragonIcon from '~/assets/types/dragon.png'
import electricIcon from '~/assets/types/electric.png'
import fairyIcon from '~/assets/types/fairy.png'
import fightingIcon from '~/assets/types/fighting.png'
import fireIcon from '~/assets/types/fire.png'
import flyingIcon from '~/assets/types/flying.png'
import ghostIcon from '~/assets/types/ghost.png'
import grassIcon from '~/assets/types/grass.png'
import groundIcon from '~/assets/types/ground.png'
import iceIcon from '~/assets/types/ice.png'
import normalIcon from '~/assets/types/normal.png'
import poisonIcon from '~/assets/types/poison.png'
import psychicIcon from '~/assets/types/psychic.png'
import rockIcon from '~/assets/types/rock.png'
import steelIcon from '~/assets/types/steel.png'
import stellarIcon from '~/assets/types/stellar.png'
import waterIcon from '~/assets/types/water.png'

// Every type name the move dex yields except the typeless '???' (which has no
// glyph), derived from `gen` so it can't drift from the source.
export type MoveType = Exclude<
  NonNullable<ReturnType<typeof gen.moves.get>>['type'],
  '???'
>

// Monochrome type glyphs (Bulbagarden). Keyed by the capitalized type names
// returned from `gen.moves.get(...).type`. A full Record keeps this exhaustive
// — a missing type won't compile.
const TYPE_ICONS: Record<MoveType, string> = {
  Normal: normalIcon,
  Fire: fireIcon,
  Fighting: fightingIcon,
  Water: waterIcon,
  Flying: flyingIcon,
  Grass: grassIcon,
  Poison: poisonIcon,
  Electric: electricIcon,
  Ground: groundIcon,
  Psychic: psychicIcon,
  Rock: rockIcon,
  Ice: iceIcon,
  Bug: bugIcon,
  Dragon: dragonIcon,
  Ghost: ghostIcon,
  Dark: darkIcon,
  Steel: steelIcon,
  Fairy: fairyIcon,
  Stellar: stellarIcon,
}

// The glyphs ship as dark silhouettes on transparency; `brightness-0 invert`
// recolors them white so they read against the type-hued move-chip fill.
export const MoveTypeIcon = ({ type }: { type: MoveType }) => {
  const src = TYPE_ICONS[type]
  return (
    <img
      alt={type}
      className="mr-1 inline-block h-[1.1em] w-[1.1em] object-contain align-[-0.15em] brightness-0 invert"
      src={src}
      title={type}
    />
  )
}
