import { currentRegulation } from '@dj-meyers/galewings/constants'
import { championsAbilitiesSchema } from '@dj-meyers/galewings/schemas'
import type { Mechanic } from '@dj-meyers/galewings/types'

const legalMechanics = new Set<Mechanic>(currentRegulation.legalMechanics)
export const TERA_ENABLED = legalMechanics.has('terastallization')

const RUIN_ABILITIES = [
  'Beads of Ruin',
  'Sword of Ruin',
  'Tablets of Ruin',
  'Vessel of Ruin',
] as const
export const RUIN_ENABLED = RUIN_ABILITIES.some(
  (name) => championsAbilitiesSchema.safeParse(name).success,
)
