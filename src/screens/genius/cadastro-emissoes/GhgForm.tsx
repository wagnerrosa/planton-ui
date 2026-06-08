'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import {
  RESUMO_COLS,
  RESUMO_GROUPS,
  RESUMO_GASES,
  ESCOPO1_LINHAS,
  ESCOPO2_LINHAS,
  ESCOPO3_LINHAS,
  OUTROS_GASES,
  CATEGORIA_COLS,
  type CategoriaLinha,
} from './ghg-form-data'

// Input de célula reaproveitado por todo o formulário. Vazio mostra o placeholder
// "—" do PDF; foco realça com o accent. Numérico (text p/ aceitar vírgula pt-BR).
function CellInput({
  value,
  onChange,
  align = 'right',
}: {
  value: string
  onChange: (v: string) => void
  align?: 'left' | 'right'
}) {
  const filled = value.trim() !== ''
  // Vazio = amarelo do grid do ChatScreen (rgba(234,179,8,.12) / texto #a16207).
  // Preenchido = verde (tokens success).
  return (
    <input
      type="text"
      inputMode="decimal"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="—"
      style={filled ? undefined : { backgroundColor: 'rgba(234, 179, 8, 0.12)', borderColor: 'rgba(234, 179, 8, 0.45)', color: '#a16207' }}
      className={`w-full h-8 px-2 border text-[12px] font-sans tabular-nums transition-colors focus:outline-none focus:border-planton-accent focus:ring-1 focus:ring-planton-accent placeholder:opacity-50 ${
        align === 'right' ? 'text-right' : 'text-left'
      } ${
        filled ? 'bg-success-surface border-success-border text-success' : ''
      }`}
    />
  )
}

// Cabeçalho de seção (numero + título), espelha "2.x ..." do PDF.
function SecaoHeader({ numero, titulo, sub }: { numero: string; titulo: string; sub?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <h3 className="text-[13px] font-semibold font-sans text-foreground">
        <span className="text-planton-accent mr-1.5">{numero}</span>
        {titulo}
      </h3>
      {sub && <p className="text-[11px] text-muted-foreground font-sans">{sub}</p>}
    </div>
  )
}

type ValueMap = Record<string, string>

// Parse pt-BR tolerante: "1.234,5", "100kg", "2 312" → número. Ignora sufixo/unidade.
function parseNum(raw: string): number {
  if (!raw) return 0
  const m = raw.replace(/\s/g, '').match(/-?[\d.,]+/)
  if (!m) return 0
  let s = m[0]
  // Se tem vírgula, ela é o decimal (pt-BR) e pontos são milhar.
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.')
  const n = parseFloat(s)
  return Number.isFinite(n) ? n : 0
}

// Soma os valores de uma lista de chaves; '' (vazio) e não-numéricos contam 0.
function sumKeys(get: (k: string) => string, keys: string[]): number {
  return keys.reduce((acc, k) => acc + parseNum(get(k)), 0)
}

// Célula de total: vazia mostra "—", senão o número formatado pt-BR.
function TotalCell({ value }: { value: number }) {
  return (
    <td className="px-3 py-2 border-t border-l border-border text-right tabular-nums">
      {value === 0 ? (
        <span className="text-muted-foreground/50">—</span>
      ) : (
        <span className="font-semibold text-foreground">
          {value.toLocaleString('pt-BR', { maximumFractionDigits: 3 })}
        </span>
      )}
    </td>
  )
}

