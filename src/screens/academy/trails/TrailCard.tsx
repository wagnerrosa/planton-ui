'use client'

import Link from 'next/link'
import {
  ArrowRight,
  PlayCircle,
  Headphones,
  FileText,
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import type { ContentItem } from '../home/mock-data'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TrailStatus = 'nao-iniciada' | 'em-andamento' | 'concluida' | 'em-breve'

type Trail = {
  id: string
  title: string
  description?: string
  contentsCount: number
  duration: string
  progress?: number
  status?: TrailStatus
  href: string
  contents?: ContentItem[]
}

type TrailCardProps = {
  trail: Trail
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const typeIcon = {
  video: PlayCircle,
  podcast: Headphones,
  artigo: FileText,
  guia: BookOpen,
  trilha: BookOpen,
}

const fallbackImages: Record<string, string[]> = {
  artigo: ['/assets/MATA-ATLANTICA-BG.jpg', '/assets/SERRA-SUL-BG.jpg'],
  guia: ['/assets/PANTANAL-BG.jpg', '/assets/MATA-ATLANTICA-BG.jpg'],
  podcast: ['/assets/CAATINGA-BG.jpg', '/assets/SERRA-SUL-BG.jpg'],
  trilha: ['/assets/PANTANAL-BG.jpg'],
}

/** One image per trail — cycles through biomes */
const trailImages = [
  '/assets/MATA-ATLANTICA-BG.jpg',
  '/assets/CAATINGA-BG.jpg',
  '/assets/SERRA-SUL-BG.jpg',
  '/assets/PANTANAL-BG.jpg',
  '/assets/PAMPA-BG.jpg',
]

const statusConfig: Record<TrailStatus, { label: string; icon: typeof Award }> = {
  'nao-iniciada': { label: 'Não iniciada', icon: Clock },
  'em-andamento': { label: 'Em andamento', icon: PlayCircle },
  'concluida': { label: 'Concluída', icon: Award },
  'em-breve': { label: 'Em breve', icon: Clock },
}

function getThumb(item: ContentItem): string {
  if (item.type === 'video' && item.thumbnailUrl) return item.thumbnailUrl
  const list = fallbackImages[item.type] ?? fallbackImages.artigo
  return list[item.id.charCodeAt(0) % list.length]
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TrailCard({ trail }: TrailCardProps) {
  const {
    id,
    title,
    description,
    contentsCount,
    duration,
    progress,
    status,
    href,
    contents = [],
  } = trail

  const isConcluida = status === 'concluida'
  const isNaoIniciada = status === 'nao-iniciada'
  const statusInfo = status ? statusConfig[status] : null

  // Pick a biome image for the main thumb based on trail id
  const trailIndex = parseInt(id.replace(/\D/g, ''), 10) || 0
  const mainImage = trailImages[trailIndex % trailImages.length]

  // Show up to 5 content thumbnails
  const thumbContents = contents.slice(0, 5)

  return (
    <Link href={href} className="group block">
      {/* White card — glassmorphism via backdrop-blur on bg-card/95.
          No border-radius, no shadows — per design system. */}
      <div className="relative overflow-hidden bg-planton-forest">

        {/* Content: left info + right thumb */}
        <div className="flex flex-col md:flex-row">

          {/* ─── Left: Info ─── */}
          <div className="flex-1 flex flex-col p-6 md:p-8">

            {/* Status badge */}
            {statusInfo && (
              <div className="mb-3">
                <span
                  className={[
                    'inline-flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.10em]',
                    isConcluida
                      ? 'text-planton-accent'
                      : status === 'em-andamento'
                        ? 'text-planton-accent/80'
                        : 'text-planton-cream/50',
                  ].join(' ')}
                >
                  <statusInfo.icon className="h-3 w-3" />
                  {statusInfo.label}
                </span>
              </div>
            )}

            {/* Title */}
            <h3 className="font-heading text-xl md:text-3xl font-normal leading-tight text-planton-cream group-hover:text-planton-accent transition-colors duration-200">
              {title}
            </h3>

            {/* Description */}
            {description && (
              <p className="mt-2 font-sans text-sm leading-relaxed text-planton-cream/80 line-clamp-2 max-w-md">
                {description}
              </p>
            )}

            {/* Content thumbs list */}
            {thumbContents.length > 0 && (
              <div className="flex gap-1.5 items-center mt-4">
                {thumbContents.map((item) => {
                  const Icon = typeIcon[item.type] ?? BookOpen
                  const isCompleted = item.status === 'concluido'
                  return (
                    <div
                      key={item.id}
                      className="relative overflow-hidden shrink-0"
                      style={{ width: 44, height: 44 }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getThumb(item)}
                        alt=""
                        className="w-full h-full object-cover brightness-75"
                        draggable={false}
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                        {isCompleted ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-planton-accent" />
                        ) : (
                          <Icon className="h-3 w-3 text-white/80" />
                        )}
                      </span>
                    </div>
                  )
                })}
                {contentsCount > thumbContents.length && (
                  <span className="font-mono text-[10px] text-planton-cream/50 pl-1">
                    +{contentsCount - thumbContents.length}
                  </span>
                )}
              </div>
            )}

            {/* Progress bar — only when progress > 0 */}
            {progress !== undefined && progress > 0 && (
              <div className="flex items-center gap-3 mt-4 max-w-xs">
                <div className="flex-1 h-px bg-planton-accent/20 overflow-hidden">
                  <div
                    className="h-full bg-planton-accent transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="font-mono text-[0.625rem] text-planton-cream/50 shrink-0">
                  {progress}%
                </span>
              </div>
            )}

            {/* Bottom: meta only */}
            <div className="mt-auto pt-5">
              <span className="font-mono text-[0.625rem] text-planton-cream/40">
                {contentsCount} conteúdo{contentsCount !== 1 ? 's' : ''}  ·  {duration}
              </span>
            </div>
          </div>

          {/* ─── Right: Thumbnail with CTA overlay ─── */}
          <div className="hidden md:block relative w-[275px] lg:w-[325px] shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mainImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover brightness-[0.85] group-hover:brightness-100 group-hover:scale-[1.03] transition-all duration-500"
              draggable={false}
            />
            {/* CTA overlay — centered on thumb */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="inline-flex items-center gap-2 border border-white/70 bg-white/10 px-4 py-2 font-mono text-xs text-white uppercase tracking-widest backdrop-blur-sm transition-colors duration-200 group-hover:bg-white/20">
                {isConcluida ? 'Rever' : isNaoIniciada ? 'Começar' : 'Continuar'}
                <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>

        </div>
      </div>
    </Link>
  )
}
