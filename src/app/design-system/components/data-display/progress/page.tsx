'use client'

import { ComponentPage } from '@/components/ui/ComponentPage'
import { Badge } from '@/components/shadcn/badge'
import { Progress } from '@/components/shadcn/progress'
import { findComponent } from '@/lib/components-registry'

const meta = findComponent('data-display', 'progress')!

export default function ProgressPage() {
  return (
    <ComponentPage
      category="Data Display"
      name={meta.name}
      description={meta.description}
      filePath={meta.filePath}
    >
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Progresso de trilhas</h2>
        <div className="flex flex-col gap-5 max-w-xl">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground">Trilha: Gestão de Emissões de GEE</span>
              <span className="font-mono text-sm text-muted-foreground">65%</span>
            </div>
            <Progress value={65} className="h-1 bg-planton-accent/10" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground">Trilha: Fundamentos ESG</span>
              <Badge variant="default">Concluída</Badge>
            </div>
            <Progress value={100} className="h-1 bg-planton-accent/10" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground">Trilha: GHG Protocol Avançado</span>
              <span className="font-mono text-sm text-muted-foreground">20%</span>
            </div>
            <Progress value={20} className="h-1 bg-planton-accent/10" />
          </div>
        </div>
      </section>
    </ComponentPage>
  )
}
