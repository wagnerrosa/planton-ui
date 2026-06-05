'use client'

import { useEffect, useState } from 'react'
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
} from '../dashboard-gerencial/dashboard-data'
import { SEGMENT_ORDER } from './v2-derive'

// Contador animado (hydration-safe: anima no client após mount, valor final =
// SSR). Respeita prefers-reduced-motion.
function useCountUp(target: number, durationMs = 900) {
  // Inicializa no valor final → SSR e prefers-reduced-motion já corretos sem
  // setState síncrono no effect. A animação só "puxa" de 0 até target via rAF
  // (callback assíncrono, fora do corpo do effect).
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
      // se desmontou antes do 1º frame, garante valor final
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

export function HeroSummary({
  overview,
  stats,
  onSegmentClick,
}: {
  overview: Overview
  stats: MiniStat[]
  onSegmentClick?: (status: CombinationStatus) => void
}) {
  const pct = useCountUp(overview.pctConclusao)

  // Segmentos da barra na ordem canônica, ignorando os zerados e N/A.
  const segments = SEGMENT_ORDER.map((status) => ({
    status,
    count: overview.porStatus[status],
  })).filter((s) => s.count > 0)
  const totalSeg = segments.reduce((acc, s) => acc + s.count, 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-4">
      {/* Hero: % grande + barra segmentada */}
      <div className="bg-card border border-border p-5 flex flex-col justify-between gap-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <span className="text-[10px] font-heading font-semibold uppercase tracking-wider text-muted-foreground">
              Coleta concluída
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-heading text-5xl font-semibold text-foreground tabular-nums leading-none">
                {pct}
                <span className="text-2xl text-muted-foreground">%</span>
              </span>
            </div>
            <p className="text-[12px] font-sans text-muted-foreground mt-1.5">
              {overview.concluidas} de {overview.totalCombinacoes} combinações coletadas
              {overview.naoAplicaveis > 0 && (
                <span className="text-muted-foreground/60"> · {overview.naoAplicaveis} N/A</span>
              )}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-success-surface text-success text-[10px] font-sans font-medium shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            atualizado {overview.ultimaAtualizacaoLabel}
          </span>
        </div>

        {/* Barra segmentada */}
        <TooltipProvider delayDuration={120}>
          <div className="flex flex-col gap-2.5">
            <div className="flex h-2.5 w-full overflow-hidden bg-muted">
              {segments.map((seg) => {
                const meta = STATUS_META[seg.status]
                const widthPct = totalSeg === 0 ? 0 : (seg.count / totalSeg) * 100
                return (
                  <Tooltip key={seg.status}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => onSegmentClick?.(seg.status)}
                        style={{ width: `${widthPct}%` }}
                        className={`h-full transition-opacity hover:opacity-80 ${meta.barClass}`}
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

            {/* Legenda */}
            <div className="flex flex-wrap gap-x-3 gap-y-1">
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
                    <span className="tabular-nums font-medium text-foreground/80">{seg.count}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </TooltipProvider>
      </div>

      {/* Mini-stats 2×2 */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => {
          const interactive = !!stat.onClick
          const Comp = interactive ? 'button' : 'div'
          return (
            <Comp
              key={stat.key}
              {...(interactive ? { type: 'button' as const, onClick: stat.onClick } : {})}
              className={`bg-card border border-border p-4 flex flex-col justify-center gap-1 text-left transition-colors ${
                interactive ? 'hover:border-planton-accent/50 hover:bg-muted/30 cursor-pointer' : ''
              }`}
            >
              <span className={`font-heading text-2xl font-semibold tabular-nums leading-none ${TONE_CLASS[stat.tone]}`}>
                {stat.value}
              </span>
              <span className="text-[11px] font-sans text-muted-foreground leading-tight">
                {stat.label}
              </span>
            </Comp>
          )
        })}
      </div>
    </div>
  )
}
