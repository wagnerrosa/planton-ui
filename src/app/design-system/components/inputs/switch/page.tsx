'use client'

import { ComponentPage } from '@/components/ui/ComponentPage'
import { Switch } from '@/components/shadcn/switch'
import { Label as ShadcnLabel } from '@/components/shadcn/label'
import { findComponent } from '@/lib/components-registry'

const meta = findComponent('inputs', 'switch')!

export default function SwitchPage() {
  return (
    <ComponentPage
      category="Inputs & Forms"
      name={meta.name}
      description={meta.description}
      filePath={meta.filePath}
    >
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Exemplos</h2>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Switch id="quiz-switch" defaultChecked />
            <ShadcnLabel htmlFor="quiz-switch" className="text-sm text-foreground cursor-pointer">Quiz habilitado para esta trilha</ShadcnLabel>
          </div>
          <div className="flex items-center gap-3">
            <Switch id="visibility-switch" />
            <ShadcnLabel htmlFor="visibility-switch" className="text-sm text-foreground cursor-pointer">Trilha visível para todos os clientes</ShadcnLabel>
          </div>
        </div>
      </section>
    </ComponentPage>
  )
}
