'use client'

import { ComponentPage } from '@/components/ui/ComponentPage'
import { ContentCard } from '@/screens/academy/home/components/ContentCard'
import { findComponent } from '@/lib/components-registry'
import { CONTENT_ITEMS, CONTINUE_WATCHING_ITEMS } from '@/screens/academy/home/mock-data'

const meta = findComponent('data-display', 'content-card')!

export default function ContentCardPage() {
  return (
    <ComponentPage
      category="Data Display · Academy"
      name={meta.name}
      description={meta.description}
      filePath={meta.filePath}
    >
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Padrão</h2>
        <div className="flex gap-4 flex-wrap">
          {CONTENT_ITEMS.slice(0, 3).map((item) => (
            <ContentCard key={item.id} content={item} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Com progresso (Continue assistindo)</h2>
        <div className="flex gap-4 flex-wrap">
          {CONTINUE_WATCHING_ITEMS.slice(0, 3).map((item) => (
            <ContentCard key={item.id} content={item} showProgress />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Com label de trilha</h2>
        <div className="flex gap-4 flex-wrap">
          {CONTENT_ITEMS.slice(0, 3).map((item) => (
            <ContentCard key={item.id} content={item} showTrail />
          ))}
        </div>
      </section>
    </ComponentPage>
  )
}
