// Registry for "history-dependent" variable-power moves and the Supreme
// Overlord ability — the small tail @smogon/calc does NOT derive from the
// inputs the app already sets, so they silently fall through to the move's
// static base power (see gen789.ts `calculateBasePowerSMSSSV` switch default).
//
// This module is the single source of truth shared by the UI (which control
// to reveal, its label/bounds) and the calc (the base-power formula). Keep it
// pure — no React, no @smogon/calc imports — so both sides depend only on data.
//
// Move names must match @smogon/calc's canonical names exactly (verified
// against the installed package).

export type ConditionId = 'doubled' | 'alliesFainted' | 'timesHit'

// Per-side condition state. All optional: an absent key means "not set",
// which the formulas treat as the neutral/zero/false case.
export type MoveConditions = {
  doubled?: boolean
  alliesFainted?: number
  timesHit?: number
}

export type ConditionControl =
  | { id: ConditionId; kind: 'toggle'; label: string }
  | { id: ConditionId; kind: 'count'; label: string; min: number; max: number }

// Moves that sit at a static base power in @smogon/calc but simply double when
// a battle-history condition the calc can't see is met (the user was hit this
// turn, the previous move failed, the target already took damage, …). The
// trigger differs per move but the effect is always ×2, so a single generic
// toggle covers all of them — far less UI than one labelled control each. The
// `trigger` text is surfaced in the toggle's tooltip so the user knows what
// they're asserting; `doubledBp` is the post-double base, kept as data so this
// module stays pure (no @smogon/calc base-power lookup needed).
const DOUBLING_MOVES: Record<string, { trigger: string; doubledBp: number }> = {
  Avalanche: { trigger: 'User was damaged by the target this turn', doubledBp: 120 },
  Revenge: { trigger: 'User was damaged by the target this turn', doubledBp: 120 },
  'Temper Flare': { trigger: "User's previous move failed", doubledBp: 150 },
  'Stomping Tantrum': { trigger: "User's previous move failed", doubledBp: 150 },
  Assurance: { trigger: 'Target already took damage this turn', doubledBp: 120 },
  Retaliate: { trigger: 'An ally fainted last turn', doubledBp: 140 },
  Round: { trigger: 'An ally already used Round this turn', doubledBp: 120 },
  // The calc's own Lash Out double is dead code: its `countBoosts(...) < 0`
  // guard can never be true (countBoosts sums only positive stages, so it's
  // always ≥ 0). So the calc never doubles Lash Out — we own it entirely, and
  // there's no risk of stacking with the calc's mod. The trigger is "a stat was
  // lowered this turn", which is independent of the *net* boost the app sets for
  // the Attack stat: +2 Swords Dance then −1 Intimidate is net +1 but still
  // doubles, so this must be a toggle, not derived from boosts.
  'Lash Out': { trigger: 'A stat was lowered this turn', doubledBp: 150 },
}

// The scaling controls — these moves don't simply double, so they keep a
// dedicated count slider rather than collapsing into the ×2 toggle.
const COUNT_CONTROLS: Record<'alliesFainted' | 'timesHit', ConditionControl> = {
  alliesFainted: {
    id: 'alliesFainted',
    kind: 'count',
    label: 'Allies fainted',
    min: 0,
    max: 3,
  },
  timesHit: { id: 'timesHit', kind: 'count', label: 'Times hit', min: 0, max: 6 },
}

// Which contextual controls apply to the selected move/ability. Empty when the
// move is an ordinary one and no relevant ability is set — the UI renders
// nothing in that case (the whole point: zero footprint by default).
//
// Controls are additive: a Supreme Overlord user throwing a doubling move shows
// both the ×2 toggle and the allies-fainted slider.
//
// `alliesFainted` is one control feeding two mechanics: Last Respects' base
// power AND Supreme Overlord's every-move boost. When only Supreme Overlord is
// present (any move), the control still shows.
export const relevantConditions = (
  move: string,
  ability?: string,
): ConditionControl[] => {
  const controls: ConditionControl[] = []
  const doubler = DOUBLING_MOVES[move]
  if (doubler)
    controls.push({
      id: 'doubled',
      kind: 'toggle',
      label: `${doubler.trigger} (×2 power)`,
    })
  if (move === 'Last Respects' || ability === 'Supreme Overlord')
    controls.push(COUNT_CONTROLS.alliesFainted)
  if (move === 'Rage Fist') controls.push(COUNT_CONTROLS.timesHit)
  return controls
}

// The resolved base power for a condition-driven move, or undefined when the
// move isn't one of them OR its condition isn't met (let the calc compute base
// power normally). The calc applies this as the pre-modifier base; STAB/items/
// BP-mods still chain on top.
export const conditionalBasePower = (
  move: string,
  c: MoveConditions,
): number | undefined => {
  const doubler = DOUBLING_MOVES[move]
  if (doubler) return c.doubled ? doubler.doubledBp : undefined
  switch (move) {
    case 'Last Respects':
      return 50 * (1 + (c.alliesFainted ?? 0))
    case 'Rage Fist':
      return Math.min(350, 50 + 50 * (c.timesHit ?? 0))
    default:
      return undefined
  }
}
