'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowUp, Plus, BarChart2, FileText, Braces, Plug, X, File, Paperclip, Loader2, CheckCircle2, ChevronUp, ChevronDown, MonitorSmartphone, RotateCcw } from 'lucide-react'
import type { GridSelectionInfo } from './InventoryDataGrid'

export type GeniusChatComposerChip = {
  label: string
  icon: React.ReactNode
  onClick?: () => void
}

const DEFAULT_CHIPS: GeniusChatComposerChip[] = [
  { label: 'Planilhas Excel', icon: <BarChart2 size={15} /> },
  { label: 'Arquivos PDF',    icon: <FileText size={15} /> },
  { label: 'Dados em JSON',   icon: <Braces size={15} /> },
  { label: 'Conecte seu ERP', icon: <Plug size={15} /> },
]

export type SentFile = {
  name: string
  ext: string
  processingId?: string
}

const FILE_INFO: Record<string, { label: string; bgStyle: React.CSSProperties; textStyle: React.CSSProperties }> = {
  xlsx: { label: 'Excel', bgStyle: { backgroundColor: '#dcfce7' }, textStyle: { color: '#15803d' } },
  xls:  { label: 'Excel', bgStyle: { backgroundColor: '#dcfce7' }, textStyle: { color: '#15803d' } },
  csv:  { label: 'CSV',   bgStyle: { backgroundColor: '#dbeafe' }, textStyle: { color: '#1d4ed8' } },
  pdf:  { label: 'PDF',   bgStyle: { backgroundColor: '#fee2e2' }, textStyle: { color: '#b91c1c' } },
  json: { label: 'JSON',  bgStyle: { backgroundColor: '#fef9c3' }, textStyle: { color: '#a16207' } },
}

function getFileInfo(ext: string) {
  return FILE_INFO[ext] ?? { label: ext.toUpperCase() || 'Arquivo', bgStyle: {}, textStyle: {} }
}

export type GeniusChatComposerProps = {
  input: string
  onChange: (value: string) => void
  onSend: (attachments: File[]) => string[]
  onSentFileClick?: (index: number) => void
  onClearSelection?: () => void
  placeholder?: string
  chips?: GeniusChatComposerChip[]
  showChips?: boolean
  disabled?: boolean
  selectionContext?: GridSelectionInfo
  fileProcessingStatus?: (processingId: string) => 'processing' | 'done' | 'error' | undefined
  filesExpanded?: boolean
  onFilesExpandedChange?: (expanded: boolean) => void
  mobileInventoryBanner?: boolean
  /** Pede confirmação ao pai antes de excluir um arquivo enviado (e os dados atrelados). */
  onRequestDeleteFile?: (index: number, file: SentFile) => void
  /** Ref preenchido com fn que remove um arquivo do shelf — chamado pelo pai após confirmar. */
  deleteFileRef?: React.RefObject<((index: number) => void) | null>
  /** Mostra o botão de reiniciar a categoria (somente no layout split, com dados já enviados). */
  showReset?: boolean
  /** Pede confirmação ao pai antes de reiniciar toda a categoria. */
  onRequestReset?: () => void
  /** Ref preenchido com fn que limpa os arquivos enviados — chamado pelo pai após confirmar o reset. */
  resetFilesRef?: React.RefObject<(() => void) | null>
}

const SHELF_THRESHOLD = 4

