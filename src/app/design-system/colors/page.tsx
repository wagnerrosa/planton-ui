import { colors } from '@/tokens/colors'

type Swatch = { name: string; value: string; usage: string; dark?: boolean }

const swatches: Swatch[] = [
  { name: 'forest',         value: colors.planton.forest, usage: 'Primary text, headings, borders on light', dark: true },
  { name: 'dark',           value: colors.planton.dark,   usage: 'Deep contrast band backgrounds',          dark: true },
  { name: 'accent',         value: colors.planton.accent, usage: 'Signal only — borders, labels, CTA',      dark: false },
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
              <span className="font-mono text-sm text-planton-forest">{s.value}</span>
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
            <span className="font-sans text-sm text-planton-muted">rgba(0, 0, 0, 0.2) — superfícies claras</span>
          </div>
          <div className="p-6 bg-planton-dark border border-[rgba(255,255,255,0.1)] flex flex-col gap-1">
            <span className="font-mono text-xs text-planton-accent uppercase tracking-[0.05em]">border-dark</span>
            <span className="font-sans text-sm text-planton-cream/80">rgba(255, 255, 255, 0.1) — superfícies escuras</span>
          </div>
        </div>
      </div>
    </main>
  )
}
