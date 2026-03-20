'use client'

import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/primitives/Button'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { ContentTypeIcon } from './ContentTypeIcon'
import type { ContentItem } from '../mock-data'

type HeroContentProps = {
  contents: ContentItem[]
}

const ROTATION_INTERVAL = 7000

export function HeroContent({ contents }: HeroContentProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const goTo = useCallback(
    (index: number) => {
      if (index === activeIndex) return
      setIsTransitioning(true)
      setTimeout(() => {
        setActiveIndex(index)
        setIsTransitioning(false)
      }, 300)
    },
    [activeIndex]
  )

  useEffect(() => {
    if (contents.length <= 1) return
    const timer = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % contents.length)
        setIsTransitioning(false)
      }, 300)
    }, ROTATION_INTERVAL)
    return () => clearInterval(timer)
  }, [contents.length])

  const content = contents[activeIndex]
  const contentHref = `/design-system/screens/academy/content/${content.id}`
  const trailHref = content.trail
    ? `/design-system/screens/academy/trail/${content.trail.id}`
    : null

  return (
    <div className="relative w-full overflow-hidden bg-black h-[60vh] min-h-[420px] max-h-[720px]">
      {/* Background thumbnails — pre-render all, toggle opacity */}
      {contents.map((item, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={item.id}
          src={item.thumbnailUrl}
          alt={item.title}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            i === activeIndex ? 'opacity-60' : 'opacity-0'
          }`}
          draggable={false}
        />
      ))}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative h-full flex items-end pb-8 md:pb-12">
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-10">
          <div
            className={`flex flex-col gap-4 max-w-lg transition-opacity duration-300 ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {/* Trail label */}
            {content.trail && (
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-planton-accent/80">
                trilha: {content.trail.name}
              </span>
            )}

            <Heading as="h1" size="heading-xl" className="!text-white">
              {content.title}
            </Heading>

            <div className="flex items-center gap-3">
              <ContentTypeIcon type={content.type} />
              <span className="font-mono text-xs text-white/60">{content.duration}</span>
            </div>

            <Body className="text-white/70 line-clamp-2">{content.description}</Body>

            {/* CTAs */}
            <div className="flex items-center gap-3 flex-wrap">
              <Button variant="primary" size="sm" href={contentHref}>
                Assistir
              </Button>

              {trailHref && (
                <Button
                  variant="outline"
                  size="sm"
                  href={trailHref}
                  className="border-white/30 text-white/80 hover:border-white hover:text-white"
                >
                  Ver trilha →
                </Button>
              )}
            </div>

            {/* Dots */}
            {contents.length > 1 && (
              <div className="flex items-center gap-2 pt-1">
                {contents.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Ir para destaque ${i + 1}`}
                    className={`rounded-full transition-all duration-300 ${
                      i === activeIndex
                        ? 'w-5 h-2 bg-white'
                        : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
