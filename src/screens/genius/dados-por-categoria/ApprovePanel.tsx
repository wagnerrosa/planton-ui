'use client'

import { useState } from 'react'
import { Check, Calculator, RotateCcw, AlertTriangle, Lock } from 'lucide-react'
import { Input } from '@/components/shadcn/input'
import { Button } from '@/components/shadcn/button'
import type { CategoriaResumo } from './dados-data'

const fmt = (n: number) => n.toLocaleString('pt-BR', { maximumFractionDigits: 2 })

export function ApprovePanel({
  resumo,
  categoriaLabel,
  locked,
  onAprovar,
}: {
  resumo: CategoriaResumo
  categoriaLabel: string
  /** categoria reprovada e devolvida → não pode aprovar até reenvio do respondente */
  locked?: boolean
  /** valor tCO₂e final confirmado pelo engenheiro */
  onAprovar: (tco2e: number) => void
}) {
  const temErros = resumo.totalErros > 0

  // Duas dimensões da mesma soma: por guia (schema) ou por unidade/filial.
  // A visão ativa é editável; o total da categoria = soma viva da visão ativa.
  const [view, setView] = useState<'guia' | 'unidade'>('guia')
  const itens = view === 'guia' ? resumo.porSchema : resumo.porUnidade

  // Valores editáveis independentes por visão — cada um pré-preenchido com as
  // somas calculadas daquela dimensão.
  const seed = (arr: { id: string; soma: number }[]) =>
    Object.fromEntries(arr.map((s) => [s.id, fmt(s.soma)]))
  const [valoresGuia, setValoresGuia] = useState<Record<string, string>>(() => seed(resumo.porSchema))
  const [valoresUnidade, setValoresUnidade] = useState<Record<string, string>>(() => seed(resumo.porUnidade))
  const valores = view === 'guia' ? valoresGuia : valoresUnidade
  const setValores = view === 'guia' ? setValoresGuia : setValoresUnidade

  const parse = (v: string) => Number((v ?? '').replace(/\./g, '').replace(',', '.'))
  const total = itens.reduce((a, s) => a + (parse(valores[s.id]) || 0), 0)
  const todasValidas = itens.every((s) => {
    const n = parse(valores[s.id])
    return Number.isFinite(n) && n >= 0
  })
  const valido = todasValidas && !locked

  const setGuia = (id: string, v: string) => setValores((m) => ({ ...m, [id]: v }))
  const restaurarTudo = () => setValores(seed(itens))

  // Reprovada → bloqueia tudo: faltam dados (linhas devolvidas para correção).
  if (locked) {
    return (
      <div className="flex flex-col h-full min-h-0 border border-border/50 rounded-md bg-transparent">
        <div className="shrink-0 flex items-center gap-2 px-3 py-2.5 border-b border-border/50">
          <Lock className="h-4 w-4 text-muted-foreground" />
          <span className="text-[13px] font-sans text-muted-foreground">Aprovação bloqueada</span>
        </div>
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center text-center gap-3 px-4 py-8">
          <div className="grid place-content-center h-12 w-12 rounded-full bg-destructive-surface">
            <Lock className="h-5 w-5 text-destructive" />
          </div>
          <p className="text-[13px] text-foreground max-w-[240px]">
            {categoriaLabel} foi reprovada e devolvida ao respondente.
          </p>
          <p className="text-[12px] text-muted-foreground max-w-[240px]">
            Faltam dados nesta categoria. A aprovação só fica disponível depois que o respondente
            corrigir e reenviar as linhas recusadas.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full min-h-0 border border-success-border/50 rounded-md bg-transparent">
      <div className="shrink-0 flex items-center gap-2 px-3 py-2.5 border-b border-success-border/50">
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

        {/* tCO₂e — editável, em duas dimensões alternáveis: por guia (formato de
            schema) ou por unidade/filial. A visão ativa define o total. */}
        <div className="rounded-md border border-border/60 bg-background/40 px-3 py-2.5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 text-[10px] font-heading uppercase tracking-wider text-muted-foreground">
              <Calculator className="h-3 w-3" />
              tCO₂e
            </div>
            <button
              onClick={restaurarTudo}
              className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
              title="Restaurar somas calculadas"
            >
              <RotateCcw className="h-3 w-3" />
              Restaurar
            </button>
          </div>

          {/* Toggle de dimensão */}
          <div className="flex items-center gap-0.5 p-0.5 mb-2.5 rounded-md bg-muted/50 border border-border/50">
            {([
              { id: 'guia', label: 'Por guia', count: resumo.porSchema.length },
              { id: 'unidade', label: 'Por unidade', count: resumo.porUnidade.length },
            ] as const).map((opt) => {
              const active = view === opt.id
              return (
                <button
                  key={opt.id}
                  onClick={() => setView(opt.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 h-6 rounded text-[11px] transition-colors ${
                    active
                      ? 'bg-background text-foreground font-medium shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {opt.label}
                  <span className="text-[10px] text-muted-foreground tabular-nums">{opt.count}</span>
                </button>
              )
            })}
          </div>

          <ul className="flex flex-col gap-2">
            {itens.map((s) => {
              const editado = parse(valores[s.id]) !== s.soma
              return (
                <li key={s.id} className="flex items-center justify-between gap-2">
                  <span className="flex flex-col min-w-0">
                    <span className="text-[11px] text-foreground truncate">{s.label}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {s.linhas} linha{s.linhas !== 1 ? 's' : ''} · soma {fmt(s.soma)}
                      {editado && <span className="text-warning"> · ajustado</span>}
                    </span>
                  </span>
                  <Input
                    value={valores[s.id] ?? ''}
                    onChange={(e) => setGuia(s.id, e.target.value)}
                    inputMode="decimal"
                    aria-label={`tCO₂e — ${s.label}`}
                    className="w-28 h-8 text-right text-[13px] tabular-nums bg-background/60 shrink-0"
                  />
                </li>
              )
            })}
          </ul>

          <p className="text-[10px] text-muted-foreground mt-2.5 leading-snug">
            Valor consolidado para {categoriaLabel}. Pré-preenchido com a soma das linhas — ajuste
            {view === 'guia' ? ' cada guia' : ' cada unidade'} se necessário.
          </p>
        </div>
      </div>

      {/* Footer fixo — Total sempre visível (não some no scroll de muitas unidades) + ação. */}
      <div className="shrink-0 border-t border-success-border">
        <div className="flex items-baseline justify-between gap-2 px-3 pt-2.5 pb-2">
          <span className="text-[11px] font-medium text-foreground">Total consolidado</span>
          <span className="flex items-baseline gap-1">
            <span className="text-[22px] font-sans text-foreground tabular-nums">{fmt(total)}</span>
            <span className="text-[12px] text-muted-foreground">tCO₂e</span>
          </span>
        </div>
        <div className="px-3 pb-2.5">
          <Button
            className="w-full bg-success text-success-foreground hover:bg-success/90"
            disabled={!valido}
            onClick={() => onAprovar(total)}
          >
            <Check className="h-4 w-4" />
            Aprovar categoria
          </Button>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border/60 bg-background/40 px-2.5 py-2">
      <div className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="text-[16px] font-sans text-foreground tabular-nums">{value}</div>
    </div>
  )
}
