import { Card } from '@/components/ui/Card'

const sections = [
  { href: '/design-system/colors',     label: 'Cores',       description: 'Paleta de brand, tokens de cor e uso' },
  { href: '/design-system/typography', label: 'Tipografia',  description: 'Escalas de fonte, espaçamento e hierarquia' },
  { href: '/design-system/components', label: 'Componentes', description: 'Button, Card, Input, Dialog, Tabs, Badge' },
  { href: '/design-system/screens',    label: 'Screens',     description: 'Telas reais dos produtos Planton' },
]

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-surface-default max-w-[1400px] mx-auto px-6 py-16">
      <div className="flex flex-col gap-2 mb-12">
        <span className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Planton UI</span>
        <h1 className="font-heading text-[clamp(2.5rem,3.5vw,3.5rem)] leading-[1.05] tracking-[-0.04em] text-planton-forest">
          Design System
        </h1>
        <p className="font-sans text-base leading-[1.65] text-planton-muted max-w-xl">
          Referência de tokens, componentes e padrões para todos os produtos Planton.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 overflow-hidden border-t border-l border-border">
        {sections.map((s) => (
          <Card
            key={s.href}
            cardHref={s.href}
            headline={s.label}
            description={s.description}
            ctaLabel="Ver"
          />
        ))}
      </div>
    </main>
  )
}
