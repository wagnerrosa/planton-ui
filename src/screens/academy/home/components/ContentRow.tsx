'use client'

import Link from 'next/link'
import { Heading } from '@/components/primitives/Heading'
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

  // Texto agora vive dentro da thumbnail — o card é 100% thumbnail,
  // então o centro do carousel já é o centro do card.
  const btnStyle = { top: '50%' }

  return (
    <section className="flex flex-col gap-3">
      {/* Row header */}
      {trailHref ? (
        <Link href={trailHref} className="group inline-flex items-baseline gap-2 self-start transition-colors hover:text-planton-accent">
          <Heading as="h2" size="heading-md" className="group-hover:!text-planton-accent transition-colors">{title}</Heading>
          <span className="text-lg leading-none group-hover:translate-x-0.5 transition-all">→</span>
        </Link>
      ) : (
        <Heading as="h2" size="heading-md">{title}</Heading>
      )}

      {/* Carousel */}
      <Carousel opts={{ align: 'start', loop }}>
        <CarouselContent className="-ml-3">
          {items.map((item) => (
            <CarouselItem key={item.id} className="pl-3 basis-[160px] sm:basis-[180px] md:basis-[200px] lg:basis-[220px]">
              <ContentCard content={item} showProgress={showProgress} showTrail={showTrail} linkToTrail={!!trailHref} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" style={btnStyle} />
        <CarouselNext className="hidden md:flex" style={btnStyle} />
      </Carousel>
    </section>
  )
}
