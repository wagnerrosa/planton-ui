'use client'

import { ComponentPage } from '@/components/ui/ComponentPage'
import { Input } from '@/components/shadcn/input'
import { findComponent } from '@/lib/components-registry'

const meta = findComponent('inputs', 'input')!

export default function InputPage() {
  return (
    <ComponentPage
      category="Inputs & Forms"
      name={meta.name}
      description={meta.description}
      filePath={meta.filePath}
    >
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Default</h2>
        <div className="flex flex-col gap-4 max-w-sm">
          <Input placeholder="Digite seu nome" className="rounded-none border-border focus-visible:ring-0 focus-visible:outline focus-visible:outline-1 focus-visible:outline-planton-accent" />
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Disabled</h2>
        <div className="flex flex-col gap-4 max-w-sm">
          <Input placeholder="Campo desabilitado" disabled className="rounded-none border-border" />
        </div>
      </section>
    </ComponentPage>
  )
}
