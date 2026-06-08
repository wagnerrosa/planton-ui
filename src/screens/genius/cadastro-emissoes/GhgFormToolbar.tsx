'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight, FileSpreadsheet, Check } from 'lucide-react'
import { FILIAIS, type Periodo } from './ghg-form-data'

export function GhgFormToolbar({
  filialId,
  periodos,
  periodoId,
  onPeriodo,
  onUpload,
  lastSaved,
}: {
  filialId: string
  periodos: Periodo[]
  periodoId: string
  onPeriodo: (id: string) => void
  onUpload: (file: File) => void
  /** texto de auto-save já formatado (ex: "08/06/2026 14:32 · Sarah Link"); null = nada salvo ainda */
  lastSaved: string | null
}) {
  const filial = FILIAIS.find((f) => f.id === filialId) ?? FILIAIS[0]
  const perIdx = periodos.findIndex((p) => p.id === periodoId)
  const periodo = periodos[perIdx]
  const fileRef = useRef<HTMLInputElement>(null)

  function stepPer(dir: -1 | 1) {
    const next = perIdx + dir
    if (next < 0 || next >= periodos.length) return
    onPeriodo(periodos[next].id)
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) onUpload(file)
    e.target.value = ''
  }

  return (
    <div className="flex items-center gap-2 border-b border-border px-4 h-12 shrink-0 bg-background">
      <div className="flex items-center gap-2 min-w-0 truncate shrink-0">
        <h2 className="text-[13px] font-semibold font-sans text-foreground shrink-0 leading-none">{filial.nome}</h2>
        <span className="text-[12px] font-sans text-muted-foreground shrink-0 leading-none">· Responsável: {filial.respondente?.nome ?? 'Sem responsável'}</span>
        {lastSaved && (
          <span className="flex items-center gap-1 text-[12px] font-sans text-muted-foreground/60 truncate min-w-0 leading-none">
            <Check className="h-3 w-3 text-planton-accent shrink-0" />
            <span className="truncate">Alterado {lastSaved}</span>
          </span>
        )}
      </div>

      <div className="flex-1" />

      {/* Upload Excel — preenche o formulário a partir da planilha */}
      <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFile} />
      <button
        onClick={() => fileRef.current?.click()}
        className="flex items-center gap-1.5 h-7 px-2.5 text-[12px] font-sans font-medium bg-planton-accent text-white hover:opacity-90 transition-opacity shrink-0"
        title="Subir planilha preenchida"
      >
        <FileSpreadsheet className="h-3.5 w-3.5" />
        Importar Excel
      </button>

      {/* Período stepper */}
      <div className="flex items-center gap-1 h-7 border border-border/70 px-1 shrink-0">
        <button
          onClick={() => stepPer(-1)}
          disabled={perIdx <= 0}
          className="grid place-content-center h-5 w-5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
          aria-label="Mês anterior"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <span className="text-[12px] font-sans tabular-nums text-foreground text-center min-w-[76px] px-1">
          {periodo?.label}
        </span>
        <button
          onClick={() => stepPer(1)}
          disabled={perIdx >= periodos.length - 1}
          className="grid place-content-center h-5 w-5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
          aria-label="Próximo mês"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
