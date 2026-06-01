import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

import { Button } from '~/components/ui/Button'
import { Fieldset } from '~/components/ui/Fieldset'
import { CheckboxField } from '~/components/fields/CheckboxField'
import { NumberField } from '~/components/fields/NumberField'
import { TextAreaField } from '~/components/fields/TextAreaField'
import { TextField } from '~/components/fields/TextField'
import {
  AuroraVeilIcon,
  CalculatorIcon,
  ClockIcon,
  CritIcon,
  EditIcon,
  ElectricTerrainIcon,
  FriendGuardIcon,
  GrassyTerrainIcon,
  HelpingHandIcon,
  ImportIcon,
  ItemIcon,
  LightScreenIcon,
  MistyTerrainIcon,
  PokemonIcon,
  PsychicTerrainIcon,
  ReflectIcon,
  RuinIcon,
  StarIcon,
  SwapIcon,
  TrashIcon,
  TypeIcon,
  WeatherIcon,
  WindIcon,
  XIcon,
} from '~/components/icons'

type SwatchSpec = { name: string; token: string; note?: string }

const BASE_PALETTE: SwatchSpec[] = [
  { name: 'red', token: '--color-red' },
  { name: 'bright-orange', token: '--color-bright-orange' },
  { name: 'pale-orange', token: '--color-pale-orange' },
  { name: 'yellow', token: '--color-yellow' },
  { name: 'white', token: '--color-white' },
  { name: 'light-gray', token: '--color-light-gray' },
  { name: 'ash', token: '--color-ash' },
  { name: 'slate', token: '--color-slate' },
  { name: 'charcoal', token: '--color-charcoal' },
  { name: 'carbon', token: '--color-carbon' },
]

const SEMANTIC_PALETTE: SwatchSpec[] = [
  { name: 'bg', token: '--color-bg', note: 'page background' },
  { name: 'surface', token: '--color-surface' },
  { name: 'surface-hover', token: '--color-surface-hover' },
  { name: 'primary', token: '--color-primary' },
  { name: 'primary-hover', token: '--color-primary-hover' },
  { name: 'accent', token: '--color-accent' },
  { name: 'error', token: '--color-error' },
  { name: 'highlight', token: '--color-highlight' },
]

const BORDER_PALETTE: SwatchSpec[] = [
  { name: 'border', token: '--color-border' },
  { name: 'border-light', token: '--color-border-light' },
  { name: 'border-lighter', token: '--color-border-lighter' },
  { name: 'border-section', token: '--color-border-section' },
]

const TEXT_SHADES: SwatchSpec[] = [
  { name: 'text', token: '--color-text' },
  { name: 'text-heading', token: '--color-text-heading' },
  { name: 'text-label', token: '--color-text-label' },
  { name: 'text-dim', token: '--color-text-dim' },
  { name: 'text-muted', token: '--color-text-muted' },
  { name: 'text-faint', token: '--color-text-faint' },
]

const KO_TIERS: SwatchSpec[] = [
  { name: 'ko-guaranteed-ohko', token: '--color-ko-guaranteed-ohko' },
  { name: 'ko-chance-ohko', token: '--color-ko-chance-ohko' },
  { name: 'ko-guaranteed-2hko', token: '--color-ko-guaranteed-2hko' },
  { name: 'ko-chance-2hko', token: '--color-ko-chance-2hko' },
  { name: 'ko-no-2hko', token: '--color-ko-no-2hko' },
]

const Swatch = ({ name, token, note }: SwatchSpec) => {
  const ref = useRef<HTMLDivElement>(null)
  const [rgb, setRgb] = useState('')
  useEffect(() => {
    if (ref.current) {
      setRgb(getComputedStyle(ref.current).backgroundColor)
    }
  }, [])
  return (
    <div className="border-border overflow-hidden rounded border">
      <div
        ref={ref}
        className="relative flex h-16 w-full items-center justify-center"
        style={{ backgroundColor: `var(${token})` }}
      >
        <span className="rounded bg-black/50 px-2 py-0.5 font-mono text-xs text-white">
          {rgb || '—'}
        </span>
      </div>
      <div className="bg-surface px-2 py-1.5 text-xs">
        <div className="text-text-heading truncate font-mono">{name}</div>
        <div className="text-text-muted truncate font-mono">{token}</div>
        {note && <div className="text-text-faint truncate">{note}</div>}
      </div>
    </div>
  )
}

