'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

/* ------------------------------------------------------------------ */
/* Container                                                           */
/* ------------------------------------------------------------------ */

type StackingCardsProps = {
  totalCards: number
  /** How much each card scales down relative to its stacking position (default 0.03) */
  scaleMultiplier?: number
  children: ReactNode
  className?: string
}

export function StackingCards({
  totalCards,
  scaleMultiplier = 0.03,
  children,
  className,
}: StackingCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  return (
    <div ref={containerRef} className={className}>
      {/* Provide context via render-prop style — children receive scrollYProgress */}
      {typeof children === 'function'
        ? (children as (ctx: { scrollYProgress: typeof scrollYProgress; totalCards: number; scaleMultiplier: number }) => ReactNode)({
            scrollYProgress,
            totalCards,
            scaleMultiplier,
          })
        : children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Individual card                                                     */
/* ------------------------------------------------------------------ */

type StackingCardItemProps = {
  index: number
  totalCards: number
  scaleMultiplier?: number
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress']
  /** Extra top offset in vh units per card (default 3) */
  topStep?: number
  children: ReactNode
  className?: string
}

export function StackingCardItem({
  index,
  totalCards,
  scaleMultiplier = 0.03,
  scrollYProgress,
  topStep = 3,
  children,
  className,
}: StackingCardItemProps) {
  const rangeStart = index / totalCards
  const rangeEnd = (index + 1) / totalCards

  const scale = useTransform(
    scrollYProgress,
    [rangeStart, rangeEnd],
    [1, 1 - scaleMultiplier * (totalCards - index)]
  )

  return (
    <motion.div
      style={{
        scale,
        top: `${5 + index * topStep}vh`,
      }}
      className={`sticky ${className ?? ''}`}
    >
      {children}
    </motion.div>
  )
}
