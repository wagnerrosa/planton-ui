'use client'

import { ComponentPage } from '@/components/ui/ComponentPage'
import { Checkbox } from '@/components/shadcn/checkbox'
import { Label as ShadcnLabel } from '@/components/shadcn/label'
import { findComponent } from '@/lib/components-registry'

const meta = findComponent('inputs', 'checkbox')!

export default function CheckboxPage() {
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
          <div className="flex items-start gap-3">
            <Checkbox id="termos" />
            <ShadcnLabel htmlFor="termos" className="text-sm text-foreground leading-snug cursor-pointer">
              Aceito os termos de uso e política de privacidade
            </ShadcnLabel>
          </div>
          <div className="flex items-start gap-3">
            <Checkbox id="gri" />
            <ShadcnLabel htmlFor="gri" className="text-sm text-foreground leading-snug cursor-pointer">
              Autorizo o uso dos dados para relatórios GRI 404 (opcional)
            </ShadcnLabel>
          </div>
        </div>
      </section>
    </ComponentPage>
  )
}
