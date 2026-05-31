import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'

import { CalcRow } from '~/components/calculator/CalcRow'
import { PokemonInfoSection } from '~/components/calculator/PokemonInfoSection'
import { SpeedCalcRow } from '~/components/SpeedCalcRow'
import { CalcPokemonStatsProvider } from '~/context/CalcPokemonStatsContext'
import { useSpeciesAbilities } from '~/hooks/api/data'
import { useSandboxStore } from '~/sandbox/store'
import type { CalcRowMode, SandboxCalc } from '~/sandbox/types'
import type { ChampionsPokemon } from '~/types'

const PlayerPokemonPanel = () => {
  const player = useSandboxStore((s) => s.player)
  const setPlayer = useSandboxStore((s) => s.setPlayer)
  const { speciesAbilities } = useSpeciesAbilities(player.species)

  return (
    <CalcPokemonStatsProvider
      value={{
        pokemon: player,
        speciesAbilities: speciesAbilities ?? [],
        compact: false,
        collapsibleMoves: true,
        label: 'Text-to-Pokémon',
        name: '',
        notes: '',
        onSpeciesChange: (species) =>
          setPlayer({ species: species as ChampionsPokemon['species'] }),
        onNatureChange: (nature) =>
          setPlayer({ nature: nature as ChampionsPokemon['nature'] }),
        onAbilityChange: (ability) =>
          setPlayer({ ability: ability as ChampionsPokemon['ability'] }),
        onItemChange: (item) =>
          setPlayer({
            item: (item || undefined) as ChampionsPokemon['item'],
          }),
        onStatPointChange: (stat, value) =>
          setPlayer({
            statPoints: { ...player.statPoints, [stat]: value },
          }),
        onMoveChange: (slot, move) => {
          const moves = [...player.moves] as string[]
          moves[slot] = move
          setPlayer({
            moves: moves.filter(Boolean) as ChampionsPokemon['moves'],
          })
        },
      }}
    >
      <PokemonInfoSection />
    </CalcPokemonStatsProvider>
  )
}

const SandboxLayout = () => {
  const playerSpecies = useSandboxStore((s) => s.player.species)
  const calcOrder = useSandboxStore((s) => s.calcOrder)
  const calcs = useSandboxStore((s) => s.calcs)

  const { offensive, defensive, speed } = useMemo(() => {
    const offensive: SandboxCalc[] = []
    const defensive: SandboxCalc[] = []
    const speed: SandboxCalc[] = []
    for (const id of calcOrder) {
      const c = calcs[id]
      if (c.type === 'offensive') offensive.push(c)
      else if (c.type === 'defensive') defensive.push(c)
      else speed.push(c)
    }
    return { offensive, defensive, speed }
  }, [calcOrder, calcs])

  return (
    <div className="mx-auto max-w-[1400px] py-6">
      <header className="mb-4">
        <h1 className="text-3xl font-bold">Galewings</h1>
        <p className="text-text-muted text-sm">
          VGC damage calculator sandbox — {playerSpecies}-led.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="min-w-0">
          <h2 className="text-text-heading border-primary mb-3 border-b-2 pb-1 text-base">
            Your Pokémon
          </h2>
          <PlayerPokemonPanel />
        </div>
        <SpeedColumn label="Speed" calcs={speed} />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <CalcColumn label="Offensive" mode="offensive" calcs={offensive} />
        <CalcColumn label="Defensive" mode="defensive" calcs={defensive} />
      </div>
    </div>
  )
}

const CalcColumn = ({
  label,
  mode,
  calcs,
}: {
  label: string
  mode: CalcRowMode
  calcs: SandboxCalc[]
}) => (
  <div className="min-w-0">
    <h2 className="text-text-heading border-primary mb-3 border-b-2 pb-1 text-base">
      {label}
    </h2>
    {calcs.map((calc) => (
      <CalcRow key={calc.id} calcId={calc.id} mode={mode} />
    ))}
  </div>
)

const SpeedColumn = ({
  label,
  calcs,
}: {
  label: string
  calcs: SandboxCalc[]
}) => (
  <div className="min-w-0">
    <h2 className="text-text-heading border-primary mb-3 border-b-2 pb-1 text-base">
      {label}
    </h2>
    {calcs.map((calc) => (
      <SpeedCalcRow key={calc.id} calcId={calc.id} />
    ))}
  </div>
)

const IndexPage = () => <SandboxLayout />

export const Route = createFileRoute('/')({
  component: IndexPage,
})
