'use client'

import { ComponentPage } from '@/components/ui/ComponentPage'
import { Badge } from '@/components/shadcn/badge'
import { findComponent } from '@/lib/components-registry'

const meta = findComponent('data-display', 'badge')!

export default function BadgePage() {
  return (
    <ComponentPage
      category="Data Display"
      name={meta.name}
      description={meta.description}
      filePath={meta.filePath}
    >
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Variantes</h2>
        <div className="flex flex-wrap gap-3">
          <Badge>Ativo</Badge>
          <Badge variant="outline">Pendente</Badge>
          <Badge variant="destructive">Erro</Badge>
          <Badge variant="success">Concluído</Badge>
          <Badge variant="warning">Em andamento</Badge>
          <Badge variant="info">Informação</Badge>
        </div>
      </section>
    </ComponentPage>
  )
}
