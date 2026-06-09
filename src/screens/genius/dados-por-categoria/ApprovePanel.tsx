'use client'

import { useState } from 'react'
import { Check, Users, AlertCircle, Ban, Download, FileText, FileArchive, ChevronUp, ChevronDown } from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import type { CategoriaResumo, RespondenteArquivo, RespStatus } from './dados-data'

// Respondente como vem do resumo (uma entrada de porRespondente).
type RespondenteResumo = CategoriaResumo['porRespondente'][number]

const FILES_THRESHOLD = 4

const FILE_BADGE: Record<string, { bg: string; fg: string }> = {
  xlsx: { bg: '#dcfce7', fg: '#15803d' },
  xls:  { bg: '#dcfce7', fg: '#15803d' },
  csv:  { bg: '#dbeafe', fg: '#1d4ed8' },
  pdf:  { bg: '#fee2e2', fg: '#b91c1c' },
  json: { bg: '#fef9c3', fg: '#a16207' },
}

function downloadMock(filename: string) {
  const blob = new Blob([`Mock — ${filename}`], { type: 'application/octet-stream' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function FilialOverviewPanel({
  resumo,
  onAprovar,
}: {
  resumo: CategoriaResumo
  onAprovar: () => void
}) {
  // Qual respondente tem o shelf de arquivos aberto em tela cheia.
  const [expandedResp, setExpandedResp] = useState<string | null>(null)

  // Separa por status p/ ordenar a lista: pendentes (a aprovar) em cima,
  // depois aprovados, recusados por último. Recusados vêm sem filiais/arquivos.
  const pendentes = resumo.porRespondente.filter((r) => r.status == null)
  const aprovados = resumo.porRespondente.filter((r) => r.status === 'aprovado')
  const recusados = resumo.porRespondente.filter((r) => r.status === 'recusado')

  // Stats só dos respondentes ainda ativos (não recusados) — recusado saiu da soma.
  const ativos = resumo.porRespondente.filter((r) => r.status !== 'recusado')
  const totalFiliais = ativos.reduce((a, r) => a + r.filiais.length, 0)
  const semDados = ativos.reduce((a, r) => a + r.filiais.filter((f) => !f.temDados).length, 0)
  const nPendentes = pendentes.length

  // Shelf expandido: respondente ativo ocupa flex-1, igual ao composer.
  const respExpandido = expandedResp
    ? resumo.porRespondente.find((r) => r.respondente === expandedResp)
    : null

  return (
    <div className="flex flex-col h-full min-h-0 border border-success-border/50 rounded-md bg-transparent">
      <div className="shrink-0 flex items-center gap-2 px-3 py-2.5 border-b border-success-border/50">
        <Check className="h-4 w-4 text-success" />
        <span className="text-[13px] font-sans text-success">Aprovar categoria</span>
        {(aprovados.length > 0 || recusados.length > 0) && (
          <span className="ml-auto flex items-center gap-1.5 text-[10px] text-muted-foreground tabular-nums">
            {aprovados.length > 0 && <span className="text-success">{aprovados.length} aprovado{aprovados.length !== 1 ? 's' : ''}</span>}
            {recusados.length > 0 && <span className="text-destructive">{recusados.length} recusado{recusados.length !== 1 ? 's' : ''}</span>}
          </span>
        )}
      </div>

      {/* Shelf expandido — toma flex-1, empurra o botão de aprovar pra baixo */}
      {respExpandido ? (
        <div className="flex flex-col flex-1 min-h-0 bg-muted/30">
          {/* Header shelf expandido — igual composer */}
          <div className="shrink-0 flex items-center justify-between px-3 py-2 border-b border-border">
            <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-sans uppercase tracking-wide">
              <FileText className="h-3 w-3" />
              {respExpandido.respondente} — Arquivos enviados ({respExpandido.arquivos.length})
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => downloadMock(`${respExpandido.respondente.toLowerCase().replace(/\s+/g, '-')}-arquivos.zip`)}
                className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-planton-accent transition-colors"
                title="Baixar todos (.zip)"
              >
                <FileArchive className="h-3 w-3" />
                Baixar todos (.zip)
              </button>
              <button
                type="button"
                onClick={() => setExpandedResp(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Recolher arquivos"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
          {/* Lista vertical com scroll — ocupa todo o espaço disponível */}
          <div className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-1.5">
            {respExpandido.arquivos.map((arq) => (
              <FileRow key={arq.id} arq={arq} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Filiais" value={String(totalFiliais)} />
            <Stat label="Sem dados" value={String(semDados)} warn={semDados > 0} />
          </div>

          {semDados > 0 && (
            <div className="flex items-start gap-2 rounded-md border border-warning-border bg-warning-surface px-2.5 py-2 text-[11px] text-warning">
              <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span>{semDados} filial(ais) sem dados enviados. Serão marcadas como pendentes.</span>
            </div>
          )}

          {/* Ordem: pendentes (a aprovar) → aprovados → recusados. */}
          <div className="flex flex-col gap-2">
            {pendentes.map((resp) => (
              <RespondenteCard
                key={resp.respondente}
                resp={resp}
                onExpandAll={() => setExpandedResp(resp.respondente)}
              />
            ))}
          </div>

          {aprovados.length > 0 && (
            <div className="flex flex-col gap-2">
              <GroupHeading label="Aprovados" count={aprovados.length} tone="success" />
              {aprovados.map((resp) => (
                <RespondenteCard
                  key={resp.respondente}
                  resp={resp}
                  onExpandAll={() => setExpandedResp(resp.respondente)}
                />
              ))}
            </div>
          )}

          {recusados.length > 0 && (
            <div className="flex flex-col gap-2">
              <GroupHeading label="Recusados" count={recusados.length} tone="destructive" />
              {recusados.map((resp) => (
                <RespondenteCard key={resp.respondente} resp={resp} />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="shrink-0 border-t border-success-border px-3 py-2.5">
        <Button
          className="w-full bg-success text-success-foreground hover:bg-success/90"
          onClick={onAprovar}
          disabled={nPendentes === 0}
        >
          <Check className="h-4 w-4" />
          {nPendentes > 0
            ? `Aprovar ${nPendentes} respondente${nPendentes !== 1 ? 's' : ''}`
            : 'Nada pendente para aprovar'}
        </Button>
      </div>
    </div>
  )
}

// Título de seção (Aprovados / Recusados) com contagem.
function GroupHeading({ label, count, tone }: { label: string; count: number; tone: 'success' | 'destructive' }) {
  return (
    <div className="flex items-center gap-2 pt-1">
      <span className={`text-[9px] font-heading uppercase tracking-wider ${tone === 'success' ? 'text-success' : 'text-destructive'}`}>
        {label}
      </span>
      <span className="text-[9px] text-muted-foreground tabular-nums">({count})</span>
      <div className="flex-1 h-px bg-border/40" />
    </div>
  )
}

// Card de um respondente, com 3 variações por status:
// - pendente: filiais + arquivos (interativo, a aprovar)
// - aprovado: filiais visíveis, badge "aprovado", tom sóbrio
// - recusado: só nome + badge "recusado" (sem filiais/arquivos — envio negado)
function RespondenteCard({
  resp,
  onExpandAll,
}: {
  resp: RespondenteResumo
  onExpandAll?: () => void
}) {
  const status: RespStatus | undefined = resp.status
  const recusado = status === 'recusado'
  const aprovado = status === 'aprovado'

  const borderClass = recusado
    ? 'border-destructive-border/40 bg-destructive/5'
    : aprovado
      ? 'border-success-border/40 bg-success-surface/30'
      : 'border-border/60 bg-background/40'

  return (
    <div className={`rounded-md border overflow-hidden ${borderClass}`}>
      <div className="flex items-center gap-2 px-2.5 py-2 border-b border-border/40">
        <Users className={`h-3.5 w-3.5 shrink-0 ${recusado ? 'text-destructive/70' : 'text-muted-foreground'}`} />
        <span className={`text-[12px] font-medium truncate ${recusado ? 'text-destructive line-through decoration-destructive/40' : 'text-foreground'}`}>
          {resp.respondente}
        </span>
        {recusado ? (
          <span className="ml-auto flex items-center gap-1 text-[10px] text-destructive shrink-0">
            <Ban className="h-3 w-3" />
            Recusado
          </span>
        ) : aprovado ? (
          <span className="ml-auto flex items-center gap-1 text-[10px] text-success shrink-0">
            <Check className="h-3 w-3" />
            Aprovado
          </span>
        ) : (
          <span className="ml-auto text-[10px] text-muted-foreground tabular-nums shrink-0">
            {resp.filiais.length} filial(ais)
          </span>
        )}
      </div>

      {/* Recusado: sem corpo — o envio foi negado por inteiro. */}
      {recusado ? (
        <p className="px-2.5 py-2 text-[10px] text-muted-foreground">
          Envio devolvido. Filiais e arquivos saíram da revisão até o reenvio.
        </p>
      ) : (
        <>
          <ul className="flex flex-col divide-y divide-border/30">
            {resp.filiais.map((f) => (
              <li key={f.unidade} className="flex items-center gap-2 px-2.5 py-1.5">
                <span className="text-[11px] text-foreground truncate flex-1">{f.unidade}</span>
                {f.temDados ? (
                  <span className="text-[10px] text-success shrink-0">
                    {f.linhas} linha{f.linhas !== 1 ? 's' : ''}
                  </span>
                ) : (
                  <span className="text-[10px] text-warning shrink-0 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    sem dados
                  </span>
                )}
              </li>
            ))}
          </ul>

          {resp.arquivos.length > 0 && (
            <RespondenteArquivosCompact
              arquivos={resp.arquivos}
              onDownloadAll={() => downloadMock(`${resp.respondente.toLowerCase().replace(/\s+/g, '-')}-arquivos.zip`)}
              onExpandAll={onExpandAll ?? (() => {})}
            />
          )}
        </>
      )}
    </div>
  )
}

// Versão compacta inline (horizontal scroll-x). "Ver todos" → expande pro layout inteiro.
function RespondenteArquivosCompact({
  arquivos,
  onDownloadAll,
  onExpandAll,
}: {
  arquivos: RespondenteArquivo[]
  onDownloadAll: () => void
  onExpandAll: () => void
}) {
  const overflow = arquivos.length > FILES_THRESHOLD

  return (
    <div className="border-t border-border/40 bg-muted/20 px-2.5 py-2">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[9px] font-heading uppercase tracking-wider text-muted-foreground">
          Arquivos enviados ({arquivos.length})
        </span>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onDownloadAll}
            className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-planton-accent transition-colors"
            title="Baixar todos os arquivos deste respondente (.zip)"
          >
            <FileArchive className="h-3 w-3" />
            Baixar todos (.zip)
          </button>
          {overflow && (
            <button
              type="button"
              onClick={onExpandAll}
              className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Ver todos os arquivos"
            >
              <ChevronUp className="h-3 w-3" />
              Ver todos
            </button>
          )}
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {arquivos.map((arq) => (
          <FileChip key={arq.id} arq={arq} />
        ))}
      </div>
    </div>
  )
}

function FileRow({ arq }: { arq: RespondenteArquivo }) {
  const badge = FILE_BADGE[arq.ext] ?? { bg: 'hsl(var(--muted))', fg: 'hsl(var(--muted-foreground))' }
  return (
    <div className="group flex items-center gap-2 border border-border bg-background px-2.5 py-1.5 w-full transition-colors hover:bg-muted">
      <div
        className="flex items-center justify-center w-6 h-6 shrink-0 text-[9px] font-mono font-bold"
        style={{ backgroundColor: badge.bg, color: badge.fg }}
      >
        {arq.ext ? arq.ext.slice(0, 3).toUpperCase() : <FileText className="h-3 w-3" />}
      </div>
      <span className="text-[11px] font-sans text-foreground truncate flex-1 leading-tight">{arq.name}</span>
      <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">
        {arq.linhas} linha{arq.linhas !== 1 ? 's' : ''}
      </span>
      <button
        type="button"
        onClick={() => downloadMock(arq.name)}
        className="shrink-0 text-muted-foreground/50 hover:text-planton-accent transition-colors p-0.5"
        aria-label={`Baixar ${arq.name}`}
        title="Baixar arquivo"
      >
        <Download className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

function FileChip({ arq }: { arq: RespondenteArquivo }) {
  const badge = FILE_BADGE[arq.ext] ?? { bg: 'hsl(var(--muted))', fg: 'hsl(var(--muted-foreground))' }
  return (
    <div className="group flex items-center gap-1.5 rounded-sm border border-border/50 bg-background/60 px-2 py-1 shrink-0 max-w-[180px]">
      <div
        className="flex items-center justify-center w-5 h-5 shrink-0 rounded-sm text-[8px] font-mono font-bold"
        style={{ backgroundColor: badge.bg, color: badge.fg }}
      >
        {arq.ext ? arq.ext.slice(0, 3).toUpperCase() : <FileText className="h-3 w-3" />}
      </div>
      <span className="text-[10px] text-foreground truncate leading-tight">{arq.name}</span>
      <button
        type="button"
        onClick={() => downloadMock(arq.name)}
        className="shrink-0 text-muted-foreground/50 hover:text-planton-accent transition-colors"
        aria-label={`Baixar ${arq.name}`}
        title="Baixar arquivo"
      >
        <Download className="h-3 w-3" />
      </button>
    </div>
  )
}

function Stat({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="rounded-md border border-border/60 bg-background/40 px-2.5 py-2">
      <div className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`text-[16px] font-sans tabular-nums ${warn ? 'text-warning' : 'text-foreground'}`}>{value}</div>
    </div>
  )
}
