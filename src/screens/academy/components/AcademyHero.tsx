'use client'

import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'
import Link from 'next/link'
import { Play, Settings2 } from 'lucide-react'
import { Button } from '@/components/primitives/Button'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { ContentTypeIcon } from '../home/components/ContentTypeIcon'
import type { ContentType } from '../home/mock-data'

export type AcademyHeroAction = {
  label: string
  href: string
  variant?: 'button' | 'link'
  style?: 'accent' | 'secondary' | 'outline'
  icon?: 'play' | 'arrow'
}

export type AcademyHeroSlide = {
  id: string
  muxPlaybackId: string
  thumbnailUrl: string
  badge?: string
  eyebrow?: string
  title: string
  description: string
  meta?: {
    type: ContentType
    duration: string
  }
  pills?: string[]
  primaryAction: AcademyHeroAction
  secondaryAction?: AcademyHeroAction
}

type AcademyHeroProps = {
  slides?: AcademyHeroSlide[]
  onConfigClick?: () => void
}

const ROTATION_INTERVAL = 7000
const TRANSITION_DURATION = 400

export function AcademyHero({ slides, onConfigClick }: AcademyHeroProps) {
  const safeSlides = slides ?? []
  const [activeIndex, setActiveIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [progressKey, setProgressKey] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)

  useEffect(() => {
    if (safeSlides.length <= 1) return

    const timer = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setVideoPlaying(false)
        setActiveIndex((prev) => (prev + 1) % safeSlides.length)
        setProgressKey((current) => current + 1)
        setIsTransitioning(false)
      }, TRANSITION_DURATION)
    }, ROTATION_INTERVAL)

    return () => clearInterval(timer)
  }, [safeSlides.length])

  useEffect(() => {
    const video = videoRef.current
    const activeSlide = safeSlides[activeIndex]
    if (!video || !activeSlide) return

    setVideoPlaying(false)
    const src = `https://stream.mux.com/${activeSlide.muxPlaybackId}.m3u8`

    const onPlaying = () => setVideoPlaying(true)
    video.addEventListener('playing', onPlaying)

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
      video.currentTime = 0
      video.play().catch(() => {})
    } else if (Hls.isSupported()) {
      hlsRef.current?.destroy()
      const hls = new Hls({ startLevel: 0, maxMaxBufferLength: 30 })
      hlsRef.current = hls
      hls.loadSource(src)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.currentTime = 0
        video.play().catch(() => {})
      })
    }

    return () => {
      video.removeEventListener('playing', onPlaying)
      hlsRef.current?.destroy()
      hlsRef.current = null
    }
  }, [activeIndex, safeSlides])

  const activeSlide = safeSlides[activeIndex]
  if (!activeSlide) return null

  function goTo(index: number) {
    if (index === activeIndex) return

    setIsTransitioning(true)
    setTimeout(() => {
      setVideoPlaying(false)
      setActiveIndex(index)
      setProgressKey((current) => current + 1)
      setIsTransitioning(false)
    }, TRANSITION_DURATION)
  }

  return (
    <div className="relative w-full overflow-hidden bg-black h-[75vh] min-h-[520px]">
      {onConfigClick && (
        <button
          type="button"
          onClick={onConfigClick}
          aria-label="Configurar Hero"
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/60 transition-colors"
        >
          <Settings2 size={18} />
        </button>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={`thumb-${activeSlide.id}`}
        src={activeSlide.thumbnailUrl}
        alt={activeSlide.title}
        draggable={false}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          videoPlaying ? 'opacity-0' : 'opacity-60'
        }`}
      />

      <video
        ref={videoRef}
        muted
        autoPlay
        loop
        playsInline
        disablePictureInPicture
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          videoPlaying ? 'opacity-60' : 'opacity-0'
        }`}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      <div className="relative h-full flex items-end pb-14 md:pb-20">
        <div className="w-full max-w-[1920px] mx-auto px-6 md:px-10">
          <div
            className={`flex flex-col gap-4 max-w-lg transition-all duration-[400ms] ease-out ${
              isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            }`}
          >
            {activeSlide.badge && (
              <span className="inline-flex items-center self-start px-2.5 py-1 rounded-sm bg-white/15 backdrop-blur-sm font-mono text-[0.625rem] uppercase tracking-[0.14em] text-white/90">
                {activeSlide.badge}
              </span>
            )}

            {activeSlide.eyebrow && (
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-planton-accent/80">
                {activeSlide.eyebrow}
              </span>
            )}

            <Heading as="h1" size="heading-xl" className="!text-white">
              {activeSlide.title}
            </Heading>

            {activeSlide.meta && (
              <div className="flex items-center gap-3">
                <ContentTypeIcon type={activeSlide.meta.type} className="!text-white/60" />
                <span className="font-mono text-xs text-white/60">
                  {activeSlide.meta.duration.replace(/(\d+)/, '$1 ')}
                </span>
              </div>
            )}

            <Body className="text-white/70 line-clamp-2">{activeSlide.description}</Body>

            {activeSlide.pills && activeSlide.pills.length > 0 && (
              <div className="flex items-center gap-4 pt-1 flex-wrap">
                {activeSlide.pills.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 font-mono text-[0.6875rem] text-white/50"
                  >
                    <span className="w-1 h-1 rounded-full bg-planton-accent/60 shrink-0" />
                    {item}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 flex-wrap">
              <HeroAction action={activeSlide.primaryAction} />
              {activeSlide.secondaryAction && <HeroAction action={activeSlide.secondaryAction} />}
            </div>

            {safeSlides.length > 1 && (
              <div className="flex items-center gap-2 pt-2">
                {safeSlides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => goTo(index)}
                    aria-label={`Ir para destaque ${index + 1}`}
                    className="relative h-[3px] rounded-full overflow-hidden transition-all duration-300"
                    style={{ width: index === activeIndex ? 40 : 16 }}
                  >
                    <span className="absolute inset-0 bg-white/25" />
                    {index === activeIndex && (
                      <span
                        key={progressKey}
                        className="absolute inset-y-0 left-0 bg-white rounded-full"
                        style={{
                          width: '100%',
                          transition: `width ${ROTATION_INTERVAL}ms linear`,
                        }}
                        ref={(element) => {
                          if (element) {
                            element.style.width = '0%'
                            element.getBoundingClientRect()
                            element.style.width = '100%'
                          }
                        }}
                      />
                    )}
                    {index < activeIndex && <span className="absolute inset-0 bg-white/60" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function HeroAction({ action }: { action: AcademyHeroAction }) {
  if (action.variant === 'link') {
    return (
      <Link
        href={action.href}
        className="inline-flex items-center gap-2 font-mono text-xs font-medium text-planton-accent hover:text-planton-accent/90 transition-colors duration-150"
      >
        {action.label}
        {action.icon === 'arrow' ? <span aria-hidden>→</span> : null}
      </Link>
    )
  }

  if (action.style === 'outline') {
    return (
      <Button
        variant="outline"
        size="sm"
        href={action.href}
        className="border-white/30 text-white/80 hover:border-white hover:text-white"
      >
        {action.label}
        {action.icon === 'arrow' ? <span aria-hidden>→</span> : null}
      </Button>
    )
  }

  if (action.style === 'accent') {
    return (
      <Link
        href={action.href}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-planton-accent text-planton-dark font-mono text-xs font-medium hover:bg-planton-accent/90 transition-colors duration-150"
      >
        {action.label}
        {action.icon === 'arrow' ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : null}
      </Link>
    )
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      href={action.href}
      className="!text-planton-dark"
    >
      {action.icon === 'play' ? <Play className="h-4 w-4 fill-current" /> : null}
      {action.label}
    </Button>
  )
}
