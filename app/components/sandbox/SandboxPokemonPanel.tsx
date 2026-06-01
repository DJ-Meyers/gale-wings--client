import { PokemonInfoSection } from '~/components/calculator/PokemonInfoSection'
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
  const pokemon = useSandboxStore((s) =>
    side === 'attacker' ? s.attacker : s.defender,
  )
  const setPokemon = useSandboxStore((s) =>
    side === 'attacker' ? s.setAttacker : s.setDefender,
  )
  const attackerCalcParameters = useSandboxStore(
    (s) => s.attackerCalcParameters,
  )
  const defenderCalcParameters = useSandboxStore(
    (s) => s.defenderCalcParameters,
  )
  const setAttackerParams = useSandboxStore((s) => s.setAttackerParams)
  const { speciesAbilities } = useSpeciesAbilities(pokemon.species)
  const { learnableMoves } = useLearnableMoves(pokemon.species)

  const moveOverride =
    side === 'attacker'
      ? {
          value: attackerCalcParameters.move ?? '',
          onChange: (move: string) => setAttackerParams({ move }),
          disabled: false,
          options: learnableMoves ?? [],
        }
      : {
          value: defenderCalcParameters.move ?? '',
          onChange: () => {},
          disabled: true,
        }

  return (
    <section aria-labelledby={`panel-heading-${side}`}>
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
          onSpeciesChange: (species) =>
            setPokemon({ species: species as ChampionsPokemon['species'] }),
          onNatureChange: (nature) =>
            setPokemon({ nature: nature as ChampionsPokemon['nature'] }),
          onAbilityChange: (ability) =>
            setPokemon({ ability: ability as ChampionsPokemon['ability'] }),
          onItemChange: (item) =>
            setPokemon({
              item: (item || undefined) as ChampionsPokemon['item'],
            }),
          onStatPointChange: (stat, value) =>
            setPokemon({
              statPoints: { ...pokemon.statPoints, [stat]: value },
            }),
          onMoveChange: (slot, move) => {
            const moves = [...pokemon.moves] as string[]
            moves[slot] = move
            setPokemon({
              moves: moves.filter(Boolean) as ChampionsPokemon['moves'],
            })
          },
        }}
      >
        <PokemonInfoSection />
      </CalcPokemonStatsProvider>
    </section>
  )
}
