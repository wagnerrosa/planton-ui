'use client'

import { useMemo, useState } from 'react'
import {
  Search,
  Building2,
  Layers,
  ChevronDown,
  ArrowUpDown,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn/tooltip'
import { STATUS_META, getCategoriaRollup, FILIAIS, CATEGORIA_COLS } from '../dashboard-gerencial/dashboard-data'
import { getFilialRows, getCategoriaStatusStrip, type FilialRow, type StatusDot, type FilialDot } from './v2-derive'

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
      {/* Barra única: toggle esquerda · busca + sort direita */}
      <div className="flex items-center gap-3">
        {/* Toggle vira o "título" da seção */}
        <div className="flex items-center border border-border overflow-hidden shrink-0">
          <ToggleBtn
            active={axis === 'filial'}
            onClick={() => setAxis('filial')}
            icon={<Building2 size={14} />}
            label="Por filial"
            activeClass="bg-planton-forest text-planton-accent"
          />
          <ToggleBtn
            active={axis === 'categoria'}
            onClick={() => setAxis('categoria')}
            icon={<Layers size={14} />}
            label="Por categoria"
          />
        </div>

        <div className="flex-1" />

        {/* Sort discreto */}
        <div className="flex items-center gap-1.5">
          <SortBtn
            label="Nome"
            active={sort?.key === 'nome'}
            onClick={() => setSort((s) => (s?.key === 'nome' ? null : { key: 'nome', asc: true }))}
          />
          <SortBtn
            label="Conclusão"
            active={sort?.key === 'pct'}
            onClick={() => setSort((s) => (s?.key === 'pct' ? null : { key: 'pct', asc: true }))}
          />
        </div>

        {/* Busca */}
        <div className="relative shrink-0">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filial, categoria, responsável…"
            className="h-8 w-56 pl-8 pr-2.5 text-[12px] font-sans bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-planton-accent"
          />
        </div>
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
      // Índice: filialId → todos os nomes de respondentes das combinações
      const respByFilial = new Map<string, string[]>()
      for (const f of FILIAIS) {
        const nomes = CATEGORIA_COLS
          .map((c) => f.combinacoes[c.id].respondente?.nome)
          .filter((n): n is string => !!n)
        respByFilial.set(f.id, nomes)
      }
      list = list.filter((r) => {
        if (r.nome.toLowerCase().includes(q)) return true
        if (r.sigla.toLowerCase().includes(q)) return true
        const resps = respByFilial.get(r.id) ?? []
        return resps.some((n) => n.toLowerCase().includes(q))
      })
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

  return (
    <div className="bg-card border border-border">
      {/* Linha principal */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-muted/30 transition-colors overflow-hidden"
      >
        <ChevronDown
          size={15}
          className={`text-muted-foreground shrink-0 transition-transform ${open ? '' : '-rotate-90'}`}
        />
        <span className="flex items-center justify-center w-10 h-10 shrink-0 font-heading text-[12px] font-semibold bg-planton-forest text-planton-accent">
          {row.sigla}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-sans font-medium text-foreground truncate">{row.nome}</p>
          <div className="flex items-center h-[18px] mt-0.5">
            <span className="text-[11px] font-sans text-muted-foreground truncate">
              {row.categoriasComDados} {row.categoriasComDados === 1 ? 'categoria com dados' : 'categorias com dados'} · {row.categoriasSemDados} sem dados
            </span>
          </div>
        </div>

        {/* Strip — absoluto, centro geométrico da linha */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex">
          <StatusStrip strip={row.strip} />
        </div>

        {/* % + barra */}
        <div className="flex items-center gap-4 shrink-0">
          <span className="font-heading text-2xl font-normal text-foreground tabular-nums leading-none w-14 text-right">
            {row.pct}<span className="text-base text-muted-foreground">%</span>
          </span>
          <div className="hidden sm:flex w-56 shrink-0 overflow-hidden">
            <TickBar pct={row.pct} colorClass="text-planton-accent" />
          </div>
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

const MAX_DOTS = 6

function StatusStrip({ strip }: { strip: StatusDot[] }) {
  const visible = strip.slice(0, MAX_DOTS)
  return (
    <TooltipProvider delayDuration={120}>
      <div className="hidden md:flex items-center gap-1 shrink-0">
        {visible.map((dot) => {
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

function FilialStrip({ strip }: { strip: FilialDot[] }) {
  const visible = strip.slice(0, MAX_DOTS)
  return (
    <TooltipProvider delayDuration={120}>
      <div className="hidden md:flex items-center gap-1 shrink-0">
        {visible.map((dot) => {
          const meta = STATUS_META[dot.status]
          return (
            <Tooltip key={dot.filialId}>
              <TooltipTrigger asChild>
                <span
                  className={`w-2.5 h-2.5 rounded-full ${meta.dotClass}`}
                  aria-label={`${dot.filialNome}: ${meta.label}`}
                />
              </TooltipTrigger>
              <TooltipContent className="text-[11px]">
                {dot.filialSigla} · {meta.label}
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
      list = list.filter((r) => {
        if (r.label.toLowerCase().includes(q)) return true
        // filiais que têm dados nessa categoria
        if (r.unidades.some((u) => u.nome.toLowerCase().includes(q))) return true
        // respondentes de cada filial nessa categoria
        return FILIAIS.some((f) => {
          const resp = f.combinacoes[r.id]?.respondente?.nome
          return resp?.toLowerCase().includes(q)
        })
      })
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

const PAGE_SIZE = 18

function CategoriaRowItem({
  cat,
  onOpenDrawer,
}: {
  cat: ReturnType<typeof getCategoriaRollup>[number]
  onOpenDrawer: (filialId: string, categoriaId?: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(0)
  const Icon = cat.icon

  const aplicaveis = cat.unidades.filter((u) => u.status !== 'nao-aplicavel')
  const totalPages = Math.ceil(aplicaveis.length / PAGE_SIZE)
  const pageUnidades = aplicaveis.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const from = page * PAGE_SIZE + 1
  const to = Math.min((page + 1) * PAGE_SIZE, aplicaveis.length)

  function handleToggle() {
    setOpen((v) => !v)
    setPage(0)
  }

  return (
    <div className="bg-card border border-border">
      <button
        type="button"
        onClick={handleToggle}
        className="relative w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-muted/30 transition-colors overflow-hidden"
      >
        <ChevronDown
          size={15}
          className={`text-muted-foreground shrink-0 transition-transform ${open ? '' : '-rotate-90'}`}
        />
        <span className="flex items-center justify-center w-10 h-10 shrink-0 bg-planton-accent text-planton-forest">
          <Icon size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-sans font-medium text-foreground truncate">{cat.label}</p>
          <div className="flex items-center gap-1.5 h-[18px] mt-0.5">
            <span className="inline-flex items-center px-1.5 h-full text-[9px] font-heading font-semibold uppercase tracking-wider border border-border text-muted-foreground shrink-0">
              Escopo {cat.scope}
            </span>
            <span className="text-[11px] font-sans text-muted-foreground truncate">
              {cat.unidadesComDados} {cat.unidadesComDados === 1 ? 'filial com dados' : 'filiais com dados'} · {cat.unidadesSemDados} sem dados
            </span>
          </div>
        </div>

        {/* Strip — absoluto, centro geométrico da linha */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex">
          <FilialStrip strip={getCategoriaStatusStrip(cat.id)} />
        </div>

        {/* % + barra */}
        <div className="flex items-center gap-4 shrink-0">
          <span className="font-heading text-2xl font-normal text-foreground tabular-nums leading-none w-14 text-right">
            {cat.pctConclusao}<span className="text-base text-muted-foreground">%</span>
          </span>
          <div className="hidden sm:flex w-56 shrink-0 overflow-hidden">
            <TickBar pct={cat.pctConclusao} colorClass="text-planton-accent" />
          </div>
        </div>
      </button>

      {/* Expansão: filiais em grid 3 colunas com paginação */}
      {open && (
        <div className="border-t border-border bg-muted/20 px-5 py-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {pageUnidades.map((u) => (
              <button
                key={u.filialId}
                type="button"
                onClick={() => onOpenDrawer(u.filialId, cat.id)}
                className="group flex items-center justify-between gap-3 bg-card border border-border px-4 py-3 text-left hover:border-planton-accent/50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-[13px] font-sans font-medium text-foreground truncate">{u.nome}</p>
                  <p className="text-[11px] font-sans text-muted-foreground truncate mt-0.5">{u.observacao}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 border text-[10px] font-sans font-medium whitespace-nowrap ${STATUS_META[u.status].cellClass}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_META[u.status].dotClass}`} />
                    {STATUS_META[u.status].label}
                  </span>
                  <ChevronRight size={12} className="text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
            {totalPages > 1 && Array.from({ length: PAGE_SIZE - pageUnidades.length }).map((_, i) => (
              <div key={`ph-${i}`} className="px-4 py-3 invisible" aria-hidden>
                <p className="text-[13px]">&nbsp;</p>
                <p className="text-[11px] mt-0.5">&nbsp;</p>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <span className="text-[11px] font-sans text-muted-foreground">
                {from}–{to} de {aplicaveis.length} filiais
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 0}
                  className="flex items-center justify-center w-7 h-7 border border-border text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={13} />
                </button>
                <span className="text-[11px] font-sans text-muted-foreground tabular-nums px-2">
                  {page + 1} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page === totalPages - 1}
                  className="flex items-center justify-center w-7 h-7 border border-border text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}
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
  activeClass = 'bg-planton-accent text-white',
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  activeClass?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 h-8 text-[12px] font-sans font-medium transition-colors ${
        active ? activeClass : 'bg-card text-muted-foreground hover:bg-muted'
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
      className={`inline-flex items-center gap-1 px-2 py-0.5 h-8 border text-[12px] font-sans transition-colors ${
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

// Barra de progresso em "ticks" (traços verticais) — estilo editorial premium.
// Preenchidos herdam a cor via colorClass (currentColor); vazios usam border.
const TICK_COUNT = 40

// Barra: bloco sólido preenchido (width=pct%) + ticks finos no restante.
// Container flex w-full. Preenchido = 1 span sólido. Vazio = N ticks separados.
function TickBar({ pct, colorClass }: { pct: number; colorClass: string }) {
  const clampedPct = Math.min(Math.max(pct, 0), 100)

  return (
    <div
      className={`flex items-center w-full ${colorClass}`}
      style={{ height: 14 }}
      aria-label={`${pct}%`}
    >
      {/* Parte preenchida: bloco sólido */}
      {clampedPct > 0 && (
        <span
          style={{
            width: `${clampedPct}%`,
            height: 14,
            backgroundColor: 'currentColor',
            flexShrink: 0,
          }}
        />
      )}
      {/* Parte vazia: sempre renderiza (flex-1) pra manter espaço no 100%. */}
      <span
          style={{
            flex: 1,
            height: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            paddingLeft: clampedPct > 0 ? 4 : 0,
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          {Array.from({ length: TICK_COUNT }).map((_, i) => (
            <span
              key={i}
              style={{
                flex: 1,
                height: 14,
                minWidth: 2,
                maxWidth: 8,
                backgroundColor: 'var(--color-border)',
              }}
            />
          ))}
        </span>
    </div>
  )
}

function EmptyRow() {
  return (
    <div className="bg-card border border-border px-4 py-8 text-center">
      <p className="text-[13px] font-sans text-muted-foreground">Nenhum resultado para a busca.</p>
    </div>
  )
}
