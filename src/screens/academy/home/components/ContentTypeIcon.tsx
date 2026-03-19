'use client'

import { PlayCircle, Headphones, FileText, BookOpen } from 'lucide-react'
import type { ContentType } from '../mock-data'

const iconMap: Record<ContentType, { icon: typeof PlayCircle; label: string }> = {
  video: { icon: PlayCircle, label: 'Vídeo' },
  podcast: { icon: Headphones, label: 'Podcast' },
  artigo: { icon: FileText, label: 'Artigo' },
  guia: { icon: BookOpen, label: 'Guia' },
}

export function ContentTypeIcon({
  type,
  showLabel = true,
  size = 'sm',
  className,
}: {
  type: ContentType
  showLabel?: boolean
  size?: 'sm' | 'lg'
  className?: string
}) {
  const { icon: Icon, label } = iconMap[type]
  const iconClass = size === 'lg' ? 'h-10 w-10' : 'h-3.5 w-3.5'
  const colorClass = size === 'lg' ? 'text-background' : 'text-planton-muted'
  return (
    <span className={`inline-flex items-center gap-1 ${colorClass} ${className ?? ''}`}>
      <Icon className={iconClass} />
      {showLabel && size !== 'lg' && <span className="text-xs">{label}</span>}
    </span>
  )
}
