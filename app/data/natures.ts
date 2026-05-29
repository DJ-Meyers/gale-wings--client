import { gen } from '~/data/gen'

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
