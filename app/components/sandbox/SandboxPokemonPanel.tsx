import type { CSSProperties } from 'react'

import { PokemonInfoStatPointInputs } from '~/components/calculator/PokemonInfoSection/PokemonInfoStatPointInputs'
import { AbilitySelectField } from '~/components/fields/AbilitySelectField'
import { ItemSelectField } from '~/components/fields/ItemSelectField'
import { MoveSelectField } from '~/components/fields/MoveSelectField'
import { NatureSelectField } from '~/components/fields/NatureSelectField'
import { PokemonSelectField } from '~/components/fields/PokemonSelectField'
import { SwapIcon } from '~/components/icons'
import { PokemonWithItemIcon } from '~/components/icons/PokemonWithItemIcon'
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
  const swapAttackerDefender = useSandboxStore((s) => s.swapAttackerDefender)
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

  return (
    <section
      aria-labelledby={`panel-heading-${side}`}
      className="border-border overflow-hidden rounded-lg border bg-gradient-to-b from-[color-mix(in_srgb,var(--color-white)_4%,var(--color-surface))] to-surface shadow-md"
      style={
        {
          '--field-accent': isAttacker
            ? 'var(--color-attacker)'
            : 'var(--color-defender)',
        } as CSSProperties
      }
    >
      <div className="border-border mb-3 flex items-center gap-2 border-b px-4 py-2">
        <span className="h-2 w-2 rounded-full bg-[var(--field-accent)]" />
        <h2
          id={`panel-heading-${side}`}
          className="text-text-heading text-xs font-bold tracking-wider uppercase"
        >
          {LABELS[side]}
        </h2>
        <button
          type="button"
          title="Swap attacker and defender"
          aria-label="Swap attacker and defender"
          onClick={swapAttackerDefender}
          className="text-text-muted hover:text-text ml-auto cursor-pointer border-none bg-transparent p-0 leading-none transition-colors"
        >
          <SwapIcon />
        </button>
      </div>
      <div className="px-4 pb-4">
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
            options={learnableMoves ?? []}
            value={move ?? ''}
            onChange={(m) => setParams({ move: m })}
          />
        </div>
        <PokemonInfoStatPointInputs
          compact
          pokemon={pokemon}
          onStatPointChange={(stat, value) =>
            setPokemon({
              statPoints: { ...pokemon.statPoints, [stat]: value },
            })
          }
        />
      </div>
    </section>
  )
}
