'use client'

import { useState } from 'react'
import { ComponentPage } from '@/components/ui/ComponentPage'
import { Label as ShadcnLabel } from '@/components/shadcn/label'
import { Calendar } from '@/components/shadcn/calendar'
import { findComponent } from '@/lib/components-registry'

const meta = findComponent('overlays', 'calendar')!

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  return (
    <ComponentPage
      category="Overlays"
      name={meta.name}
      description={meta.description}
      filePath={meta.filePath}
    >
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Seletor de data</h2>
        <div className="flex flex-col gap-3">
          <ShadcnLabel className="text-sm font-medium text-foreground">Agendar publicação do conteúdo</ShadcnLabel>
          <div className="border border-border w-fit">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
            />
          </div>
          {selectedDate && (
            <p className="text-sm text-muted-foreground">
              Data selecionada: {selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          )}
        </div>
      </section>
    </ComponentPage>
  )
}
