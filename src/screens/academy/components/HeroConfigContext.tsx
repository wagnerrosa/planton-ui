'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { AcademyHeroSlide } from './AcademyHero'
import { HOME_HERO_SLIDES } from '../home/mock-data'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type HeroVideoConfig = {
  muxPlaybackId: string
  thumbnailUrl: string
  title: string
  eyebrow: string
  description: string
  bullets: [string, string, string]
  ctaLabel: string
  ctaHref: string
}

export type HeroConfig = {
  heroVideo: HeroVideoConfig
  contentIds: string[]
}

type HeroConfigContextValue = {
  slides: AcademyHeroSlide[]
  config: HeroConfig
  dialogOpen: boolean
  openDialog: () => void
  closeDialog: () => void
  saveConfig: (config: HeroConfig) => void
}

// ---------------------------------------------------------------------------
// Default values
// ---------------------------------------------------------------------------

const DEFAULT_HERO_VIDEO: HeroVideoConfig = {
  muxPlaybackId: 'Saalk9MFlAPv1moxI00yiyJzvxdQOesW23fPVc3AL802w',
  thumbnailUrl: `https://image.mux.com/Saalk9MFlAPv1moxI00yiyJzvxdQOesW23fPVc3AL802w/thumbnail.png`,
  title: 'Aprenda ESG com trilhas estruturadas',
  eyebrow: 'Trilhas de aprendizagem',
  description: 'Evolua do básico ao avançado com jornadas guiadas e conquiste seu certificado',
  bullets: ['Jornada guiada', 'Progressão por níveis', 'Certificação'],
  ctaLabel: 'Explorar trilhas',
  ctaHref: '/design-system/screens/academy/(app)/trilhas',
}

const DEFAULT_CONFIG: HeroConfig = {
  heroVideo: DEFAULT_HERO_VIDEO,
  contentIds: [],
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function heroVideoToSlide(video: HeroVideoConfig): AcademyHeroSlide {
  return {
    id: 'hero-custom-video',
    muxPlaybackId: video.muxPlaybackId,
    thumbnailUrl: video.thumbnailUrl,
    eyebrow: video.eyebrow || undefined,
    title: video.title,
    description: video.description,
    pills: video.bullets.filter(Boolean),
    primaryAction: {
      label: video.ctaLabel,
      href: video.ctaHref,
      style: 'accent',
      icon: 'arrow',
    },
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const HeroConfigContext = createContext<HeroConfigContextValue | null>(null)

export function HeroConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<HeroConfig>(DEFAULT_CONFIG)
  const [slides, setSlides] = useState<AcademyHeroSlide[]>(HOME_HERO_SLIDES)
  const [dialogOpen, setDialogOpen] = useState(false)

  function openDialog() {
    setDialogOpen(true)
  }

  function closeDialog() {
    setDialogOpen(false)
  }

  function saveConfig(newConfig: HeroConfig) {
    setConfig(newConfig)

    // Build new slides: heroVideo first, then selected catalog contents
    const heroSlide = heroVideoToSlide(newConfig.heroVideo)

    // Import CONTENT_ITEMS dynamically to resolve selected contents as hero slides
    import('../home/mock-data').then(({ CONTENT_ITEMS }) => {
      const contentSlides = newConfig.contentIds
        .map((id) => CONTENT_ITEMS.find((c) => c.id === id))
        .filter(Boolean)
        .map((content) => {
          const c = content!
          return {
            id: c.id,
            muxPlaybackId: c.muxPlaybackId,
            thumbnailUrl: c.thumbnailUrl,
            eyebrow: c.trail ? `trilha: ${c.trail.name}` : undefined,
            title: c.title,
            description: c.description,
            meta: { type: c.type, duration: c.duration },
            primaryAction: {
              label: 'Assistir',
              href: `/design-system/screens/academy/content/${c.id}`,
              icon: 'play' as const,
            },
          } satisfies AcademyHeroSlide
        })

      setSlides([heroSlide, ...contentSlides])
    })

    setDialogOpen(false)
  }

  return (
    <HeroConfigContext.Provider value={{ slides, config, dialogOpen, openDialog, closeDialog, saveConfig }}>
      {children}
    </HeroConfigContext.Provider>
  )
}

export function useHeroConfig() {
  const ctx = useContext(HeroConfigContext)
  if (!ctx) throw new Error('useHeroConfig must be used inside HeroConfigProvider')
  return ctx
}
