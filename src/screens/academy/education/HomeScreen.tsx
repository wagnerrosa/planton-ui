'use client'

import { Heading } from '@/components/primitives/Heading'
import { Eyebrow } from '@/components/primitives/Eyebrow'
import { Card } from '@/components/ui/Card'

const courses = [
  { id: '1', index: '01', title: 'Fundamentos do Solo', description: 'Composição, textura e estrutura do solo agrícola.' },
  { id: '2', index: '02', title: 'Irrigação por Gotejamento', description: 'Eficiência hídrica e instalação de sistemas.' },
  { id: '3', index: '03', title: 'Manejo de Pragas', description: 'Controle integrado e uso responsável de defensivos.' },
]

export function HomeScreen() {
  return (
    <div className="min-h-screen bg-surface-default p-6">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <Eyebrow>Academy</Eyebrow>
          <Heading as="h1" size="heading-xl">Trilhas e Cursos</Heading>
        </div>

        <section className="flex flex-col gap-4">
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Destaques</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 overflow-hidden border-t border-l border-border">
            {courses.map((course) => (
              <Card
                key={course.id}
                index={course.index}
                headline={course.title}
                description={course.description}
                ctaLabel="Ver curso"
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
