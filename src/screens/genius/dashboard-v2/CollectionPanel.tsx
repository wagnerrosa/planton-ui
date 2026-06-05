'use client'

import { useMemo, useState } from 'react'
import {
  Search,
  Users,
  Layers,
  ChevronDown,
  ArrowUpDown,
  ChevronRight,
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn/tooltip'
import { STATUS_META, getCategoriaRollup } from '../dashboard-gerencial/dashboard-data'
import { StatusPill } from '../dashboard-gerencial/StatusPill'
import { getFilialRows, type FilialRow, type StatusDot } from './v2-derive'

type Axis = 'filial' | 'categoria'
// Sem Z–A por spec: cada coluna alterna A–Z ↔ ordem de inserção.
type SortState = { key: 'nome' | 'pct'; asc: boolean } | null

export function CollectionPanel({
  onOpenDrawer,
}: {
  onOpenDrawer: (filialId: string, categoriaId?: string) => void
}) {
  const [axis, setAxis] = useState<Axis>('filial')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortState>(null)

  return (
    <section className="flex flex-col gap-3">
      {/* Cabeçalho: título + toggle + busca */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="font-heading text-[15px] font-semibold text-foreground">
          {axis === 'filial' ? 'Progresso por filial' : 'Coleta por categoria'}
        </h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar…"
              className="h-8 w-44 pl-8 pr-2.5 text-[12px] font-sans bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-planton-accent"
            />
          </div>
          <div className="flex items-center border border-border overflow-hidden">
            <ToggleBtn
              active={axis === 'filial'}
              onClick={() => setAxis('filial')}
              icon={<Users size={14} />}
              label="Por filial"
            />
            <ToggleBtn
              active={axis === 'categoria'}
              onClick={() => setAxis('categoria')}
              icon={<Layers size={14} />}
              label="Por categoria"
            />
          </div>
        </div>
      </div>

      {/* Barra de ordenação (A–Z ↔ inserção) */}
      <div className="flex items-center gap-1.5 text-[11px] font-sans text-muted-foreground">
        <span>Ordenar:</span>
        <SortBtn
          label="Nome"
          active={sort?.key === 'nome'}
          onClick={() =>
            setSort((s) => (s?.key === 'nome' ? null : { key: 'nome', asc: true }))
          }
        />
        <SortBtn
          label="Conclusão"
          active={sort?.key === 'pct'}
          onClick={() =>
            setSort((s) => (s?.key === 'pct' ? null : { key: 'pct', asc: true }))
          }
        />
        {sort && (
          <span className="text-muted-foreground/60">
            (clique de novo p/ voltar à ordem de inserção)
          </span>
        )}
      </div>

      {axis === 'filial' ? (
        <FilialList search={search} sort={sort} onOpenDrawer={onOpenDrawer} />
      ) : (
        <CategoriaList search={search} sort={sort} onOpenDrawer={onOpenDrawer} />
      )}
    </section>
  )
}

// ── Lista por filial ────────────────────────────────────────────────────────

function FilialList({
  search,
  sort,
  onOpenDrawer,
}: {
  search: string
  sort: SortState
  onOpenDrawer: (filialId: string, categoriaId?: string) => void
}) {
  const rows = useMemo(() => {
    let list = getFilialRows()
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(
        (r) =>
          r.nome.toLowerCase().includes(q) ||
          r.sigla.toLowerCase().includes(q) ||
          (r.respondenteNome?.toLowerCase().includes(q) ?? false),
      )
    }
    if (sort) {
      const dir = sort.asc ? 1 : -1
      list = [...list].sort((a, b) =>
        sort.key === 'nome'
          ? a.nome.localeCompare(b.nome, 'pt-BR') * dir
          : (a.pct - b.pct) * dir,
      )
    }
    return list
  }, [search, sort])

  if (rows.length === 0) return <EmptyRow />

  return (
    <div className="flex flex-col gap-1.5">
      {rows.map((row) => (
        <FilialRowItem key={row.id} row={row} onOpenDrawer={onOpenDrawer} />
      ))}
    </div>
  )
}

function FilialRowItem({
  row,
  onOpenDrawer,
}: {
  row: FilialRow
  onOpenDrawer: (filialId: string, categoriaId?: string) => void
}) {
  const [open, setOpen] = useState(false)
  const hasResp = !!row.respondenteNome

  return (
    <div className="bg-card border border-border">
      {/* Linha principal */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-3.5 py-3 text-left hover:bg-muted/30 transition-colors"
      >
        <ChevronDown
          size={15}
          className={`text-muted-foreground shrink-0 transition-transform ${open ? '' : '-rotate-90'}`}
        />
        <span
          className={`flex items-center justify-center w-9 h-9 shrink-0 font-heading text-[12px] font-semibold ${
            hasResp
              ? 'bg-planton-forest text-planton-accent'
              : 'bg-warning-surface text-warning border border-warning-border'
          }`}
        >
          {row.sigla}
        </span>
        <div className="min-w-0 w-40 shrink-0">
          <p className="text-[13px] font-sans font-medium text-foreground truncate">{row.nome}</p>
          <p className="text-[11px] font-sans text-muted-foreground truncate">
            {row.respondenteNome ?? 'Sem responsável'}
          </p>
        </div>

        {/* Strip de status por categoria */}
        <StatusStrip strip={row.strip} />

        {/* Progresso */}
        <div className="ml-auto flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex flex-col items-end w-28">
            <div className="h-1.5 w-full bg-muted overflow-hidden">
              <div
                className={`h-full ${STATUS_META[row.worstStatus].barClass}`}
                style={{ width: `${row.pct}%` }}
              />
            </div>
            <span className="text-[10px] font-sans text-muted-foreground mt-1 tabular-nums">
              {row.done}/{row.total} cats
            </span>
          </div>
          <span className="font-heading text-[15px] font-semibold text-foreground tabular-nums w-10 text-right">
            {row.pct}%
          </span>
        </div>
      </button>

      {/* Expansão: mini-matriz de categorias */}
      {open && (
        <div className="border-t border-border px-3.5 py-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 bg-muted/20">
          {row.strip.map((dot) => (
            <button
              key={dot.categoriaId}
              type="button"
              onClick={() => onOpenDrawer(row.id, dot.categoriaId)}
              className="flex items-center justify-between gap-2 px-3 py-2 bg-card border border-border hover:border-planton-accent/50 transition-colors text-left"
            >
              <span className="text-[12px] font-sans text-foreground truncate">
                {dot.categoriaLabel}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 border text-[10px] font-sans font-medium whitespace-nowrap shrink-0 ${STATUS_META[dot.status].cellClass}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_META[dot.status].dotClass}`} />
                {STATUS_META[dot.status].label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function StatusStrip({ strip }: { strip: StatusDot[] }) {
  return (
    <TooltipProvider delayDuration={120}>
      <div className="hidden md:flex items-center gap-1 shrink-0">
        {strip.map((dot) => {
          const meta = STATUS_META[dot.status]
          return (
            <Tooltip key={dot.categoriaId}>
              <TooltipTrigger asChild>
                <span
                  className={`w-2.5 h-2.5 rounded-full ${meta.dotClass}`}
                  aria-label={`${dot.categoriaLabel}: ${meta.label}`}
                />
              </TooltipTrigger>
              <TooltipContent className="text-[11px]">
                {dot.categoriaLabel}: {meta.label}
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </TooltipProvider>
  )
}

// ── Lista por categoria ───────────────────────────────────────────────────────

function CategoriaList({
  search,
  sort,
  onOpenDrawer,
}: {
  search: string
  sort: SortState
  onOpenDrawer: (filialId: string, categoriaId?: string) => void
}) {
  const rows = useMemo(() => {
    let list = getCategoriaRollup()
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter((r) => r.label.toLowerCase().includes(q))
    }
    if (sort) {
      const dir = sort.asc ? 1 : -1
      list = [...list].sort((a, b) =>
        sort.key === 'nome'
          ? a.label.localeCompare(b.label, 'pt-BR') * dir
          : (a.pctConclusao - b.pctConclusao) * dir,
      )
    }
    return list
  }, [search, sort])

  if (rows.length === 0) return <EmptyRow />

  return (
    <div className="flex flex-col gap-1.5">
      {rows.map((cat) => (
        <CategoriaRowItem key={cat.id} cat={cat} onOpenDrawer={onOpenDrawer} />
      ))}
    </div>
  )
}

function CategoriaRowItem({
  cat,
  onOpenDrawer,
}: {
  cat: ReturnType<typeof getCategoriaRollup>[number]
  onOpenDrawer: (filialId: string, categoriaId?: string) => void
}) {
  const [open, setOpen] = useState(false)
  const Icon = cat.icon

  return (
    <div className="bg-card border border-border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-3.5 py-3 text-left hover:bg-muted/30 transition-colors"
      >
        <ChevronDown
          size={15}
          className={`text-muted-foreground shrink-0 transition-transform ${open ? '' : '-rotate-90'}`}
        />
        <span className="flex items-center justify-center w-9 h-9 shrink-0 bg-planton-forest text-planton-accent">
          <Icon size={17} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-sans font-medium text-foreground truncate">{cat.label}</p>
          <p className="text-[11px] font-sans text-muted-foreground">
            Escopo {cat.scope} · {cat.unidadesComDados} c/ dados · {cat.unidadesSemDados} s/ dados
          </p>
        </div>
        <StatusPill status={cat.status} size="xs" />
        <div className="hidden sm:flex flex-col items-end w-28 shrink-0">
          <div className="h-1.5 w-full bg-muted overflow-hidden">
            <div
              className={`h-full ${STATUS_META[cat.status].barClass}`}
              style={{ width: `${cat.pctConclusao}%` }}
            />
          </div>
          <span className="text-[10px] font-sans text-muted-foreground mt-1 tabular-nums">
            {cat.pctConclusao}% concluído
          </span>
        </div>
      </button>

      {/* Expansão: unidades */}
      {open && (
        <div className="border-t border-border bg-muted/20">
          {cat.unidades.map((u) => (
            <button
              key={u.filialId}
              type="button"
              onClick={() => onOpenDrawer(u.filialId, cat.id)}
              className="w-full flex items-center gap-3 px-3.5 py-2 text-left border-b border-border/40 last:border-b-0 hover:bg-card transition-colors"
            >
              <span className="text-[10px] font-mono text-muted-foreground/60 w-10 shrink-0">
                {u.codigo}
              </span>
              <span className="text-[12px] font-sans text-foreground truncate flex-1">{u.nome}</span>
              <span className="text-[11px] font-sans text-muted-foreground truncate hidden sm:block max-w-[40%]">
                {u.observacao}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 border text-[10px] font-sans font-medium whitespace-nowrap shrink-0 ${STATUS_META[u.status].cellClass}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_META[u.status].dotClass}`} />
                {STATUS_META[u.status].label}
              </span>
              <ChevronRight size={13} className="text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Primitivos locais ─────────────────────────────────────────────────────────

function ToggleBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 h-8 text-[12px] font-sans font-medium transition-colors ${
        active ? 'bg-planton-accent text-white' : 'bg-card text-muted-foreground hover:bg-muted'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

function SortBtn({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2 py-0.5 border transition-colors ${
        active
          ? 'border-planton-accent text-planton-accent bg-planton-accent/10'
          : 'border-border text-muted-foreground hover:text-foreground'
      }`}
    >
      <ArrowUpDown size={11} />
      {label}
    </button>
  )
}

function EmptyRow() {
  return (
    <div className="bg-card border border-border px-4 py-8 text-center">
      <p className="text-[13px] font-sans text-muted-foreground">Nenhum resultado para a busca.</p>
    </div>
  )
}
