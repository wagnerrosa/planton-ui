'use client'

import { Eyebrow } from '@/components/primitives/Eyebrow'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/shadcn/carousel'
import { TrailCard } from './TrailCard'
import type { Trail, ContentItem } from '../mock-data'

type TrailsRowProps = {
  title: string
  trails: Trail[]
  onOpenDetail: (trail: Trail) => void
  onOpenContent: (content: ContentItem, trail: Trail) => void
}

export function TrailsRow({ title, trails, onOpenDetail, onOpenContent }: TrailsRowProps) {
  if (trails.length === 0) return null

  return (
    <section className="flex flex-col gap-4">
      <Eyebrow>{title}</Eyebrow>

      <div className="relative">
        <Carousel opts={{ align: 'start', loop: false }}>
          <CarouselContent className="-ml-4">
            {trails.map((trail) => (
              <CarouselItem key={trail.id} className="pl-4 basis-4/5 md:basis-1/3">
                <TrailCard
                  trail={trail}
                  onOpenDetail={onOpenDetail}
                  onOpenContent={onOpenContent}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4" />
          <CarouselNext className="hidden md:flex -right-4" />
        </Carousel>
      </div>
    </section>
  )
}
