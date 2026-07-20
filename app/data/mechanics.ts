import { championsAbilitiesSchema } from '@dj-meyers/gale-wings/schemas'

const RUIN_ABILITIES = [
  'Beads of Ruin',
  'Sword of Ruin',
  'Tablets of Ruin',
  'Vessel of Ruin',
] as const
export const RUIN_ENABLED = RUIN_ABILITIES.some(
  (name) => championsAbilitiesSchema.safeParse(name).success,
)
