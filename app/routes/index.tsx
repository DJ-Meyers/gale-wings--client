import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useRef } from 'react'

import { CalcRow } from '~/components/calculator/CalcRow'
import { PokemonInfoSection } from '~/components/calculator/PokemonInfoSection'
import { SpeedCalcRow } from '~/components/SpeedCalcRow'
import { CalcPokemonStatsProvider } from '~/context/CalcPokemonStatsContext'
import { useSpeciesAbilities } from '~/hooks/useSpeciesAbilities'
import { SANDBOX_FIXTURES, SANDBOX_PLAYER } from '~/sandbox/fixtures'
import { SandboxProvider, useSandbox } from '~/sandbox/SandboxContext'
import type { SandboxCalc } from '~/sandbox/types'
import type { ChampionsPokemon } from '~/types'

const PlayerPokemonPanel = () => {
  const { state, dispatch } = useSandbox()
  const speciesAbilities = useSpeciesAbilities(state.player.species)

  return (
    <CalcPokemonStatsProvider
      value={{
        pokemon: state.player,
        speciesAbilities,
        compact: false,
        label: 'Text-to-Pokémon',
        name: '',
        notes: '',
        onSpeciesChange: (species) =>
          dispatch({
            type: 'PLAYER_UPDATE',
            patch: { species: species as ChampionsPokemon['species'] },
          }),
        onNatureChange: (nature) =>
          dispatch({
            type: 'PLAYER_UPDATE',
            patch: { nature: nature as ChampionsPokemon['nature'] },
          }),
        onAbilityChange: (ability) =>
          dispatch({
            type: 'PLAYER_UPDATE',
            patch: { ability: ability as ChampionsPokemon['ability'] },
          }),
        onItemChange: (item) =>
          dispatch({
            type: 'PLAYER_UPDATE',
            patch: {
              item: (item || undefined) as ChampionsPokemon['item'],
            },
          }),
        onStatPointChange: (stat, value) =>
          dispatch({
            type: 'PLAYER_UPDATE',
            patch: {
              statPoints: { ...state.player.statPoints, [stat]: value },
            },
          }),
        onMoveChange: (slot, move) => {
          const moves = [...state.player.moves] as string[]
          moves[slot] = move
          dispatch({
            type: 'PLAYER_UPDATE',
            patch: {
              moves: moves.filter(Boolean) as ChampionsPokemon['moves'],
            },
          })
        },
      }}
    >
      <PokemonInfoSection />
    </CalcPokemonStatsProvider>
  )
}

const SandboxLayout = () => {
  const { state, dispatch } = useSandbox()
  // Ref-guarded so StrictMode's dev double-invoke of effects doesn't
  // dispatch CALC_ADD twice per fixture before the first set has landed
  // in state.
  const seededRef = useRef(false)

  useEffect(() => {
    if (seededRef.current) return
    seededRef.current = true
    dispatch({ type: 'PLAYER_UPDATE', patch: SANDBOX_PLAYER })
    for (const fixture of SANDBOX_FIXTURES) {
      dispatch({ type: 'CALC_ADD', calc: fixture })
    }
  }, [dispatch])

  const offensiveCalcs = useMemo(
    () => state.calcs.filter((c) => c.type === 'offensive'),
    [state.calcs],
  )
  const defensiveCalcs = useMemo(
    () => state.calcs.filter((c) => c.type === 'defensive'),
    [state.calcs],
  )
  const speedCalcs = useMemo(
    () => state.calcs.filter((c) => c.type === 'speed'),
    [state.calcs],
  )

  return (
    <div className="mx-auto max-w-[1400px] py-6">
      <header className="mb-4">
        <h1 className="text-3xl font-bold">Galewings</h1>
        <p className="text-text-muted text-sm">
          VGC damage calculator sandbox — {state.player.species}-led.
        </p>
      </header>
      <div className="mb-6 max-w-md">
        <h2 className="text-text-heading border-primary mb-3 border-b-2 pb-1 text-base">
          Your Pokémon
        </h2>
        <PlayerPokemonPanel />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <CalcColumn label="Offensive" calcs={offensiveCalcs} />
        <CalcColumn label="Defensive" calcs={defensiveCalcs} />
        <SpeedColumn label="Speed" calcs={speedCalcs} />
      </div>
    </div>
  )
}

const CalcColumn = ({
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
    {calcs.map((calc) => {
      if (calc.type === 'speed') return null
      return <CalcRow key={calc.id} calc={calc} mode={calc.type} />
    })}
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
      <SpeedCalcRow key={calc.id} calc={calc} />
    ))}
  </div>
)

const IndexPage = () => (
  <SandboxProvider>
    <SandboxLayout />
  </SandboxProvider>
)

export const Route = createFileRoute('/')({
  component: IndexPage,
})
