import { useState } from 'react'
import { ITEM_SPRITE_SLUGS, toSlug } from '~/data/itemSpriteNames'

const SPRITE_BASE = 'https://img.pokemondb.net/sprites/items'

const ItemIconInner = ({ item }: { item: string }) => {
  const [failed, setFailed] = useState(false)

  if (!item || failed) return null

  // Champions-legal items all resolve to a locally-hosted sprite (one
  // consistent art style); anything unmapped falls back to PokemonDB.
  const slug = ITEM_SPRITE_SLUGS[item]
  const src = slug
    ? `/assets/items/${slug}.png`
    : `${SPRITE_BASE}/${toSlug(item)}.png`

  return (
    <img
      alt={item}
      className="mx-[0.1em] inline-block h-[1.3em] w-[1.3em] align-[-0.25em]"
      src={src}
      title={item}
      onError={() => setFailed(true)}
    />
  )
}

export const ItemIcon = ({ item }: { item: string }) => (
  <ItemIconInner item={item} key={item} />
)
