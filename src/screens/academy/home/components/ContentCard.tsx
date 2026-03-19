'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Body } from '@/components/primitives/Body'
import { Progress } from '@/components/shadcn/progress'
import { ContentTypeIcon } from './ContentTypeIcon'
import type { ContentItem } from '../mock-data'

type ContentCardProps = {
  content: ContentItem
  /** Mostra barra de progresso (para "Continue assistindo") */
  showProgress?: boolean
  /** Mostra label "Da trilha X" abaixo do título */
  showTrail?: boolean
}

export function ContentCard({ content, showProgress = false, showTrail = false }: ContentCardProps) {
  const [hovered, setHovered] = useState(false)

  const href = content.trail
    ? `/design-system/screens/academy/trail/${content.trail.id}`
    : `/design-system/screens/academy/content/${content.id}`

  return (
    <Link
      href={href}
      className="flex flex-col gap-2 group focus:outline-none w-[200px] sm:w-[220px] md:w-[240px] lg:w-[260px] flex-shrink-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail — troca para animated.gif no hover, sem zoom, sem shadow, sem layout shift */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hovered ? content.previewUrl : content.thumbnailUrl}
          alt={content.title}
          className="w-full h-full object-cover"
          draggable={false}
        />

        {/* Progress bar overlay (bottom of thumbnail) */}
        {showProgress && content.progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/40">
            <div
              className="h-full bg-planton-accent"
              style={{ width: `${content.progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1">
        <span className="font-sans text-sm font-medium text-foreground leading-snug group-hover:text-planton-accent transition-colors line-clamp-2">
          {content.title}
        </span>

        {showTrail && content.trail && (
          <span className="font-sans text-xs text-planton-muted">
            Da trilha: {content.trail.name}
          </span>
        )}

        <div className="flex items-center gap-2">
          <ContentTypeIcon type={content.type} />
          <Body size="sm" muted>{content.duration}</Body>
        </div>
      </div>
    </Link>
  )
}
