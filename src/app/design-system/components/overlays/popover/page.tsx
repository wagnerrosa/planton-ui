'use client'

import { ComponentPage } from '@/components/ui/ComponentPage'
import { Button } from '@/components/primitives/Button'
import { Checkbox } from '@/components/shadcn/checkbox'
import { Label as ShadcnLabel } from '@/components/shadcn/label'
import { Separator } from '@/components/shadcn/separator'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/shadcn/popover'
import { findComponent } from '@/lib/components-registry'

const meta = findComponent('overlays', 'popover')!

export default function PopoverPage() {
  return (
    <ComponentPage
      category="Overlays"
      name={meta.name}
      description={meta.description}
      filePath={meta.filePath}
    >
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Interativo - clique para abrir</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="primary">Filtrar por status</Button>
          </PopoverTrigger>
          <PopoverContent className="w-52" align="start">
            <div className="flex flex-col gap-3">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Status</p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Checkbox id="f-ativo" />
                  <ShadcnLabel htmlFor="f-ativo" className="text-sm text-foreground cursor-pointer">Ativo</ShadcnLabel>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="f-inativo" />
                  <ShadcnLabel htmlFor="f-inativo" className="text-sm text-foreground cursor-pointer">Inativo</ShadcnLabel>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="f-pendente" />
                  <ShadcnLabel htmlFor="f-pendente" className="text-sm text-foreground cursor-pointer">Pendente</ShadcnLabel>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </section>

      <Separator />

      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Preview estático - conteúdo do popover</h2>
        <div className="w-52 border border-border bg-popover shadow-md p-4">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Status</p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Checkbox id="prev-ativo" />
                <ShadcnLabel htmlFor="prev-ativo" className="text-sm text-foreground cursor-pointer">Ativo</ShadcnLabel>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="prev-inativo" />
                <ShadcnLabel htmlFor="prev-inativo" className="text-sm text-foreground cursor-pointer">Inativo</ShadcnLabel>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="prev-pendente" />
                <ShadcnLabel htmlFor="prev-pendente" className="text-sm text-foreground cursor-pointer">Pendente</ShadcnLabel>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ComponentPage>
  )
}
