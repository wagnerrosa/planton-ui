'use client'

import { useState, useRef, useEffect } from 'react'
import { Undo2, Redo2, Copy, Scissors, ClipboardPaste, Trash2, Search, X } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn/tooltip'
import type { GridSelectionInfo } from './InventoryDataGridImpl'

// Detecta Mac no client → glifo de atalho (⌘ vs Ctrl) nos tooltips.
// Client-only para evitar hydration mismatch; default Ctrl até montar.
function detectMac(): boolean {
  if (typeof navigator === 'undefined') return false
  const uaPlatform = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform
  const platform = uaPlatform || navigator.platform || ''
  return /Mac|iPhone|iPad/i.test(platform)
}

type ToolbarButtonProps = {
  icon: React.ComponentType<{ size?: number | string; className?: string }>
  label: string
  description: string
  shortcut?: string
  onClick?: () => void
  disabled?: boolean
}

function ToolbarButton({ icon: Icon, label, description, shortcut, onClick, disabled }: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          aria-label={label}
          className="flex items-center justify-center w-7 h-7 rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
        >
          <Icon size={14} />
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-[200px] px-2.5 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-sans font-medium text-popover-foreground">{label}</span>
          {shortcut && (
            <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px] font-mono text-muted-foreground leading-none">
              {shortcut}
            </kbd>
          )}
        </div>
        <p className="mt-1 text-[11px] font-sans text-muted-foreground leading-snug">{description}</p>
      </TooltipContent>
    </Tooltip>
  )
}

function Divider() {
  return <span className="w-px h-4 bg-border shrink-0" aria-hidden />
}

type Props = {
  selection: GridSelectionInfo
  canUndo?: boolean
  canRedo?: boolean
  onUndo?: () => void
  onRedo?: () => void
  onCopy?: () => void
  onCut?: () => void
  onPaste?: () => void
  onDelete?: () => void
  search?: string
  onSearchChange?: (value: string) => void
}

export function GridToolbar({
  selection,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  onCopy,
  onCut,
  onPaste,
  onDelete,
  search = '',
  onSearchChange,
}: Props) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [mod, setMod] = useState('Ctrl')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const hasSelection = selection.count > 0

  useEffect(() => {
    if (detectMac()) setMod('⌘')
  }, [])

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus()
  }, [searchOpen])

  function closeSearch() {
    setSearchOpen(false)
    onSearchChange?.('')
  }

  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex items-center gap-1 px-2 h-9 border-b border-border bg-muted/20 shrink-0">
        <ToolbarButton icon={Undo2} label="Desfazer" shortcut={`${mod}+Z`} description="Reverte a última alteração feita na tabela." onClick={onUndo} disabled={!canUndo} />
        <ToolbarButton icon={Redo2} label="Refazer" shortcut={`${mod}+Shift+Z`} description="Reaplica a alteração que foi desfeita." onClick={onRedo} disabled={!canRedo} />

        <Divider />

        <ToolbarButton icon={Copy} label="Copiar" shortcut={`${mod}+C`} description="Copia as células selecionadas para a área de transferência." onClick={onCopy} disabled={!hasSelection} />
        <ToolbarButton icon={Scissors} label="Recortar" shortcut={`${mod}+X`} description="Copia as células e limpa os valores de origem." onClick={onCut} disabled={!hasSelection} />
        <ToolbarButton icon={ClipboardPaste} label="Colar" shortcut={`${mod}+V`} description="Cola o conteúdo na célula ativa. Colunas fora do schema são ignoradas." onClick={onPaste} />

        <Divider />

        <ToolbarButton icon={Trash2} label="Limpar seleção" shortcut="Delete" description="Apaga os valores das células selecionadas. Linhas que ficarem vazias são removidas." onClick={onDelete} disabled={!hasSelection} />

        {/* Busca — empurrada para a direita */}
        <div className="ml-auto flex items-center">
          {searchOpen ? (
            <div className="flex items-center gap-1 px-2 h-7 rounded-md border border-border bg-background">
              <Search size={13} className="text-muted-foreground shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => onSearchChange?.(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Escape') closeSearch() }}
                placeholder="Buscar na tabela…"
                className="w-40 bg-transparent text-xs font-sans text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              />
              <button
                type="button"
                onClick={closeSearch}
                aria-label="Fechar busca"
                className="flex items-center justify-center w-4 h-4 rounded text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <ToolbarButton icon={Search} label="Buscar" shortcut={`${mod}+F`} description="Procura um valor em todas as células da aba." onClick={() => setSearchOpen(true)} />
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