const Section = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
  <section className="mb-10">
    <h2 className="text-text-heading border-primary mb-3 border-b-2 pb-1 text-lg font-semibold">
      {title}
    </h2>
    {children}
  </section>
)

type InputVariant = { label: string; className: string }

const WideInputVariant = ({ label, className }: InputVariant) => (
  <div>
    <div className="text-text-muted mb-1 text-xs">{label}</div>
    <input
      type="text"
      placeholder="252+ Atk Choice Band Tinkaton Gigaton Hammer vs. 252 HP / 4 Def Iron Hands"
      className={`${className} w-full`}
    />
  </div>
)

const PanelInputVariant = ({ label, className }: InputVariant) => (
  <div className="w-[280px]">
    <div className="text-text-muted mb-1 text-xs">{label}</div>
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="Charizard-Mega-Y"
        className={`${className} w-full`}
      />
      <input
        type="number"
        placeholder="252"
        className={`${className} w-16`}
      />
    </div>
  </div>
)

const QUICK_CALC_VARIANTS: InputVariant[] = [
  {
    label: 'Current (broken — bg-background is undefined)',
    className:
      'border-border bg-background rounded-sm border px-3 py-3 font-mono text-base',
  },
  {
    label: 'Surface-hover (plain)',
    className:
      'border-border bg-surface-hover rounded-sm border px-3 py-3 font-mono text-base',
  },
  {
    label: 'Surface-hover + focus ring',
    className:
      'border-border bg-surface-hover focus:border-primary focus:ring-primary/30 rounded-sm border px-3 py-3 font-mono text-base focus:ring-2 focus:outline-none',
  },
  {
    label: 'Surface-hover + left accent border',
    className:
      'border-border bg-surface-hover border-l-primary rounded-sm border border-l-4 px-3 py-3 font-mono text-base',
  },
  {
    label: 'Surface-hover + inner shadow',
    className:
      'border-border bg-surface-hover rounded-sm border px-3 py-3 font-mono text-base shadow-inner',
  },
  {
    label: 'Combo — surface-hover + focus ring + left accent + inner shadow',
    className:
      'border-border bg-surface-hover border-l-primary focus:border-primary focus:ring-primary/30 rounded-sm border border-l-4 px-3 py-3 font-mono text-base shadow-inner focus:ring-2 focus:outline-none',
  },
  {
    label:
      'Combo + light-gray — bg-light-gray + left accent + focus ring + inner shadow',
    className:
      'bg-light-gray border-l-primary focus:border-primary focus:ring-primary/30 rounded-sm border border-l-4 px-3 py-3 font-mono text-base shadow-inner focus:ring-2 focus:outline-none',
  },
  {
    label:
      'Combo + slate — bg-slate + left accent + focus ring + inner shadow',
    className:
      'bg-slate border-l-primary focus:border-primary focus:ring-primary/30 rounded-sm border border-l-4 px-3 py-3 font-mono text-base shadow-inner focus:ring-2 focus:outline-none',
  },
  {
    label:
      'Combo + charcoal — bg-charcoal + left accent + focus ring + inner shadow',
    className:
      'bg-charcoal border-l-primary focus:border-primary focus:ring-primary/30 rounded-sm border border-l-4 px-3 py-3 font-mono text-base shadow-inner focus:ring-2 focus:outline-none',
  },
  {
    label:
      'Slate + accent only (no border) — bg-slate + left accent + focus ring',
    className:
      'bg-slate border-l-primary border-l-4 focus:ring-primary/30 rounded-sm px-3 py-3 font-mono text-base focus:ring-2 focus:outline-none',
  },
]

