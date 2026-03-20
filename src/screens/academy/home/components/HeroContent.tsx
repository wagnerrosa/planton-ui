'use client'

import { Button } from '@/components/primitives/Button'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { ContentTypeIcon } from './ContentTypeIcon'
import type { ContentItem } from '../mock-data'

type HeroContentProps = {
  content: ContentItem
}

export function HeroContent({ content }: HeroContentProps) {
  const contentHref = `/design-system/screens/academy/content/${content.id}`
  const trailHref = content.trail
    ? `/design-system/screens/academy/trail/${content.trail.id}`
    : null

  return (
    <div className="relative w-full overflow-hidden bg-black h-[60vh] min-h-[420px] max-h-[720px]">
      {/* Background thumbnail */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={content.thumbnailUrl}
        alt={content.title}
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        draggable={false}
      />

      {/* Gradient overlay — fades left side for legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      {/* Content — aligned with page container */}
      <div className="relative h-full flex items-end pb-8 md:pb-12">
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="flex flex-col gap-4 max-w-lg">
          {/* Trail label */}
          {content.trail && (
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-planton-accent/80">
              trilha: {content.trail.name}
            </span>
          )}

          <Heading as="h1" size="heading-xl" className="!text-white">
            {content.title}
          </Heading>

          <div className="flex items-center gap-3">
            <ContentTypeIcon type={content.type} />
            <span className="font-mono text-xs text-white/60">{content.duration}</span>
          </div>

          <Body className="text-white/70 line-clamp-2">{content.description}</Body>

          {/* CTAs */}
          <div className="flex items-center gap-3 flex-wrap">
            <Button variant="primary" size="sm" href={contentHref}>
              Assistir
            </Button>

            {trailHref && (
              <Button
                variant="outline"
                size="sm"
                href={trailHref}
                className="border-white/30 text-white/80 hover:border-white hover:text-white"
              >
                Ver trilha →
              </Button>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
