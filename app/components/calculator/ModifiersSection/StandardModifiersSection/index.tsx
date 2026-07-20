import { ModifierMoveSelector } from '~/components/calculator/ModifiersSection/StandardModifiersSection/ModifierMoveSelector'
import { ModifierStatusField } from '~/components/calculator/ModifiersSection/StandardModifiersSection/ModifierStatusField'
import { useModifiers } from '~/hooks/calc/useModifiers'

interface Properties {
  side: 'player' | 'opponent'
}

export const StandardModifiersSection = ({ side }: Properties) => {
  const { showMove } = useModifiers(side)

  return (
    <div className="flex flex-wrap items-end gap-2">
      {showMove && <ModifierMoveSelector side={side} />}
      <ModifierStatusField side={side} />
    </div>
  )
}
