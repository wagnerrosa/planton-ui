import Link from 'next/link'

const sections = [
  { href: '/design-system/colors',     label: 'Cores',       description: 'Paleta de brand, tokens de cor e uso' },
  { href: '/design-system/typography', label: 'Tipografia',  description: 'Escalas de fonte, espaçamento e hierarquia' },
  { href: '/design-system/components', label: 'Componentes', description: 'Button, Card, Input, Dialog, Tabs, Badge' },
  { href: '/design-system/patterns',   label: 'Padrões',     description: 'Login, LessonCard e composições de tela' },
]

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-surface-default max-w-[1400px] mx-auto px-6 py-16">
      <div className="flex flex-col gap-2 mb-12">
        <span className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Planton UI</span>
        <h1 className="font-heading text-[clamp(2.5rem,3.5vw,3.5rem)] leading-[1.1] tracking-[-0.04em] text-planton-forest">
          Design System
        </h1>
        <p className="font-sans text-base leading-[1.65] text-planton-muted max-w-xl">
          Referência de tokens, componentes e padrões para todos os produtos Planton.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group relative overflow-hidden border-b border-r border-border p-8 flex flex-col gap-3 hover:bg-surface-card transition-colors duration-200"
          >
            <span className="font-heading text-xl text-planton-forest">{s.label}</span>
            <span className="font-sans text-sm text-planton-muted leading-[1.65]">{s.description}</span>
            <span className="mt-4 font-mono text-xs text-planton-accent">Ver →</span>
          </Link>
        ))}
      </div>
    </main>
  )
}
