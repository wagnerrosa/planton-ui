'use client'

import { ComponentPage } from '@/components/ui/ComponentPage'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/shadcn/tabs'
import { findComponent } from '@/lib/components-registry'

const meta = findComponent('navigation', 'tabs')!

export default function TabsPage() {
  return (
    <ComponentPage
      category="Navigation"
      name={meta.name}
      description={meta.description}
      filePath={meta.filePath}
    >
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Exemplo</h2>
        <Tabs defaultValue="overview" className="max-w-lg">
          <TabsList className="rounded-none bg-surface-card gap-0 p-0">
            <TabsTrigger value="overview" className="rounded-none font-mono text-xs uppercase tracking-[0.05em]">Visão Geral</TabsTrigger>
            <TabsTrigger value="details" className="rounded-none font-mono text-xs uppercase tracking-[0.05em]">Detalhes</TabsTrigger>
            <TabsTrigger value="history" className="rounded-none font-mono text-xs uppercase tracking-[0.05em]">Histórico</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="pt-4 font-sans text-sm text-planton-muted leading-[1.65]">
            Resumo da operação atual com principais métricas.
          </TabsContent>
          <TabsContent value="details" className="pt-4 font-sans text-sm text-planton-muted leading-[1.65]">
            Detalhes técnicos e configurações avançadas.
          </TabsContent>
          <TabsContent value="history" className="pt-4 font-sans text-sm text-planton-muted leading-[1.65]">
            Registro de ações e alterações recentes.
          </TabsContent>
        </Tabs>
      </section>
    </ComponentPage>
  )
}
