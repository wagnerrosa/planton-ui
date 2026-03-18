'use client'

import { useState } from 'react'
import { ComponentPage } from '@/components/ui/ComponentPage'
import { Switch } from '@/components/shadcn/switch'
import { Label as ShadcnLabel } from '@/components/shadcn/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/shadcn/collapsible'
import { ChevronDown } from 'lucide-react'
import { findComponent } from '@/lib/components-registry'

const meta = findComponent('layout', 'collapsible')!

export default function CollapsiblePage() {
  const [collapsibleOpen, setCollapsibleOpen] = useState(false)

  return (
    <ComponentPage
      category="Layout & Structure"
      name={meta.name}
      description={meta.description}
      filePath={meta.filePath}
    >
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Configurações avançadas</h2>
        <Collapsible
          open={collapsibleOpen}
          onOpenChange={setCollapsibleOpen}
          className="border border-border max-w-sm"
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors">
            Configurações avançadas da trilha
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${collapsibleOpen ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="border-t border-border px-4 py-4 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Switch id="col-quiz" defaultChecked />
                <ShadcnLabel htmlFor="col-quiz" className="text-sm text-foreground cursor-pointer">Quiz habilitado</ShadcnLabel>
              </div>
              <div className="flex flex-col gap-2">
                <ShadcnLabel className="text-sm font-medium text-foreground">Visibilidade</ShadcnLabel>
                <Select>
                  <SelectTrigger className="rounded-none border-border">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os clientes</SelectItem>
                    <SelectItem value="selecionados">Clientes selecionados</SelectItem>
                    <SelectItem value="privado">Privado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </section>
    </ComponentPage>
  )
}
