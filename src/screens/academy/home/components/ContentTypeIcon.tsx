'use client'

import { PlayCircle, Headphones, FileText, BookOpen } from 'lucide-react'
import type { ContentType } from '../mock-data'

const iconMap: Record<ContentType, { icon: typeof PlayCircle; label: string }> = {
  video: { icon: PlayCircle, label: 'Vídeo' },
  podcast: { icon: Headphones, label: 'Podcast' },
  artigo: { icon: FileText, label: 'Artigo' },
  guia: { icon: BookOpen, label: 'Guia' },
}

export function ContentTypeIcon({ type, showLabel = true }: { type: ContentType; showLabel?: boolean }) {
  const { icon: Icon, label } = iconMap[type]
  return (
    <span className="inline-flex items-center gap-1 text-planton-muted">
      <Icon className="h-3.5 w-3.5" />
      {showLabel && <span className="text-xs">{label}</span>}
    </span>
  )
}
