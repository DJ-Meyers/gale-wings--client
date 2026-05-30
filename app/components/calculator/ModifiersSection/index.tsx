import { BoostsSection } from '~/components/calculator/ModifiersSection/BoostsSection'
import { StandardModifiersSection } from '~/components/calculator/ModifiersSection/StandardModifiersSection'

interface Properties {
  side: 'player' | 'opponent'
}

export const ModifiersSection = ({ side }: Properties) => (
  <div className="my-2 flex flex-col gap-1.5">
    <StandardModifiersSection side={side} />
    <BoostsSection side={side} />
  </div>
)
