'use client'

import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { Progress } from '@/components/shadcn/progress'
import { AcademyNavbar } from '@/components/navigation/AcademyNavbar'
import { ContentTypeIcon } from '../home/components/ContentTypeIcon'
import { CONTENT_ITEMS } from '../home/mock-data'

function findContentById(id: string) {
  return CONTENT_ITEMS.find((c) => c.id === id) ?? null
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

type ContentScreenProps = {
  contentId: string
}

export function ContentScreen({ contentId }: ContentScreenProps) {
  const content = findContentById(contentId)

  if (!content) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Body muted>Conteúdo não encontrado.</Body>
      </div>
    )
  }

  const isVideo = content.type === 'video'

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AcademyNavbar
        userName="Wagner Rosa"
        breadcrumbs={[
          { label: 'Conteúdos', href: '/design-system/screens/academy/home' },
          { label: content.title },
        ]}
      />

      <div className="flex-1 flex flex-col">
        {/* Player */}
        {isVideo ? (
          <MuxPlayer playbackId={content.muxPlaybackId} title={content.title} />
        ) : (
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
        )}

        {/* Content info */}
        <div className="max-w-[900px] mx-auto w-full px-6 py-8 flex flex-col gap-4">
          <Heading as="h1" size="heading-xl">{content.title}</Heading>

          <div className="flex items-center gap-3">
            <ContentTypeIcon type={content.type} />
            <Body size="sm" muted>{content.duration}</Body>
            {content.trail && (
              <Body size="sm" muted>· Trilha: {content.trail.name}</Body>
            )}
          </div>

          <Body muted>{content.description}</Body>

          {content.progress > 0 && (
            <div className="flex items-center gap-3 max-w-sm">
              <Progress value={content.progress} className="flex-1 h-2" />
              <Body size="sm" muted className="shrink-0">{content.progress}%</Body>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
