'use client'

import { ComponentPage } from '@/components/ui/ComponentPage'
import { ContentRow } from '@/screens/academy/home/components/ContentRow'
import { findComponent } from '@/lib/components-registry'
import { CONTENT_ITEMS, CONTINUE_WATCHING_ITEMS } from '@/screens/academy/home/mock-data'

const meta = findComponent('layout', 'content-row')!

export default function ContentRowPage() {
  return (
    <ComponentPage
      category="Layout & Structure · Academy"
      name={meta.name}
      description={meta.description}
      filePath={meta.filePath}
    >
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Padrão</h2>
        <ContentRow
          title="Novos conteúdos"
          items={CONTENT_ITEMS}
        />
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Com progresso</h2>
        <ContentRow
          title="Continue assistindo"
          items={CONTINUE_WATCHING_ITEMS}
          showProgress
          showTrail
        />
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Com link de trilha</h2>
        <ContentRow
          title="Fundamentos ESG"
          items={CONTENT_ITEMS.slice(0, 4)}
          trailHref="/design-system/screens/academy/trail/trail-1"
        />
      </section>
    </ComponentPage>
  )
}
