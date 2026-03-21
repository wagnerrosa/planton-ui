'use client'

import { AcademyNavbarSync } from '@/components/navigation/AcademyNavbarSync'
import { AcademyFooter } from '@/components/navigation/AcademyFooter'
import { HeroContent } from './components/HeroContent'
import { ContentRow } from './components/ContentRow'
import { ContinueTrailsCard } from './components/ContinueTrailsCard'
import { OnboardingDialog } from './components/OnboardingDialog'
import {
  HERO_CONTENTS,
  CONTINUE_WATCHING_ITEMS,
  NEW_CONTENT_ITEMS,
  CONTENT_ITEMS,
  MOCK_TRAILS,
} from './mock-data'

export function HomeScreen() {
  const trailsComConteudo = MOCK_TRAILS.filter(
    (t) => t.status !== 'em-breve' && t.contents.length > 0
  )
  const trailsEmAndamento = MOCK_TRAILS.filter(
    (t) => t.status !== 'concluida' && t.progress > 0
  )
  const hasContinueWatching = CONTINUE_WATCHING_ITEMS.length > 0
  const hasTrailsInProgress = trailsEmAndamento.length > 0

  return (
    <div className="min-h-screen bg-background">
      <AcademyNavbarSync breadcrumbs={[{ label: 'Home' }]} />

      {/* 1. Hero */}
      <HeroContent contents={HERO_CONTENTS} />

      <div className="max-w-[1920px] mx-auto px-6 py-10 flex flex-col gap-12">

        {/* 2. Continue assistindo + Trilhas em andamento */}
        {hasContinueWatching && !hasTrailsInProgress && (
          <ContentRow
            title="Continue assistindo"
            items={CONTINUE_WATCHING_ITEMS}
            showProgress
            showTrail
          />
        )}

        {hasContinueWatching && hasTrailsInProgress && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 -my-10">
            <div className="lg:col-span-2 pr-8 py-10">
              <ContentRow
                title="Continue assistindo"
                items={CONTINUE_WATCHING_ITEMS}
                showProgress
                showTrail
              />
            </div>
            <div className="pt-10 pb-10 lg:pl-8 lg:border-l border-border flex flex-col overflow-hidden">
              <ContinueTrailsCard trails={MOCK_TRAILS} />
            </div>
          </div>
        )}

      </div>

      {CONTINUE_WATCHING_ITEMS.length > 0 && NEW_CONTENT_ITEMS.length > 0 && (
        <div className="border-t border-border" />
      )}

      <div className="max-w-[1920px] mx-auto px-6 py-10 flex flex-col gap-12">

        {/* 3. Novos conteúdos */}
        {NEW_CONTENT_ITEMS.length > 0 && (
          <ContentRow
            title="Novos conteúdos"
            items={NEW_CONTENT_ITEMS}
            loop
          />
        )}

        {/* 4. Trilhas , uma row por trilha */}
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

      <OnboardingDialog />
    </div>
  )
}
