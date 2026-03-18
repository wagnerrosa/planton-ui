'use client'

import { useState } from 'react'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { Separator } from '@/components/shadcn/separator'
import { ContinueWatchingCard } from './components/ContinueWatchingCard'
import { TrailsRow } from './components/TrailsRow'
import { ContentModal } from './components/ContentModal'
import { TrailDetailView } from './components/TrailDetailView'
import { MOCK_TRAILS, CONTINUE_WATCHING } from './mock-data'
import type { ContentItem, Trail } from './mock-data'

export function HomeScreen() {
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
  const [selectedTrail, setSelectedTrail] = useState<Trail | null>(null)
  const [contentModalOpen, setContentModalOpen] = useState(false)
  const [detailTrail, setDetailTrail] = useState<Trail | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const trailsEmAndamento = MOCK_TRAILS.filter((t) => t.status === 'em-andamento')
  const trailsConcluidas = MOCK_TRAILS.filter((t) => t.status === 'concluida')

  function handleOpenContent(content: ContentItem, trail: Trail) {
    setSelectedContent(content)
    setSelectedTrail(trail)
    setContentModalOpen(true)
  }

  function handleOpenDetail(trail: Trail) {
    setDetailTrail(trail)
    setDetailOpen(true)
  }

  function handleResumeContinueWatching() {
    const trail = MOCK_TRAILS.find((t) => t.id === CONTINUE_WATCHING.trailId)
    if (trail) {
      handleOpenContent(CONTINUE_WATCHING.content, trail)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar placeholder */}
      <nav className="border-b border-border bg-card">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logos_produtos/planton_academy_forest.svg"
              alt="Planton Academy"
              width={140}
              height={28}
              className="dark:hidden"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logos_produtos/planton_academy_branco.svg"
              alt="Planton Academy"
              width={140}
              height={28}
              className="hidden dark:block"
            />
          </div>
          <div className="flex items-center gap-4">
            <Body size="sm" muted>Wagner Rosa</Body>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-8 flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <Heading as="h1" size="heading-xl">Minhas trilhas</Heading>
          <Body muted>Continue de onde parou ou explore novas trilhas de aprendizado.</Body>
        </div>

        {/* Continue watching */}
        <ContinueWatchingCard onResume={handleResumeContinueWatching} />

        <Separator />

        {/* Em andamento */}
        {trailsEmAndamento.length > 0 && (
          <TrailsRow
            title="Em andamento"
            trails={trailsEmAndamento}
            onOpenDetail={handleOpenDetail}
            onOpenContent={handleOpenContent}
          />
        )}

        {/* Todas as trilhas */}
        <TrailsRow
          title="Todas as trilhas"
          trails={MOCK_TRAILS}
          onOpenDetail={handleOpenDetail}
          onOpenContent={handleOpenContent}
        />

        {/* Concluídas */}
        {trailsConcluidas.length > 0 && (
          <TrailsRow
            title="Concluídas"
            trails={trailsConcluidas}
            onOpenDetail={handleOpenDetail}
            onOpenContent={handleOpenContent}
          />
        )}
      </div>

      {/* Overlays */}
      <ContentModal
        content={selectedContent}
        trail={selectedTrail}
        open={contentModalOpen}
        onClose={() => setContentModalOpen(false)}
      />

      <TrailDetailView
        trail={detailTrail}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onOpenContent={handleOpenContent}
      />
    </div>
  )
}
