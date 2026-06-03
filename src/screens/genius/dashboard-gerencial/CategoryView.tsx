import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { StatusPill } from './StatusPill'
import { getCategoriaRollup, type CategoriaRollup } from './dashboard-data'

const SCOPE_LABEL: Record<1 | 2 | 3, string> = { 1: 'E1', 2: 'E2', 3: 'E3' }

export function CategoryView({
  onOpenDrawer,
}: {
  onOpenDrawer: (filialId: string, categoriaId: string) => void
}) {
  const rollup = getCategoriaRollup()
  const [expanded, setExpanded] = useState<Set<string>>(new Set([rollup[0]?.id]))

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="border border-border bg-card overflow-hidden">
      {/* Header de colunas */}
      <div className="hidden md:grid grid-cols-[60px_1fr_150px_120px_120px_140px] items-center gap-3 px-5 py-3 border-b border-border bg-muted/30 text-[10px] font-heading font-semibold uppercase tracking-wider text-muted-foreground">
        <span>Escopo</span>
        <span>Categoria</span>
        <span>Status</span>
        <span className="text-center">Com dados</span>
        <span className="text-center">Sem dados</span>
        <span>Conclusão</span>
      </div>

      {rollup.map((cat) => (
        <CategoryRow
          key={cat.id}
          cat={cat}
          open={expanded.has(cat.id)}
          onToggle={() => toggle(cat.id)}
          onOpenDrawer={onOpenDrawer}
        />
      ))}
    </div>
  )
}

function CategoryRow({
  cat,
  open,
  onToggle,
  onOpenDrawer,
}: {
  cat: CategoriaRollup
  open: boolean
  onToggle: () => void
  onOpenDrawer: (filialId: string, categoriaId: string) => void
}) {
  const Icon = cat.icon
  const aplicaveis = cat.unidades.filter((u) => u.status !== 'nao-aplicavel')

  return (
    <div className="border-b border-border/60 last:border-b-0">
      {/* Linha categoria */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full grid grid-cols-[24px_1fr_auto] md:grid-cols-[60px_1fr_150px_120px_120px_140px] items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-muted/40"
      >
        {/* Escopo (desktop) / chevron (mobile) */}
        <span className="hidden md:inline-flex items-center justify-center w-7 h-6 text-[10px] font-heading font-semibold bg-muted text-muted-foreground border border-border">
          {SCOPE_LABEL[cat.scope]}
        </span>
        <ChevronRight
          size={16}
          className={`md:hidden text-muted-foreground transition-transform ${open ? 'rotate-90' : ''}`}
        />

        {/* Categoria */}
        <span className="flex items-center gap-2.5 min-w-0">
          <ChevronRight
            size={15}
            className={`hidden md:inline text-muted-foreground transition-transform shrink-0 ${open ? 'rotate-90' : ''}`}
          />
          <Icon size={16} className="text-muted-foreground shrink-0" />
          <span className="font-heading text-[13px] font-semibold text-foreground truncate">
            {cat.label}
          </span>
          <span className="md:hidden text-[10px] font-heading font-semibold text-muted-foreground">
            {SCOPE_LABEL[cat.scope]}
          </span>
        </span>

        {/* Status */}
        <span className="hidden md:flex"><StatusPill status={cat.status} size="xs" /></span>

        {/* Com / sem dados */}
        <span className="hidden md:block text-center text-[13px] font-sans text-foreground tabular-nums">
          {cat.unidadesComDados}
        </span>
        <span className="hidden md:block text-center text-[13px] font-sans tabular-nums">
          {cat.unidadesSemDados > 0 ? (
            <span className="text-warning font-medium">{cat.unidadesSemDados}</span>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </span>

        {/* Conclusão */}
        <span className="flex items-center gap-2">
          <span className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden min-w-16">
            <span
              className="block h-full rounded-full bg-planton-accent"
              style={{ width: `${cat.pctConclusao}%` }}
            />
          </span>
          <span className="text-[11px] font-sans text-muted-foreground tabular-nums shrink-0">
            {cat.pctConclusao}%
          </span>
        </span>
      </button>

      {/* Unidades expandidas */}
      {open && (
        <div className="bg-muted/20 border-t border-border/60">
          <div className="px-5 py-2 text-[10px] font-heading font-semibold uppercase tracking-wider text-muted-foreground/70">
            Unidades aplicáveis ({aplicaveis.length})
          </div>
          <div className="flex flex-col">
            {aplicaveis.map((u) => (
              <button
                key={u.codigo}
                type="button"
                onClick={() => onOpenDrawer(u.filialId, cat.id)}
                className="grid grid-cols-[70px_1fr_auto] md:grid-cols-[70px_1fr_140px_auto] items-center gap-3 px-5 py-2.5 text-left border-t border-border/40 transition-colors hover:bg-muted/40"
              >
                <span className="font-mono text-[11px] text-muted-foreground">{u.codigo}</span>
                <span className="text-[12.5px] font-sans text-foreground truncate">{u.nome}</span>
                <span className="hidden md:flex"><StatusPill status={u.status} size="xs" /></span>
                <span className="text-[11px] font-sans text-muted-foreground text-right truncate">
                  {u.linhas > 0 ? `${u.linhas} linhas` : u.observacao}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
