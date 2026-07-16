// Items that boost a Pokémon's damage output (move-power multipliers and
// species-locked stat doublers). Megastones and utility items (Choice Scarf,
// Sitrus Berry, Focus Sash, Leftovers, etc.) are omitted. Limited to the
// Champions-legal item pool (see ITEM_SPRITE_SLUGS in ~/data/itemSpriteNames).
// Used to prefix the attacker's item in the calc-result title.
export const POWER_BOOSTING_ITEMS: ReadonlySet<string> = new Set([
  'Light Ball',
  'Life Orb',
  'Expert Belt',
  'Muscle Band',
  'Wise Glasses',
  'Metronome',
  'Charcoal',
  'Mystic Water',
  'Miracle Seed',
  'Magnet',
  'Twisted Spoon',
  'Black Belt',
  'Black Glasses',
  'Sharp Beak',
  'Poison Barb',
  'Soft Sand',
  'Hard Stone',
  'Silver Powder',
  'Spell Tag',
  'Metal Coat',
  'Dragon Fang',
  'Never-Melt Ice',
  'Silk Scarf',
])

// Items that boost a Pokémon's defensive outcome in the calc — single-hit
// survivability (Focus Sash) and the type-resist berries (one-time half-damage
// on a super-effective hit). Limited to the Champions-legal item pool (see
// ITEM_SPRITE_SLUGS in ~/data/itemSpriteNames).
// Used to prefix the defender's item in the calc-result title.
export const DEFENSE_BOOSTING_ITEMS: ReadonlySet<string> = new Set([
  'Focus Sash',
  'Babiri Berry',
  'Charti Berry',
  'Chilan Berry',
  'Chople Berry',
  'Coba Berry',
  'Colbur Berry',
  'Haban Berry',
  'Kasib Berry',
  'Kebia Berry',
  'Occa Berry',
  'Passho Berry',
  'Payapa Berry',
  'Rindo Berry',
  'Roseli Berry',
  'Shuca Berry',
  'Tanga Berry',
  'Wacan Berry',
  'Yache Berry',
])
