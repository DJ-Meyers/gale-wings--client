import { Typeahead } from '~/components/fields/Typeahead'
import { naturesList } from '~/data/natures'

interface Properties {
  value: string
  onChange: (nature: string) => void
  compact?: boolean
}

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  atk: 'Atk',
  def: 'Def',
  spa: 'SpA',
  spd: 'SpD',
  spe: 'Spe',
}

const natureNames = naturesList.map((n) => n.name)

const natureLabelMap = new Map(
  naturesList.map((n) => {
    const label =
      n.plus && n.minus
        ? `${n.name} (+${STAT_LABELS[n.plus] ?? n.plus}, -${STAT_LABELS[n.minus] ?? n.minus})`
        : n.name
    return [n.name, label]
  }),
)

export const NatureSelectField = ({
  value,
  onChange,
  compact,
}: Properties) => (
  <Typeahead
    compact={compact}
    getLabel={(v) => natureLabelMap.get(v) ?? v}
    label="Nature"
    options={natureNames}
    placeholder="Search natures..."
    value={value}
    onChange={onChange}
  />
)