const PANEL_INPUT_VARIANTS: InputVariant[] = [
  {
    label: 'Default canvas — border-border bg-bg border px-2 py-1 text-sm',
    className:
      'border-border bg-bg rounded-sm border px-2 py-1 font-mono text-sm',
  },
  {
    label:
      'Combo full — bg-surface-hover + border-l-4 accent + shadow-inner + focus ring',
    className:
      'bg-surface-hover border-l-primary focus:border-primary focus:ring-primary/30 rounded-sm border border-l-4 px-2 py-1 font-mono text-sm shadow-inner focus:ring-2 focus:outline-none',
  },
  {
    label: 'Combo thinner accent — same but border-l-2',
    className:
      'bg-surface-hover border-l-primary focus:border-primary focus:ring-primary/30 rounded-sm border border-l-2 px-2 py-1 font-mono text-sm shadow-inner focus:ring-2 focus:outline-none',
  },
  {
    label: 'No accent — bg-surface-hover + shadow-inner + focus ring',
    className:
      'bg-surface-hover focus:border-primary focus:ring-primary/30 rounded-sm border px-2 py-1 font-mono text-sm shadow-inner focus:ring-2 focus:outline-none',
  },
  {
    label: 'Minimal — bg-surface-hover + focus ring only',
    className:
      'bg-surface-hover focus:border-primary focus:ring-primary/30 rounded-sm border px-2 py-1 font-mono text-sm focus:ring-2 focus:outline-none',
  },
  {
    label:
      'No accent + light-gray — bg-light-gray + shadow-inner + focus ring',
    className:
      'bg-light-gray focus:border-primary focus:ring-primary/30 rounded-sm border px-2 py-1 font-mono text-sm shadow-inner focus:ring-2 focus:outline-none',
  },
  {
    label: 'No accent + slate — bg-slate + shadow-inner + focus ring',
    className:
      'bg-slate focus:border-primary focus:ring-primary/30 rounded-sm border px-2 py-1 font-mono text-sm shadow-inner focus:ring-2 focus:outline-none',
  },
  {
    label: 'No accent + charcoal — bg-charcoal + shadow-inner + focus ring',
    className:
      'bg-charcoal focus:border-primary focus:ring-primary/30 rounded-sm border px-2 py-1 font-mono text-sm shadow-inner focus:ring-2 focus:outline-none',
  },
  {
    label:
      'Slate + accent only (no border) — bg-slate + left accent + focus ring',
    className:
      'bg-slate border-l-primary border-l-4 focus:ring-primary/30 rounded-sm px-2 py-1 font-mono text-sm focus:ring-2 focus:outline-none',
  },
]

const Subsection = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
  <div className="mb-5">
    <h3 className="text-text-muted mb-2 text-xs font-medium tracking-wide uppercase">
      {title}
    </h3>
    {children}
  </div>
)

const IconCell = ({
  name,
  children,
}: {
  name: string
  children: React.ReactNode
}) => (
  <div className="border-border bg-surface flex flex-col items-center gap-1 rounded border p-3">
    <div className="text-text-heading text-2xl leading-none">{children}</div>
    <div className="text-text-muted font-mono text-[0.65rem]">{name}</div>
  </div>
)

