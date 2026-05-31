import { ModifierMoveSelector } from '~/components/calculator/ModifiersSection/StandardModifiersSection/ModifierMoveSelector'
import { ModifierStatusField } from '~/components/calculator/ModifiersSection/StandardModifiersSection/ModifierStatusField'
import { ModifierTeraField } from '~/components/calculator/ModifiersSection/StandardModifiersSection/ModifierTeraField'
import { TERA_ENABLED } from '~/data/mechanics'
import { useModifiers } from '~/hooks/calc/useModifiers'

interface Properties {
  side: 'player' | 'opponent'
}

export const StandardModifiersSection = ({ side }: Properties) => {
  const { showMove } = useModifiers(side)

  return (
    <div className="mb-2 flex flex-wrap items-end gap-2">
      {showMove && <ModifierMoveSelector side={side} />}
      {TERA_ENABLED && <ModifierTeraField side={side} />}
      <ModifierStatusField side={side} />
    </div>
  )
}
