import { useState, useRef } from 'react'
import { Send } from 'lucide-react'
import { cn } from '@/lib/utils'

type InputAreaProps = {
  onSend: (text: string) => void
  disabled?: boolean
  isMobile?: boolean
}

export function InputArea({ onSend, disabled, isMobile }: InputAreaProps) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    inputRef.current?.focus()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-white/10 px-4 py-3"
      style={isMobile ? { paddingBottom: `calc(0.75rem + env(safe-area-inset-bottom))` } : undefined}
    >
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Como posso te ajudar?"
          disabled={disabled}
          className={cn(
            'flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground',
            'outline-none disabled:cursor-not-allowed disabled:opacity-50',
          )}
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          aria-label="Enviar mensagem"
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-200',
            value.trim()
              ? 'bg-planton-accent text-planton-dark hover:bg-planton-accent/80'
              : 'text-muted-foreground',
          )}
        >
          <Send size={15} />
        </button>
      </div>
    </form>
  )
}
