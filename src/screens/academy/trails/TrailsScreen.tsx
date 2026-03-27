'use client'

import { AcademyNavbarSync } from '@/components/navigation/AcademyNavbarSync'
import { AcademyFooter } from '@/components/navigation/AcademyFooter'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { AcademyHero } from '../components/AcademyHero'
import { TrailCard } from './TrailCard'
import { MOCK_TRAILS, TRAILS_HERO_SLIDES } from '../home/mock-data'

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
      <AcademyHero slides={TRAILS_HERO_SLIDES} />

      {/* 2. Intro */}
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-10 text-center">
        <Heading as="h2" size="heading-lg">
          Avance no seu ritmo até a certificação
        </Heading>
        <Body size="base" muted className="mt-3">
          Escolha uma trilha, acompanhe seu progresso e conquiste seu certificado.
        </Body>
      </div>

      {/* Full-width separator */}
      <div className="h-px bg-border" />

      {/* 3. Trail cards */}
      <div className="flex">
        {/* Left gutter */}
        <div className="hidden md:block w-16 shrink-0 border-r border-border" />

        <div className="flex-1 px-6 pt-10 pb-16">
          <div className="max-w-[960px] mx-auto flex flex-col gap-6">
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
                  contents: t.contents,
                  href: `/design-system/screens/academy/trail/${t.id}`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Right gutter */}
        <div className="hidden md:block w-16 shrink-0 border-l border-border" />
      </div>

      <AcademyFooter />
    </div>
  )
}
