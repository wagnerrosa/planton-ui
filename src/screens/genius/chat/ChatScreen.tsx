'use client'

import { useState, useRef, useEffect } from 'react'
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from 'lucide-react'
import { GeniusNavbarSync } from '@/components/navigation/GeniusNavbarSync'
import { GeniusChatComposer } from '@/components/genius/GeniusChatComposer'
import { InventoryDataGrid } from '@/components/genius/InventoryDataGrid'
import { CATEGORIES, DEFAULT_CATEGORY_ID, findCategory, getCategoryWorstStatus, getSchemaWorstStatus, type CellStatus, type ChatMessage } from './mock-data'

const STATUS_DOT_CLASS: Record<CellStatus, string> = {
  error: 'bg-destructive',
  warning: 'bg-warning',
}

const STATUS_BORDER_CLASS: Record<CellStatus, string> = {
  error: 'border-destructive',
  warning: 'border-warning',
}

type ViewMode = 'empty' | 'chat' | 'split'

const INVENTORY_PATTERN =
  /\b(\d+[\.,]?\d*)\s*(kg|ton|t\b|tco2|tco2e|kwh|mwh|gwh|litros?|m³|m3|galões?|km|milhas?)\b/i

function detectsInventoryData(text: string): boolean {
  return INVENTORY_PATTERN.test(text)
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function buildInitialChats(): Record<string, ChatMessage[]> {
  return Object.fromEntries(CATEGORIES.map((c) => [c.id, c.initialChat]))
}

function buildInitialSchemas(): Record<string, string> {
  return Object.fromEntries(CATEGORIES.map((c) => [c.id, c.schemas[0].id]))
}

export function ChatScreen() {
  const [input, setInput] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('empty')
  const [activeCategoryId, setActiveCategoryId] = useState(DEFAULT_CATEGORY_ID)
  const [activeSchemaByCategory, setActiveSchemaByCategory] = useState<Record<string, string>>(buildInitialSchemas)
  const [chatsByCategory, setChatsByCategory] = useState<Record<string, ChatMessage[]>>(buildInitialChats)
  const [categoriesOpen, setCategoriesOpen] = useState(true)
  const [chatOpen, setChatOpen] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  const activeCategory = findCategory(activeCategoryId)
  const activeSchemaId = activeSchemaByCategory[activeCategoryId] ?? activeCategory.schemas[0].id
  const activeSchema = activeCategory.schemas.find((s) => s.id === activeSchemaId) ?? activeCategory.schemas[0]
  const activeChat = chatsByCategory[activeCategoryId] ?? []

  useEffect(() => {
    if (activeChat.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [activeChat])

  function handleSend() {
    const text = input.trim()
    if (!text) return

    const isInventory = detectsInventoryData(text)
    const now = new Date()

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      hasInventoryData: isInventory,
      timestamp: now,
    }
    const assistantMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: isInventory
        ? `Identifiquei dados de ${activeCategory.label.toLowerCase()} na sua mensagem. Adicionei à guia "${activeSchema.label}". Deseja ajustar algum valor?`
        : `Envie dados de ${activeCategory.label.toLowerCase()} — por exemplo, consumos, quantidades ou faturas relacionados a essa categoria.`,
      timestamp: new Date(now.getTime() + 500),
    }

    setChatsByCategory((prev) => ({
      ...prev,
      [activeCategoryId]: [...(prev[activeCategoryId] ?? []), userMsg, assistantMsg],
    }))
    setInput('')

    if (isInventory) {
      setViewMode('split')
    } else if (viewMode === 'empty') {
      setViewMode('chat')
    }
  }

  function handleSelectCategory(id: string) {
    setActiveCategoryId(id)
    if (viewMode === 'empty') setViewMode('split')
  }

  function handleSelectSchema(id: string) {
    setActiveSchemaByCategory((prev) => ({ ...prev, [activeCategoryId]: id }))
  }

  // ── Estado vazio ──────────────────────────────────────────────
  if (viewMode === 'empty') {
    return (
      <>
        <GeniusNavbarSync breadcrumbs={[]} />
        <div className="flex flex-col items-center justify-center h-full px-8 gap-10">
          <div className="flex flex-col items-center gap-4">
            <img
              src="/logos_planton/planton_square_inside.svg"
              alt="Planton"
              className="h-14 w-auto"
            />
            <p className="text-planton-forest dark:text-foreground text-4xl font-heading font-normal leading-[1.2] text-center max-w-2xl">
              Envie planilhas, relatórios ou<br />
              informações da sua operação para<br />
              começarmos o inventário de emissões.
            </p>
          </div>
          <div className="w-full max-w-3xl">
            <GeniusChatComposer
              input={input}
              onChange={setInput}
              onSend={handleSend}
              placeholder="Descreva os dados que você possui ou anexe os documentos."
              showChips
            />
          </div>
        </div>
      </>
    )
  }

  // ── Estado chat (sem tabela ainda, só conversa) ──────────────
  if (viewMode === 'chat') {
    return (
      <>
        <GeniusNavbarSync breadcrumbs={[]} />
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto px-6 py-8">
            <div className="max-w-3xl mx-auto flex flex-col gap-4">
              {activeChat.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 text-sm font-sans leading-relaxed rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-muted text-foreground border border-border'
                        : 'text-foreground'
                    }`}
                  >
                    {msg.content}
                    <span className={`block text-[10px] text-muted-foreground/60 mt-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          </div>
          <div className="shrink-0 px-6 pb-6">
            <div className="max-w-3xl mx-auto">
              <GeniusChatComposer
                input={input}
                onChange={setInput}
                onSend={handleSend}
                placeholder="Continue descrevendo..."
              />
            </div>
          </div>
        </div>
      </>
    )
  }

  // ── Estado split (canvas com categorias + tabela + chat + guias) ──
  return (
    <div className="flex flex-col h-full">
      <GeniusNavbarSync breadcrumbs={[]} />
      <div className="flex flex-1 overflow-hidden bg-muted px-6 py-8 dark:bg-muted/60">
        <div className="flex flex-col flex-1 bg-background border border-border rounded-2xl shadow-sm overflow-hidden genius-enter-canvas">

          {/* Header da janela */}
          <div className="flex items-center justify-between px-4 h-12 border-b border-border shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <activeCategory.icon size={16} className="text-muted-foreground shrink-0" />
              <h2 className="text-sm font-semibold text-foreground font-sans truncate">
                {activeCategory.label}
              </h2>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                · {activeSchema.label}
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setCategoriesOpen((v) => !v)}
                className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                aria-label={categoriesOpen ? 'Recolher categorias' : 'Expandir categorias'}
                title={categoriesOpen ? 'Recolher categorias' : 'Expandir categorias'}
              >
                {categoriesOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
              </button>
              <button
                onClick={() => setChatOpen((v) => !v)}
                className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                aria-label={chatOpen ? 'Recolher chat' : 'Expandir chat'}
                title={chatOpen ? 'Recolher chat' : 'Expandir chat'}
              >
                {chatOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
              </button>
            </div>
          </div>

          {/* Corpo: categorias + tabela + chat */}
          <div className="flex flex-1 overflow-hidden">

            {/* Sidebar categorias */}
            <div className={`${categoriesOpen ? 'w-56' : 'w-12'} shrink-0 border-r border-border overflow-y-auto overflow-x-hidden py-2 bg-muted/20 transition-[width] duration-200 genius-enter-sidebar-left`}>
              {categoriesOpen && (
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                  Categorias
                </div>
              )}
              <ul className="flex flex-col">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon
                  const isActive = cat.id === activeCategoryId
                  const worst = getCategoryWorstStatus(cat)
                  const borderClass = isActive
                    ? 'border-planton-accent'
                    : worst
                      ? STATUS_BORDER_CLASS[worst]
                      : 'border-transparent'
                  return (
                    <li key={cat.id}>
                      <button
                        onClick={() => handleSelectCategory(cat.id)}
                        title={!categoriesOpen ? cat.label : undefined}
                        className={`w-full flex items-center ${categoriesOpen ? 'gap-2.5 px-3 justify-start' : 'justify-center px-0'} py-2 text-xs font-sans transition-colors border-l-2 ${borderClass} ${
                          isActive
                            ? 'bg-background text-foreground font-medium'
                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                        }`}
                      >
                        <span className="relative shrink-0">
                          <Icon size={15} />
                          {worst && (
                            <span
                              className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${STATUS_DOT_CLASS[worst]} ring-1 ring-background`}
                            />
                          )}
                        </span>
                        {categoriesOpen && <span className="truncate text-left">{cat.label}</span>}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Centro: tabela + rodapé guias */}
            <div className="flex flex-col flex-1 overflow-hidden genius-enter-grid">
              <div className="flex-1 min-h-0">
                <InventoryDataGrid columns={activeSchema.columns} rows={activeSchema.rows} />
              </div>

              {/* Rodapé guias estilo Excel */}
              <div className="flex items-stretch h-9 border-t border-border bg-muted/30 shrink-0 overflow-x-auto">
                {activeCategory.schemas.map((schema) => {
                  const isActive = schema.id === activeSchemaId
                  const worst = getSchemaWorstStatus(schema)
                  return (
                    <button
                      key={schema.id}
                      onClick={() => handleSelectSchema(schema.id)}
                      className={`px-4 text-xs font-sans whitespace-nowrap transition-colors border-r border-border flex items-center gap-2 ${
                        isActive
                          ? 'bg-background text-foreground font-medium border-t-2 border-t-planton-accent -mt-px'
                          : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                      }`}
                    >
                      {worst && (
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_DOT_CLASS[worst]}`} />
                      )}
                      {schema.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Sidebar chat */}
            {chatOpen && (
              <div className="w-[360px] shrink-0 border-l border-border relative overflow-hidden flex flex-col genius-enter-sidebar-right">
                <div className="px-4 py-3 border-b border-border shrink-0">
                  <h3 className="text-xs font-semibold text-foreground font-sans">
                    Envie dados de {activeCategory.label.toLowerCase()}
                  </h3>
                  <p className="text-[10px] text-muted-foreground mt-1 leading-snug">{activeCategory.hint}</p>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pt-4 pb-28">
                  <div className="flex flex-col gap-3">
                    {activeChat.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[90%] px-3 py-2.5 text-xs font-sans leading-relaxed rounded-2xl ${
                            msg.role === 'user'
                              ? 'bg-muted text-foreground border border-border'
                              : 'text-foreground'
                          }`}
                        >
                          {msg.hasInventoryData && msg.role === 'user' && (
                            <span className="flex items-center gap-1 text-[10px] text-planton-accent font-medium mb-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-planton-accent shrink-0" />
                              Dados de emissão detectados
                            </span>
                          )}
                          {msg.content}
                          <span className={`block text-[10px] text-muted-foreground/60 mt-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                            {formatTime(msg.timestamp)}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div ref={bottomRef} />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 z-10">
                  <div className="h-8 bg-gradient-to-t from-background to-transparent" />
                  <div className="bg-background px-3 pb-3">
                    <GeniusChatComposer
                      input={input}
                      onChange={setInput}
                      onSend={handleSend}
                      placeholder="Continue descrevendo..."
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
