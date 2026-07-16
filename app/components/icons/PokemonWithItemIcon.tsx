import { ItemIcon } from '~/components/icons/ItemIcon'
import { PokemonIcon } from '~/components/icons/PokemonIcon'
import type { AllItemName, AllSpeciesName } from '~/types'

type PokemonWithItemIconSize = 'sm' | 'lg'

// `sm` is the inline default (40px sprite, ~20px item badge) and carries its own
// right margin for inline flows. `lg` is a bigger standalone treatment (72px
// sprite, larger item badge) for card/detail layouts, where the parent's own
// gap owns spacing — so it deliberately omits the margin. The `lg` badge also
// sits the item on a neutral chip (matching the card's ability/move chips) so
// it reads as a distinct element over the sprite.
const sizeClasses: Record<
  PokemonWithItemIconSize,
  { box: string; item: string; margin: string }
> = {
  sm: { box: 'h-[40px] w-[40px]', item: '-bottom-1', margin: 'mr-2' },
  lg: {
    box: 'h-[72px] w-[72px]',
    item: 'bottom-0 inline-flex items-center justify-center rounded bg-slate/85 light:bg-light-gray/85 p-px text-base [&_img]:mx-0',
    margin: '',
  },
}

export const PokemonWithItemIcon = ({
  species,
  item,
  className,
  itemClassName,
  size = 'sm',
}: {
  species: AllSpeciesName
  item?: AllItemName
  className?: string
  // Extra classes for the item badge chip (e.g. a "changed" highlight ring).
  itemClassName?: string
  size?: PokemonWithItemIconSize
}) => {
  const { box, item: itemClass, margin } = sizeClasses[size]
  return (
    <div className={`relative ${margin} ${box} ${className ?? ''}`}>
      <PokemonIcon
        className={`relative inline-block overflow-hidden ${box}`}
        species={species}
      />
      {item && (
        <span className={`absolute -right-1 ${itemClass} ${itemClassName ?? ''}`}>
          <ItemIcon item={item} />
        </span>
      )}
    </div>
  )
}
