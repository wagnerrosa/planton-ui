'use client'

import { Heading } from '@/components/primitives/Heading'
import { Button } from '@/components/primitives/Button'
import { ArrowRight } from 'lucide-react'
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
  /** Botão "Ver trilha →" exibido ao lado do título */
  trailHref?: string
  /** Ativa loop infinito no carousel */
  loop?: boolean
}

export function ContentRow({
  title,
  items,
  showProgress = false,
  showTrail = false,
  trailHref,
  loop = true,
}: ContentRowProps) {
  if (items.length === 0) return null

  return (
    <section className="flex flex-col gap-3">
      {/* Row header */}
      <div className="flex items-baseline gap-3">
        <Heading as="h2" size="heading-lg">{title}</Heading>
        {trailHref && (
          <Button variant="icon" href={trailHref}>
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Carousel */}
      <div className="relative">
        <Carousel opts={{ align: 'start', loop }}>
          <CarouselContent className="-ml-3">
            {items.map((item) => (
              <CarouselItem key={item.id} className="pl-3 basis-auto">
                <ContentCard content={item} showProgress={showProgress} showTrail={showTrail} linkToTrail={!!trailHref} />
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
