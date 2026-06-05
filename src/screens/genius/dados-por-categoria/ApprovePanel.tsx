'use client'

import { useState } from 'react'
import { Check, Calculator, RotateCcw, AlertTriangle } from 'lucide-react'
import { Input } from '@/components/shadcn/input'
import { Button } from '@/components/shadcn/button'
import type { CategoriaResumo } from './dados-data'

const fmt = (n: number) => n.toLocaleString('pt-BR', { maximumFractionDigits: 2 })

export function ApprovePanel({
  resumo,
  categoriaLabel,
  onAprovar,
}: {
  resumo: CategoriaResumo
  categoriaLabel: string
  /** valor tCO₂e final confirmado pelo engenheiro */
  onAprovar: (tco2e: number) => void
}) {
  // Pré-preenche com a soma das linhas; engenheiro pode sobrescrever.
  const [valor, setValor] = useState(fmt(resumo.somaTco2e))
  const temErros = resumo.totalErros > 0

  const parsed = Number(valor.replace(/\./g, '').replace(',', '.'))
  const valido = Number.isFinite(parsed) && parsed >= 0

  return (
    <div className="flex flex-col h-full min-h-0 border border-success-border rounded-md bg-success-surface/30">
      <div className="shrink-0 flex items-center gap-2 px-3 py-2.5 border-b border-success-border">
        <Check className="h-4 w-4 text-success" />
        <span className="text-[13px] font-sans text-success">Aprovar categoria</span>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3 flex flex-col gap-3">
        {temErros && (
          <div className="flex items-start gap-2 rounded-md border border-warning-border bg-warning-surface px-2.5 py-2 text-[11px] text-warning">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>
              Ainda há {resumo.totalErros} linha(s) com erro. Aprovar mesmo assim consolida os dados
              como estão.
            </span>
          </div>
        )}

        {/* Resumo numérico */}
        <div className="grid grid-cols-2 gap-2">
          <Stat label="Linhas" value={String(resumo.totalLinhas)} />
          <Stat label="Avisos" value={String(resumo.totalAvisos)} />
        </div>

        {/* Soma calculada */}
        <div className="rounded-md border border-border bg-background px-3 py-2.5">
          <div className="flex items-center gap-1.5 text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-1">
            <Calculator className="h-3 w-3" />
            Soma das linhas
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[20px] font-sans text-foreground tabular-nums">
              {fmt(resumo.somaTco2e)}
            </span>
            <span className="text-[12px] text-muted-foreground">tCO₂e</span>
          </div>
        </div>

        {/* Entrada manual do tCO₂e final */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] text-foreground">
            tCO₂e final da categoria
          </label>
          <div className="flex items-center gap-2">
            <Input
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              inputMode="decimal"
              className="text-[14px] tabular-nums"
            />
            <button
              onClick={() => setValor(fmt(resumo.somaTco2e))}
              className="grid place-content-center h-9 w-9 shrink-0 rounded-md border border-border text-muted-foreground hover:bg-accent transition-colors"
              aria-label="Restaurar soma calculada"
              title="Restaurar soma calculada"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Valor consolidado para {categoriaLabel}. Pré-preenchido com a soma — ajuste se necessário.
          </p>
        </div>
      </div>

      <div className="shrink-0 px-3 py-2.5 border-t border-success-border">
        <Button
          className="w-full bg-success text-success-foreground hover:bg-success/90"
          disabled={!valido}
          onClick={() => onAprovar(parsed)}
        >
          <Check className="h-4 w-4" />
          Aprovar categoria
        </Button>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background px-2.5 py-2">
      <div className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="text-[16px] font-sans text-foreground tabular-nums">{value}</div>
    </div>
  )
}
