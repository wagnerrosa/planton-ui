'use client'

import Link from 'next/link'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/shadcn/carousel'
import { ContentCard } from './ContentCard'
import type { ContentItem } from '../mock-data'

type ContentRowProps = {
  title: string
  items: ContentItem[]
  showProgress?: boolean
  showTrail?: boolean
  /** Link "Ver trilha →" exibido ao lado do título */
  trailHref?: string
  trailLabel?: string
}

export function ContentRow({
  title,
  items,
  showProgress = false,
  showTrail = false,
  trailHref,
  trailLabel,
}: ContentRowProps) {
  if (items.length === 0) return null

  return (
    <section className="flex flex-col gap-3">
      {/* Row header */}
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">
          {title}
        </span>
        {trailHref && (
          <Link
            href={trailHref}
            className="font-sans text-xs text-planton-muted hover:text-foreground transition-colors"
          >
            {trailLabel ?? 'Ver trilha →'}
          </Link>
        )}
      </div>

      {/* Carousel */}
      <div className="relative">
        <Carousel opts={{ align: 'start', loop: false }}>
          <CarouselContent className="-ml-3">
            {items.map((item) => (
              <CarouselItem key={item.id} className="pl-3 basis-auto">
                <ContentCard content={item} showProgress={showProgress} showTrail={showTrail} />
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
