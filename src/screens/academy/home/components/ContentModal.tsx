'use client'

import { Body } from '@/components/primitives/Body'
import { Button } from '@/components/primitives/Button'
import { AspectRatio } from '@/components/shadcn/aspect-ratio'
import { Badge } from '@/components/shadcn/badge'
import { Progress } from '@/components/shadcn/progress'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/shadcn/dialog'
import { PlayCircle } from 'lucide-react'
import { toast } from 'sonner'
import { ContentTypeIcon } from './ContentTypeIcon'
import type { ContentItem, Trail } from '../mock-data'

type ContentModalProps = {
  content: ContentItem | null
  trail: Trail | null
  open: boolean
  onClose: () => void
}

export function ContentModal({ content, trail, open, onClose }: ContentModalProps) {
  if (!content || !trail) return null

  function handleMarkComplete() {
    toast.success('Conteúdo marcado como concluído ✓')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline">{trail.title}</Badge>
            <ContentTypeIcon type={content.type} />
          </div>
          <DialogTitle className="font-heading text-[clamp(1.25rem,1.5vw,1.5rem)] tracking-[-0.02em] leading-[1.1] text-planton-forest">
            {content.title}
          </DialogTitle>
        </DialogHeader>

        <AspectRatio ratio={16 / 9}>
          <div
            className="flex flex-col items-center justify-center w-full h-full gap-2"
            style={{ backgroundColor: content.thumbnailColor }}
          >
            <PlayCircle className="h-14 w-14 text-white/60" />
            <span className="text-sm text-white/50 font-sans">
              Player de {content.type} aqui
            </span>
          </div>
        </AspectRatio>

        <Body size="sm" muted>
          Conteúdo educacional sobre {content.title.toLowerCase()} — parte da trilha {trail.title}. Duração: {content.duration}.
        </Body>

        {content.progress > 0 && (
          <div className="flex items-center gap-3">
            <Progress value={content.progress} className="flex-1 h-2" />
            <Body size="sm" muted className="shrink-0">{content.progress}%</Body>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="primary" size="sm" onClick={handleMarkComplete}>
            Marcar como concluído
          </Button>
          <button
            type="button"
            onClick={onClose}
            className="font-sans text-sm text-planton-muted hover:text-foreground transition-colors px-4 py-2"
          >
            Fechar
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
