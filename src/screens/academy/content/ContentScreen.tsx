'use client'

import Link from 'next/link'
import { Download } from 'lucide-react'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { Button } from '@/components/primitives/Button'
import { AcademyNavbar } from '@/components/navigation/AcademyNavbar'
import { ContentTypeIcon } from '../home/components/ContentTypeIcon'
import { CONTENT_ITEMS } from '../home/mock-data'
import type { ContentItem } from '../home/mock-data'

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

function TrailBadges({ trails }: { trails: { id: string; name: string }[] }) {
  if (trails.length === 0) return null
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Body size="sm" muted>Trilhas:</Body>
      {trails.map((trail) => (
        <Link
          key={trail.id}
          href={`/academy/trail/${trail.id}`}
          className="inline-flex items-center px-3 py-1 rounded-full border border-border text-sm text-foreground hover:bg-muted transition-colors"
        >
          {trail.name}
        </Link>
      ))}
    </div>
  )
}

function ContentMeta({
  content,
  trails,
  firstTrail,
}: {
  content: ContentItem
  trails: { id: string; name: string }[]
  firstTrail: { id: string; name: string } | undefined
}) {
  return (
    <div className="flex flex-col gap-6">
      <Heading as="h1" size="heading-xl">{content.title}</Heading>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <ContentTypeIcon type={content.type} />
          <Body size="sm" muted>{content.duration}</Body>
        </div>
        <TrailBadges trails={trails} />
      </div>

      <Body muted>{content.description}</Body>

      {firstTrail && (
        <div>
          <Button variant="primary" href={`/academy/trail/${firstTrail.id}`}>
            Continuar trilha →
          </Button>
        </div>
      )}
    </div>
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

  const trails = content.trails ?? (content.trail ? [content.trail] : [])
  const firstTrail = trails[0]

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
        {/* Artigo: sem player — conteúdo ocupa a área principal */}
        {content.type === 'artigo' && (
          <div className="max-w-[900px] mx-auto w-full px-6 py-8 flex flex-col gap-8">
            <ContentMeta content={content} trails={trails} firstTrail={firstTrail} />
            <div className="prose prose-invert max-w-none border-t border-border pt-6">
              <p className="text-foreground/80 leading-relaxed">{content.description}</p>
              <p className="text-foreground/60 leading-relaxed mt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p className="text-foreground/60 leading-relaxed mt-4">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
          </div>
        )}

        {/* Vídeo: player em cima, info abaixo */}
        {content.type === 'video' && (
          <>
            <MuxPlayer playbackId={content.muxPlaybackId} title={content.title} />
            <div className="max-w-[900px] mx-auto w-full px-6 py-8">
              <ContentMeta content={content} trails={trails} firstTrail={firstTrail} />
            </div>
          </>
        )}

        {/* Podcast: player de áudio em cima, info abaixo */}
        {content.type === 'podcast' && (
          <>
            <div className="w-full bg-planton-accent/10 flex flex-col items-center justify-center gap-6 px-8 py-16">
              <ContentTypeIcon type="podcast" size="lg" />
              <Heading as="h2" size="heading-lg" className="text-center">{content.title}</Heading>
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <audio
                controls
                className="w-full max-w-md"
                src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
              />
            </div>
            <div className="max-w-[900px] mx-auto w-full px-6 py-8">
              <ContentMeta content={content} trails={trails} firstTrail={firstTrail} />
            </div>
          </>
        )}

        {/* Guia: CTA de download em cima, info abaixo */}
        {content.type === 'guia' && (
          <>
            <div className="w-full bg-planton-accent/10 flex flex-col items-center justify-center gap-4 py-16">
              <ContentTypeIcon type="guia" size="lg" />
              <Heading as="h2" size="heading-lg">{content.title}</Heading>
              <Body muted>{content.description}</Body>
              <Button variant="outline" className="mt-2">
                <Download className="h-4 w-4" />
                Abrir PDF
              </Button>
            </div>
            <div className="max-w-[900px] mx-auto w-full px-6 py-8">
              <ContentMeta content={content} trails={trails} firstTrail={firstTrail} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
