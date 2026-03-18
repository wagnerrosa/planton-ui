'use client'

import { Eyebrow } from '@/components/primitives/Eyebrow'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { Button } from '@/components/primitives/Button'
import { AspectRatio } from '@/components/shadcn/aspect-ratio'
import { Progress } from '@/components/shadcn/progress'
import { PlayCircle } from 'lucide-react'
import { ContentTypeIcon } from './ContentTypeIcon'
import { CONTINUE_WATCHING } from '../mock-data'

type ContinueWatchingCardProps = {
  onResume: () => void
}

export function ContinueWatchingCard({ onResume }: ContinueWatchingCardProps) {
  const { trailTitle, content } = CONTINUE_WATCHING

  return (
    <div className="flex flex-col md:flex-row gap-6 bg-card border border-border p-6">
      <div className="w-full md:w-[280px] shrink-0">
        <AspectRatio ratio={16 / 9}>
          <div
            className="flex items-center justify-center w-full h-full"
            style={{ backgroundColor: content.thumbnailColor }}
          >
            <PlayCircle className="h-12 w-12 text-white/70" />
          </div>
        </AspectRatio>
      </div>

      <div className="flex flex-col gap-3 flex-1 justify-center">
        <Eyebrow>{trailTitle}</Eyebrow>
        <Heading as="h3" size="heading-lg">{content.title}</Heading>

        <div className="flex items-center gap-3">
          <ContentTypeIcon type={content.type} />
          <Body size="sm" muted>{content.duration}</Body>
        </div>

        <div className="flex items-center gap-3">
          <Progress value={content.progress} className="flex-1 h-2" />
          <Body size="sm" muted className="shrink-0">{content.progress}%</Body>
        </div>

        <div>
          <Button variant="primary" size="sm" onClick={onResume}>
            Retomar
          </Button>
        </div>
      </div>
    </div>
  )
}
