'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Hls from 'hls.js'
import { Play } from 'lucide-react'
import { Button } from '@/components/primitives/Button'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { ContentTypeIcon } from './ContentTypeIcon'
import type { ContentItem } from '../mock-data'

type HeroContentProps = {
  contents: ContentItem[]
}

const ROTATION_INTERVAL = 7000
const TRANSITION_DURATION = 400

function getContentBadge(content: ContentItem): string | null {
  if (content.isNew) return 'Novo'
  if (content.progress > 0 && content.progress < 100) return 'Continuar assistindo'
  return null
}

export function HeroContent({ contents }: HeroContentProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [progressKey, setProgressKey] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)

  const goTo = useCallback(
    (index: number) => {
      if (index === activeIndex) return
      setIsTransitioning(true)
      setTimeout(() => {
        setVideoPlaying(false)
        setActiveIndex(index)
        setProgressKey((k) => k + 1)
        setIsTransitioning(false)
      }, TRANSITION_DURATION)
    },
    [activeIndex]
  )

  useEffect(() => {
    if (contents.length <= 1) return
    const timer = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setVideoPlaying(false)
        setActiveIndex((prev) => (prev + 1) % contents.length)
        setProgressKey((k) => k + 1)
        setIsTransitioning(false)
      }, TRANSITION_DURATION)
    }, ROTATION_INTERVAL)
    return () => clearInterval(timer)
  }, [contents.length])

  // Attach HLS stream to <video> when activeIndex changes
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    setVideoPlaying(false)
    const src = `https://stream.mux.com/${contents[activeIndex].muxPlaybackId}.m3u8`

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
  }, [activeIndex, contents])

  const content = contents[activeIndex]
  const contentHref = `/design-system/screens/academy/content/${content.id}`
  const trailHref = content.trail
    ? `/design-system/screens/academy/trail/${content.trail.id}`
    : null
  const badge = getContentBadge(content)

  return (
    <div className="relative w-full overflow-hidden bg-black h-[60vh] min-h-[420px] max-h-[720px]">
      {/* Background thumbnail — fades out when video starts */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={`thumb-${content.id}`}
        src={content.thumbnailUrl}
        alt={content.title}
        draggable={false}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          videoPlaying ? 'opacity-0' : 'opacity-60'
        }`}
      />

      {/* Background video — muted, autoplay, no controls */}
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

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      {/* Content — slide-up + fade transition */}
      <div className="relative h-full flex items-end pb-14 md:pb-20">
        <div className="w-full max-w-[1920px] mx-auto px-6 md:px-10">
          <div
            className={`flex flex-col gap-4 max-w-lg transition-all duration-[400ms] ease-out ${
              isTransitioning
                ? 'opacity-0 translate-y-4'
                : 'opacity-100 translate-y-0'
            }`}
          >
            {/* Badge contextual */}
            {badge && (
              <span className="inline-flex items-center self-start px-2.5 py-1 rounded-sm bg-white/15 backdrop-blur-sm font-mono text-[0.625rem] uppercase tracking-[0.14em] text-white/90">
                {badge}
              </span>
            )}

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
              <ContentTypeIcon type={content.type} className="!text-white/60" />
              <span className="font-mono text-xs text-white/60">{content.duration.replace(/(\d+)/, '$1 ')}</span>
            </div>

            <Body className="text-white/70 line-clamp-2">{content.description}</Body>

            {/* CTAs */}
            <div className="flex items-center gap-3 flex-wrap">
              <Button variant="secondary" size="sm" href={contentHref} className="!text-planton-dark">
                <Play className="h-4 w-4 fill-current" />
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

            {/* Progress pills — Apple TV+ style */}
            {contents.length > 1 && (
              <div className="flex items-center gap-2 pt-2">
                {contents.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Ir para destaque ${i + 1}`}
                    className="relative h-[3px] rounded-full overflow-hidden transition-all duration-300"
                    style={{ width: i === activeIndex ? 40 : 16 }}
                  >
                    {/* Track */}
                    <span className="absolute inset-0 bg-white/25" />
                    {/* Fill — animated progress */}
                    {i === activeIndex && (
                      <span
                        key={progressKey}
                        className="absolute inset-y-0 left-0 bg-white rounded-full"
                        style={{
                          width: '100%',
                          transition: `width ${ROTATION_INTERVAL}ms linear`,
                          // Force restart: mount at 0, then CSS transition kicks in
                        }}
                        ref={(el) => {
                          if (el) {
                            el.style.width = '0%'
                            // Force reflow then animate to 100%
                            el.getBoundingClientRect()
                            el.style.width = '100%'
                          }
                        }}
                      />
                    )}
                    {/* Completed pills */}
                    {i < activeIndex && (
                      <span className="absolute inset-0 bg-white/60" />
                    )}
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
