import type { CSSProperties } from 'react'

import { PokemonInfoStatPointInputs } from '~/components/calculator/PokemonInfoSection/PokemonInfoStatPointInputs'
import { AbilitySelectField } from '~/components/fields/AbilitySelectField'
import { ItemSelectField } from '~/components/fields/ItemSelectField'
import { MoveSelectField } from '~/components/fields/MoveSelectField'
import { NatureSelectField } from '~/components/fields/NatureSelectField'
import { PokemonSelectField } from '~/components/fields/PokemonSelectField'
import { PokemonWithItemIcon } from '~/components/icons/PokemonWithItemIcon'
import { CalcPokemonStatsProvider } from '~/context/CalcPokemonStatsContext'
import { useSpeciesAbilities } from '~/hooks/api/data'
import { useLearnableMoves } from '~/hooks/useLearnableMoves'
import { useSandboxStore } from '~/sandbox/store'
import type { ChampionsPokemon } from '~/types'

type Side = 'attacker' | 'defender'

const LABELS: Record<Side, string> = {
  attacker: 'Attacker',
  defender: 'Defender',
}

export const SandboxPokemonPanel = ({ side }: { side: Side }) => {
  const isAttacker = side === 'attacker'
  const pokemon = useSandboxStore((s) => (isAttacker ? s.attacker : s.defender))
  const setPokemon = useSandboxStore((s) =>
    isAttacker ? s.setAttacker : s.setDefender,
  )
  const move = useSandboxStore((s) =>
    isAttacker ? s.attackerCalcParameters.move : s.defenderCalcParameters.move,
  )
  const setParams = useSandboxStore((s) =>
    isAttacker ? s.setAttackerParams : s.setDefenderParams,
  )
  const { speciesAbilities } = useSpeciesAbilities(pokemon.species)
  const { learnableMoves } = useLearnableMoves(pokemon.species)

  const { species, nature, ability, item } = pokemon

  const onSpeciesChange = (s: string) => {
    setPokemon({
      species: s as ChampionsPokemon['species'],
      ability: '' as ChampionsPokemon['ability'],
      item: undefined,
      moves: [] as unknown as ChampionsPokemon['moves'],
      statPoints: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
    })
    setParams({ move: '' as never })
  }
  const onNatureChange = (n: string) =>
    setPokemon({ nature: n as ChampionsPokemon['nature'] })
  const onAbilityChange = (a: string) =>
    setPokemon({ ability: a as ChampionsPokemon['ability'] })
  const onItemChange = (i: string) =>
    setPokemon({ item: (i || undefined) as ChampionsPokemon['item'] })

  const moveOverride = {
    value: move ?? '',
    onChange: (m: string) => setParams({ move: m }),
    options: learnableMoves ?? [],
  }

  return (
    <section
      aria-labelledby={`panel-heading-${side}`}
      className="bg-surface rounded-lg p-4 shadow-md"
      style={
        {
          '--field-accent': isAttacker
            ? 'var(--color-blue)'
            : 'var(--color-yellow)',
        } as CSSProperties
      }
    >
      <h2
        id={`panel-heading-${side}`}
        className="text-text-heading mb-2 text-sm font-semibold"
      >
        {LABELS[side]}
      </h2>
      <CalcPokemonStatsProvider
        value={{
          pokemon,
          speciesAbilities: speciesAbilities ?? [],
          compact: true,
          collapsibleMoves: true,
          name: '',
          notes: '',
          moveOverride,
          onSpeciesChange,
          onNatureChange,
          onAbilityChange,
          onItemChange,
          onStatPointChange: (stat, value) =>
            setPokemon({
              statPoints: { ...pokemon.statPoints, [stat]: value },
            }),
          onMoveChange: (slot, nextMove) => {
            const moves = [...pokemon.moves] as string[]
            moves[slot] = nextMove
            setPokemon({
              moves: moves.filter(Boolean) as ChampionsPokemon['moves'],
            })
          },
        }}
      >
        <div className="flex items-center gap-2">
          <PokemonWithItemIcon item={item} species={species} />
          <div className="min-w-0 flex-1">
            <PokemonSelectField
              compact
              value={species}
              onChange={onSpeciesChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
          <NatureSelectField
            compact
            value={nature}
            onChange={onNatureChange}
          />
          <AbilitySelectField
            compact
            speciesAbilities={speciesAbilities ?? []}
            value={ability}
            onChange={onAbilityChange}
          />
          <ItemSelectField
            compact
            value={item ?? ''}
            onChange={onItemChange}
          />
          <MoveSelectField
            compact
            options={moveOverride.options}
            value={moveOverride.value}
            onChange={moveOverride.onChange}
          />
        </div>
        <PokemonInfoStatPointInputs />
      </CalcPokemonStatsProvider>
    </section>
  )
}

