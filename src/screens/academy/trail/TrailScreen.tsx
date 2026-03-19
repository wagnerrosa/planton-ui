'use client'

import { useState } from 'react'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { Badge } from '@/components/shadcn/badge'
import { Progress } from '@/components/shadcn/progress'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import { AcademyNavbar } from '@/components/navigation/AcademyNavbar'
import { ContentTypeIcon } from '../home/components/ContentTypeIcon'
import { CheckCircle, Circle, CircleDot, Award } from 'lucide-react'
import { MOCK_TRAILS } from '../home/mock-data'
import type { ContentItem, Trail } from '../home/mock-data'

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatusIcon({ status }: { status: ContentItem['status'] }) {
  if (status === 'concluido') return <CheckCircle className="h-4 w-4 text-planton-accent shrink-0" />
  if (status === 'visualizado') return <CircleDot className="h-4 w-4 text-planton-muted shrink-0" />
  return <Circle className="h-4 w-4 text-planton-muted/50 shrink-0" />
}

function MuxPlayer({ playbackId, title }: { playbackId: string; title: string }) {
  return (
    <iframe
      src={`https://player.mux.com/${playbackId}?metadata-video-title=${encodeURIComponent(title)}`}
      title={title}
      style={{ width: '100%', border: 'none', aspectRatio: '16/9' }}
      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
      allowFullScreen
    />
  )
}

function ContentPlaceholder({ content }: { content: ContentItem }) {
  return (
    <div className="w-full relative bg-black" style={{ aspectRatio: '16/9' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={content.thumbnailUrl}
        alt={content.title}
        className="w-full h-full object-cover opacity-50"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <Body muted className="text-white/60 bg-black/40 px-3 py-1.5">
          {content.type === 'podcast' ? 'Podcast' : content.type === 'artigo' ? 'Artigo' : 'Guia'} — sem player
        </Body>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

type TrailScreenProps = {
  trailId: string
}

export function TrailScreen({ trailId }: TrailScreenProps) {
  const trail = MOCK_TRAILS.find((t) => t.id === trailId)
  const [activeIndex, setActiveIndex] = useState(0)

  if (!trail) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Body muted>Trilha não encontrada.</Body>
      </div>
    )
  }

  const activeContent = trail.contents[activeIndex]
  const isVideo = activeContent?.type === 'video'

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AcademyNavbar
        userName="Wagner Rosa"
        breadcrumbs={[
          { label: 'Trilhas', href: '/design-system/screens/academy/home' },
          { label: trail.title },
        ]}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* ---- Sidebar: lista de conteúdos ---- */}
        <aside className="w-[340px] shrink-0 border-r border-border bg-card hidden md:flex flex-col">
          {/* Trail header */}
          <div className="p-5 border-b border-border flex flex-col gap-3">
            <Heading as="h2" size="heading-lg">{trail.title}</Heading>
            <Body size="sm" muted>{trail.totalItems} conteúdos · {trail.totalDuration}</Body>
            <div className="flex items-center gap-3">
              <Progress value={trail.progress} className="flex-1 h-2" />
              <span className="text-sm font-medium text-foreground">{trail.progress}%</span>
            </div>
          </div>

          {/* Content list */}
          <ScrollArea className="flex-1">
            <div className="flex flex-col py-2">
              {trail.contents.map((item, i) => {
                const isActive = i === activeIndex
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    className={`flex items-center gap-3 px-5 py-3 text-left transition-colors ${
                      isActive
                        ? 'bg-sidebar-accent border-l-2 border-planton-accent'
                        : 'hover:bg-card/80 border-l-2 border-transparent'
                    }`}
                  >
                    <span className="text-xs text-planton-muted w-5 shrink-0 text-right">{i + 1}</span>
                    <StatusIcon status={item.status} />
                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                      <span className={`text-sm truncate ${isActive ? 'text-planton-accent font-medium' : 'text-foreground'}`}>
                        {item.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <ContentTypeIcon type={item.type} />
                        <span className="text-xs text-planton-muted">{item.duration}</span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Quiz section */}
            {trail.progress === 100 && (
              <div className="p-5 border-t border-border flex items-center gap-2">
                <Award className="h-5 w-5 text-planton-accent" />
                <Badge variant="secondary">Quiz desbloqueado</Badge>
              </div>
            )}
          </ScrollArea>
        </aside>

        {/* ---- Player area ---- */}
        <div className="flex-1 flex flex-col overflow-auto">
          {/* Player */}
          {activeContent ? (
            isVideo ? (
              <MuxPlayer playbackId={activeContent.muxPlaybackId} title={activeContent.title} />
            ) : (
              <ContentPlaceholder content={activeContent} />
            )
          ) : (
            <div className="w-full bg-muted flex items-center justify-center" style={{ aspectRatio: '16/9' }}>
              <Body muted>Nenhum conteúdo selecionado</Body>
            </div>
          )}

          {/* Content info */}
          {activeContent && (
            <div className="max-w-[900px] px-6 py-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Badge variant="outline">{trail.title}</Badge>
                <ContentTypeIcon type={activeContent.type} />
                <Body size="sm" muted>{activeContent.duration}</Body>
              </div>

              <Heading as="h1" size="heading-xl">{activeContent.title}</Heading>

              <Body muted>
                Conteúdo educacional sobre {activeContent.title.toLowerCase()} — parte da trilha {trail.title}.
              </Body>

              {activeContent.progress > 0 && (
                <div className="flex items-center gap-3 max-w-sm">
                  <Progress value={activeContent.progress} className="flex-1 h-2" />
                  <Body size="sm" muted className="shrink-0">{activeContent.progress}%</Body>
                </div>
              )}
            </div>
          )}

          {/* Mobile: content list below player */}
          <div className="md:hidden px-6 pb-6">
            <div className="flex flex-col gap-1 border-t border-border pt-4">
              <Body size="sm" muted className="mb-2">{trail.totalItems} conteúdos</Body>
              {trail.contents.map((item, i) => {
                const isActive = i === activeIndex
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    className={`flex items-center gap-3 py-2 px-2 text-left transition-colors ${
                      isActive ? 'bg-sidebar-accent' : 'hover:bg-card/80'
                    }`}
                  >
                    <span className="text-xs text-planton-muted w-5 shrink-0 text-right">{i + 1}</span>
                    <StatusIcon status={item.status} />
                    <span className={`text-sm truncate flex-1 ${isActive ? 'text-planton-accent font-medium' : 'text-foreground'}`}>
                      {item.title}
                    </span>
                    <span className="text-xs text-planton-muted shrink-0">{item.duration}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
