/**
 * Convert an item name (from @smogon/calc) to the PokemonDB item sprite filename.
 *
 * PokemonDB hosts item sprites at:
 *   https://img.pokemondb.net/sprites/items/{slug}.png
 *
 * Most items just need lowercasing and space→hyphen conversion.
 *
 * Generated/validated by scripts/check-item-sprites.ts
 */

/** Slug an item name: lowercase, spaces→hyphens, strip punctuation. */
const toSlug = (s: string): string =>
  s
    .toLowerCase()
    .replaceAll(/['''\u2018\u2019]/g, '') // strip quotes (King's Rock → kings-rock)
    .replaceAll(/\.\s*/g, '-')
    .replaceAll(/\s+/g, '-')
    .replaceAll(/-+/g, '-')
    .replaceAll(/^-|-$/g, '')

/**
 * Hard overrides for items whose PokemonDB slug can't be derived from the name.
 */
const ITEM_OVERRIDES: Record<string, string> = {
  // Mega stones, Z-crystals, and fake items that don't exist on PokemonDB
  // will simply 404 and the fallback will handle them.
}

/**
 * Items missing from PokemonDB that we host locally in /assets/items/.
 * Keyed by the item name from @smogon/calc.
 */
export const LOCAL_ITEM_SPRITES: Record<string, string> = {
  'Booster Energy': 'boosterenergy',
  'Ability Shield': 'abilityshield',
  'Clear Amulet': 'clearamulet',
  'Mirror Herb': 'mirrorherb',
  'Punching Glove': 'punchingglove',
  'Covert Cloak': 'covertcloak',
  'Loaded Dice': 'loadeddice',
  'Fairy Feather': 'fairyfeather',
  'Teal Mask': 'tealmask',
  'Cornerstone Mask': 'cornerstonemask',
  'Wellspring Mask': 'wellspringmask',
  'Hearthflame Mask': 'hearthflamemask',
  // Legends: Z-A Mega Stones — Champions-legal but absent from PokemonDB.
  // Sprites hosted in public/assets/items/ (sourced from serebii's Z-A itemdex).
  Barbaracite: 'barbaracite',
  Chandelurite: 'chandelurite',
  Chesnaughtite: 'chesnaughtite',
  Chimechite: 'chimechite',
  Clefablite: 'clefablite',
  Crabominite: 'crabominite',
  Delphoxite: 'delphoxite',
  Dragalgite: 'dragalgite',
  Dragoninite: 'dragoninite',
  Drampanite: 'drampanite',
  Eelektrossite: 'eelektrossite',
  Emboarite: 'emboarite',
  Excadrite: 'excadrite',
  Falinksite: 'falinksite',
  Feraligite: 'feraligite',
  Floettite: 'floettite',
  Froslassite: 'froslassite',
  Glimmoranite: 'glimmoranite',
  Golurkite: 'golurkite',
  Greninjite: 'greninjite',
  Hawluchanite: 'hawluchanite',
  Malamarite: 'malamarite',
  Meganiumite: 'meganiumite',
  Meowsticite: 'meowsticite',
  Pyroarite: 'pyroarite',
  'Raichunite X': 'raichunitex',
  'Raichunite Y': 'raichunitey',
  Scolipite: 'scolipite',
  Scovillainite: 'scovillainite',
  Scraftinite: 'scraftinite',
  Skarmorite: 'skarmorite',
  Staraptite: 'staraptite',
  Starminite: 'starminite',
  Victreebelite: 'victreebelite',
}

export const toItemSpriteId = (item: string): string => {
  if (ITEM_OVERRIDES[item]) {
    return ITEM_OVERRIDES[item]
  }
  return toSlug(item)
}
