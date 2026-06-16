# gale-wings--client — AGENTS.md

VGC damage calculator + teambuilder for **Pokémon Champions**. Vite 7 + React 19 + TanStack Router (file-based) + TanStack Query + tRPC + Zustand + Tailwind 4 + `@smogon/calc`. Node 22, TypeScript 5.9, strict mode, ESM.

## What this repo is

```
app/
├── routes/         file-based TanStack routes; routeTree.gen.ts is generated
├── sandbox/        Zustand store for the anonymous sandbox calc page (/)
├── calc/           damage-calc adapter, speed calc, KO classifier, compute-damage
├── components/     calculator/, fields/, pokemon/, ui/, layout/, sandbox/
├── hooks/          api/ (typed trpc wrappers via useNamedQuery/Mutation), calc/, …
├── trpc/           createTRPCContext<AppRouter>() + query client
├── data/           mechanics.ts (TERA_ENABLED, RUIN_ENABLED), regulation constants
├── context/        CalcRowContext, CalcPokemonStatsContext
└── utils/
```

- Sandbox calc page at `/` runs entirely client-side over a Zustand store; static-data queries silently retry, so the page is usable without the API up.
- Authenticated routes (`_authenticated/`) — Clerk + tRPC; teams + Pokémon library + persisted calcs land in Phase C+.
- All server state goes through tRPC + TanStack Query. Damage math runs locally via `@smogon/calc`; the server provides shapes and static data, not calc results.

## What the other repos are

**`gale-wings--api`** at `/Users/djmeyers/dev/gale-wings/api/` (`origin = git@github.com:DJ-Meyers/gale-wings--api.git`). Private pnpm monorepo: Hono + tRPC server on port `8787`, plus the published `@dj-meyers/gale-wings--api-types` package that exports only the tRPC `AppRouter` type. **Read-only from this repo's perspective** — API changes ship in their own PR cycle there.

**`gale-wings--data`** at `/Users/djmeyers/dev/gale-wings/data/` (`origin = git@github.com:DJ-Meyers/gale-wings--data.git`). Standalone repo that publishes `@dj-meyers/gale-wings` — zod schemas, derived types, regulation constants, dex accessors, and alias maps. Same read-only relationship.

Both are consumed from GitHub Packages (no workspace link):

```jsonc
// package.json
"@dj-meyers/gale-wings": "^1.0.0",
"@dj-meyers/gale-wings--api-types": "^0.1.0"
```

You import from these subpaths:

```ts
import { championsPokemonSchema } from '@dj-meyers/gale-wings/schemas'
import type { ChampionsPokemon, CalcParameters } from '@dj-meyers/gale-wings/types'
import type { AppRouter } from '@dj-meyers/gale-wings--api-types'
```

Schema/type changes ship via a `@dj-meyers/gale-wings` version bump from `gale-wings--data`; router-shape changes ship via a `@dj-meyers/gale-wings--api-types` bump from `gale-wings--api`. Bump the matching dep here and run `pnpm install` to pick up either.

**TailRoom** at `/Users/djmeyers/dev/TailRoom/` is the previous-generation VGC calc client. **Read-only reference**, not a port target. Field names and shapes have drifted post-API-alignment; see the handoff doc's D-list for every concrete divergence.

## Goals

- Champions-honest UX: stat points (0–32 per stat, 32 max, sum ≤66), 20 natures, PascalCase tera/weather/terrain, `level: 50` baked in (no level UI per plan Q9).
- Server-state correctness: loose validation (Q10), prefetched static data with `staleTime: Infinity` (Q11), per-side `playerCalcParameters` / `opponentCalcParameters` (no top-level conflation).
- Sandbox-first: anonymous users can land at `/` and use the calculator without signing in (Q12). Auth gates only the persisted layer (teams, Pokémon library, saved calcs).
- Small, reviewable PRs. Atomic Graphite stack; ≤10 min review per PR.

## Non-goals

- **No API code.** No DB, no tRPC routers, no parser, no Showdown parser. All of these are server-side; the client calls RPCs.
- **No "build" vocabulary for a `ChampionsPokemon`.** Always `pokemon` (or `playerPokemon` / `opponentPokemon` / `attackerPokemon` / `defenderPokemon`). Memory-pinned at `~/.claude/projects/-Users-djmeyers-dev/memory/feedback_galewings_pokemon_vocab.md`.
- **No `sp * 8`** for stat-point → EV conversion. The real formula is `sp === 0 ? 0 : 4 + (sp - 1) * 8`. Memory-pinned at `~/.claude/projects/-Users-djmeyers-dev/memory/project_champions_stat_points.md`.
- **No level / `abilityOverride` / `abilityOn` / `boostedStat` UI in MVP** (plan Q6/Q7/Q9). Fields stay in schemas and round-trip; just no controls.
- **No TailRoom defensive-mode crit re-routing.** `isCrit` lives on each side's `CalcParameters` natively; the rendered side is `(side === 'player' && mode === 'offensive') || (side === 'opponent' && mode === 'defensive')`.
- **No persistence in the sandbox layer.** Calcs live in the Zustand store only. Persisted calcs are a separate Phase D feature.

