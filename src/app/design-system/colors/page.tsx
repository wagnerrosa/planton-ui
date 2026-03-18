'use client'

import { colors } from '@/tokens/colors'
import { CopyButton } from '@/components/ui/CopyButton'

type Swatch = { name: string; value: string; usage: string; dark?: boolean }

const swatches: Swatch[] = [
  { name: 'forest',         value: colors.planton.forest, usage: 'Primary text, headings, borders on light', dark: true },
  { name: 'dark',           value: colors.planton.dark,   usage: 'Deep contrast band backgrounds',          dark: true },
  { name: 'accent',         value: colors.planton.accent, usage: 'Signal only - borders, labels, CTA',      dark: false },
  { name: 'cream',          value: colors.planton.cream,  usage: 'On-dark text and backgrounds',            dark: false },
  { name: 'ink',            value: colors.planton.ink,    usage: 'Near-black body text',                    dark: true },
  { name: 'muted',          value: colors.planton.muted,  usage: 'Captions, secondary text',                dark: false },
  { name: 'white',          value: colors.planton.white,  usage: 'Content surfaces',                        dark: false },
  { name: 'surface-card',   value: colors.surface.card,   usage: 'Slightly elevated surfaces',              dark: false },
  { name: 'surface-dark',   value: colors.surface.dark,   usage: 'Dark band surfaces',                      dark: true },
  { name: 'surface-forest', value: colors.surface.forest, usage: 'Brand marketing blocks',                  dark: true },
]

