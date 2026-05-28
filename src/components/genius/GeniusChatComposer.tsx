'use client'

import { useRef, useState } from 'react'
import { ArrowUp, Plus, BarChart2, FileText, Braces, Plug, X, File, Paperclip } from 'lucide-react'

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
  onSend: (attachments: File[]) => void
  onSentFileClick?: (index: number) => void
  placeholder?: string
  chips?: GeniusChatComposerChip[]
  showChips?: boolean
  disabled?: boolean
}

export function GeniusChatComposer({
  input,
  onChange,
  onSend,
  onSentFileClick,
  placeholder = 'Descreva os dados que você possui',
  chips = DEFAULT_CHIPS,
  showChips = false,
  disabled = false,
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
    if (current.length > 0) {
      setSentFiles((prev) => [
        ...prev,
        ...current.map((f) => ({ name: f.name, ext: f.name.split('.').pop()?.toLowerCase() ?? '' })),
      ])
    }
    setAttachments([])
    onSend(current)
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

  function handleChipClick(chip: GeniusChatComposerChip) {
    chip.onClick?.()
    textareaRef.current?.focus()
  }

  return (
    <div className="flex flex-col w-full">
      <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileChange} />

      {/* Shelf de arquivos enviados */}
      {sentFiles.length > 0 && (
        <div className="border border-b-0 border-border bg-muted/30 px-3 py-2">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Paperclip size={10} className="text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground font-sans uppercase tracking-wide">Arquivos enviados ({sentFiles.length})</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {sentFiles.map((f, i) => {
              const info = getFileInfo(f.ext)
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    const next = selectedSentFile === i ? null : i
                    setSelectedSentFile(next)
                    onSentFileClick?.(next ?? -1)
                  }}
                  className={`flex items-center gap-1.5 border px-2 py-1 shrink-0 max-w-[160px] transition-colors ${
                    selectedSentFile === i
                      ? 'border-planton-accent bg-planton-accent/5'
                      : 'border-border bg-background hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center justify-center w-5 h-5 shrink-0 text-[8px] font-mono font-bold" style={{ ...info.bgStyle, ...info.textStyle }}>
                    {f.ext ? f.ext.slice(0, 3).toUpperCase() : <File size={10} />}
                  </div>
                  <span className="text-[10px] font-sans text-foreground truncate leading-tight">{f.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Composer box */}
      <div className={`flex flex-col w-full border border-border bg-background shadow-sm transition-shadow ${disabled ? 'opacity-60' : 'focus-within:shadow-md'}`}>

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
            placeholder={disabled ? 'Inventário enviado. Somente leitura.' : placeholder}
            rows={1}
            disabled={disabled}
            className="flex-1 resize-none bg-transparent py-4 text-sm font-sans text-foreground placeholder:text-muted-foreground focus:outline-none max-h-[200px] leading-relaxed disabled:cursor-not-allowed"
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
