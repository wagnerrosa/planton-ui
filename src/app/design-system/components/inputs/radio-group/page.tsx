'use client'

import { ComponentPage } from '@/components/ui/ComponentPage'
import { RadioGroup, RadioGroupItem } from '@/components/shadcn/radio-group'
import { Label as ShadcnLabel } from '@/components/shadcn/label'
import { findComponent } from '@/lib/components-registry'

const meta = findComponent('inputs', 'radio-group')!

export default function RadioGroupPage() {
  return (
    <ComponentPage
      category="Inputs & Forms"
      name={meta.name}
      description={meta.description}
      filePath={meta.filePath}
    >
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Exemplo - Quiz</h2>
        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium text-foreground">O que significa GHG Protocol?</p>
          <RadioGroup defaultValue="b" className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <RadioGroupItem value="a" id="r-a" />
              <ShadcnLabel htmlFor="r-a" className="text-sm text-foreground cursor-pointer">A. Protocolo de gestão hídrica global</ShadcnLabel>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="b" id="r-b" />
              <ShadcnLabel htmlFor="r-b" className="text-sm text-foreground cursor-pointer">B. Padrão para inventário de gases de efeito estufa</ShadcnLabel>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="c" id="r-c" />
              <ShadcnLabel htmlFor="r-c" className="text-sm text-foreground cursor-pointer">C. Regulamento de emissões industriais da ONU</ShadcnLabel>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="d" id="r-d" />
              <ShadcnLabel htmlFor="r-d" className="text-sm text-foreground cursor-pointer">D. Índice de desempenho ambiental corporativo</ShadcnLabel>
            </div>
          </RadioGroup>
        </div>
      </section>
    </ComponentPage>
  )
}
