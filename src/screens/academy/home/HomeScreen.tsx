'use client'

import { useState, useMemo, useRef } from 'react'
import { X } from 'lucide-react'
import { AcademyNavbarSync } from '@/components/navigation/AcademyNavbarSync'
import { AcademyFooter } from '@/components/navigation/AcademyFooter'
import { Body } from '@/components/primitives/Body'
import { Button } from '@/components/primitives/Button'
import { HeroContent } from './components/HeroContent'
import { ContentRow } from './components/ContentRow'
import { CertificationBanner } from './components/CertificationBanner'
import { SearchBar } from './components/SearchBar'
import { FilterChips, type FilterState } from './components/FilterChips'
import { ContentGrid } from './components/ContentGrid'
import { TrailGrid } from './components/TrailGrid'
import { OnboardingDialog } from './components/OnboardingDialog'
import {
  HERO_CONTENTS,
  CONTINUE_WATCHING_ITEMS,
  CONTENT_ITEMS,
  MOCK_TRAILS,
} from './mock-data'

const EMPTY_FILTERS: FilterState = { types: [], tags: [], statuses: [] }

export function HomeScreen() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS)
  const contentsSectionRef = useRef<HTMLDivElement>(null)

  const hasContinueWatching = CONTINUE_WATCHING_ITEMS.length > 0

  const hasActiveFilters =
    search.trim().length > 0 ||
    filters.types.length > 0 ||
    filters.tags.length > 0 ||
    filters.statuses.length > 0

  const showTrails = filters.types.includes('trilha')
  // Content types without trilha for item filtering
  const contentTypes = filters.types.filter((t) => t !== 'trilha')

  // Filtered results
  const filteredItems = useMemo(() => {
    if (!hasActiveFilters) return []
    // If only trilha is selected, no content items
    if (filters.types.length > 0 && contentTypes.length === 0) return []

    let items = CONTENT_ITEMS

    const query = search.trim().toLowerCase()
    if (query) {
      items = items.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.tags?.some((t) => t.toLowerCase().includes(query))
      )
    }

    if (contentTypes.length > 0) {
      items = items.filter((c) => (contentTypes as string[]).includes(c.type))
    }

    if (filters.tags.length > 0) {
      items = items.filter((c) => c.tags?.some((t) => filters.tags.includes(t)))
    }

    if (filters.statuses.length > 0) {
      items = items.filter((c) => filters.statuses.includes(c.status))
    }

    return items
  }, [search, filters, hasActiveFilters, contentTypes])

  // Content by type (when no search/filter active)
  const videoItems = CONTENT_ITEMS.filter((c) => c.type === 'video')
  const artigoItems = CONTENT_ITEMS.filter((c) => c.type === 'artigo')
  const podcastItems = CONTENT_ITEMS.filter((c) => c.type === 'podcast')
  const guiaItems = CONTENT_ITEMS.filter((c) => c.type === 'guia')

  function clearAll() {
    setSearch('')
    setFilters(EMPTY_FILTERS)
  }

  function handleExploreTrails() {
    setFilters({ ...EMPTY_FILTERS, types: ['trilha'] })
    setTimeout(() => {
      contentsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  // Build active filter label
  function getActiveLabel(): string {
    const parts: string[] = []
    if (search.trim()) parts.push(`"${search.trim()}"`)
    const typeLabels: Record<string, string> = { video: 'Vídeo', artigo: 'Artigo', podcast: 'Podcast', guia: 'Guia', trilha: 'Trilhas' }
    if (filters.types.length > 0) parts.push(filters.types.map((t) => typeLabels[t]).join(', '))
    if (filters.tags.length > 0) parts.push(filters.tags.join(', '))
    const statusLabels: Record<string, string> = { 'nao-iniciado': 'Não iniciado', visualizado: 'Em andamento', concluido: 'Concluído' }
    if (filters.statuses.length > 0) parts.push(filters.statuses.map((s) => statusLabels[s]).join(', '))
    return parts.join(' + ')
  }

  return (
    <div className="min-h-screen bg-background">
      <AcademyNavbarSync breadcrumbs={[{ label: 'Home' }]} />

      {/* 1. Hero */}
      <HeroContent contents={HERO_CONTENTS} />

      <div className="relative">
        {hasContinueWatching && (
          <div className="pointer-events-none absolute inset-y-0 hidden lg:block w-full" aria-hidden>
            <div className="max-w-[1920px] mx-auto h-full px-6">
              <div className="relative h-full">
                <span className="absolute top-0 bottom-0 left-[66.6667%] w-px -translate-x-1/2 bg-border" />
              </div>
            </div>
          </div>
        )}

        {/* 2. Continue assistindo + Banner de certificação */}
        <div className="max-w-[1920px] mx-auto px-6 py-10 flex flex-col gap-12">
          {hasContinueWatching && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:items-stretch">
              <div className="lg:col-span-2 pr-0 lg:pr-8">
                <ContentRow
                  title="Continue assistindo"
                  items={CONTINUE_WATCHING_ITEMS}
                  showProgress
                  showTrail
                />
              </div>
              <div className="pt-8 lg:pt-0 lg:pl-8 lg:-my-10 lg:-mr-6 flex flex-col">
                <CertificationBanner onExploreTrails={handleExploreTrails} />
              </div>
            </div>
          )}

          {!hasContinueWatching && (
            <CertificationBanner onExploreTrails={handleExploreTrails} />
          )}
        </div>

        <div className="border-t border-border" />

        {/* 3. Search Hub */}
        <div className="bg-surface-elevated">
          <div className="max-w-[1920px] mx-auto px-6 pt-12 flex justify-center">
            <SearchBar value={search} onChange={setSearch} />
          </div>
        </div>
      </div>

      <div className="bg-surface-elevated border-b border-border">
        <div className="max-w-[1920px] mx-auto px-6 pt-8 pb-12 flex justify-center">
          <FilterChips filters={filters} onChange={setFilters} />
        </div>
      </div>

      {/* 4. Conteúdos */}
      <div ref={contentsSectionRef}>
        {hasActiveFilters ? (
          <div className="max-w-[1920px] mx-auto px-6 pt-8 pb-16 flex flex-col gap-12">
            {/* Filtered results header */}
            <div className="flex items-center gap-3 flex-wrap">
              <Body size="sm" muted>
                Resultados para: {getActiveLabel()}
              </Body>
              <Button variant="ghost" size="sm" onClick={clearAll} className="text-planton-muted hover:text-foreground">
                <X className="h-3.5 w-3.5" />
                Limpar filtros
              </Button>
            </div>

            {showTrails && <TrailGrid trails={MOCK_TRAILS} />}

            {filteredItems.length > 0 && (
              <ContentGrid title="" items={filteredItems} initialCount={12} />
            )}

            {!showTrails && filteredItems.length === 0 && (
              <div className="py-16 text-center">
                <Body muted>Nenhum conteúdo encontrado para os filtros selecionados.</Body>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="max-w-[1920px] mx-auto px-6 pt-8 pb-10 w-full">
              <ContentGrid title="Vídeos" items={videoItems} />
            </div>
            <div className="border-t border-border" />
            <div className="max-w-[1920px] mx-auto px-6 py-10 w-full">
              <ContentGrid title="Artigos" items={artigoItems} />
            </div>
            <div className="border-t border-border" />
            <div className="max-w-[1920px] mx-auto px-6 py-10 w-full">
              <ContentGrid title="Podcasts" items={podcastItems} />
            </div>
            <div className="border-t border-border" />
            <div className="max-w-[1920px] mx-auto px-6 py-10 pb-16 w-full">
              <ContentGrid title="Guias" items={guiaItems} />
            </div>
          </div>
        )}
      </div>

      <AcademyFooter />

      <OnboardingDialog />
    </div>
  )
}
