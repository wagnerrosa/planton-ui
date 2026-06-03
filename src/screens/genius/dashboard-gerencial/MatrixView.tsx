import { useMemo, useState } from 'react'
import { Search, ArrowUpDown, ArrowUp } from 'lucide-react'
import { StatusPill } from './StatusPill'
import {
  CATEGORIA_COLS,
  FILIAIS,
  STATUS_META,
  getFilialProgress,
  type CombinationStatus,
  type Filial,
} from './dashboard-data'

type SortState = { colId: string; dir: 'asc' } | null

// Filtro de status agrupado (alinha com os chips/KPIs).
function matchesStatusFilter(status: CombinationStatus, filter: string): boolean {
  if (filter === 'todos') return true
  if (filter === 'requer-acao') return status === 'reprovado' || status === 'sem-respondente'
  if (filter === 'pendentes') return status !== 'enviado' && status !== 'aprovado' && status !== 'nao-aplicavel'
  if (filter === 'concluidas') return status === 'enviado' || status === 'aprovado'
  return status === filter
}

export function MatrixView({
  statusFilter,
  categoriaFilter,
  search,
  onSearch,
  onStatusFilter,
  onCategoriaFilter,
  onOpenDrawer,
}: {
  statusFilter: string
  categoriaFilter: string
  search: string
  onSearch: (v: string) => void
  onStatusFilter: (v: string) => void
  onCategoriaFilter: (v: string) => void
  onOpenDrawer: (filialId: string, categoriaId?: string) => void
}) {
  // Ordenação por coluna (spec): asc / volta à ordem de inserção. Sem Z–A.
  const [sort, setSort] = useState<SortState>(null)

  function toggleSort(colId: string) {
    setSort((prev) => (prev?.colId === colId ? null : { colId, dir: 'asc' }))
  }

  const visibleCols = categoriaFilter === 'todas'
    ? CATEGORIA_COLS
    : CATEGORIA_COLS.filter((c) => c.id === categoriaFilter)

  const filteredFiliais = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = FILIAIS.filter((f) => {
      // busca por filial ou respondente
      if (q) {
        const hay = `${f.nome} ${f.sigla} ${f.respondente?.nome ?? ''}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      // status: mantém filial se alguma das colunas visíveis bate o filtro
      if (statusFilter !== 'todos') {
        const hit = visibleCols.some((c) => matchesStatusFilter(f.combinacoes[c.id].status, statusFilter))
        if (!hit) return false
      }
      return true
    })

    // Ordenação. colId === 'filial' ordena por nome; colId === 'progresso' por pct;
    // senão ordena pelo label do status da categoria.
    if (sort) {
      list = [...list].sort((a, b) => {
        if (sort.colId === 'filial') return a.nome.localeCompare(b.nome, 'pt-BR')
        if (sort.colId === 'progresso') return getFilialProgress(a).pct - getFilialProgress(b).pct
        const sa = STATUS_META[a.combinacoes[sort.colId].status].label
        const sb = STATUS_META[b.combinacoes[sort.colId].status].label
        return sa.localeCompare(sb, 'pt-BR')
      })
    }
    return list
  }, [search, statusFilter, visibleCols, sort])

  function rowNeedsAttention(f: Filial): boolean {
    return visibleCols.some((c) => {
      const s = f.combinacoes[c.id].status
      return s === 'reprovado' || s === 'sem-respondente'
    })
  }

  return (
    <div className="border border-border bg-card overflow-hidden">
      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-2.5 px-4 py-3 border-b border-border bg-muted/30">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Buscar filial ou responsável…"
            className="h-8 w-56 pl-8 pr-2.5 text-[12px] font-sans border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-planton-accent"
          />
        </div>
        <div className="h-5 w-px bg-border" />
        <FilterSelect
          label="Status"
          value={statusFilter}
          onChange={onStatusFilter}
          options={[
            { value: 'todos', label: 'Todos os status' },
            { value: 'requer-acao', label: 'Requer ação' },
            { value: 'pendentes', label: 'Apenas pendentes' },
            { value: 'concluidas', label: 'Enviado / Aprovado' },
          ]}
        />
        <FilterSelect
          label="Categoria"
          value={categoriaFilter}
          onChange={onCategoriaFilter}
          options={[
            { value: 'todas', label: 'Todas as categorias' },
            ...CATEGORIA_COLS.map((c) => ({ value: c.id, label: c.label })),
          ]}
        />
        <span className="ml-auto text-[11px] font-sans text-muted-foreground">
          <strong className="text-foreground">{filteredFiliais.length}</strong> filiais ·{' '}
          <strong className="text-foreground">{visibleCols.length}</strong> categorias
        </span>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <SortHeader
                label="Filial"
                colId="filial"
                sort={sort}
                onSort={toggleSort}
                align="left"
                className="min-w-[220px] pl-5"
              />
              {visibleCols.map((col) => (
                <SortHeader
                  key={col.id}
                  label={col.labelCurto}
                  colId={col.id}
                  sort={sort}
                  onSort={toggleSort}
                  align="center"
                  icon={col.icon}
                  className="min-w-[128px]"
                />
              ))}
              <SortHeader
                label="Progresso"
                colId="progresso"
                sort={sort}
                onSort={toggleSort}
                align="left"
                className="min-w-[150px] pr-5"
              />
            </tr>
          </thead>
          <tbody>
            {filteredFiliais.map((f) => {
              const prog = getFilialProgress(f)
              const attn = rowNeedsAttention(f)
              return (
                <tr
                  key={f.id}
                  onClick={() => onOpenDrawer(f.id)}
                  className={`border-b border-border/60 cursor-pointer transition-colors hover:bg-muted/40 ${
                    attn ? 'bg-destructive-surface/30' : ''
                  }`}
                >
                  {/* Filial */}
                  <td className="py-3 pl-5 pr-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex items-center justify-center w-9 h-9 shrink-0 font-heading text-[11px] font-semibold ${
                          f.respondente
                            ? 'bg-planton-forest text-planton-accent'
                            : 'bg-warning-surface text-warning border border-warning-border'
                        }`}
                      >
                        {f.sigla}
                      </span>
                      <div className="min-w-0">
                        <div className="font-heading text-[13px] font-semibold text-foreground leading-tight">
                          {f.nome}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10.5px] font-sans text-muted-foreground mt-0.5">
                          {f.respondente ? (
                            <span className="truncate">{f.respondente.nome}</span>
                          ) : (
                            <span className="text-warning font-medium">⚠ Sem responsável</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Células de status */}
                  {visibleCols.map((col) => (
                    <td
                      key={col.id}
                      className="py-3 px-2 text-center"
                      onClick={(e) => {
                        e.stopPropagation()
                        onOpenDrawer(f.id, col.id)
                      }}
                    >
                      <span className="inline-flex hover:opacity-80 transition-opacity">
                        <StatusPill status={f.combinacoes[col.id].status} size="xs" />
                      </span>
                    </td>
                  ))}

                  {/* Progresso */}
                  <td className="py-3 pl-2 pr-5">
                    <div className="flex items-center gap-2 min-w-28">
                      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-planton-accent"
                          style={{ width: `${prog.pct}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-sans text-muted-foreground tabular-nums shrink-0">
                        {prog.done}/{prog.total}
                      </span>
                    </div>
                  </td>
                </tr>
              )
            })}
            {filteredFiliais.length === 0 && (
              <tr>
                <td colSpan={visibleCols.length + 2} className="py-10 text-center text-[13px] font-sans text-muted-foreground">
                  Nenhuma filial corresponde aos filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Header ordenável ──────────────────────────────────────────────────────────
function SortHeader({
  label,
  colId,
  sort,
  onSort,
  align,
  icon: Icon,
  className = '',
}: {
  label: string
  colId: string
  sort: SortState
  onSort: (colId: string) => void
  align: 'left' | 'center'
  icon?: React.ComponentType<{ size?: number; className?: string }>
  className?: string
}) {
  const active = sort?.colId === colId
  return (
    <th className={`py-3 px-2 ${className}`}>
      <button
        type="button"
        onClick={() => onSort(colId)}
        className={`group inline-flex items-center gap-1.5 font-heading text-[10px] font-semibold uppercase tracking-wider transition-colors ${
          align === 'center' ? 'justify-center w-full' : ''
        } ${active ? 'text-planton-accent' : 'text-muted-foreground hover:text-foreground'}`}
        title="Ordenar"
      >
        {Icon && <Icon size={13} className="opacity-70" />}
        <span>{label}</span>
        {active ? (
          <ArrowUp size={11} className="shrink-0" />
        ) : (
          <ArrowUpDown size={11} className="shrink-0 opacity-0 group-hover:opacity-50 transition-opacity" />
        )}
      </button>
    </th>
  )
}

// ── Select de filtro (nativo, compacto) ────────────────────────────────────────
function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <label className="flex items-center gap-1.5">
      <span className="text-[10px] font-heading font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 px-2 pr-7 text-[12px] font-sans border border-border bg-background text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-planton-accent appearance-none bg-[length:12px] bg-no-repeat bg-[right_0.5rem_center] bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23687280%22 stroke-width=%222%22><polyline points=%226 9 12 15 18 9%22/></svg>')]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}