const DesignPage = () => {
  const [text, setText] = useState('')
  const [num, setNum] = useState(50)
  const [checked, setChecked] = useState(false)
  const [notes, setNotes] = useState('')

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Design</h1>
        <p className="text-text-muted text-sm">
          Theme tokens and UI element reference. Edit{' '}
          <code className="font-mono text-xs">app/index.css</code> to change
          tokens.
        </p>
      </header>

      <Section title="Colors">
        <Subsection title="Base palette">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {BASE_PALETTE.map((s) => (
              <Swatch key={s.token} {...s} />
            ))}
          </div>
        </Subsection>
        <Subsection title="Semantic">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {SEMANTIC_PALETTE.map((s) => (
              <Swatch key={s.token} {...s} />
            ))}
          </div>
        </Subsection>
        <Subsection title="Borders">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {BORDER_PALETTE.map((s) => (
              <Swatch key={s.token} {...s} />
            ))}
          </div>
        </Subsection>
        <Subsection title="Text shades">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {TEXT_SHADES.map((s) => (
              <Swatch key={s.token} {...s} />
            ))}
          </div>
        </Subsection>
        <Subsection title="KO tiers">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
            {KO_TIERS.map((s) => (
              <Swatch key={s.token} {...s} />
            ))}
          </div>
        </Subsection>
      </Section>

      <Section title="Typography">
        <div className="border-border bg-surface space-y-2 rounded border p-4">
          <h1 className="text-3xl font-bold">Heading 1 — text-3xl bold</h1>
          <h2 className="text-2xl font-semibold">
            Heading 2 — text-2xl semibold
          </h2>
          <h3 className="text-lg font-semibold">Heading 3 — text-lg semibold</h3>
          <p className="text-base">Body — text-base default</p>
          <p className="text-sm">Body — text-sm</p>
          <p className="text-xs">Body — text-xs</p>
          <p className="text-text-heading">text-text-heading (full)</p>
          <p className="text-text-label">text-text-label (80%)</p>
          <p className="text-text-dim">text-text-dim (60%)</p>
          <p className="text-text-muted">text-text-muted</p>
          <p className="text-text-faint">text-text-faint (40%)</p>
          <p className="font-mono text-sm">font-mono — 252+ Atk Choice Band</p>
          <p className="tabular-nums">tabular-nums — 100.0% – 117.6%</p>
        </div>
      </Section>

      <Section title="Buttons">
        <Subsection title="Variants — md">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="tertiary">Tertiary</Button>
            <Button variant="danger">Danger</Button>
            <Button disabled>Disabled</Button>
          </div>
        </Subsection>
        <Subsection title="Variants — sm">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="primary" size="sm">
              Primary
            </Button>
            <Button variant="secondary" size="sm">
              Secondary
            </Button>
            <Button variant="tertiary" size="sm">
              Tertiary
            </Button>
            <Button variant="danger" size="sm">
              Danger
            </Button>
          </div>
        </Subsection>
        <Subsection title="With icon / icon-only">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="primary" icon={ImportIcon}>
              Import
            </Button>
            <Button variant="secondary" icon={EditIcon}>
              Edit
            </Button>
            <Button variant="danger" icon={TrashIcon}>
              Delete
            </Button>
            <Button variant="tertiary" icon={XIcon} aria-label="Close" />
            <Button variant="secondary" icon={EditIcon} aria-label="Edit" />
          </div>
        </Subsection>
      </Section>

      <Section title="Fields">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="border-border bg-surface rounded border p-4">
            <TextField
              label="TextField"
              value={text}
              onChange={setText}
              placeholder="Type here…"
              className="border-border bg-bg w-full rounded-sm border px-2 py-1 text-sm"
            />
          </div>
          <div className="border-border bg-surface rounded border p-4">
            <label className="text-text-label mb-1 block text-xs font-medium">
              NumberField
            </label>
            <NumberField
              value={num}
              onChange={setNum}
              min={0}
              max={252}
              step={4}
              className="border-border bg-bg w-full rounded-sm border px-2 py-1 text-sm"
            />
          </div>
          <div className="border-border bg-surface rounded border p-4">
            <CheckboxField
              label="CheckboxField"
              checked={checked}
              onChange={setChecked}
            />
          </div>
          <div className="border-border bg-surface rounded border p-4">
            <TextAreaField
              label="TextAreaField"
              value={notes}
              onChange={setNotes}
              placeholder="Notes…"
              rows={3}
              className="border-border bg-bg w-full rounded-sm border px-2 py-1 text-sm"
            />
          </div>
        </div>
      </Section>

      <Section title="Quick Calc input — variants">
        <p className="text-text-muted mb-4 text-sm">
          Compare visual treatments for the parse input on the home page. Each
          variant is an inert mock — typing is allowed but nothing is wired up.
          Pick one and we&apos;ll apply it to{' '}
          <code className="font-mono text-xs">routes/index.tsx</code>.
        </p>
        <div className="flex flex-col gap-5">
          {QUICK_CALC_VARIANTS.map(({ label, className }) => (
            <WideInputVariant key={label} label={label} className={className} />
          ))}
        </div>
      </Section>

      <Section title="Panel input — variants">
        <p className="text-text-muted mb-4 text-sm">
          Compare visual treatments for the panel inputs (Typeahead and
          NumberField) on the home page. Each variant is an inert mock at the
          compact size used inside{' '}
          <code className="font-mono text-xs">SandboxPokemonPanel</code>. Pick
          one and we&apos;ll apply it to the panel fields.
        </p>
        <div className="flex flex-col gap-5">
          {PANEL_INPUT_VARIANTS.map(({ label, className }) => (
            <PanelInputVariant key={label} label={label} className={className} />
          ))}
        </div>
      </Section>

      <Section title="Fieldset">
        <Fieldset legend="Example fieldset">
          <CheckboxField label="One" checked={false} onChange={() => {}} />
          <CheckboxField label="Two" checked={true} onChange={() => {}} />
          <CheckboxField label="Three" checked={false} onChange={() => {}} />
        </Fieldset>
      </Section>

      <Section title="Icons">
        <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
          <IconCell name="PokemonIcon">
            <PokemonIcon species="Incineroar" />
          </IconCell>
          <IconCell name="ItemIcon">
            <ItemIcon item="Choice Band" />
          </IconCell>
          <IconCell name="TypeIcon">
            <TypeIcon typeName="Fire" />
          </IconCell>
          <IconCell name="WeatherIcon">
            <WeatherIcon weather="Sun" />
          </IconCell>
          <IconCell name="GrassyTerrain">
            <GrassyTerrainIcon />
          </IconCell>
          <IconCell name="ElectricTerrain">
            <ElectricTerrainIcon />
          </IconCell>
          <IconCell name="PsychicTerrain">
            <PsychicTerrainIcon />
          </IconCell>
          <IconCell name="MistyTerrain">
            <MistyTerrainIcon />
          </IconCell>
          <IconCell name="Reflect">
            <ReflectIcon />
          </IconCell>
          <IconCell name="LightScreen">
            <LightScreenIcon />
          </IconCell>
          <IconCell name="AuroraVeil">
            <AuroraVeilIcon />
          </IconCell>
          <IconCell name="WindIcon">
            <WindIcon />
          </IconCell>
          <IconCell name="RuinIcon">
            <RuinIcon ruin="sword" />
          </IconCell>
          <IconCell name="StarIcon">
            <StarIcon className="text-accent h-5 w-5" />
          </IconCell>
          <IconCell name="EditIcon">
            <EditIcon className="h-5 w-5" />
          </IconCell>
          <IconCell name="TrashIcon">
            <TrashIcon className="h-5 w-5" />
          </IconCell>
          <IconCell name="XIcon">
            <XIcon className="h-5 w-5" />
          </IconCell>
          <IconCell name="ImportIcon">
            <ImportIcon className="h-5 w-5" />
          </IconCell>
          <IconCell name="ClockIcon">
            <ClockIcon className="h-5 w-5" />
          </IconCell>
          <IconCell name="CalculatorIcon">
            <CalculatorIcon className="h-5 w-5" />
          </IconCell>
          <IconCell name="SwapIcon">
            <SwapIcon className="h-5 w-5" />
          </IconCell>
          <IconCell name="FriendGuardIcon">
            <FriendGuardIcon className="h-5 w-5" />
          </IconCell>
          <IconCell name="CritIcon">
            <CritIcon className="h-5 w-5" />
          </IconCell>
          <IconCell name="HelpingHandIcon">
            <HelpingHandIcon className="h-5 w-5" />
          </IconCell>
        </div>
      </Section>
    </div>
  )
}

export const Route = createFileRoute('/design')({
  component: DesignPage,
})
