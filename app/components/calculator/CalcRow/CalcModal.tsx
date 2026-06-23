import { useCallback, useEffect, useRef, useState } from 'react'

import { formatSummary } from '~/components/calculator/CalcRow/formatSummary'
import { FieldConditionsSection } from '~/components/calculator/FieldConditionsSection'
import { ModifiersSection } from '~/components/calculator/ModifiersSection'
import { PokemonInfoSection } from '~/components/calculator/PokemonInfoSection'
import { PokemonIcon } from '~/components/icons'
import { Modal } from '~/components/layout/Modal'
import { UnsavedChangesDialog } from '~/components/ui/UnsavedChangesDialog'
import { useCalcRowContext } from '~/context/CalcRowContext'
import { useCalcRow } from '~/hooks/calc/useCalcRow'
import { useExpandedCalc } from '~/hooks/calc/useExpandedCalc'
import { useSpeciesAbilities } from '~/hooks/api/data'
import { useSuppressUnsavedWarning } from '~/hooks/useSuppressUnsavedWarning'
import { useCalcStore } from '~/calc/store'
import type { Calc } from '~/calc/types'
import type { ChampionsPokemon } from '~/types'

const pokemonIconClass =
  'relative inline-block w-[2.4em] h-[2em] overflow-hidden align-middle'

export const CalcModal = () => {
  const { calcId, mode } = useCalcRowContext()
  const {
    calc,
    playerSide,
    opponentSide,
    attackerSide,
    defenderSide,
    result,
  } = useCalcRow(calcId, mode)
  const { expandedId, setExpandedId } = useExpandedCalc()
  const setOpponent = useCalcStore((s) => s.setOpponent)
  const patchCalc = useCalcStore((s) => s.patchCalc)
  const replaceCalc = useCalcStore((s) => s.replaceCalc)
  const { suppressed } = useSuppressUnsavedWarning()
  const isOpen = expandedId === calcId

  const snapshotRef = useRef<Calc | null>(null)
  const calcRef = useRef(calc)
  calcRef.current = calc
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (isOpen && snapshotRef.current === null) {
      snapshotRef.current = structuredClone(calc)
    } else if (!isOpen) {
      snapshotRef.current = null
    }
    // Only react to isOpen transitions — re-cloning every calc change
    // during editing would defeat the snapshot's purpose.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const isCalcDirty = useCallback(
    () =>
      snapshotRef.current !== null &&
      JSON.stringify(snapshotRef.current) !== JSON.stringify(calcRef.current),
    [],
  )

  const forceClose = () => {
    if (snapshotRef.current && isCalcDirty()) {
      replaceCalc(calcId, snapshotRef.current)
    }
    setShowConfirm(false)
    setExpandedId(null)
  }

  const handleClose = () => {
    if (!isCalcDirty() || suppressed) {
      forceClose()
      return
    }
    setShowConfirm(true)
  }

  const { speciesAbilities: opponentAbilities } = useSpeciesAbilities(
    calc.opponent.species,
  )

  const topSide = mode === 'offensive' ? 'player' : 'opponent'
  const bottomSide = mode === 'offensive' ? 'opponent' : 'player'
  const topSpecies =
    mode === 'offensive'
      ? playerSide.pokemon.species
      : opponentSide.pokemon.species
  const bottomSpecies =
    mode === 'offensive'
      ? opponentSide.pokemon.species
      : playerSide.pokemon.species

  const onOpponentUpdate = (patch: Partial<ChampionsPokemon>) =>
    setOpponent(calcId, patch)

  const defenderMaxHp = result?.defenderMaxHp ?? 1
  const title = formatSummary(
    attackerSide,
    defenderSide,
    mode,
    result,
    defenderMaxHp,
    calc.fieldConditions,
  )

  return (
    <>
      <Modal open={isOpen} title={title} onClose={handleClose}>
        <div className="mb-1 flex items-end gap-1 leading-none">
          <PokemonIcon className={pokemonIconClass} species={topSpecies} />
          <span className="text-text-dim text-sm font-semibold">
            {topSpecies} Modifiers
          </span>
        </div>
        <ModifiersSection side={topSide} />
        <FieldConditionsSection />
        <PokemonInfoSection
          compact
          name={calc.name}
          notes={calc.notes}
          pokemon={calc.opponent}
          speciesAbilities={opponentAbilities ?? []}
          onAbilityChange={(ability) =>
            onOpponentUpdate({
              ability: ability as ChampionsPokemon['ability'],
            })
          }
          onItemChange={(item) =>
            onOpponentUpdate({
              item: (item || undefined) as ChampionsPokemon['item'],
            })
          }
          onMoveChange={(slot, move) => {
            const moves = [...calc.opponent.moves] as string[]
            moves[slot] = move
            onOpponentUpdate({
              moves: moves.filter(Boolean) as ChampionsPokemon['moves'],
            })
          }}
          onNameChange={(name) => patchCalc(calcId, { name })}
          onNatureChange={(nature) =>
            onOpponentUpdate({ nature: nature as ChampionsPokemon['nature'] })
          }
          onNotesChange={(notes) => patchCalc(calcId, { notes })}
          onSpeciesChange={(species) =>
            onOpponentUpdate({
              species: species as ChampionsPokemon['species'],
            })
          }
          onStatPointChange={(stat, value) =>
            onOpponentUpdate({
              statPoints: { ...calc.opponent.statPoints, [stat]: value },
            })
          }
        />
        <div className="mt-2 mb-1 flex items-end gap-1 leading-none">
          <PokemonIcon className={pokemonIconClass} species={bottomSpecies} />
          <span className="text-text-dim text-sm font-semibold">
            {bottomSpecies} Modifiers
          </span>
        </div>
        <ModifiersSection side={bottomSide} />
      </Modal>
      <UnsavedChangesDialog
        open={showConfirm}
        onDiscard={forceClose}
        onStay={() => setShowConfirm(false)}
      />
    </>
  )
}
