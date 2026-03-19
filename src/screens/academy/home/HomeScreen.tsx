'use client'

import { AcademyNavbarSync } from '@/components/navigation/AcademyNavbarSync'
import { AcademyFooter } from '@/components/navigation/AcademyFooter'
import { HeroContent } from './components/HeroContent'
import { ContentRow } from './components/ContentRow'
import {
  HERO_CONTENT,
  CONTINUE_WATCHING_ITEMS,
  NEW_CONTENT_ITEMS,
  CONTENT_ITEMS,
  MOCK_TRAILS,
} from './mock-data'

export function HomeScreen() {
  const trailsComConteudo = MOCK_TRAILS.filter(
    (t) => t.status !== 'em-breve' && t.contents.length > 0
  )

  return (
    <div className="min-h-screen bg-background">
      <AcademyNavbarSync breadcrumbs={[{ label: 'Home' }]} />

      {/* 1. Hero */}
      <HeroContent content={HERO_CONTENT} />

      <div className="max-w-[1400px] mx-auto px-6 py-10 flex flex-col gap-12">

        {/* 2. Continue assistindo */}
        {CONTINUE_WATCHING_ITEMS.length > 0 && (
          <ContentRow
            title="Continue assistindo"
            items={CONTINUE_WATCHING_ITEMS}
            showProgress
            showTrail
          />
        )}

        {/* 3. Novos conteúdos */}
        {NEW_CONTENT_ITEMS.length > 0 && (
          <ContentRow
            title="Novos conteúdos"
            items={NEW_CONTENT_ITEMS}
          />
        )}

        {/* 4. Trilhas — uma row por trilha */}
        {trailsComConteudo.map((trail) => (
          <ContentRow
            key={trail.id}
            title={`Trilha: ${trail.title}`}
            items={trail.contents}
            trailHref={`/design-system/screens/academy/trail/${trail.id}`}
          />
        ))}

        {/* 5. Todos os conteúdos */}
        <ContentRow
          title="Todos os conteúdos"
          items={CONTENT_ITEMS}
        />

      </div>

      <AcademyFooter />
    </div>
  )
}
