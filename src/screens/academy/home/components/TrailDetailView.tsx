'use client'

import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { Button } from '@/components/primitives/Button'
import { Badge } from '@/components/shadcn/badge'
import { Progress } from '@/components/shadcn/progress'
import { Separator } from '@/components/shadcn/separator'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/shadcn/sheet'
import { CheckCircle, Circle, CircleDot, Award } from 'lucide-react'
import { ContentTypeIcon } from './ContentTypeIcon'
import type { Trail, ContentItem } from '../mock-data'

function StatusIcon({ status }: { status: ContentItem['status'] }) {
  if (status === 'concluido') return <CheckCircle className="h-4 w-4 text-planton-accent shrink-0" />
  if (status === 'visualizado') return <CircleDot className="h-4 w-4 text-planton-muted shrink-0" />
  return <Circle className="h-4 w-4 text-planton-muted/50 shrink-0" />
}

type TrailDetailViewProps = {
  trail: Trail | null
  open: boolean
  onClose: () => void
  onOpenContent: (content: ContentItem, trail: Trail) => void
}

export function TrailDetailView({ trail, open, onClose, onOpenContent }: TrailDetailViewProps) {
  if (!trail) return null

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="font-heading text-[clamp(1.25rem,1.5vw,1.5rem)] tracking-[-0.02em] leading-[1.1] text-planton-forest">
            {trail.title}
          </SheetTitle>
          <Body size="sm" muted>{trail.description}</Body>
          <Body size="sm" muted>
            {trail.totalItems} conteúdos · {trail.totalDuration}
          </Body>

          <div className="flex items-center gap-3 pt-2">
            <Progress value={trail.progress} className="flex-1 h-2" />
            <span className="text-sm font-medium text-foreground">{trail.progress}%</span>
          </div>
        </SheetHeader>

        <Separator />

        <ScrollArea className="flex-1">
          <div className="flex flex-col p-6 pt-4">
            {trail.contents.map((item, i) => (
              <button
                key={item.id}
                type="button"
                className="flex items-center gap-3 py-3 text-left hover:bg-card/50 transition-colors -mx-2 px-2 rounded-sm"
                onClick={() => {
                  onClose()
                  onOpenContent(item, trail)
                }}
              >
                <span className="text-xs text-planton-muted w-5 shrink-0 text-right">{i + 1}</span>
                <StatusIcon status={item.status} />
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <span className="text-sm text-foreground truncate">{item.title}</span>
                  <div className="flex items-center gap-2">
                    <ContentTypeIcon type={item.type} />
                    <span className="text-xs text-planton-muted">{item.duration}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>

        {trail.progress === 100 && (
          <>
            <Separator />
            <div className="p-6 pt-4 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-planton-accent" />
                <Badge variant="secondary">Quiz desbloqueado</Badge>
              </div>
              <Button variant="primary" size="sm" disabled>
                Realizar Quiz →
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