export default function ColorsPage() {
  return (
    <main className="min-h-screen bg-surface-default max-w-[1400px] mx-auto px-6 py-16">
      <div className="flex flex-col gap-2 mb-12">
        <span className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Foundations</span>
        <h1 className="font-heading text-[clamp(2.5rem,3.5vw,3.5rem)] leading-[1.1] tracking-[-0.04em] text-planton-forest">
          Cores
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {swatches.map((s) => (
          <div key={s.name} className="border-b border-r border-border">
            <div
              className="h-24 w-full"
              style={{ background: s.value }}
            />
            <div className="p-4 flex flex-col gap-1">
              <span className="font-mono text-xs uppercase tracking-[0.05em] text-planton-accent">
                {s.name}
              </span>
              <div className="flex items-center gap-1">
                <span className="font-mono text-sm text-planton-forest flex-1">{s.value}</span>
                <CopyButton value={s.value} title="Copiar valor" />
              </div>
              <span className="font-sans text-xs text-planton-muted leading-[1.65]">{s.usage}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 flex flex-col gap-4">
        <h2 className="font-heading text-xl text-planton-forest tracking-[-0.02em]">Bordas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-6 border border-border flex flex-col gap-1">
            <span className="font-mono text-xs text-planton-accent uppercase tracking-[0.05em]">border-light</span>
            <div className="flex items-center gap-1">
              <span className="font-sans text-sm text-planton-muted flex-1">rgba(0, 0, 0, 0.2) - superfícies claras</span>
              <CopyButton value="rgba(0, 0, 0, 0.2)" title="Copiar valor" />
            </div>
          </div>
          <div className="p-6 bg-planton-dark border border-[rgba(255,255,255,0.1)] flex flex-col gap-1">
            <span className="font-mono text-xs text-planton-accent uppercase tracking-[0.05em]">border-dark</span>
            <div className="flex items-center gap-1">
              <span className="font-sans text-sm text-planton-cream/80 flex-1">rgba(255, 255, 255, 0.1) - superfícies escuras</span>
              <CopyButton value="rgba(255, 255, 255, 0.1)" title="Copiar valor" />
            </div>
          </div>
        </div>
      </div>

      {/* Dark Mode */}
      <div className="mt-16 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="font-heading text-xl text-planton-forest tracking-[-0.02em]">Dark Mode</h2>
          <p className="font-sans text-sm text-planton-muted leading-[1.65] max-w-xl">
            No dark mode, as cores de brand permanecem inalteradas. Apenas os tokens de superfície e foreground são substituídos por valores neutros em OKLCH - sem croma, apenas luminosidade.
          </p>
        </div>

        {/* Surfaces */}
        <div className="flex flex-col gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Superfícies - neutras</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 border-t border-l border-border">
            {[
              { token: '--background',       oklch: 'oklch(0.145 0 0)', label: 'App background',    hex: '#1c1c1c' },
              { token: '--card',             oklch: 'oklch(0.205 0 0)', label: 'Card / panel',       hex: '#2a2a2a' },
              { token: '--surface',          oklch: 'oklch(0.18 0 0)',  label: 'Surface base',       hex: '#252525' },
              { token: '--surface-elevated', oklch: 'oklch(0.22 0 0)',  label: 'Surface elevada',    hex: '#2f2f2f' },
              { token: '--surface-hover',    oklch: 'oklch(0.25 0 0)',  label: 'Surface hover',      hex: '#343434' },
            ].map((s) => (
              <div key={s.token} className="border-b border-r border-border flex flex-col">
                <div className="h-16 w-full" style={{ background: s.oklch }} />
                <div className="p-4 flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-xs text-planton-accent uppercase tracking-[0.05em] flex-1">{s.token}</span>
                    <CopyButton value={s.token} title="Copiar token" />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-xs text-foreground/60 flex-1">{s.oklch}</span>
                    <CopyButton value={s.oklch} title="Copiar valor" />
                  </div>
                  <span className="font-sans text-xs text-planton-muted leading-[1.65]">{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Foreground */}
        <div className="flex flex-col gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Foreground - texto</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-border">
            {[
              { token: '--foreground',      oklch: 'oklch(0.985 0 0)', label: 'Texto principal',   bg: '#141414' },
              { token: '--muted-foreground',oklch: 'oklch(0.708 0 0)', label: 'Texto secundário',  bg: '#141414' },
              { token: '--card-foreground', oklch: 'oklch(0.985 0 0)', label: 'Texto em card',     bg: '#2a2a2a' },
            ].map((s) => (
              <div key={s.token} className="border-b border-r border-border flex flex-col">
                <div className="h-16 w-full flex items-center px-5" style={{ background: s.bg }}>
                  <span className="font-sans text-sm" style={{ color: s.oklch }}>Aa - Planton</span>
                </div>
                <div className="p-4 flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-xs text-planton-accent uppercase tracking-[0.05em] flex-1">{s.token}</span>
                    <CopyButton value={s.token} title="Copiar token" />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-xs text-foreground/60 flex-1">{s.oklch}</span>
                    <CopyButton value={s.oklch} title="Copiar valor" />
                  </div>
                  <span className="font-sans text-xs text-planton-muted leading-[1.65]">{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Brand constante */}
        <div className="flex flex-col gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Brand - inalterado</span>
          <p className="font-sans text-xs text-planton-muted leading-[1.65]">
            Estas cores não mudam entre temas. O sidebar sempre usa a paleta brand; o accent sempre sinaliza ação.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-border">
            {[
              { token: '--sidebar',         value: '#0A2D30', label: 'Sidebar background' },
              { token: '--sidebar-accent',  value: '#145559', label: 'Sidebar hover / active' },
              { token: '--planton-accent',  value: '#ADCF78', label: 'Accent - CTA, labels' },
              { token: '--sidebar-primary', value: '#ADCF78', label: 'Sidebar primary action' },
            ].map((s) => (
              <div key={s.token} className="border-b border-r border-border flex flex-col">
                <div className="h-16 w-full" style={{ background: s.value }} />
                <div className="p-4 flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-xs text-planton-accent uppercase tracking-[0.05em] flex-1">{s.token}</span>
                    <CopyButton value={s.token} title="Copiar token" />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-xs text-foreground/60 flex-1">{s.value}</span>
                    <CopyButton value={s.value} title="Copiar valor" />
                  </div>
                  <span className="font-sans text-xs text-planton-muted leading-[1.65]">{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
