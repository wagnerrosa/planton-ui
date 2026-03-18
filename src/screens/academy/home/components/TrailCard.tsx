'use client'

import { useState } from 'react'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { AspectRatio } from '@/components/shadcn/aspect-ratio'
import { Badge } from '@/components/shadcn/badge'
import { Progress } from '@/components/shadcn/progress'
import { PlayCircle, Clock } from 'lucide-react'
import { ContentTypeIcon } from './ContentTypeIcon'
import type { Trail, ContentItem } from '../mock-data'

const statusLabels: Record<Trail['status'], string> = {
  'nao-iniciada': 'Não iniciada',
  'em-andamento': 'Em andamento',
  'concluida': 'Concluída',
  'em-breve': 'Em breve',
}

const statusVariants: Record<Trail['status'], 'default' | 'secondary' | 'outline'> = {
  'nao-iniciada': 'outline',
  'em-andamento': 'default',
  'concluida': 'secondary',
  'em-breve': 'outline',
}

type TrailCardProps = {
  trail: Trail
  onOpenDetail: (trail: Trail) => void
  onOpenContent: (content: ContentItem, trail: Trail) => void
}

export function TrailCard({ trail, onOpenDetail, onOpenContent }: TrailCardProps) {
  const [hovered, setHovered] = useState(false)
  const isDisabled = trail.status === 'em-breve'

  return (
    <div
      className={`flex flex-col border border-border bg-card transition-all duration-200 ${
        isDisabled
          ? 'opacity-50 cursor-default'
          : 'cursor-pointer md:hover:scale-105 md:hover:z-10 md:hover:shadow-xl'
      }`}
      onMouseEnter={() => !isDisabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => !isDisabled && onOpenDetail(trail)}
    >
      {/* Thumbnail / hover preview */}
      <AspectRatio ratio={16 / 9}>
        <div
          className="flex items-center justify-center w-full h-full relative"
          style={{ backgroundColor: hovered ? '#0A2D30' : trail.accentColor }}
        >
          {hovered ? (
            <div className="flex flex-col items-center gap-2">
              <PlayCircle className="h-10 w-10 text-white/80 animate-pulse" />
              <span className="text-xs text-white/60 font-sans">Prévia disponível</span>
            </div>
          ) : (
            <PlayCircle className="h-10 w-10 text-white/40" />
          )}
        </div>
      </AspectRatio>

      {/* Info */}
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center gap-2">
          <Badge variant={statusVariants[trail.status]}>
            {statusLabels[trail.status]}
          </Badge>
        </div>

        <Heading as="h3" size="heading-lg" className="!text-base">
          {trail.title}
        </Heading>

        <Body size="sm" muted className="line-clamp-2">
          {trail.description}
        </Body>

        <div className="flex items-center gap-3 text-planton-muted">
          <span className="inline-flex items-center gap-1 text-xs">
            <Clock className="h-3.5 w-3.5" />
            {trail.totalDuration}
          </span>
          <span className="text-xs">{trail.totalItems} conteúdos</span>
        </div>

        {trail.progress > 0 && (
          <div className="flex items-center gap-2">
            <Progress value={trail.progress} className="flex-1 h-1.5" />
            <span className="text-xs text-planton-muted">{trail.progress}%</span>
          </div>
        )}

        {/* Hover: first 3 contents */}
        {hovered && trail.contents.length > 0 && (
          <div className="hidden md:flex flex-col gap-1 pt-2 border-t border-border mt-1">
            {trail.contents.slice(0, 3).map((item) => (
              <button
                key={item.id}
                type="button"
                className="flex items-center gap-2 py-1 text-left hover:text-planton-accent transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  onOpenContent(item, trail)
                }}
              >
                <ContentTypeIcon type={item.type} showLabel={false} />
                <span className="text-xs text-foreground truncate">{item.title}</span>
                <span className="text-xs text-planton-muted ml-auto shrink-0">{item.duration}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
