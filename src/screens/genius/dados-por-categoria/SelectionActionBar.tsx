'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'
import { Input } from '@/components/shadcn/input'
import { Button } from '@/components/shadcn/button'
import { MOTIVOS_RECUSA } from './dados-data'

// Conteúdo do estado 'selecionado' da barra superior da planilha (espelha o Chat).
// O engenheiro escolhe o motivo UMA vez e adiciona o conjunto como um grupo.
export function SelectionActionBar({
  count,
  onClear,
  onAdd,
}: {
  count: number
  onClear: () => void
  /** cria um grupo de recusa com as linhas selecionadas */
  onAdd: (motivoId: string, texto: string) => void
}) {
  const [motivoId, setMotivoId] = useState('')
  const [texto, setTexto] = useState('')

  if (count === 0) return null

  const precisaTexto = motivoId === 'outro'
  const podeAdd = !!motivoId && (!precisaTexto || texto.trim().length > 0)

  function handleAdd() {
    if (!podeAdd) return
    onAdd(motivoId, texto.trim())
    setMotivoId('')
    setTexto('')
  }

  return (
    <div className="flex items-center gap-1.5 h-full w-full justify-between">
      <span className="flex items-center gap-2 min-w-0">
        <span className="inline-flex items-center justify-center min-w-6 h-6 px-1.5 bg-destructive text-destructive-foreground text-[12px]">
          {count}
        </span>
        <span className="text-[12px] text-foreground whitespace-nowrap truncate">
          linha{count !== 1 ? 's' : ''} selecionada{count !== 1 ? 's' : ''}
        </span>
      </span>

      <div className="flex items-center gap-1.5 shrink-0">
        <Select value={motivoId} onValueChange={setMotivoId}>
          <SelectTrigger className="h-7 text-[12px] min-w-[180px] bg-background">
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

        {precisaTexto && (
          <Input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Descreva o problema…"
            className="h-7 text-[12px]! min-w-[220px] bg-background"
          />
        )}

        <Button size="sm" variant="destructive" className="h-7" disabled={!podeAdd} onClick={handleAdd}>
          <Plus className="h-3.5 w-3.5" />
          Adicionar ao carrinho
        </Button>

        <button
          onClick={onClear}
          className="grid place-content-center h-7 w-7 rounded text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="Limpar seleção"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
