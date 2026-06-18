import type { DamageCalcResult } from '@dj-meyers/gale-wings/calc'

// 0 = Guaranteed OHKO, 1 = chance OHKO, …, 5 = no result.
export type KoTier = 0 | 1 | 2 | 3 | 4 | 5

export const classifyKoTier = (result: DamageCalcResult | null): KoTier => {
  if (!result || !result.koChance) return 5
  const kc = result.koChance
  if (kc.includes('guaranteed OHKO')) return 0
  if (kc.includes('OHKO')) return 1
  if (kc.includes('guaranteed 2HKO')) return 2
  if (kc.includes('2HKO')) return 3
  return 4
}

export const KO_TIER_LABELS_OFFENSIVE: Record<KoTier, string> = {
  0: 'Guaranteed OHKO',
  1: 'Chance OHKO',
  2: 'Guaranteed 2HKO',
  3: 'Chance 2HKO',
  4: '3HKO+',
  5: 'No result',
}

export const KO_TIER_LABELS_DEFENSIVE: Record<KoTier, string> = {
  0: "Guaranteed KO'd",
  1: "Chance KO'd",
  2: "Guaranteed 2HKO'd",
  3: "Chance 2HKO'd",
  4: 'Survives (3HKO+)',
  5: 'No result',
}

export const KO_TIER_COLORS_OFFENSIVE: Record<KoTier, string> = {
  0: 'text-ko-guaranteed-ohko',
  1: 'text-ko-chance-ohko',
  2: 'text-ko-guaranteed-2hko',
  3: 'text-ko-chance-2hko',
  4: 'text-ko-no-2hko',
  5: 'text-text-muted',
}

// Left-edge accent border colors, paired with KO_TIER_COLORS_OFFENSIVE: the
// card border restates the tier the result text already shows. Tier 5 (no
// result) falls back to the neutral border rather than a muted color.
export const KO_TIER_ACCENT_OFFENSIVE: Record<KoTier, string> = {
  0: 'border-l-ko-guaranteed-ohko',
  1: 'border-l-ko-chance-ohko',
  2: 'border-l-ko-guaranteed-2hko',
  3: 'border-l-ko-chance-2hko',
  4: 'border-l-ko-no-2hko',
  5: 'border-l-border',
}
