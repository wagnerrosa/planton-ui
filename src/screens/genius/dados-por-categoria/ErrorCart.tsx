'use client'

import { X, Send, ShoppingCart, ChevronDown, Users, AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/shadcn/button'
import { motivoLabel, type RejectionGroup, type ReviewRow } from './dados-data'

export function ErrorCart({
  groups,
  rowsById,
  affectedRespondentes,
  onRemoveGroup,
  onRemoveRow,
  onClear,
  onRecusar,
}: {
  groups: RejectionGroup[]
  /** lookup id → linha, para render dos chips de unidade */
  rowsById: Map<string, ReviewRow>
  /** respondentes que serão negados por inteiro ao recusar (envio é atômico) */
  affectedRespondentes: string[]
  onRemoveGroup: (groupId: string) => void
  onRemoveRow: (groupId: string, rowId: string) => void
  onClear: () => void
  onRecusar: () => void
}) {
  const totalLinhas = groups.reduce((a, g) => a + g.rowIds.length, 0)
  const vazio = groups.length === 0
  const nResp = affectedRespondentes.length

  return (
    <div className="flex flex-col h-full min-h-0 border border-destructive-border/50 rounded-md bg-transparent">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between gap-2 px-3 py-2.5 border-b border-destructive-border">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4 text-destructive" />
          <span className="text-[13px] font-sans text-destructive">Carrinho de erros</span>
          {groups.length > 0 && (
            <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 bg-destructive text-destructive-foreground text-[11px]">
              {groups.length} grupo{groups.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        {!vazio && (
          <button onClick={onClear} className="text-[11px] text-muted-foreground hover:text-foreground">
            Limpar
          </button>
        )}
      </div>

      {/* Grupos */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2 flex flex-col gap-2">
        {vazio ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-2 py-8">
            <ShoppingCart className="h-7 w-7 text-muted-foreground/30" />
            <p className="text-[12px] text-muted-foreground max-w-[220px]">
              Selecione linhas na tabela, escolha um motivo e adicione tudo de uma vez como um grupo.
            </p>
          </div>
        ) : (
          groups.map((g, i) => (
            <GroupCard
              key={g.id}
              numero={i + 1}
              group={g}
              rowsById={rowsById}
              onRemove={() => onRemoveGroup(g.id)}
              onRemoveRow={(rowId) => onRemoveRow(g.id, rowId)}
            />
          ))
        )}
      </div>

      {/* Ação */}
      <div className="shrink-0 px-3 py-2.5 border-t border-destructive-border flex flex-col gap-2">
        {/* Aviso de escopo — recusar nega o envio INTEIRO de cada respondente
            atingido (todas as filiais/linhas dele saem da tabela), não só as
            linhas marcadas. Torna a cascata explícita antes de confirmar. */}
        {!vazio && nResp > 0 && (
          <div className="flex items-start gap-2 rounded-md border border-destructive-border bg-destructive/5 px-2.5 py-2">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-destructive" />
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-[11px] text-destructive leading-snug">
                Recusa o envio inteiro de {nResp} respondente{nResp !== 1 ? 's' : ''}. Todas as
                filiais e linhas {nResp !== 1 ? 'deles' : 'dele'} serão devolvidas.
              </span>
              <div className="flex flex-wrap gap-1">
                {affectedRespondentes.map((resp) => (
                  <span
                    key={resp}
                    className="inline-flex items-center gap-1 rounded-sm bg-destructive/10 px-1.5 py-0.5 text-[10px] text-destructive"
                  >
                    <Users className="h-2.5 w-2.5 shrink-0" />
                    {resp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
        <Button variant="destructive" className="w-full" disabled={vazio} onClick={onRecusar}>
          <Send className="h-4 w-4" />
          Recusar e devolver ({nResp} respondente{nResp !== 1 ? 's' : ''})
        </Button>
        {!vazio && (
          <p className="text-[10px] text-muted-foreground text-center">
            {totalLinhas} linha{totalLinhas !== 1 ? 's' : ''} marcada{totalLinhas !== 1 ? 's' : ''} em{' '}
            {groups.length} motivo{groups.length !== 1 ? 's' : ''} de recusa.
          </p>
        )}
      </div>
    </div>
  )
}

function GroupCard({
  numero,
  group,
  rowsById,
  onRemove,
  onRemoveRow,
}: {
  numero: number
  group: RejectionGroup
  rowsById: Map<string, ReviewRow>
  onRemove: () => void
  onRemoveRow: (rowId: string) => void
}) {
  const [open, setOpen] = useState(false)
  const rows = group.rowIds.map((id) => rowsById.get(id)).filter(Boolean) as ReviewRow[]
  const preview = rows.slice(0, 4).map((r) => r.code).join(', ')
  const extra = rows.length - 4

  return (
    <div className="rounded-md border border-border/60 bg-background/40 p-2.5 flex flex-col gap-1.5">
      <div className="flex items-start justify-between gap-2">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-start gap-1.5 min-w-0 text-left"
        >
          <ChevronDown
            className={`h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground transition-transform ${open ? '' : '-rotate-90'}`}
          />
          <div className="flex flex-col min-w-0">
            <span className="inline-flex items-center gap-1.5 text-[12px] text-foreground">
              <span className="inline-flex items-center justify-center h-4 px-1.5 bg-destructive text-destructive-foreground text-[10px] tabular-nums shrink-0">
                G{numero}
              </span>
              {motivoLabel(group.motivoId)}
            </span>
            {!open && (
              <span className="text-[10px] text-muted-foreground truncate">
                {preview}
                {extra > 0 ? `, +${extra}` : ''}
              </span>
            )}
          </div>
        </button>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
            {rows.length} linha{rows.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={onRemove}
            className="grid place-content-center h-5 w-5 rounded text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Remover grupo"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {group.texto && (
        <p className="text-[11px] text-muted-foreground pl-5 italic">“{group.texto}”</p>
      )}

      {open && (
        <ul className="pl-5 flex flex-col gap-1 pt-0.5">
          {rows.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-2 text-[11px]">
              <span className="flex items-center gap-1.5 min-w-0">
                <span className="inline-flex items-center justify-center h-4 min-w-7 px-1 bg-muted text-muted-foreground text-[10px] tabular-nums shrink-0">
                  {r.code}
                </span>
                <span className="text-foreground/80 truncate">
                  {r.unidade} <span className="text-muted-foreground">· {r.schemaLabel}</span>
                </span>
              </span>
              <button
                onClick={() => onRemoveRow(r.id)}
                className="grid place-content-center h-4 w-4 rounded text-muted-foreground hover:text-destructive shrink-0"
                aria-label="Tirar linha do grupo"
              >
                <X className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
