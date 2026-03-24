'use client'

import { AcademyNavbarSync } from '@/components/navigation/AcademyNavbarSync'
import { AcademyFooter } from '@/components/navigation/AcademyFooter'
import { Heading } from '@/components/primitives/Heading'
import { TrailsHero } from './TrailsHero'
import { TrailCard } from './TrailCard'
import { MOCK_TRAILS } from '../home/mock-data'

export function TrailsScreen() {
  return (
    <div className="min-h-screen bg-background">
      <AcademyNavbarSync
        breadcrumbs={[
          { label: 'Home', href: '/design-system/screens/academy/home' },
          { label: 'Trilhas' },
        ]}
      />

      {/* 1. Hero */}
      <TrailsHero />

      {/* 2. Intro text + trilhas — container com borda */}
      <div id="trilhas" className="max-w-[1920px] mx-auto px-6 pb-20">
        <div className="border border-border">

          {/* Heading */}
          <div className="px-10 pt-10 pb-8 border-b border-border">
            <Heading as="h2" size="heading-lg">
              Avance no seu ritmo até a certificação
            </Heading>
          </div>

          {/* Grid de cards — 2 colunas × N linhas, cada célula com border-b + border-r */}
          <div className="grid grid-cols-1 md:grid-cols-2">
            {MOCK_TRAILS.map((t, i) => {
              const totalRows = Math.ceil(MOCK_TRAILS.length / 2)
              const row = Math.floor(i / 2)
              const isLastRow = row === totalRows - 1
              return (
              <div
                key={t.id}
                className={[
                  'px-10',
                  !isLastRow ? 'border-b border-border' : '',
                  i % 2 === 0 ? 'md:border-r md:border-border' : '',
                ].join(' ')}
              >
                <TrailCard
                  trail={{
                    id: t.id,
                    title: t.title,
                    description: t.description,
                    contentsCount: t.totalItems,
                    duration: t.totalDuration,
                    progress: t.progress,
                    status: t.status,
                    contents: t.contents,
                    href: `/design-system/screens/academy/trail/${t.id}`,
                  }}
                />
              </div>
              )
            })}
          </div>

        </div>
      </div>

      <AcademyFooter />
    </div>
  )
}