## How the two repos work together

1. **Schemas are the contract.** Anything that crosses the wire is a zod schema in `@dj-meyers/gale-wings/schemas`. Use `looseChampionsPokemonSchema` in editor forms; let the strict version run at submission time only if it ever needs to (Q10 says loose everywhere).
2. **AppRouter type inference.** `app/trpc/client.ts` does `createTRPCContext<AppRouter>()` so every `trpc.X.queryOptions(...)` is typed. But `@trpc/tanstack-react-query@11.17` × `@tanstack/react-query@5.100` **doesn't infer `TQueryFnData` through `queryOptions(...)`** — so every typed query goes through `useNamedQuery<T>` in `app/hooks/api/data.ts`. Consumers destructure `{ <name>, is<Name>Pending, ... }`, not `{ data, isPending }`. Memory-pinned at `project_galewings_trpc_query_inference.md`.
3. **Per-side calc parameters.** `playerCalcParameters` and `opponentCalcParameters` both carry `move`, `teraType`, `boosts`, `status`, `isCrit`, `abilityOn`, `abilityOverride?`, `boostedStat`. The attacker side's `move` is what feeds `new Move`. The `gameType: 'Doubles'` field is hardcoded at the `computeDamage` boundary, not on `fieldConditions`.
4. **Static data prefetch.** App boot prefetches `data.listSpecies / listMoves / listItems / listAbilities` with `staleTime: Infinity, gcTime: Infinity`.
5. **CORS + auth.** API needs `ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174`. Dev bypass: `VITE_DEV_BYPASS_AUTH=true` here pairs with `DEV_BYPASS_AUTH=true` in `../api/.env`.
6. **Regulation gating.** `app/data/mechanics.ts` derives `TERA_ENABLED` and `RUIN_ENABLED` from `currentRegulation`. Hidden inputs default to `''` / `false`; downstream renders stay silent without belt-and-suspenders guards. `vgc-2026-m-a legalItems` has known gaps (Booster Energy, Choice Specs, Safety Goggles, …) — that's API data, comment client-side checks with a "re-enable when X returns to legalItems" note rather than fixing it here.

## Working in this repo

```sh
nvm use                                  # node 22
pnpm install
npx vite --port 5174 --strictPort        # TailRoom holds 5173
npx tsc --noEmit
npx vitest run
```

The API repo's dev server must be running for authenticated routes; the sandbox at `/` works without it. Health probe: `curl -s http://localhost:8787/api/health`.

**Before any PR with visible UI changes:** start dev server, exercise the feature in a browser, list the scenarios to spot-check, and don't mark done until the user confirms. `tsc` + `vitest` verify code correctness, not feature correctness.

## Pointers for fresh agents

Read in this order:

1. **`~/dev/galewings-phase-b-handoff.md`** — current stack state, locked decisions D1–D15, gotchas (Graphite, tooling, CSS), first-moves checklist. **The most load-bearing doc in the project.**
2. **`~/dev/galewings-client-plan.md`** — consolidated rebuild plan. §1 (status), §2 (locked decisions), §5 (Q1–Q16 with rationale), §7 (phase steps 11–14 for Phase C), §9 (process rules).
3. **`~/.claude/projects/-Users-djmeyers-dev/memory/MEMORY.md`** — indexes the three load-bearing memories: SP→EV non-linear formula, `useNamedQuery` pattern, `pokemon`-not-`build` vocab.
4. **`../api/AGENTS.md`** — the API-side counterpart to this doc, including the schema-first contract and stat-point ADR pointer.

## Don'ts

- **Don't write to `../api/`.** API changes ship in their own PR cycle there. If you find a real API bug, surface it; don't patch around it silently. Document workarounds with a re-enable note.
- **Don't port TailRoom code blindly.** Field names and shapes have drifted — every TailRoom carryover needs a D-list pass (handoff §2 / plan §3).
- **Don't add an `abilityOn` / `boostedStat` / `abilityOverride` / level control** without an explicit decision to unwind Q6/Q7/Q9.
- **Don't reintroduce `build` as a `ChampionsPokemon` variable name**, ever.
- **Don't substitute `JSON.parse(JSON.stringify(...))` for `structuredClone`** in `CalcModal.tsx` — preserves more types and matches the established pattern.
- **Don't rename a branch with an open PR** (closes it) and **always `gt submit --stack --no-edit` before `gt sync --force --restack`** (sync can drop un-pushed local commits). Full list of Graphite gotchas in the handoff §4.
