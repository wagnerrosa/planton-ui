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

  // Centro da thumbnail = 50% do carousel (thumb+info) menos metade do info abaixo.
  // Info padrão (gap-2 + título 2l + gap-1 + duração) ≈ 66px
  // Info com trilha adiciona "Da trilha: X" (~20px) ≈ 86px
  // O carousel base já aplica -translate-y-1/2 (desloca -50% da altura do botão).
  // Só precisamos ajustar o top para o centro da thumbnail em vez do centro do card completo.
  // Centro da thumb = 50% do carousel total - metade da área de info abaixo da thumb.
  // Info padrão (gap-2 + título 2l + gap-1 + duração) ≈ 66px → metade = 33px
  // Info com trilha adiciona "Da trilha: X" (~20px) ≈ 86px → metade = 43px
  const infoHalf = showTrail ? 29 : 22
  const btnStyle = { top: `calc(50% - ${infoHalf}px)` }

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
      <Carousel opts={{ align: 'start', loop }}>
        <CarouselContent className="-ml-3">
          {items.map((item) => (
            <CarouselItem key={item.id} className="pl-3 basis-auto">
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
