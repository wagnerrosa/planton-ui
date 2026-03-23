'use client'

import { useState, useMemo } from 'react'
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
import { OnboardingDialog } from './components/OnboardingDialog'
import {
  HERO_CONTENTS,
  CONTINUE_WATCHING_ITEMS,
  CONTENT_ITEMS,
  MOCK_TRAILS,
} from './mock-data'

const EMPTY_FILTERS: FilterState = { type: null, tag: null, status: null }

export function HomeScreen() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS)

  const hasContinueWatching = CONTINUE_WATCHING_ITEMS.length > 0

  const hasActiveFilters =
    search.trim().length > 0 ||
    filters.type !== null ||
    filters.tag !== null ||
    filters.status !== null

  // Filtered results
  const filteredItems = useMemo(() => {
    if (!hasActiveFilters) return []

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

    if (filters.type) {
      items = items.filter((c) => c.type === filters.type)
    }

    if (filters.tag) {
      items = items.filter((c) => c.tags?.includes(filters.tag!))
    }

    if (filters.status) {
      items = items.filter((c) => c.status === filters.status)
    }

    return items
  }, [search, filters, hasActiveFilters])

  // Content by type (when no search/filter active)
  const videoItems = CONTENT_ITEMS.filter((c) => c.type === 'video')
  const artigoItems = CONTENT_ITEMS.filter((c) => c.type === 'artigo')
  const podcastItems = CONTENT_ITEMS.filter((c) => c.type === 'podcast')
  const guiaItems = CONTENT_ITEMS.filter((c) => c.type === 'guia')

  function clearAll() {
    setSearch('')
    setFilters(EMPTY_FILTERS)
  }

  // Build active filter label
  function getActiveLabel(): string {
    const parts: string[] = []
    if (search.trim()) parts.push(`"${search.trim()}"`)
    if (filters.type) {
      const labels: Record<string, string> = { video: 'Vídeo', artigo: 'Artigo', podcast: 'Podcast', guia: 'Guia' }
      parts.push(labels[filters.type])
    }
    if (filters.tag) parts.push(filters.tag)
    if (filters.status) {
      const labels: Record<string, string> = { 'nao-iniciado': 'Não iniciado', visualizado: 'Em andamento', concluido: 'Concluído' }
      parts.push(labels[filters.status])
    }
    return parts.join(' + ')
  }

  return (
    <div className="min-h-screen bg-background">
      <AcademyNavbarSync breadcrumbs={[{ label: 'Home' }]} />

      {/* 1. Hero */}
      <HeroContent contents={HERO_CONTENTS} />

      {/* 2. Continue assistindo + Banner de certificação */}
      <div className="max-w-[1920px] mx-auto px-6 py-10 flex flex-col gap-12">
        {hasContinueWatching && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            <div className="lg:col-span-2 pr-0 lg:pr-8">
              <ContentRow
                title="Continue assistindo"
                items={CONTINUE_WATCHING_ITEMS}
                showProgress
                showTrail
              />
            </div>
            <div className="pt-8 lg:pt-0 lg:pl-8 lg:border-l border-border flex flex-col justify-center">
              <CertificationBanner />
            </div>
          </div>
        )}

        {!hasContinueWatching && (
          <CertificationBanner />
        )}
      </div>

      <div className="border-t border-border" />

      {/* 3. Busca + Filtros */}
      <div className="max-w-[1920px] mx-auto px-6 pt-10 pb-6 flex flex-col gap-5 items-center">
        <SearchBar value={search} onChange={setSearch} />
        <FilterChips filters={filters} onChange={setFilters} />
      </div>

      {/* 4. Conteúdos */}
      <div className="max-w-[1920px] mx-auto px-6 pb-16 flex flex-col gap-12">
        {hasActiveFilters ? (
          <>
            {/* Filtered results */}
            <div className="flex items-center gap-3 flex-wrap">
              <Body size="sm" muted>
                Resultados para: {getActiveLabel()}
              </Body>
              <Button variant="ghost" size="sm" onClick={clearAll} className="text-planton-muted hover:text-foreground">
                <X className="h-3.5 w-3.5" />
                Limpar filtros
              </Button>
            </div>

            {filteredItems.length > 0 ? (
              <ContentGrid title="" items={filteredItems} initialCount={12} />
            ) : (
              <div className="py-16 text-center">
                <Body muted>Nenhum conteúdo encontrado para os filtros selecionados.</Body>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Content by type */}
            <ContentGrid title="Vídeos" items={videoItems} />
            <ContentGrid title="Artigos" items={artigoItems} />
            <ContentGrid title="Podcasts" items={podcastItems} />
            <ContentGrid title="Guias" items={guiaItems} />
          </>
        )}
      </div>

      <AcademyFooter />

      <OnboardingDialog />
    </div>
  )
}
