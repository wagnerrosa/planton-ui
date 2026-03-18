'use client'

import { ComponentPage } from '@/components/ui/ComponentPage'
import { Card } from '@/components/ui/Card'
import { findComponent } from '@/lib/components-registry'

const meta = findComponent('data-display', 'card')!

export default function CardPage() {
  return (
    <ComponentPage
      category="Data Display"
      name={meta.name}
      description={meta.description}
      filePath={meta.filePath}
    >
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Grid de Cards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 overflow-hidden border-t border-l border-border">
          <Card index="01" headline="Gestão de Insumos" description="Controle de estoque e pedidos integrados à sua operação." ctaLabel="Saiba mais" />
          <Card index="02" headline="Monitoramento de Lavoura" description="Dados em tempo real para decisões mais rápidas." ctaLabel="Ver demo" />
          <Card index="03" headline="Análise de Solo" description="Laudos digitais e recomendações de correção." ctaLabel="Explorar" />
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Card com superfície escura</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 overflow-hidden border-t border-l border-border">
          <Card surface="forest" index="01" headline="Título Forest" description="Card com superfície forest." ctaLabel="Ver" />
        </div>
      </section>
    </ComponentPage>
  )
}
