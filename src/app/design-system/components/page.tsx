import Link from 'next/link'
import { Heading } from '@/components/primitives/Heading'
import { Eyebrow } from '@/components/primitives/Eyebrow'
import { Body } from '@/components/primitives/Body'
import { componentCategories, buttonMeta } from '@/lib/components-registry'

export default function ComponentsIndexPage() {
  return (
    <main className="min-h-screen bg-surface-default max-w-[1400px] mx-auto px-6 py-16 flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <Eyebrow>Catalog</Eyebrow>
        <Heading as="h1" size="heading-xl">Componentes</Heading>
        <Body muted className="max-w-2xl">
          Todos os componentes do design system organizados por categoria. Clique para ver exemplos, variantes e o path do arquivo.
        </Body>
      </div>

      {/* Button - standalone */}
      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Destaque</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 overflow-hidden border-t border-l border-border">
          <Link
            href="/design-system/components/button"
            className="group border-r border-b border-border p-6 flex flex-col gap-2 hover:bg-card transition-colors"
          >
            <span className="font-sans text-base font-medium text-foreground group-hover:text-planton-accent transition-colors">
              {buttonMeta.name}
            </span>
            <span className="text-sm text-planton-muted leading-[1.65]">{buttonMeta.description}</span>
            <span className="font-mono text-xs text-planton-muted/50 mt-1">{buttonMeta.filePath}</span>
          </Link>
        </div>
      </section>

      {/* Categories */}
      {componentCategories.map((category) => {
        const CategoryIcon = category.icon
        return (
          <section key={category.slug} className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <CategoryIcon size={14} className="text-planton-accent" />
              <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">
                {category.label}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 overflow-hidden border-t border-l border-border">
              {category.components.map((comp) => (
                <Link
                  key={comp.slug}
                  href={`/design-system/components/${category.slug}/${comp.slug}`}
                  className="group border-r border-b border-border p-6 flex flex-col gap-2 hover:bg-card transition-colors"
                >
                  <span className="font-sans text-base font-medium text-foreground group-hover:text-planton-accent transition-colors">
                    {comp.name}
                  </span>
                  <span className="text-sm text-planton-muted leading-[1.65]">{comp.description}</span>
                  <span className="font-mono text-xs text-planton-muted/50 mt-1">{comp.filePath}</span>
                </Link>
              ))}
            </div>
          </section>
        )
      })}
    </main>
  )
}