export function GeniusChatComposer({
  input,
  onChange,
  onSend,
  onSentFileClick,
  onClearSelection,
  placeholder = 'Descreva os dados que você possui',
  chips = DEFAULT_CHIPS,
  showChips = false,
  disabled = false,
  selectionContext,
  fileProcessingStatus,
  filesExpanded = false,
  onFilesExpandedChange,
  mobileInventoryBanner = false,
  onRequestDeleteFile,
  deleteFileRef,
  showReset = false,
  onRequestReset,
  resetFilesRef,
}: GeniusChatComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [attachments, setAttachments] = useState<File[]>([])
  const [sentFiles, setSentFiles] = useState<SentFile[]>([])
  const [selectedSentFile, setSelectedSentFile] = useState<number | null>(null)

  const canSend = !disabled && (input.trim().length > 0 || attachments.length > 0)

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (canSend) handleSend()
    }
  }

  function handleSend() {
    const current = attachments
    const processingIds = onSend(current)
    if (current.length > 0) {
      setSentFiles((prev) => {
        const next = [
          ...prev,
          ...current.map((f, i) => ({
            name: f.name,
            ext: f.name.split('.').pop()?.toLowerCase() ?? '',
            processingId: processingIds[i],
          })),
        ]
        return next
      })
    }
    setAttachments([])
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length > 0) setAttachments((prev) => [...prev, ...files])
    e.target.value = ''
    textareaRef.current?.focus()
  }

  function removeAttachment(index: number) {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  function removeSentFile(index: number) {
    setSentFiles((prev) => prev.filter((_, i) => i !== index))
    setSelectedSentFile((prev) => {
      if (prev === null) return prev
      if (prev === index) return null
      return prev > index ? prev - 1 : prev
    })
  }

  // Expõe a remoção ao pai — chamada após o pai confirmar a exclusão no modal.
  useEffect(() => {
    if (!deleteFileRef) return
    deleteFileRef.current = removeSentFile
    return () => { deleteFileRef.current = null }
  })

  function clearSentFiles() {
    setSentFiles([])
    setSelectedSentFile(null)
    setAttachments([])
  }

  // Expõe a limpeza total dos arquivos ao pai — chamada após confirmar o reset da categoria.
  useEffect(() => {
    if (!resetFilesRef) return
    resetFilesRef.current = clearSentFiles
    return () => { resetFilesRef.current = null }
  })

  function handleChipClick(chip: GeniusChatComposerChip) {
    chip.onClick?.()
    textareaRef.current?.focus()
  }

  return (
    <div className={`flex flex-col w-full ${filesExpanded ? 'flex-1 min-h-0' : ''}`}>
      <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileChange} />

      {/* Shelf de arquivos enviados — expandido (lista vertical) */}
      {sentFiles.length > 0 && filesExpanded && (
        <div className="flex flex-col flex-1 min-h-0 border border-t-0 border-border bg-muted/50">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0">
            <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-sans uppercase tracking-wide">
              <Paperclip size={10} />
              Arquivos enviados ({sentFiles.length})
            </span>
            <button
              type="button"
              onClick={() => onFilesExpandedChange?.(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Recolher arquivos"
            >
              <ChevronDown size={14} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-1.5">
            {sentFiles.map((f, i) => {
              const info = getFileInfo(f.ext)
              const status = f.processingId ? fileProcessingStatus?.(f.processingId) : undefined
              return (
                <div
                  key={i}
                  className={`group flex items-center gap-2 border px-2.5 py-1.5 w-full transition-colors ${
                    selectedSentFile === i
                      ? 'border-planton-accent bg-planton-accent/5'
                      : 'border-border bg-background hover:bg-muted'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      const next = selectedSentFile === i ? null : i
                      setSelectedSentFile(next)
                      onSentFileClick?.(next ?? -1)
                    }}
                    className="flex items-center gap-2 flex-1 min-w-0 text-left"
                  >
                    <div className="flex items-center justify-center w-6 h-6 shrink-0 text-[9px] font-mono font-bold" style={{ ...info.bgStyle, ...info.textStyle }}>
                      {f.ext ? f.ext.slice(0, 3).toUpperCase() : <File size={10} />}
                    </div>
                    <span className="text-xs font-sans text-foreground truncate flex-1 leading-tight">{f.name}</span>
                  </button>
                  {status === 'processing' && <Loader2 size={11} className="animate-spin text-muted-foreground shrink-0" />}
                  {status === 'done' && <CheckCircle2 size={11} className="text-planton-accent shrink-0" />}
                  <button
                    type="button"
                    onClick={() => onRequestDeleteFile?.(i, f)}
                    className="shrink-0 text-muted-foreground/50 hover:text-destructive transition-colors p-0.5"
                    aria-label={`Excluir ${f.name}`}
                    title="Excluir arquivo"
                  >
                    <X size={13} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Shelf de arquivos enviados — compacto (horizontal) */}
      {sentFiles.length > 0 && !filesExpanded && (
        <div className="border border-border bg-muted/50 px-3 py-2">
          <div className="flex items-center justify-between gap-1.5 mb-1.5">
            <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-sans uppercase tracking-wide">
              <Paperclip size={10} />
              Arquivos enviados ({sentFiles.length})
            </span>
            {sentFiles.length > SHELF_THRESHOLD && (
              <button
                type="button"
                onClick={() => onFilesExpandedChange?.(true)}
                className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors shrink-0"
                aria-label="Ver todos os arquivos"
              >
                <ChevronUp size={12} />
                Ver todos
              </button>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {sentFiles.map((f, i) => {
              const info = getFileInfo(f.ext)
              const status = f.processingId ? fileProcessingStatus?.(f.processingId) : undefined
              return (
                <div
                  key={i}
                  className={`group flex items-center gap-1.5 border px-2 py-1 shrink-0 max-w-[180px] transition-colors ${
                    selectedSentFile === i
                      ? 'border-planton-accent bg-planton-accent/5'
                      : 'border-border bg-background hover:bg-muted'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      const next = selectedSentFile === i ? null : i
                      setSelectedSentFile(next)
                      onSentFileClick?.(next ?? -1)
                    }}
                    className="flex items-center gap-1.5 min-w-0 text-left"
                  >
                    <div className="flex items-center justify-center w-5 h-5 shrink-0 text-[8px] font-mono font-bold" style={{ ...info.bgStyle, ...info.textStyle }}>
                      {f.ext ? f.ext.slice(0, 3).toUpperCase() : <File size={10} />}
                    </div>
                    <span className="text-[10px] font-sans text-foreground truncate leading-tight">{f.name}</span>
                  </button>
                  {status === 'processing' && <Loader2 size={10} className="animate-spin text-muted-foreground shrink-0" />}
                  {status === 'done' && <CheckCircle2 size={10} className="text-planton-accent shrink-0" />}
                  <button
                    type="button"
                    onClick={() => onRequestDeleteFile?.(i, f)}
                    className="shrink-0 text-muted-foreground/50 hover:text-destructive transition-colors"
                    aria-label={`Excluir ${f.name}`}
                    title="Excluir arquivo"
                  >
                    <X size={11} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Composer box */}
      <div className={`flex flex-col w-full border bg-background ${sentFiles.length > 0 ? 'border-t-0' : ''} border-border ${disabled ? 'opacity-60' : ''}`}>

        {/* Anexos pendentes */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 px-4 pt-3">
            {attachments.map((file, i) => {
              const info = getFileInfo(file.name.split('.').pop()?.toLowerCase() ?? '')
              return (
                <div key={i} className="flex items-center gap-2 border border-border bg-background px-2.5 py-1.5 max-w-[200px]">
                  <div className="flex items-center justify-center w-7 h-7 shrink-0" style={info.bgStyle}>
                    <File size={13} style={info.textStyle} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-sans font-medium text-foreground truncate leading-tight">{file.name}</span>
                    <span className="text-[10px] text-muted-foreground leading-tight">{info.label}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttachment(i)}
                    className="shrink-0 ml-1 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Remover anexo"
                  >
                    <X size={13} />
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* Mobile inventory banner — chip inline */}
        {mobileInventoryBanner && (
          <div className="flex items-center gap-1.5 px-4 pt-2.5">
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-planton-accent/10 text-planton-accent text-[11px] font-sans font-medium border border-planton-accent/25">
              <MonitorSmartphone size={11} className="shrink-0" />
              Dados recebidos — abra no computador para editar a planilha
            </span>
          </div>
        )}

        {/* Selection context pill */}
        {selectionContext && selectionContext.count > 0 && (
          <div className="flex items-center gap-1.5 px-4 pt-2.5">
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-planton-accent/10 text-planton-accent text-[11px] font-sans font-medium border border-planton-accent/25">
              {selectionContext.type === 'columns'
                ? `${selectionContext.count} ${selectionContext.count === 1 ? 'coluna selecionada' : 'colunas selecionadas'} no contexto`
                : selectionContext.type === 'rows'
                  ? `${selectionContext.count} ${selectionContext.count === 1 ? 'linha selecionada' : 'linhas selecionadas'} no contexto`
                  : `${selectionContext.count} ${selectionContext.count === 1 ? 'célula selecionada' : 'células selecionadas'} no contexto`
              }
              {onClearSelection && (
                <button
                  type="button"
                  onClick={onClearSelection}
                  className="ml-0.5 hover:opacity-70 transition-opacity"
                  aria-label="Limpar seleção"
                >
                  <X size={11} />
                </button>
              )}
            </span>
          </div>
        )}

        {/* Input row */}
        <div className="flex items-center gap-2 px-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors disabled:cursor-not-allowed disabled:hover:text-muted-foreground"
            aria-label="Anexar arquivo"
          >
            <Plus size={20} strokeWidth={3} />
          </button>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? 'Categoria enviada. Somente leitura.' : placeholder}
            rows={1}
            disabled={disabled}
            className="flex-1 resize-none bg-transparent py-4 text-[12px] font-sans text-foreground placeholder:text-muted-foreground focus:outline-none max-h-[200px] leading-relaxed disabled:cursor-not-allowed"
            style={{ fieldSizing: 'content' } as React.CSSProperties}
          />

          <button
            onClick={handleSend}
            disabled={!canSend}
            className={`shrink-0 flex items-center justify-center w-9 h-9 rounded-full transition-all ${
              canSend
                ? 'bg-planton-accent text-white hover:bg-planton-accent/85'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
            aria-label="Enviar mensagem"
          >
            <ArrowUp size={20} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Caixa de ação abaixo do box — reiniciar conversa (espelha o shelf de anexos no topo) */}
      {showReset && (
        <div className="border border-t-0 border-border bg-muted/50 px-3 py-2">
          <button
            type="button"
            onClick={onRequestReset}
            className="flex items-center gap-1.5 text-xs font-sans text-muted-foreground hover:text-destructive transition-colors"
            aria-label="Reiniciar conversa"
            title="Reiniciar conversa — apaga todos os dados desta categoria"
          >
            <RotateCcw size={13} />
            Reiniciar conversa
          </button>
        </div>
      )}

      {/* Suggestion chips */}
      {showChips && chips.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center pt-1">
          {chips.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => { fileInputRef.current?.click(); handleChipClick(chip) }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-background text-sm font-sans text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
            >
              {chip.icon}
              {chip.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
