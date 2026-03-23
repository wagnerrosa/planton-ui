'use client'

import Link from 'next/link'
import { Download } from 'lucide-react'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { Button } from '@/components/primitives/Button'
import { badgeVariants } from '@/components/shadcn/badge'
import { AcademyNavbarSync } from '@/components/navigation/AcademyNavbarSync'
import { AcademyFooter } from '@/components/navigation/AcademyFooter'
import { ContentTypeIcon } from '../home/components/ContentTypeIcon'
import { CONTENT_ITEMS } from '../home/mock-data'
import type { ContentItem } from '../home/mock-data'

function findContentById(id: string) {
  return CONTENT_ITEMS.find((c) => c.id === id) ?? null
}

function MuxPlayer({ playbackId, title }: { playbackId: string; title: string }) {
  return (
    <iframe
      src={`https://player.mux.com/${playbackId}?metadata-video-title=${encodeURIComponent(title)}&accent-color=%2396d35f`}
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
          className={badgeVariants({ variant: 'outline' })}
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
}: {
  content: ContentItem
  trails: { id: string; name: string }[]
}) {
  return (
    <div className="flex flex-col gap-6">
      <Heading as="h1" size="heading-xl">{content.title}</Heading>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <ContentTypeIcon type={content.type} />
          <span className="font-mono text-xs text-planton-muted">{content.duration}</span>
        </div>
        <TrailBadges trails={trails} />
      </div>

      <Body muted>{content.description}</Body>
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
      <AcademyNavbarSync
        breadcrumbs={[
          { label: 'Conteúdos', href: '/design-system/screens/academy/home' },
          { label: content.title },
        ]}
      />

      <div className="flex-1 flex flex-col">
        {/* Artigo: sem player , conteúdo ocupa a área principal */}
        {content.type === 'artigo' && (
          <div className="max-w-[900px] mx-auto w-full px-6 pt-12 pb-24 flex flex-col gap-8">
            <ContentMeta content={content} trails={trails} />

            <div className="prose prose-invert max-w-none border-t border-border pt-6">
              <p className="text-foreground/60 leading-relaxed">
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
                        {firstTrail && (
              <Button variant="primary" href={`/academy/trail/${firstTrail.id}`} className="self-start">
                Continuar trilha →
              </Button>
            )}
          </div>
        )}

        {/* Vídeo: player em cima, info abaixo */}
        {content.type === 'video' && (
          <>
            <MuxPlayer playbackId={content.muxPlaybackId} title={content.title} />
            <div className="max-w-[900px] mx-auto w-full px-6 pt-12 pb-24 flex flex-col gap-6">
              <ContentMeta content={content} trails={trails} />
              {firstTrail && (
                <Button variant="primary" href={`/academy/trail/${firstTrail.id}`} className="self-start">
                  Continuar trilha →
                </Button>
              )}
            </div>
          </>
        )}

        {/* Podcast: player de áudio em cima, info abaixo */}
        {content.type === 'podcast' && (
          <>
            <div className="w-full bg-planton-accent/10 flex flex-col items-center justify-center gap-6 px-8 py-16">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <audio
                controls
                className="w-full max-w-md"
                src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
              />
            </div>
            <div className="max-w-[900px] mx-auto w-full px-6 pt-12 pb-24 flex flex-col gap-6">
              <ContentMeta content={content} trails={trails} />
              {firstTrail && (
                <Button variant="primary" href={`/academy/trail/${firstTrail.id}`} className="self-start">
                  Continuar trilha →
                </Button>
              )}
            </div>
          </>
        )}

        {/* Guia: PDF embed + info + download */}
        {content.type === 'guia' && (
          <>
            <iframe
              src="https://mozilla.github.io/pdf.js/web/viewer.html"
              className="w-full border-none"
              style={{ aspectRatio: '16/9' }}
              title={content.title}
            />
            <div className="max-w-[900px] mx-auto w-full px-6 pt-12 pb-24 flex flex-col gap-6">
              <ContentMeta content={content} trails={trails} />
              <div className="flex items-center gap-3">
                <Button variant="outline">
                  <Download className="h-4 w-4" />
                  Baixar PDF
                </Button>
                {firstTrail && (
                  <Button variant="primary" href={`/academy/trail/${firstTrail.id}`}>
                    Continuar trilha →
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <AcademyFooter />
    </div>
  )
}
