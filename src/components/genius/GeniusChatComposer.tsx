'use client'

import { useRef } from 'react'
import { ArrowUp, Plus, BarChart2, FileText, Braces, Plug } from 'lucide-react'

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

export type GeniusChatComposerProps = {
  input: string
  onChange: (value: string) => void
  onSend: () => void
  placeholder?: string
  chips?: GeniusChatComposerChip[]
  showChips?: boolean
  disabled?: boolean
}

export function GeniusChatComposer({
  input,
  onChange,
  onSend,
  placeholder = 'Descreva os dados que você possui',
  chips = DEFAULT_CHIPS,
  showChips = false,
  disabled = false,
}: GeniusChatComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canSend = !disabled && input.trim().length > 0

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (canSend) onSend()
    }
  }

  function handleChipClick(chip: GeniusChatComposerChip) {
    chip.onClick?.()
    textareaRef.current?.focus()
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          // mockup: apenas abre, não processa
          e.target.value = ''
        }}
      />

      {/* Composer box */}
      <div className={`flex items-center gap-2 w-full rounded-full border border-border bg-background shadow-sm px-4 transition-shadow ${disabled ? 'opacity-60' : 'focus-within:shadow-md'}`}>
        {/* Plus icon (left) — abre file picker */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors disabled:cursor-not-allowed disabled:hover:text-muted-foreground"
          aria-label="Anexar arquivo"
        >
          <Plus size={20} strokeWidth={3} />
        </button>

        {/* Textarea */}
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

        {/* Send button (right) */}
        <button
          onClick={onSend}
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

      {/* Suggestion chips */}
      {showChips && chips.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center pt-1">
          {chips.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => {
                fileInputRef.current?.click()
                handleChipClick(chip)
              }}
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
