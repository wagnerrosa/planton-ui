'use client'

import { X, Send, ShoppingCart, AlertCircle, AlertTriangle } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'
import { Textarea } from '@/components/shadcn/textarea'
import { Button } from '@/components/shadcn/button'
import { MOTIVOS_RECUSA, type ReviewRow } from './dados-data'

export type Justificativa = { motivoId: string; texto: string }

export function ErrorCart({
  rows,
  justificativas,
  onSetMotivo,
  onSetTexto,
  onRemove,
  onClear,
  onRecusar,
}: {
  /** linhas marcadas para recusa (em qualquer schema) */
  rows: ReviewRow[]
  justificativas: Map<string, Justificativa>
  onSetMotivo: (rowId: string, motivoId: string) => void
  onSetTexto: (rowId: string, texto: string) => void
  onRemove: (rowId: string) => void
  onClear: () => void
  onRecusar: () => void
}) {
  // Pronto p/ enviar = toda linha tem motivo (e, se 'outro', texto preenchido)
  const todasComMotivo =
    rows.length > 0 &&
    rows.every((r) => {
      const j = justificativas.get(r.id)
      if (!j?.motivoId) return false
      if (j.motivoId === 'outro' && !j.texto.trim()) return false
      return true
    })

  return (
    <div className="flex flex-col h-full min-h-0 border border-destructive-border rounded-md bg-destructive-surface/30">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between gap-2 px-3 py-2.5 border-b border-destructive-border">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4 text-destructive" />
          <span className="text-[13px] font-sans text-destructive">
            Carrinho de erros
          </span>
          <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-destructive text-destructive-foreground text-[11px]">
            {rows.length}
          </span>
        </div>
        {rows.length > 0 && (
          <button onClick={onClear} className="text-[11px] text-muted-foreground hover:text-foreground">
            Limpar
          </button>
        )}
      </div>

      {/* Lista de itens */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2 flex flex-col gap-2">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-2 py-8">
            <ShoppingCart className="h-7 w-7 text-muted-foreground/30" />
            <p className="text-[12px] text-muted-foreground max-w-[220px]">
              Selecione linhas na tabela para juntar os erros e devolver ao respondente de uma vez.
            </p>
          </div>
        ) : (
          rows.map((r) => {
            const j = justificativas.get(r.id) ?? { motivoId: '', texto: '' }
            return (
              <div
                key={r.id}
                className="rounded-md border border-border bg-background p-2.5 flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col min-w-0">
                    <span className="text-[12px] text-foreground truncate">{r.unidade}</span>
                    <span className="text-[10px] text-muted-foreground">{r.schemaLabel}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {r.errorCount > 0 && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        {r.errorCount}
                      </span>
                    )}
                    {r.warningCount > 0 && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-warning">
                        <AlertTriangle className="h-3 w-3" />
                        {r.warningCount}
                      </span>
                    )}
                    <button
                      onClick={() => onRemove(r.id)}
                      className="grid place-content-center h-5 w-5 rounded text-muted-foreground hover:bg-accent hover:text-foreground"
                      aria-label="Remover do carrinho"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <Select value={j.motivoId} onValueChange={(v) => onSetMotivo(r.id, v)}>
                  <SelectTrigger className="h-8 text-[12px]">
                    <SelectValue placeholder="Motivo da recusa…" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOTIVOS_RECUSA.map((m) => (
                      <SelectItem key={m.id} value={m.id} className="text-[12px]">
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {j.motivoId === 'outro' && (
                  <Textarea
                    value={j.texto}
                    onChange={(e) => onSetTexto(r.id, e.target.value)}
                    placeholder="Descreva o problema para o respondente…"
                    className="text-[12px] min-h-[56px] resize-none"
                  />
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Ação */}
      <div className="shrink-0 px-3 py-2.5 border-t border-destructive-border">
        <Button
          variant="destructive"
          className="w-full"
          disabled={!todasComMotivo}
          onClick={onRecusar}
        >
          <Send className="h-4 w-4" />
          Recusar e devolver ({rows.length})
        </Button>
        {rows.length > 0 && !todasComMotivo && (
          <p className="text-[10px] text-muted-foreground text-center mt-1.5">
            Defina um motivo para cada linha antes de enviar.
          </p>
        )}
      </div>
    </div>
  )
}
