'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ContentTypeIcon } from './ContentTypeIcon'
import type { ContentItem } from '../mock-data'

type ContentCardProps = {
  content: ContentItem
  /** Mostra barra de progresso (para "Continue assistindo") */
  showProgress?: boolean
  /** Mostra label "Da trilha X" abaixo do título */
  showTrail?: boolean
  /** Se true, o clique abre a página da trilha em vez do conteúdo avulso */
  linkToTrail?: boolean
}

// start aleatório para variar o frame inicial do GIF (mock duration 392s)
function getGifStart(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  return hash % 392
}

export function ContentCard({ content, showProgress = false, showTrail = false, linkToTrail = false }: ContentCardProps) {
  const [hovered, setHovered] = useState(false)

  const href = linkToTrail && content.trail
    ? `/design-system/screens/academy/trail/${content.trail.id}`
    : `/design-system/screens/academy/content/${content.id}`

  const gifUrl = `${content.previewUrl}?start=${getGifStart(content.id)}`
  const isVideo = content.type === 'video'

  return (
    <Link
      href={href}
      className="group/card focus:outline-none w-full flex-shrink-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: '4/5' }}>
        {/* 1. Image (base layer) */}
        {isVideo ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={hovered ? gifUrl : content.thumbnailUrl}
            alt={content.title}
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full bg-planton-accent flex items-center justify-center">
            <ContentTypeIcon type={content.type} size="lg" />
          </div>
        )}

        {/* 2. Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* 3. Text content */}
        <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col gap-1">
          <span className="text-white text-sm font-medium leading-tight line-clamp-2">
            {content.title}
          </span>

          {showTrail && content.trail && (
            <span className="text-white/60 text-xs">
              Da trilha: {content.trail.name}
            </span>
          )}

          <div className="flex items-center gap-2 text-white text-xs">
            <ContentTypeIcon type={content.type} className="text-white" />
            <span>{content.duration}</span>
          </div>
        </div>

        {/* 4. Progress bar (top layer) */}
        {showProgress && content.progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40 z-10">
            <div
              className="h-full bg-planton-accent"
              style={{ width: `${content.progress}%` }}
            />
          </div>
        )}
      </div>
    </Link>
  )
}
