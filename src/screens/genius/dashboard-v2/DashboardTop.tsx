'use client'

import { useEffect, useState } from 'react'
import { ChevronRight, Check } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn/tooltip'
import {
  STATUS_META,
  type Overview,
  type CombinationStatus,
  type AttentionItem,
} from './dashboard-data'
import { SEGMENT_ORDER, SEVERITY_META } from './v2-derive'

function useCountUp(target: number, durationMs = 900) {
  const [value, setValue] = useState(target)
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    let started = false
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(eased * target))
      started = true
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      if (!started) setValue(target)
    }
  }, [target, durationMs])
  return value
}

export type MiniStat = {
  key: string
  label: string
  value: string
  tone: 'default' | 'success' | 'warning' | 'destructive' | 'accent'
  onClick?: () => void
}

const TONE_CLASS: Record<MiniStat['tone'], string> = {
  default: 'text-foreground',
  success: 'text-success',
  warning: 'text-warning',
  destructive: 'text-destructive',
  accent: 'text-planton-accent',
}

export function DashboardTop({
  overview,
  stats,
  attentionItems,
  onSegmentClick,
  onAttentionOpen,
  onSeeAllAttention,
}: {
  overview: Overview
  stats: MiniStat[]
  attentionItems: AttentionItem[]
  onSegmentClick?: (status: CombinationStatus) => void
  onAttentionOpen: (filialId: string, categoriaId?: string) => void
  onSeeAllAttention?: () => void
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1.3fr)] gap-4 items-stretch">
      <HeroCard overview={overview} onSegmentClick={onSegmentClick} />
      <StatsCard stats={stats} />
      <AttentionCard
        items={attentionItems}
        onOpen={onAttentionOpen}
        onSeeAll={onSeeAllAttention}
      />
    </div>
  )
}

