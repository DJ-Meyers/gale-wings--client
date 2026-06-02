import { getSpriteUrl } from '@dj-meyers/gale-wings/sprites'

const FALLBACK_SRC = getSpriteUrl('Ditto')

export const PokemonIcon = ({
  species,
  className,
}: {
  species: string
  className?: string
}) => {
  const source = getSpriteUrl(species) ?? FALLBACK_SRC
  return (
    <div
      className={
        className ??
        'relative inline-block h-[1.4em] w-[1.8em] overflow-hidden align-middle'
      }
    >
      {source && (
        <img
          alt={species}
          className="h-full w-full object-contain"
          height={128}
          loading="lazy"
          src={source}
          title={species}
          width={128}
        />
      )}
    </div>
  )
}
