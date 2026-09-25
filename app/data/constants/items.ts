// Items that boost a Pokémon's damage output (move-power multipliers and
// species-locked stat doublers). Megastones and utility items (Choice Scarf,
// Sitrus Berry, Focus Sash, Leftovers, etc.) are omitted. Limited to the
// Champions-legal item pool (see ITEM_SPRITE_SLUGS in ~/data/itemSpriteNames).
// Used to prefix the attacker's item in the calc-result title.
//
// Regulation M-C additions reviewed: Normal Gem is a one-shot 1.3x on a
// Normal move and @smogon/calc applies it, so it belongs here. Leek only
// raises the crit ratio (the calc takes isCrit as an input, never a
// probability) and Binding Band only scales trap residual, so neither
// changes a damage roll and both stay out.
export const POWER_BOOSTING_ITEMS: ReadonlySet<string> = new Set([
  'Light Ball',
  'Life Orb',
  'Expert Belt',
  'Muscle Band',
  'Wise Glasses',
  'Normal Gem',
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
//
// Regulation M-C additions reviewed: Air Balloon (Ground immunity) and the
// four terrain Seeds (+1 Def / +1 SpD when the matching terrain is up) both
// change what the defender takes and @smogon/calc models them, so they are
// listed. Rocky Helmet, Red Card, Eject Button, and Terrain Extender never
// change an incoming damage roll and stay out.
export const DEFENSE_BOOSTING_ITEMS: ReadonlySet<string> = new Set([
  'Focus Sash',
  'Air Balloon',
  'Electric Seed',
  'Grassy Seed',
  'Misty Seed',
  'Psychic Seed',
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
