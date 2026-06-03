import { useMemo, useState } from 'react'
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/shadcn/sheet'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { StatusPill } from './StatusPill'
import {
  CATEGORIA_COLS,
  findFilial,
  type Combination,
  type Filial,
} from './dashboard-data'

export type DrawerTarget = { filialId: string; categoriaId?: string } | null

export function FilialDrawer({
  target,
  onClose,
}: {
  target: DrawerTarget
  onClose: () => void
}) {
  return (
    <Sheet open={target !== null} onOpenChange={(o) => { if (!o) onClose() }}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col gap-0 overflow-hidden">
        <VisuallyHidden>
          <SheetTitle>Detalhe da filial</SheetTitle>
          <SheetDescription>Informações de coleta por categoria</SheetDescription>
        </VisuallyHidden>
        {target && (
          // key remonta o conteúdo a cada alvo → useState inicializa a aba certa
          // sem precisar de useEffect de sincronização.
          <DrawerInner
            key={`${target.filialId}:${target.categoriaId ?? ''}`}
            target={target}
            onClose={onClose}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}

function DrawerInner({
  target,
  onClose,
}: {
  target: NonNullable<DrawerTarget>
  onClose: () => void
}) {
  const filial: Filial | undefined = findFilial(target.filialId)

  // Categorias aplicáveis (exclui N/A) da filial — abas internas do drawer.
  const applicableCols = useMemo(
    () =>
      filial
        ? CATEGORIA_COLS.filter((c) => filial.combinacoes[c.id].status !== 'nao-aplicavel')
        : [],
    [filial],
  )

  const [activeCatId, setActiveCatId] = useState<string | null>(() => {
    if (
      target.categoriaId &&
      filial &&
      filial.combinacoes[target.categoriaId].status !== 'nao-aplicavel'
    ) {
      return target.categoriaId
    }
    return applicableCols[0]?.id ?? null
  })

  const activeCol = activeCatId ? CATEGORIA_COLS.find((c) => c.id === activeCatId) : undefined
  const comb = filial && activeCatId ? filial.combinacoes[activeCatId] : undefined

  return (
    <>
      {filial && (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border shrink-0">
              <span
                className={`flex items-center justify-center w-11 h-11 shrink-0 font-heading text-sm font-semibold ${
                  filial.respondente
                    ? 'bg-planton-forest text-planton-accent'
                    : 'bg-warning-surface text-warning border border-warning-border'
                }`}
              >
                {filial.sigla}
              </span>
              <div className="min-w-0">
                <div className="font-heading text-base font-semibold text-foreground leading-tight">
                  {filial.nome}
                </div>
                <div className="text-[12px] font-sans text-muted-foreground mt-0.5 truncate">
                  {activeCol ? activeCol.label : 'Sem categoria aplicável'}
                </div>
              </div>
            </div>

            {/* Abas de categoria */}
            {applicableCols.length > 0 && (
              <div className="flex gap-1 px-3 py-2 border-b border-border overflow-x-auto shrink-0">
                {applicableCols.map((col) => {
                  const Icon = col.icon
                  const isActive = col.id === activeCatId
                  return (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => setActiveCatId(col.id)}
                      title={col.label}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-sans whitespace-nowrap transition-colors border ${
                        isActive
                          ? 'border-planton-accent bg-planton-accent/10 text-planton-accent font-medium'
                          : 'border-transparent text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon size={13} />
                      {col.labelCurto}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Corpo: 4 seções da spec */}
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">
              {comb ? (
                <CombinationDetail comb={comb} filialNome={filial.nome} sigla={filial.sigla} />
              ) : (
                <p className="text-[13px] font-sans text-muted-foreground py-8 text-center">
                  Esta filial não possui categorias aplicáveis.
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-t border-border shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 h-9 text-[13px] font-sans border border-border bg-background text-foreground hover:bg-muted transition-colors"
              >
                Fechar
              </button>
              <div className="flex-1" />
              <button
                type="button"
                className="px-4 h-9 text-[13px] font-sans font-medium bg-planton-accent text-white hover:bg-planton-accent/90 transition-colors"
              >
                Abrir planilha
              </button>
            </div>
          </>
      )}
    </>
  )
}

function CombinationDetail({
  comb,
  filialNome,
  sigla,
}: {
  comb: Combination
  filialNome: string
  sigla: string
}) {
  const resultadoLabel =
    comb.qualidade.resultado === 'passou'
      ? '✓ Passou'
      : comb.qualidade.resultado === 'falhou'
        ? '⚠ Falhou'
        : '— Nunca rodou'
  const resultadoClass =
    comb.qualidade.resultado === 'passou'
      ? 'text-success'
      : comb.qualidade.resultado === 'falhou'
        ? 'text-warning'
        : 'text-muted-foreground'

  return (
    <>
      {/* Status no topo */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-heading font-semibold uppercase tracking-wider text-muted-foreground">
          Situação
        </span>
        <StatusPill status={comb.status} />
      </div>

      {/* 1. Identificação */}
      <Section title="Identificação">
        <Row k="Respondente" v={comb.respondente?.nome ?? 'Não designado'} warn={!comb.respondente} />
        <Row k="E-mail" v={comb.respondente?.email ?? '—'} />
        <Row k="Filial" v={`${filialNome} (${sigla})`} />
        <Row k="Alocada em" v={comb.respondente?.alocadaEm ?? '—'} />
      </Section>

      {/* 2. Atividade */}
      <Section title="Atividade">
        <Row k="Primeiro dado" v={comb.atividade.primeiroDado} />
        <Row k="Última atualização" v={comb.atividade.ultimaAtualizacao} ok={comb.atividade.diasSemAtualizar === 0} />
        <Row
          k="Dias sem atualizar"
          v={String(comb.atividade.diasSemAtualizar)}
          ok={comb.atividade.diasSemAtualizar === 0}
          warn={comb.atividade.diasSemAtualizar >= 2}
        />
      </Section>

      {/* 3. Volume (bronze) */}
      <Section title="Volume (bronze)">
        <Row k="Total de linhas" v={comb.volume.totalLinhas.toLocaleString('pt-BR')} />
        {comb.volume.schemas.length > 0 && (
          <div className="flex flex-col gap-1.5 mt-2">
            {comb.volume.schemas.map((s) => (
              <div key={s.nome} className="flex items-center justify-between gap-2 px-3 py-2 bg-muted/40 border border-border/60">
                <span className="text-[12.5px] font-sans text-foreground truncate">{s.nome}</span>
                <span className="text-[11px] font-sans text-muted-foreground tabular-nums shrink-0">
                  {s.linhas.toLocaleString('pt-BR')} linhas
                </span>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* 4. Qualidade */}
      <Section title="Qualidade">
        <Row k="Linhas OK" v={comb.qualidade.linhasOk.toLocaleString('pt-BR')} ok={comb.qualidade.linhasProblema === 0} />
        <Row
          k="Linhas com problema"
          v={comb.qualidade.linhasProblema.toLocaleString('pt-BR')}
          warn={comb.qualidade.linhasProblema > 0}
        />
        <Row k="Última verificação" v={comb.qualidade.ultimaVerificacao} />
        <div className="flex items-center justify-between py-1.5">
          <span className="text-[12.5px] font-sans text-muted-foreground">Resultado</span>
          <span className={`text-[12.5px] font-sans font-medium ${resultadoClass}`}>{resultadoLabel}</span>
        </div>
      </Section>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] font-heading font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        {title}
      </span>
      <div className="flex flex-col">{children}</div>
    </div>
  )
}

function Row({ k, v, ok, warn }: { k: string; v: string; ok?: boolean; warn?: boolean }) {
  const cls = warn ? 'text-warning font-medium' : ok ? 'text-success font-medium' : 'text-foreground'
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 border-b border-border/40 last:border-b-0">
      <span className="text-[12.5px] font-sans text-muted-foreground shrink-0">{k}</span>
      <span className={`text-[12.5px] font-sans text-right truncate ${cls}`}>{v}</span>
    </div>
  )
}
