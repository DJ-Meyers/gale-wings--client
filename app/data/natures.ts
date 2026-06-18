import { gen } from '@dj-meyers/gale-wings/calc'

export type NatureEntry = {
  name: string
  plus?: string
  minus?: string
}

export const naturesList: NatureEntry[] = [...gen.natures].map((n) => ({
  name: n.name,
  plus: n.plus,
  minus: n.minus,
}))
