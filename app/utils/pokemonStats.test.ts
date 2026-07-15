import { describe, expect, it } from 'vitest'

import { formatStatSubLabel, natureModifier } from './pokemonStats'

// Adamant raises Atk and lowers SpA; Serious is neutral (names Spe for both).
const ADAMANT = { plus: 'atk', minus: 'spa' }
const SERIOUS = { plus: 'spe', minus: 'spe' }

describe('natureModifier', () => {
  it('signs the raised and lowered stats', () => {
    expect(natureModifier(ADAMANT, 'atk')).toBe('+')
    expect(natureModifier(ADAMANT, 'spa')).toBe('-')
  })

  it('gives no sign for an unaffected stat', () => {
    expect(natureModifier(ADAMANT, 'def')).toBeUndefined()
  })

  it('gives no sign for a neutral nature (same stat raised and lowered)', () => {
    expect(natureModifier(SERIOUS, 'spe')).toBeUndefined()
  })
})

describe('formatStatSubLabel', () => {
  // An Adamant pokemon with 10 Atk points and none in SpA.
  it('shows points with the nature sign (Adamant, 10 Atk points -> "10+")', () => {
    expect(formatStatSubLabel(10, natureModifier(ADAMANT, 'atk'), 'Atk')).toBe(
      '10+',
    )
  })

  it('shows the stat name + sign when a nature-modified stat has no points (Adamant SpA -> "SpA-")', () => {
    expect(formatStatSubLabel(0, natureModifier(ADAMANT, 'spa'), 'SpA')).toBe(
      'SpA-',
    )
  })

  it('shows just the stat name for an unmodified stat with no points', () => {
    expect(formatStatSubLabel(0, natureModifier(ADAMANT, 'def'), 'Def')).toBe(
      'Def',
    )
  })

  it('shows no sign for a neutral nature even with no points', () => {
    expect(formatStatSubLabel(0, natureModifier(SERIOUS, 'spe'), 'Spe')).toBe(
      'Spe',
    )
  })
})
