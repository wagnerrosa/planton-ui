'use client'

import { useMemo, useState } from 'react'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Check, X, Clock, AlertTriangle } from 'lucide-react'
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/shadcn/sheet'
import { StatusPill } from '../dashboard-gerencial/StatusPill'
import {
  CATEGORIA_COLS,
  findFilial,
  type Combination,
  type Filial,
} from '../dashboard-gerencial/dashboard-data'
import { getCombinationTimeline, type TimelineEvent } from './v2-derive'

export type DrawerTarget = { filialId: string; categoriaId?: string } | null

export function FilialDrawerV2({
  target,
  onClose,
}: {
  target: DrawerTarget
  onClose: () => void
}) {
  return (
    <Sheet open={target !== null} onOpenChange={(o) => { if (!o) onClose() }}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl p-0 flex flex-col gap-0 overflow-hidden"
      >
        <VisuallyHidden>
          <SheetTitle>Detalhe da filial</SheetTitle>
          <SheetDescription>Informações de coleta e rastreio por categoria</SheetDescription>
        </VisuallyHidden>
        {target && (
          <DrawerInner
            key={`${target.filialId}:${target.categoriaId ?? ''}`}
            target={target}
            onClose={onClose}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}

function DrawerInner({
  target,
  onClose,
}: {
  target: NonNullable<DrawerTarget>
  onClose: () => void
}) {
  const filial: Filial | undefined = findFilial(target.filialId)

  const applicableCols = useMemo(
    () =>
      filial
        ? CATEGORIA_COLS.filter((c) => filial.combinacoes[c.id].status !== 'nao-aplicavel')
        : [],
    [filial],
  )

  const [activeCatId, setActiveCatId] = useState<string | null>(() => {
    if (
      target.categoriaId &&
      filial &&
      filial.combinacoes[target.categoriaId].status !== 'nao-aplicavel'
    ) {
      return target.categoriaId
    }
    return applicableCols[0]?.id ?? null
  })

  const activeCol = activeCatId ? CATEGORIA_COLS.find((c) => c.id === activeCatId) : undefined
  const comb = filial && activeCatId ? filial.combinacoes[activeCatId] : undefined

  if (!filial) return null

  return (
    <>
      {/* Header: sigla + nome + status integrado */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border shrink-0">
        <span
          className={`flex items-center justify-center w-11 h-11 shrink-0 font-heading text-sm font-semibold ${
            filial.respondente
              ? 'bg-planton-forest text-planton-accent'
              : 'bg-warning-surface text-warning border border-warning-border'
          }`}
        >
          {filial.sigla}
        </span>
        <div className="min-w-0 flex-1">
          <div className="font-heading text-base font-semibold text-foreground leading-tight">
            {filial.nome}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[12px] font-sans text-muted-foreground truncate">
              {activeCol ? activeCol.label : 'Sem categoria aplicável'}
            </span>
            {comb && <StatusPill status={comb.status} />}
          </div>
        </div>
      </div>

      {/* Tabs de categoria — só se mais de 1 */}
      {applicableCols.length > 1 && (
        <div className="flex gap-1 px-4 py-2 border-b border-border overflow-x-auto shrink-0">
          {applicableCols.map((col) => {
            const Icon = col.icon
            const isActive = col.id === activeCatId
            return (
              <button
                key={col.id}
                type="button"
                onClick={() => setActiveCatId(col.id)}
                title={col.label}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-sans whitespace-nowrap transition-colors border ${
                  isActive
                    ? 'border-planton-accent bg-planton-accent/10 text-planton-accent font-medium'
                    : 'border-transparent text-muted-foreground hover:bg-muted'
                }`}
              >
                <Icon size={13} />
                {col.labelCurto}
              </button>
            )
          })}
        </div>
      )}

      {/* Corpo */}
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-7">
        {comb ? (
          <CombinationDetail comb={comb} filialNome={filial.nome} sigla={filial.sigla} />
        ) : (
          <p className="text-[13px] font-sans text-muted-foreground py-8 text-center">
            Esta filial não possui categorias aplicáveis.
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 px-6 py-3.5 border-t border-border shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="text-[13px] font-sans text-muted-foreground hover:text-foreground transition-colors"
        >
          Fechar
        </button>
        <div className="flex-1" />
        <button
          type="button"
          className="px-4 h-9 text-[13px] font-sans font-medium bg-planton-accent text-white hover:bg-planton-accent/90 transition-colors"
        >
          Abrir planilha
        </button>
      </div>
    </>
  )
}

// Retorna done/fail/current + somente o próximo pending. Oculta pending futuros.
function visibleTimeline(events: TimelineEvent[]): TimelineEvent[] {
  const result: TimelineEvent[] = []
  let pendingSeen = false
  for (const ev of events) {
    if (ev.state === 'pending') {
      if (!pendingSeen) {
        result.push(ev)
        pendingSeen = true
      }
    } else {
      result.push(ev)
    }
  }
  return result
}

function CombinationDetail({
  comb,
  filialNome,
  sigla,
}: {
  comb: Combination
  filialNome: string
  sigla: string
}) {
  const timeline = useMemo(() => getCombinationTimeline(comb), [comb])

  return (
    <>
      {/* Bloco: Quem responde */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-heading font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          Responsável
        </span>
        {comb.respondente ? (
          <div className="flex flex-col gap-0.5">
            <span className="text-[14px] font-sans font-semibold text-foreground leading-tight">
              {comb.respondente.nome}
            </span>
            <span className="text-[12px] font-sans text-muted-foreground">
              {comb.respondente.email}
            </span>
            <span className="text-[12px] font-sans text-muted-foreground mt-0.5">
              {filialNome} ({sigla})
              {comb.atividade.diasSemAtualizar > 0 && (
                <span className="text-warning font-medium">
                  {' '}· {comb.atividade.diasSemAtualizar} dia{comb.atividade.diasSemAtualizar !== 1 ? 's' : ''} sem atualizar
                </span>
              )}
              {comb.atividade.diasSemAtualizar === 0 && (
                <span className="text-success font-medium">
                  {' '}· atualizado {comb.atividade.ultimaAtualizacao}
                </span>
              )}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2.5 bg-warning-surface border border-warning-border">
            <AlertTriangle size={14} className="text-warning shrink-0" />
            <span className="text-[13px] font-sans text-warning font-medium">
              Nenhum responsável designado
            </span>
          </div>
        )}
      </div>

      {/* Bloco: Ciclo */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center mb-1">
          <span className="text-[10px] font-heading font-semibold uppercase tracking-wider text-muted-foreground">
            Ciclo de coleta
          </span>
        </div>
        <Timeline events={visibleTimeline(timeline)} />
      </div>
    </>
  )
}

// ── Timeline ──────────────────────────────────────────────────────────────────

const TL_STATE_META: Record<
  TimelineEvent['state'],
  { dot: string; ring: string; icon: React.ReactNode | null; labelClass: string }
> = {
  done: {
    dot: 'bg-success text-white',
    ring: 'bg-success/30',
    icon: <Check size={11} strokeWidth={3} />,
    labelClass: 'text-foreground',
  },
  current: {
    dot: 'bg-planton-accent text-white',
    ring: 'bg-planton-accent/30',
    icon: <Clock size={11} strokeWidth={2.5} />,
    labelClass: 'text-foreground font-medium',
  },
  fail: {
    dot: 'bg-destructive text-white',
    ring: 'bg-destructive/30',
    icon: <X size={11} strokeWidth={3} />,
    labelClass: 'text-destructive font-medium',
  },
  pending: {
    dot: 'bg-muted text-muted-foreground border border-border',
    ring: 'bg-border/60',
    icon: null,
    labelClass: 'text-muted-foreground',
  },
}

function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="flex flex-col">
      {events.map((ev, i) => {
        const meta = TL_STATE_META[ev.state]
        const isLast = i === events.length - 1
        return (
          <li key={ev.key} className="flex gap-3">
            <div className="flex flex-col items-center shrink-0">
              <span
                className={`flex items-center justify-center w-6 h-6 rounded-full shrink-0 ${meta.dot}`}
              >
                {meta.icon}
              </span>
              {!isLast && <span className={`w-px flex-1 my-1 ${meta.ring}`} />}
            </div>
            <div className={`min-w-0 ${isLast ? '' : 'pb-4'}`}>
              <p className={`text-[13px] font-sans leading-tight ${meta.labelClass}`}>
                {ev.label}
              </p>
              {ev.detail && (
                <p className="text-[11px] font-sans text-muted-foreground mt-0.5">{ev.detail}</p>
              )}
              {ev.action && (
                <p className={`text-[11px] font-sans leading-snug mt-1.5 px-2.5 py-2 border-l-2 ${
                  ev.state === 'fail'
                    ? 'border-l-destructive bg-destructive-surface text-destructive/90'
                    : 'border-l-warning bg-warning-surface text-warning/90'
                }`}>
                  {ev.action}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