export function GhgForm({
  values,
  onChange,
  scopeId,
}: {
  /** valores já escopados por filial+período (chave = fieldId) */
  values: ValueMap
  onChange: (fieldId: string, value: string) => void
  /** chave de remontagem (filial+período) p/ resetar accordion ao trocar */
  scopeId: string
}) {
  // HFC/PFC começam recolhidos (igual Excel). Resetam ao trocar filial/período.
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  function toggle(id: string) {
    setExpanded((e) => ({ ...e, [id]: !e[id] }))
  }

  const get = (k: string) => values[k] ?? ''
  const set = (k: string) => (v: string) => onChange(k, v)

  return (
    <div key={scopeId} className="flex flex-col gap-10 px-6 py-6 max-w-5xl mx-auto w-full">
      {/* Logos GHG Protocol + FGV */}
      <div className="flex items-center gap-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/ghgprotocol_logo.png" alt="Programa Brasileiro GHG Protocol" className="h-10 w-auto shrink-0" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/fgv.svg" alt="FGV" className="h-5 w-auto shrink-0" />
      </div>
      {/* ── 2.1 Resumo das emissões totais ─────────────────────────────── */}
      <section className="flex flex-col gap-3">
        <SecaoHeader numero="2.1" titulo="Resumo das emissões totais" sub="Em toneladas de gás, por gás e escopo. HFC e PFC podem ser detalhados por sub-gás." />
        <div className="border border-border overflow-x-auto">
          <table className="w-full border-collapse text-[12px]">
            <thead>
              {/* Nível 1 — grupos de unidade (toneladas de gás | tCO2e) */}
              <tr className="bg-muted/50">
                <th rowSpan={2} className="text-left font-medium font-sans text-muted-foreground px-3 py-2 border-b border-border align-bottom min-w-[120px]">GEE</th>
                {RESUMO_GROUPS.map((g) => (
                  <th
                    key={g.id}
                    colSpan={g.cols.length}
                    className="text-center font-medium font-sans text-muted-foreground px-3 py-1.5 border-b border-l border-border"
                  >
                    {g.label}
                  </th>
                ))}
              </tr>
              {/* Nível 2 — escopos dentro de cada grupo */}
              <tr className="bg-muted/40">
                {RESUMO_COLS.map((c) => (
                  <th key={c.id} className="text-right font-normal font-sans text-muted-foreground/80 text-[11px] px-3 py-2 border-b border-l border-border min-w-[150px]">
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RESUMO_GASES.map((gas) => {
                const hasChildren = !!gas.children?.length
                const isOpen = expanded[gas.id]
                return (
                  <ResumoRows
                    key={gas.id}
                    gas={gas}
                    hasChildren={hasChildren}
                    isOpen={isOpen}
                    onToggle={() => toggle(gas.id)}
                    get={get}
                    set={set}
                  />
                )
              })}
              {/* Total — soma por coluna das linhas-mãe (sub-gases não contam, evita dupla soma) */}
              <tr className="bg-muted/30">
                <td className="px-3 py-2 border-t border-border font-semibold font-sans text-foreground">Total</td>
                {RESUMO_COLS.map((col) => {
                  const keys = RESUMO_GASES
                    .filter((g) => g.escopos.includes(col.escopo))
                    .map((g) => `resumo|${g.id}|${col.id}`)
                  return <TotalCell key={col.id} value={sumKeys(get, keys)} />
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 2.2 Escopo 1 ───────────────────────────────────────────────── */}
      <CategoriaSecao
        numero="2.2"
        titulo="Emissões de Escopo 1 desagregadas por categoria"
        prefixo="e1"
        linhas={ESCOPO1_LINHAS}
        totalLabel="Total de emissões Escopo 1"
        get={get}
        set={set}
      />

      {/* ── 2.3 Escopo 2 (duas abordagens) ─────────────────────────────── */}
      <section className="flex flex-col gap-5">
        <SecaoHeader numero="2.3" titulo="Emissões de Escopo 2 desagregadas por categoria" />
        <CategoriaTabela
          subtitulo="Abordagem baseada na localização"
          prefixo="e2loc"
          linhas={ESCOPO2_LINHAS}
          totalLabel="Total de emissões Escopo 2 (localização)"
          get={get}
          set={set}
        />
        <CategoriaTabela
          subtitulo="Abordagem baseada na escolha de compra"
          prefixo="e2comp"
          linhas={ESCOPO2_LINHAS}
          totalLabel="Total de emissões Escopo 2 (escolha de compra)"
          get={get}
          set={set}
        />
      </section>

      {/* ── 2.4 Escopo 3 ───────────────────────────────────────────────── */}
      <CategoriaSecao
        numero="2.4"
        titulo="Emissões de Escopo 3 desagregadas por categoria"
        prefixo="e3"
        linhas={ESCOPO3_LINHAS}
        totalLabel="Total de emissões Escopo 3"
        get={get}
        set={set}
      />

      {/* ── 2.5 Outros gases fora do Protocolo de Quioto ───────────────── */}
      <section className="flex flex-col gap-3">
        <SecaoHeader numero="2.5" titulo="Outros gases de efeito estufa não contemplados pelo Protocolo de Quioto" />
        <div className="border border-border overflow-hidden">
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr className="bg-muted/40">
                <th className="text-left font-medium font-sans text-muted-foreground px-3 py-2 border-b border-border">Categoria</th>
                <th className="text-right font-medium font-sans text-muted-foreground px-3 py-2 border-b border-l border-border w-[200px]">Emissões tCO2e</th>
              </tr>
            </thead>
            <tbody>
              {OUTROS_GASES.map((g) => (
                <tr key={g.id} className="border-t border-border first:border-t-0">
                  <td className="px-3 py-1.5 font-sans text-foreground">{g.label}</td>
                  <td className="px-2 py-1.5 border-l border-border">
                    <CellInput value={get(`outros|${g.id}`)} onChange={set(`outros|${g.id}`)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

// Linha-mãe da matriz 2.1 + (opcional) sub-gases expandidos.
function ResumoRows({
  gas,
  hasChildren,
  isOpen,
  onToggle,
  get,
  set,
}: {
  gas: (typeof RESUMO_GASES)[number]
  hasChildren: boolean
  isOpen: boolean
  onToggle: () => void
  get: (k: string) => string
  set: (k: string) => (v: string) => void
}) {
  return (
    <>
      <tr className="border-t border-border first:border-t-0 hover:bg-muted/20">
        <td className="px-3 py-1.5 font-sans text-foreground">
          {hasChildren ? (
            <button
              onClick={onToggle}
              className="flex items-center gap-1.5 font-medium hover:text-planton-accent transition-colors"
            >
              <ChevronRight size={13} className={`shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
              {gas.label}
            </button>
          ) : (
            gas.label
          )}
        </td>
        {RESUMO_COLS.map((col) => {
          const editable = gas.escopos.includes(col.escopo)
          return (
            <td key={col.id} className="px-2 py-1.5 border-l border-border">
              {editable ? (
                <CellInput value={get(`resumo|${gas.id}|${col.id}`)} onChange={set(`resumo|${gas.id}|${col.id}`)} />
              ) : (
                <div className="h-8 grid place-content-center text-muted-foreground/30 bg-muted/30">—</div>
              )}
            </td>
          )
        })}
      </tr>
      {hasChildren && isOpen &&
        gas.children!.map((child) => (
          <tr key={child.id} className="border-t border-border/60 bg-muted/10">
            <td className="pl-9 pr-3 py-1.5 font-sans text-muted-foreground text-[11px]">{child.label}</td>
            {RESUMO_COLS.map((col) => {
              const editable = gas.escopos.includes(col.escopo)
              return (
                <td key={col.id} className="px-2 py-1.5 border-l border-border">
                  {editable ? (
                    <CellInput value={get(`resumo|${gas.id}|${child.id}|${col.id}`)} onChange={set(`resumo|${gas.id}|${child.id}|${col.id}`)} />
                  ) : (
                    <div className="h-8 grid place-content-center text-muted-foreground/30 bg-muted/30">—</div>
                  )}
                </td>
              )
            })}
          </tr>
        ))}
    </>
  )
}

// Tabela de categoria (2.2/2.3/2.4): linhas com tCO2e + CO2 biogênico (+ remoções).
function CategoriaTabela({
  subtitulo,
  prefixo,
  linhas,
  totalLabel,
  get,
  set,
}: {
  subtitulo?: string
  prefixo: string
  linhas: CategoriaLinha[]
  totalLabel: string
  get: (k: string) => string
  set: (k: string) => (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      {subtitulo && <p className="text-[12px] font-medium font-sans text-foreground">{subtitulo}</p>}
      <div className="border border-border overflow-x-auto">
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr className="bg-muted/40">
              <th className="text-left font-medium font-sans text-muted-foreground px-3 py-2 border-b border-border min-w-[260px]">Categoria</th>
              {CATEGORIA_COLS.map((c) => (
                <th key={c.id} className="text-right font-medium font-sans text-muted-foreground px-3 py-2 border-b border-l border-border w-[170px]">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {linhas.map((linha) => (
              <tr key={linha.id} className="border-t border-border first:border-t-0 hover:bg-muted/20">
                <td className="px-3 py-1.5 font-sans text-foreground">{linha.label}</td>
                {CATEGORIA_COLS.map((col) => {
                  const k = `${prefixo}|${linha.id}|${col.id}`
                  return (
                    <td key={col.id} className="px-2 py-1.5 border-l border-border">
                      <CellInput value={get(k)} onChange={set(k)} />
                    </td>
                  )
                })}
              </tr>
            ))}
            <tr className="bg-muted/30">
              <td className="px-3 py-2 border-t border-border font-semibold font-sans text-foreground">{totalLabel}</td>
              {CATEGORIA_COLS.map((col) => {
                const keys = linhas.map((l) => `${prefixo}|${l.id}|${col.id}`)
                return <TotalCell key={col.id} value={sumKeys(get, keys)} />
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Seção = header + tabela única (2.2 e 2.4)
function CategoriaSecao({
  numero,
  titulo,
  prefixo,
  linhas,
  totalLabel,
  get,
  set,
}: {
  numero: string
  titulo: string
  prefixo: string
  linhas: CategoriaLinha[]
  totalLabel: string
  get: (k: string) => string
  set: (k: string) => (v: string) => void
}) {
  return (
    <section className="flex flex-col gap-3">
      <SecaoHeader numero={numero} titulo={titulo} />
      <CategoriaTabela prefixo={prefixo} linhas={linhas} totalLabel={totalLabel} get={get} set={set} />
    </section>
  )
}