// ── Card 1: Hero % + barra ────────────────────────────────────────────────────
function HeroCard({
  overview,
  onSegmentClick,
}: {
  overview: Overview
  onSegmentClick?: (status: CombinationStatus) => void
}) {
  const pct = useCountUp(overview.pctConclusao)
  const segments = SEGMENT_ORDER.map((s) => ({
    status: s,
    count: overview.porStatus[s],
  })).filter((s) => s.count > 0)
  const totalSeg = segments.reduce((acc, s) => acc + s.count, 0)

  return (
    <div className="bg-card border border-border flex flex-col justify-between gap-4 px-7 py-6">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] font-heading font-semibold uppercase tracking-wider text-muted-foreground">
          Coleta concluída
        </span>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-success-surface text-success text-[10px] font-sans font-medium shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          atualizado {overview.ultimaAtualizacaoLabel}
        </span>
      </div>

      <div>
        <div className="flex items-baseline gap-0.5">
          <span className="font-mono text-[96px] font-normal text-foreground tabular-nums leading-[0.85]">
            {pct}
          </span>
          <span className="font-mono text-[40px] font-normal text-foreground leading-none">%</span>
        </div>
        <p className="text-[12px] font-sans text-muted-foreground mt-3">
          {overview.concluidas} de {overview.totalCombinacoes} combinações
          {overview.naoAplicaveis > 0 && (
            <span className="text-muted-foreground/50"> · {overview.naoAplicaveis} não se aplicam</span>
          )}
        </p>
      </div>

      <TooltipProvider delayDuration={100}>
        <div className="flex flex-col gap-3.5">
          <div className="flex gap-0.5 h-2.5 w-full">
            {segments.map((seg) => {
              const meta = STATUS_META[seg.status]
              const w = totalSeg === 0 ? 0 : (seg.count / totalSeg) * 100
              return (
                <Tooltip key={seg.status}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => onSegmentClick?.(seg.status)}
                      style={{ width: `${w}%` }}
                      className={`h-full transition-opacity hover:opacity-70 ${meta.barClass}`}
                      aria-label={`${meta.label}: ${seg.count}`}
                    />
                  </TooltipTrigger>
                  <TooltipContent className="text-[11px]">
                    {meta.label}: {seg.count}
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
          <div className="grid grid-cols-3 gap-x-3.5 gap-y-1.5">
            {segments.map((seg) => {
              const meta = STATUS_META[seg.status]
              return (
                <button
                  key={seg.status}
                  type="button"
                  onClick={() => onSegmentClick?.(seg.status)}
                  className="inline-flex items-center gap-1.5 text-[11px] font-sans text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${meta.dotClass}`} />
                  {meta.label}
                  <span className="tabular-nums font-semibold text-foreground/70">{seg.count}</span>
                </button>
              )
            })}
          </div>
        </div>
      </TooltipProvider>
    </div>
  )
}

// ── Card 2: Mini-stats 2×2 ────────────────────────────────────────────────────
function StatsCard({ stats }: { stats: MiniStat[] }) {
  return (
    <div className="bg-card border border-border grid grid-cols-2 grid-rows-2">
      {stats.map((stat, i) => {
        const interactive = !!stat.onClick
        const Comp = interactive ? 'button' : 'div'
        const borderCls = [
          i % 2 === 1 ? 'border-l border-border' : '',
          i >= 2 ? 'border-t border-border' : '',
        ].join(' ')
        return (
          <Comp
            key={stat.key}
            {...(interactive ? { type: 'button' as const, onClick: stat.onClick } : {})}
            className={`flex flex-col justify-center gap-2 px-6 py-5 text-left ${borderCls} ${
              interactive ? 'hover:bg-muted/30 transition-colors cursor-pointer' : ''
            }`}
          >
            <span className={`font-heading text-3xl font-semibold tabular-nums leading-none ${TONE_CLASS[stat.tone]}`}>
              {stat.value}
            </span>
            <span className="text-[11px] font-sans text-muted-foreground leading-snug">
              {stat.label}
            </span>
          </Comp>
        )
      })}
    </div>
  )
}

// ── Card 3: Atenção ───────────────────────────────────────────────────────────
function AttentionCard({
  items,
  onOpen,
  onSeeAll,
}: {
  items: AttentionItem[]
  onOpen: (filialId: string, categoriaId?: string) => void
  onSeeAll?: () => void
}) {
  if (items.length === 0) {
    return (
      <div className="bg-card border border-border flex flex-col items-center justify-center gap-3 px-6 py-8">
        <span className="flex items-center justify-center w-10 h-10 bg-success-surface text-success">
          <Check size={20} />
        </span>
        <div className="text-center">
          <p className="text-[13px] font-sans font-medium text-foreground">Tudo em dia</p>
          <p className="text-[11px] font-sans text-muted-foreground mt-0.5">
            Nenhuma pendência requer atenção.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border shrink-0">
        <h3 className="inline-flex items-center gap-2 text-[11px] font-heading font-semibold uppercase tracking-wider text-foreground">
          Precisa de atenção
          <span className="px-1.5 py-0.5 bg-muted text-muted-foreground text-[10px] font-sans font-semibold tabular-nums">
            {items.length}
          </span>
        </h3>
      </div>

      {/* Lista */}
      <div className="flex flex-col overflow-y-auto divide-y divide-border/50" style={{ maxHeight: 228, scrollbarWidth: 'thin', scrollbarColor: 'var(--color-border) transparent' }}>
        {items.map((item) => {
          const sev = SEVERITY_META[item.severity]
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onOpen(item.filialId, item.categoriaId)}
              className="group flex items-center gap-3 px-5 py-3.5 text-left hover:bg-muted/40 transition-colors flex-1"
            >
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${sev.dotClass}`} />
              <div className="min-w-0 flex-1">
                <p className="text-[12.5px] font-sans font-medium text-foreground truncate leading-snug">
                  {item.headline}
                </p>
                <p className="text-[11px] font-sans text-muted-foreground truncate mt-0.5">
                  {item.detail}
                </p>
              </div>
              <ChevronRight size={13} className="text-muted-foreground/50 shrink-0 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all" />
            </button>
          )
        })}
      </div>

      {/* Footer: ver tudo */}
      {items.length > 0 && (
        <button
          type="button"
          onClick={onSeeAll}
          className="flex items-center justify-center gap-1 px-5 py-2.5 border-t border-border text-[11px] font-sans font-medium bg-planton-accent text-white hover:opacity-90 transition-opacity shrink-0"
        >
          Ver todas as {items.length} pendências
          <ChevronRight size={13} />
        </button>
      )}
    </div>
  )
}
