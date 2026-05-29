import { BoostsSection } from '~/components/calculator/ModifiersSection/BoostsSection'
import { StandardModifiersSection } from '~/components/calculator/ModifiersSection/StandardModifiersSection'

interface Properties {
  side: 'player' | 'opponent'
}

export const ModifiersSection = ({ side }: Properties) => (
  <div className="mb-2 py-2">
    <StandardModifiersSection side={side} />
    <BoostsSection side={side} />
  </div>
)
