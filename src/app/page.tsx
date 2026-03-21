import { SidebarProvider } from '@/components/shadcn/sidebar'
import { DesignSystemSidebar, SidebarCollapseButton } from '@/components/navigation/DesignSystemSidebar'
import { Card } from '@/components/ui/Card'

const sections = [
  {
    href: '/design-system/colors',
    label: 'Cores',
    description: 'Paleta de brand, tokens semânticos de cor e exemplos de uso correto',
  },
  {
    href: '/design-system/typography',
    label: 'Tipografia',
    description: 'Escalas de fonte, line-height, tracking e hierarquia visual',
  },
  {
    href: '/design-system/components',
    label: 'Componentes',
    description: 'Primitivos reutilizáveis: Button, Card, Input, Dialog, Tabs, Badge e mais',
  },
  {
    href: '/design-system/screens',
    label: 'Screens',
    description: 'Telas reais dos produtos Planton com layout e comportamento documentados',
  },
]

const gettingStarted = [
  'Use tokens em vez de valores hardcoded (cores, espaçamento, tipografia)',
  'Prefira primitivos existentes antes de criar novos componentes',
  'Reutilize componentes sempre que possível — evite duplicação',
  'Siga as convenções de nomenclatura e estrutura do projeto',
]

const changelog = [
  { date: '21 mar 2026', entry: 'Adicionada página de Imagens nos Foundations com os 5 biomas brasileiros e download' },
  { date: '21 mar 2026', entry: 'Política de Privacidade e Termos de Uso com dialog no footer do Academy' },
  { date: '21 mar 2026', entry: 'Home do Design System agora acessível direto em design.planton.eco.br' },
  { date: '21 mar 2026', entry: 'Adicionado fluxo de Login' },
  { date: '20 mar 2026', entry: 'Adicionada navegação por Sidebar' },
  { date: '19 mar 2026', entry: 'Estilos do Button atualizados' },
]

export default function Home() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full relative">
        <DesignSystemSidebar />
        <SidebarCollapseButton />
        <main className="flex-1 overflow-auto">
          <div className="min-h-screen bg-surface-default max-w-[1400px] mx-auto px-6 py-16">

            {/* Header */}
            <div className="flex flex-col gap-2 mb-12">
              <span className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Planton UI</span>
              <h1 className="font-heading text-[clamp(2.5rem,3.5vw,3.5rem)] leading-[1.05] tracking-[-0.04em] text-planton-forest">
                Design System
              </h1>
              <p className="font-sans text-base leading-[1.65] text-planton-muted max-w-xl">
                Referência de tokens, componentes e padrões para todos os produtos Planton.
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="font-mono text-xs text-planton-muted/60">v0.3.0</span>
                <span className="w-px h-3 bg-border" />
                <span className="font-mono text-xs text-planton-muted/60">Atualizado em março de 2026</span>
              </div>
            </div>

            {/* Getting Started */}
            <section className="mb-12">
              <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-muted/60 mb-4">
                Getting Started
              </h2>
              <ul className="flex flex-col gap-2 border-l-2 border-planton-accent/30 pl-5">
                {gettingStarted.map((item) => (
                  <li key={item} className="font-sans text-sm leading-[1.65] text-planton-muted">
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* Category Cards */}
            <section className="mb-16">
              <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-muted/60 mb-4">
                Explorar
              </h2>
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
            </section>

            {/* Changelog */}
            <section>
              <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-muted/60 mb-4">
                Changelog
              </h2>
              <ul className="flex flex-col gap-3">
                {changelog.map(({ date, entry }) => (
                  <li key={entry} className="flex items-start gap-3">
                    <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-planton-accent/50 shrink-0" />
                    <div className="flex flex-col gap-0.5">
                      <span className="font-sans text-sm leading-[1.65] text-planton-muted">{entry}</span>
                      <span className="font-mono text-[0.6875rem] text-planton-muted/40">{date}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
