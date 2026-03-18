'use client'

import { ComponentPage } from '@/components/ui/ComponentPage'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import { findComponent } from '@/lib/components-registry'

const meta = findComponent('layout', 'scroll-area')!

export default function ScrollAreaPage() {
  return (
    <ComponentPage
      category="Layout & Structure"
      name={meta.name}
      description={meta.description}
      filePath={meta.filePath}
    >
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Lista com scroll</h2>
        <ScrollArea className="h-48 w-72 border border-border p-4">
          <div className="flex flex-col gap-2">
            {[
              'Ana Beatriz Silva',
              'Carlos Eduardo Mota',
              'Fernanda Lima',
              'Rafael Gonçalves',
              'Juliana Pereira',
              'Marcos Oliveira',
              'Patrícia Almeida',
              'Bruno Nascimento',
              'Camila Rocha',
              'Diego Ferreira',
              'Larissa Santos',
              'Thiago Monteiro',
            ].map((name) => (
              <p key={name} className="text-sm text-foreground border-b border-border pb-2 last:border-0">
                {name}
              </p>
            ))}
          </div>
        </ScrollArea>
      </section>
    </ComponentPage>
  )
}
