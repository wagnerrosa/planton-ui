import { SidebarProvider } from '@/components/shadcn/sidebar'
import { DesignSystemSidebar, SidebarCollapseButton } from '@/components/navigation/DesignSystemSidebar'
import { Card } from '@/components/ui/Card'

const sections = [
  {
    href: '/design-system/colors',
    label: 'Colors',
    description: 'Brand palette, semantic color tokens and correct usage examples',
  },
  {
    href: '/design-system/typography',
    label: 'Typography',
    description: 'Font scales, line-height, tracking and visual hierarchy',
  },
  {
    href: '/design-system/components',
    label: 'Components',
    description: 'Reusable primitives: Button, Card, Input, Dialog, Tabs, Badge and more',
  },
  {
    href: '/design-system/screens',
    label: 'Screens',
    description: 'Real Planton product screens with documented layout and behavior',
  },
]

const gettingStarted = [
  'Use tokens instead of hardcoded values (colors, spacing, typography)',
  'Prefer existing primitives before creating new components',
  'Reuse components whenever possible — avoid duplication',
  'Follow the project naming and structure conventions',
]

const changelog = [
  { date: '21 mar 2026', entry: 'Added Images page to Foundations with 5 Brazilian biomes and download' },
  { date: '21 mar 2026', entry: 'Privacy Policy and Terms of Use with dialog in Academy footer' },
  { date: '21 mar 2026', entry: 'Design System home now accessible directly at design.planton.eco.br' },
  { date: '21 mar 2026', entry: 'Added Login flow' },
  { date: '20 mar 2026', entry: 'Added Sidebar navigation' },
  { date: '19 mar 2026', entry: 'Button styles updated' },
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
                Token, component and pattern reference for all Planton products.
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="font-mono text-xs text-planton-muted/60">v0.3.0</span>
                <span className="w-px h-3 bg-border" />
                <span className="font-mono text-xs text-planton-muted/60">Updated March 2026</span>
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
                Explore
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 overflow-hidden border-t border-l border-border">
                {sections.map((s) => (
                  <Card
                    key={s.href}
                    cardHref={s.href}
                    headline={s.label}
                    description={s.description}
                    ctaLabel="View"
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
