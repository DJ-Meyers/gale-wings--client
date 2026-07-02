import { ItemIcon } from '~/components/icons/ItemIcon'
import { PokemonIcon } from '~/components/icons/PokemonIcon'
import type { AllItemName, AllSpeciesName } from '~/types'

type PokemonWithItemIconSize = 'sm' | 'lg'

// `sm` is the inline default (40px sprite, ~20px item badge) and carries its own
// right margin for inline flows. `lg` is a bigger standalone treatment (72px
// sprite, larger item badge) for card/detail layouts, where the parent's own
// gap owns spacing — so it deliberately omits the margin.
const sizeClasses: Record<
  PokemonWithItemIconSize,
  { box: string; item: string; margin: string }
> = {
  sm: { box: 'h-[40px] w-[40px]', item: '', margin: 'mr-2' },
  lg: { box: 'h-[72px] w-[72px]', item: 'text-2xl', margin: '' },
}

export const PokemonWithItemIcon = ({
  species,
  item,
  className,
  size = 'sm',
}: {
  species: AllSpeciesName
  item?: AllItemName
  className?: string
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
        <span className={`absolute -right-1 -bottom-1 ${itemClass}`}>
          <ItemIcon item={item} />
        </span>
      )}
    </div>
  )
}
