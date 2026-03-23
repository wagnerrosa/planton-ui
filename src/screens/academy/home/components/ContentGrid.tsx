'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Heading } from '@/components/primitives/Heading'
import { Button } from '@/components/primitives/Button'
import { ContentCard } from './ContentCard'
import type { ContentItem } from '../mock-data'

type ContentGridProps = {
  title: string
  items: ContentItem[]
  /** Initial number of items visible (1 row ~ 4-6 items) */
  initialCount?: number
}

const ROW_SIZE = 6

export function ContentGrid({ title, items, initialCount = ROW_SIZE }: ContentGridProps) {
  const [visibleCount, setVisibleCount] = useState(initialCount)

  if (items.length === 0) return null

  const visible = items.slice(0, visibleCount)
  const hasMore = visibleCount < items.length

  function showMore() {
    setVisibleCount((v) => Math.min(v + ROW_SIZE, items.length))
  }

  return (
    <section className="flex flex-col gap-4">
      <Heading as="h2" size="heading-md">{title}</Heading>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {visible.map((item) => (
          <ContentCard key={item.id} content={item} />
        ))}
      </div>

      {hasMore && (
        <Button
          variant="ghost"
          size="sm"
          onClick={showMore}
          className="self-center text-planton-muted hover:text-foreground"
        >
          <ChevronDown className="h-4 w-4" />
          Mostrar mais
        </Button>
      )}
    </section>
  )
}
