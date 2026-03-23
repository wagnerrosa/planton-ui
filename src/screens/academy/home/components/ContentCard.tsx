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

const fallbackImages: Record<string, string[]> = {
  artigo: ['/assets/MATA-ATLANTICA-BG.jpg', '/assets/SERRA-SUL-BG.jpg'],
  guia: ['/assets/PANTANAL-BG.jpg', '/assets/MATA-ATLANTICA-BG.jpg'],
  podcast: ['/assets/CAATINGA-BG.jpg', '/assets/SERRA-SUL-BG.jpg'],
  trilha: ['/assets/PANTANAL-BG.jpg', '/assets/CAATINGA-BG.jpg', '/assets/MATA-ATLANTICA-BG.jpg'],
}

function getFallbackImage(type: string, id: string): string {
  const list = fallbackImages[type] || fallbackImages.artigo
  const index = id.charCodeAt(0) % list.length
  return list[index]
}

export function ContentCard({ content, showProgress = false, showTrail = false, linkToTrail = false }: ContentCardProps) {
  const [hovered, setHovered] = useState(false)

  const href = content.type === 'trilha'
    ? `/design-system/screens/academy/trail/${content.id}`
    : linkToTrail && content.trail
      ? `/design-system/screens/academy/trail/${content.trail.id}`
      : `/design-system/screens/academy/content/${content.id}`

  const gifUrl = `${content.previewUrl}?start=${getGifStart(content.id)}`
  const isVideo = content.type === 'video'

  const imageFilterClass =
    content.type === 'podcast'
      ? 'brightness-[0.75] contrast-110'
      : content.type === 'artigo'
        ? 'brightness-[0.95] saturate-75'
        : content.type === 'guia'
          ? 'contrast-110'
          : ''

  return (
    <Link
      href={href}
      className="group/card relative w-full max-w-[220px] flex-shrink-0 transition-all duration-300 ease-out hover:scale-[1.04] hover:z-10 focus:outline-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      <div
        className="relative w-full overflow-hidden rounded-lg transition-shadow duration-300 group-hover/card:shadow-2xl"
        style={{ aspectRatio: '4/5' }}
      >
        {/* 1. Image (base layer) */}
        {isVideo ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={hovered ? gifUrl : content.thumbnailUrl}
            alt={content.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
            draggable={false}
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={getFallbackImage(content.type, content.id)}
            alt={content.title}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105 ${imageFilterClass}`}
            draggable={false}
          />
        )}

        {/* 2. Brand tint (non-video) */}
        {!isVideo && (
          <div className="absolute inset-0 bg-planton-accent/20 mix-blend-multiply" />
        )}

        {/* 2b. Extra overlay for podcast */}
        {content.type === 'podcast' && (
          <div className="absolute inset-0 bg-black/20" />
        )}

        {/* 3. Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-colors duration-300 group-hover/card:from-black/80" />

        {/* Badges (top) */}
        {content.isNew && (
          <div className="absolute top-2 left-2 bg-planton-accent text-[10px] font-medium px-2 py-1 rounded-md text-planton-ink">
            Novo
          </div>
        )}

        {showProgress && content.progress > 0 && (
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-md">
            {Math.round(content.progress)}%
          </div>
        )}

        {content.status === 'concluido' && (
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-md flex items-center gap-1">
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
            Concluído
          </div>
        )}

        {/* 4. Text content */}
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

        {/* 5. Progress bar (top layer) */}
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
