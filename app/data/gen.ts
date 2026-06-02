import { getSpecies } from '@dj-meyers/gale-wings/dex'
import { Generations, toID } from '@smogon/calc'
import type { Specie } from '@smogon/calc/dist/data/interface'

export const gen = Generations.get(9)

// Display-name aliases the client uses for compactness.
// Maps client display name → @smogon/calc canonical species name.
const DISPLAY_NAME_TO_SMOGON: Record<string, string> = {
  'Basculin-Blue': 'Basculin-Blue-Striped',
  'Basculin-White': 'Basculin-White-Striped',
  'Urshifu-Rapid': 'Urshifu-Rapid-Strike',
  'Urshifu-Single': 'Urshifu',
}

const SMOGON_TO_DISPLAY: Record<string, string> = Object.fromEntries(
  Object.entries(DISPLAY_NAME_TO_SMOGON)
    .filter(([display, smogon]) => display !== smogon)
    .map(([display, smogon]) => [smogon, display]),
)

export const toSmogonName = (displayName: string): string =>
  DISPLAY_NAME_TO_SMOGON[displayName] ?? displayName

export const toDisplayName = (smogonName: string): string =>
  SMOGON_TO_DISPLAY[smogonName] ?? smogonName

// @smogon/calc's bundled gen9 data is missing Champions-mod megas
// (Floette-Mega, Drampa-Mega, ...). When the calc lookup misses, fall
// back to the gale-wings champions dex and return the seven fields the
// Pokemon constructor actually reads as `overrides`.
export const speciesOverride = (name: string): Partial<Specie> | undefined => {
  if (gen.species.get(toID(name))) return undefined
  const s = getSpecies(name)
  if (!s.exists) return undefined
  return {
    name: s.name,
    types: s.types,
    baseStats: s.baseStats,
    weightkg: s.weightkg,
    abilities: s.abilities,
    baseSpecies: s.baseSpecies,
    otherFormes: s.otherFormes,
  } as Partial<Specie>
}

// True when the species resolves in either data layer — used as the
// "do we know this Pokemon?" guard before calc construction.
export const hasSpecies = (name: string): boolean =>
  !!gen.species.get(toID(name)) || getSpecies(name).exists
