'use client'

import { useState } from 'react'
import { Search, ArrowUpDown } from 'lucide-react'
import { FILIAIS, type PreenchStatus } from './ghg-form-data'

const DOT_CLASS: Record<PreenchStatus, string | null> = {
  completo: 'bg-muted-foreground/50',
  parcial: 'bg-muted-foreground/50',
  vazio: null,
}

type SortMode = 'nome-az' | 'nome-za' | 'preench'
const SORT_LABELS: Record<SortMode, string> = {
  'nome-az': 'Nome A→Z',
  'nome-za': 'Nome Z→A',
  'preench': 'Preenchimento',
}
const SORT_ORDER: SortMode[] = ['nome-az', 'nome-za', 'preench']

const STATUS_ORDER: Record<PreenchStatus, number> = { completo: 0, parcial: 1, vazio: 2 }

export function FilialSidebar({
  filialId,
  onFilial,
  open,
  statusOf,
}: {
  filialId: string
  onFilial: (id: string) => void
  open: boolean
  statusOf: (filialId: string) => PreenchStatus
}) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortMode>('nome-az')

  function cycleSort() {
    setSort((s) => SORT_ORDER[(SORT_ORDER.indexOf(s) + 1) % SORT_ORDER.length])
  }

  const q = query.trim().toLowerCase()
  let filiais = q
    ? FILIAIS.filter(
        (f) => f.nome.toLowerCase().includes(q) || f.sigla.toLowerCase().includes(q),
      )
    : [...FILIAIS]

  if (sort === 'nome-az') filiais = filiais.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
  else if (sort === 'nome-za') filiais = filiais.sort((a, b) => b.nome.localeCompare(a.nome, 'pt-BR'))
  else filiais = filiais.sort((a, b) => STATUS_ORDER[statusOf(a.id)] - STATUS_ORDER[statusOf(b.id)])

  return (
    <div
      className={`${open ? 'w-56' : 'w-12'} shrink-0 flex flex-col border-r border-border bg-muted/20 transition-[width] duration-200 overflow-hidden`}
    >
      {open && (
        <div className="px-2 pt-2 pb-1 shrink-0 flex flex-col gap-1">
          <div className="relative">
            <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar filial…"
              className="w-full h-7 pl-7 pr-2 text-[12px] font-sans bg-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-planton-accent transition-colors"
            />
          </div>
          <div className="flex items-center gap-1">
            <ArrowUpDown size={10} className="text-muted-foreground/50 shrink-0" />
            {SORT_ORDER.map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={`h-5 px-1.5 text-[10px] font-sans transition-colors border ${
                  sort === s
                    ? 'bg-planton-accent/15 border-planton-accent/40 text-planton-accent font-medium'
                    : 'border-border text-muted-foreground hover:text-foreground hover:border-border/80'
                }`}
              >
                {s === 'nome-az' ? 'A→Z' : s === 'nome-za' ? 'Z→A' : 'Preench.'}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto overflow-x-hidden py-2">
        {open && (
          <div className="px-3 pt-1 pb-1 text-[9px] uppercase tracking-wider text-muted-foreground/60 font-medium">
            Filiais
          </div>
        )}
        {open && filiais.length === 0 ? (
          <p className="px-3 py-3 text-[11px] text-muted-foreground/60 font-sans">Nenhuma filial encontrada.</p>
        ) : (
          <ul className="flex flex-col">
            {filiais.map((filial) => {
              const isActive = filial.id === filialId
              const dot = DOT_CLASS[statusOf(filial.id)]
              return (
                <li key={filial.id}>
                  <button
                    onClick={() => onFilial(filial.id)}
                    title={!open ? filial.nome : undefined}
                    className={`w-full flex items-center py-2 text-xs font-sans transition-colors ${
                      open ? 'gap-2 px-3 justify-start' : 'justify-center px-0'
                    } ${
                      isActive
                        ? 'bg-planton-accent/12 text-foreground font-semibold'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    }`}
                  >
                    {/* Aberta: dot reservado à esquerda (mantém alinhamento mesmo sem dot) */}
                    {open && (
                      <span className="w-1.5 shrink-0 flex justify-center">
                        {dot && <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />}
                      </span>
                    )}
                    <span className="relative shrink-0">
                      <span
                        className={`flex items-center justify-center w-6 h-5 text-[9px] font-mono font-semibold border ${
                          isActive
                            ? 'border-planton-accent/40 text-planton-accent'
                            : 'border-border text-muted-foreground'
                        }`}
                      >
                        {filial.sigla}
                      </span>
                      {/* Colapsada: dot sobreposto no canto da sigla */}
                      {!open && dot && (
                        <span className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ring-1 ring-background ${dot}`} />
                      )}
                    </span>
                    {open && <span className="truncate text-left">{filial.nome}</span>}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
