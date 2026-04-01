'use client'

import { useState, useMemo } from 'react'
import { Search, ArrowUp, ArrowDown, X, Upload, Link2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/shadcn/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/shadcn/tabs'
import { Input } from '@/components/shadcn/input'
import { Textarea } from '@/components/shadcn/textarea'
import { Label } from '@/components/shadcn/label'
import { Button } from '@/components/primitives/Button'
import { Body } from '@/components/primitives/Body'
import { Badge } from '@/components/shadcn/badge'
import { CONTENT_ITEMS } from '../home/mock-data'
import { useHeroConfig, type HeroVideoConfig } from './HeroConfigContext'

const MAX_CONTENT_SLOTS = 3

// ---------------------------------------------------------------------------
// Step 1: Hero video form
// ---------------------------------------------------------------------------

type Step1Props = {
  value: HeroVideoConfig
  onChange: (v: HeroVideoConfig) => void
}

function Step1({ value, onChange }: Step1Props) {
  function set<K extends keyof HeroVideoConfig>(key: K, val: HeroVideoConfig[K]) {
    onChange({ ...value, [key]: val })
  }

  function setBullet(index: 0 | 1 | 2, text: string) {
    const bullets = [...value.bullets] as [string, string, string]
    bullets[index] = text
    onChange({ ...value, bullets })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border border-border bg-muted/30 px-4 py-3">
        <Body muted className="text-xs leading-relaxed">
          Este é o vídeo principal exibido no Hero. Ele aparece como destaque inicial e pode direcionar para uma trilha ou a página de trilhas.
        </Body>
      </div>

      {/* Vídeo */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="hero-video-url">Link do vídeo (embed / Mux Playback ID)</Label>
          <div className="relative">
            <Link2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-planton-muted" />
            <Input
              id="hero-video-url"
              placeholder="Cole o Mux Playback ID ou URL do vídeo"
              value={value.muxPlaybackId}
              onChange={(e) => set('muxPlaybackId', e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <Body muted className="text-xs">ou</Body>
          <span className="h-px flex-1 bg-border" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="hero-video-file">
            <span className="flex items-center gap-1.5">
              <Upload size={14} />
              Upload de arquivo de vídeo
            </span>
          </Label>
          <Input id="hero-video-file" type="file" accept="video/*" />
          <Body muted className="text-xs">O upload substitui o Playback ID acima ao ser processado</Body>
        </div>
      </div>

      {/* Cartola */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="hero-eyebrow">Cartola</Label>
        <Input
          id="hero-eyebrow"
          placeholder="ex: Trilhas de aprendizagem"
          value={value.eyebrow}
          onChange={(e) => set('eyebrow', e.target.value)}
        />
      </div>

      {/* Título */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="hero-title">Título</Label>
        <Input
          id="hero-title"
          placeholder="Título do vídeo principal"
          value={value.title}
          onChange={(e) => set('title', e.target.value)}
        />
      </div>

      {/* Descrição */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="hero-desc">Descrição</Label>
        <Textarea
          id="hero-desc"
          placeholder="Breve descrição exibida abaixo do título"
          rows={2}
          value={value.description}
          onChange={(e) => set('description', e.target.value)}
        />
      </div>

      {/* Bullets */}
      <div className="flex flex-col gap-2">
        <Label>Bullets (até 3)</Label>
        {([0, 1, 2] as const).map((i) => (
          <Input
            key={i}
            placeholder={`Bullet ${i + 1}`}
            value={value.bullets[i]}
            onChange={(e) => setBullet(i, e.target.value)}
          />
        ))}
      </div>

      {/* CTA */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="hero-cta-label">Texto do botão (CTA)</Label>
          <Input
            id="hero-cta-label"
            placeholder="ex: Explorar trilhas"
            value={value.ctaLabel}
            onChange={(e) => set('ctaLabel', e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="hero-cta-href">Link do botão</Label>
          <Input
            id="hero-cta-href"
            placeholder="ex: /trilhas"
            value={value.ctaHref}
            onChange={(e) => set('ctaHref', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Step 2: Content selection
// ---------------------------------------------------------------------------

type Step2Props = {
  selectedIds: string[]
  onChangeIds: (ids: string[]) => void
}

function Step2({ selectedIds, onChangeIds }: Step2Props) {
  const [search, setSearch] = useState('')

  const available = useMemo(() => {
    const q = search.toLowerCase().trim()
    const videos = CONTENT_ITEMS.filter((c) => c.type === 'video')
    if (!q) return videos
    return videos.filter((c) => c.title.toLowerCase().includes(q))
  }, [search])

  function toggle(id: string) {
    if (selectedIds.includes(id)) {
      onChangeIds(selectedIds.filter((s) => s !== id))
    } else if (selectedIds.length < MAX_CONTENT_SLOTS) {
      onChangeIds([...selectedIds, id])
    }
  }

  function move(index: number, direction: 'up' | 'down') {
    const next = [...selectedIds]
    const swap = direction === 'up' ? index - 1 : index + 1
    if (swap < 0 || swap >= next.length) return
    ;[next[index], next[swap]] = [next[swap], next[index]]
    onChangeIds(next)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border border-border bg-muted/30 px-4 py-3">
        <Body muted className="text-xs leading-relaxed">
          Selecione até 3 conteúdos que aparecerão após o vídeo principal no carrossel do Hero. A ordem define a sequência de exibição.
        </Body>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-planton-muted" />
        <Input
          placeholder="Buscar conteúdo no catálogo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Catalog list */}
      <div className="border border-border max-h-[200px] overflow-y-auto">
        {available.length === 0 ? (
          <div className="px-4 py-6 text-sm text-planton-muted text-center">Nenhum conteúdo encontrado</div>
        ) : (
          available.map((content) => {
            const isSelected = selectedIds.includes(content.id)
            const isDisabled = !isSelected && selectedIds.length >= MAX_CONTENT_SLOTS
            return (
              <button
                key={content.id}
                type="button"
                disabled={isDisabled}
                onClick={() => toggle(content.id)}
                className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between border-b border-border last:border-b-0 transition-colors ${
                  isSelected
                    ? 'bg-planton-accent/10 text-planton-accent'
                    : isDisabled
                      ? 'opacity-40 cursor-not-allowed'
                      : 'hover:bg-muted'
                }`}
              >
                <span>{content.title}</span>
                <Badge variant="outline" className="text-xs shrink-0">{content.type}</Badge>
              </button>
            )
          })
        )}
      </div>

      {/* Selected + ordering */}
      {selectedIds.length > 0 && (
        <div className="flex flex-col gap-1">
          <Label className="mb-1">
            Selecionados ({selectedIds.length}/{MAX_CONTENT_SLOTS})
          </Label>
          {selectedIds.map((id, i) => {
            const content = CONTENT_ITEMS.find((c) => c.id === id)
            if (!content) return null
            return (
              <div key={id} className="flex items-center gap-2 border border-border px-3 py-2">
                <span className="font-mono text-xs text-planton-muted w-5">{i + 1}</span>
                <span className="flex-1 text-sm truncate">{content.title}</span>
                <button
                  type="button"
                  onClick={() => move(i, 'up')}
                  disabled={i === 0}
                  className="p-1 hover:bg-muted rounded disabled:opacity-30 transition-colors"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 'down')}
                  disabled={i === selectedIds.length - 1}
                  className="p-1 hover:bg-muted rounded disabled:opacity-30 transition-colors"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => onChangeIds(selectedIds.filter((s) => s !== id))}
                  className="p-1 hover:bg-muted rounded text-destructive transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Dialog
// ---------------------------------------------------------------------------

export function HeroConfigDialog() {
  const { dialogOpen, closeDialog, saveConfig, config } = useHeroConfig()

  const [tab, setTab] = useState<'video' | 'conteudos'>('video')
  const [heroVideo, setHeroVideo] = useState<HeroVideoConfig>(config.heroVideo)
  const [contentIds, setContentIds] = useState<string[]>(config.contentIds)

  function handleOpenChange(open: boolean) {
    if (!open) {
      closeDialog()
      setTab('video')
      setHeroVideo(config.heroVideo)
      setContentIds(config.contentIds)
    }
  }

  function handleSave() {
    saveConfig({ heroVideo, contentIds })
    setTab('video')
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configurar Hero</DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => setTab(v as 'video' | 'conteudos')} className="mt-2">
          <TabsList className="w-full">
            <TabsTrigger value="video" className="flex-1">1. Vídeo principal</TabsTrigger>
            <TabsTrigger value="conteudos" className="flex-1">2. Conteúdos do carrossel</TabsTrigger>
          </TabsList>

          <TabsContent value="video" className="pt-4">
            <Step1 value={heroVideo} onChange={setHeroVideo} />
          </TabsContent>

          <TabsContent value="conteudos" className="pt-4">
            <Step2 selectedIds={contentIds} onChangeIds={setContentIds} />
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          {tab === 'video' ? (
            <Button onClick={() => setTab('conteudos')}>
              Próximo
            </Button>
          ) : (
            <>
              <Button onClick={() => setTab('video')}>
                Voltar
              </Button>
              <Button onClick={handleSave}>
                Salvar
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
