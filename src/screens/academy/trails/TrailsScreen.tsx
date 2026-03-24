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

      {/* 2. Intro text */}
      <div className="max-w-[1920px] mx-auto px-6 pt-12 pb-2 flex flex-col gap-3">
        <Heading as="h2" size="heading-lg">
          Avance no seu ritmo até a certificação
        </Heading>
      </div>

      {/* 3. Grid de trilhas — 2 colunas */}
      <div id="trilhas" className="max-w-[1920px] mx-auto px-6 pt-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_TRAILS.map((t) => (
            <TrailCard
              key={t.id}
              trail={{
                id: t.id,
                title: t.title,
                description: t.description,
                contentsCount: t.totalItems,
                duration: t.totalDuration,
                progress: t.progress,
                status: t.status,
                accentColor: t.accentColor,
                contents: t.contents,
                href: `/design-system/screens/academy/trail/${t.id}`,
              }}
            />
          ))}
        </div>
      </div>

      <AcademyFooter />
    </div>
  )
}
