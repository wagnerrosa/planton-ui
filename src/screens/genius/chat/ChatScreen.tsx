'use client'

import { useState, useRef, useEffect } from 'react'
import { GeniusNavbarSync } from '@/components/navigation/GeniusNavbarSync'
import { GeniusChatComposer } from '@/components/genius/GeniusChatComposer'
import { InventoryDataGrid } from '@/components/genius/InventoryDataGrid'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  hasInventoryData?: boolean
  timestamp: Date
}

type ViewMode = 'empty' | 'chat' | 'split'

// Detecta se mensagem contém dados de inventário de emissões
const INVENTORY_PATTERN =
  /\b(\d+[\.,]?\d*)\s*(kg|ton|t\b|tco2|tco2e|kwh|mwh|gwh|litros?|m³|m3|galões?|km|milhas?)\b/i

function detectsInventoryData(text: string): boolean {
  return INVENTORY_PATTERN.test(text)
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('empty')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  function handleSend() {
    const text = input.trim()
    if (!text) return

    const isInventory = detectsInventoryData(text)

    const now = new Date()
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      hasInventoryData: isInventory,
      timestamp: now,
    }
    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: isInventory
        ? 'Identifiquei dados de emissões na sua mensagem. Organizei as informações na tabela ao lado. Deseja ajustar algum valor ou adicionar mais fontes de emissão?'
        : 'Para começarmos o inventário, envie mensagens com dados de consumo — por exemplo: "frota usou 12.450 litros de diesel", "consumo de 87.300 kWh em janeiro" ou "emitimos 33 tCO₂ no trimestre". Você também pode anexar planilhas ou PDFs pelo botão + ao lado do campo de texto.',
      timestamp: new Date(now.getTime() + 500),
    }

    setMessages((prev) => [...prev, userMsg, assistantMsg])
    setInput('')

    if (isInventory) {
      setViewMode('split')
    } else if (viewMode === 'empty') {
      setViewMode('chat')
    }
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

  // ── Estado split ──────────────────────────────────────────────
  if (viewMode === 'split') {
    return (
      <div className="flex flex-col h-full">
        <GeniusNavbarSync breadcrumbs={[]} />
        <div className="flex flex-1 overflow-hidden">
          {/* Tabela — 70% esquerda */}
          <div className="flex-[7] border-r border-border overflow-hidden">
            <div className="flex flex-col h-full">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-sm font-semibold text-foreground font-sans">Inventário de Emissões</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Dados extraídos automaticamente</p>
              </div>
              <div className="flex-1 min-h-0">
                <InventoryDataGrid />
              </div>
            </div>
          </div>

          {/* Chat — 30% direita */}
          <div className="flex-[3] relative overflow-hidden">
            <div className="absolute inset-0 overflow-y-auto px-4 pt-6 pb-28">
              <div className="flex flex-col gap-3">
                {messages.map((msg) => (
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

            {/* Gradiente + composer flutuante */}
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
        </div>
      </div>
    )
  }

  // ── Estado chat full ──────────────────────────────────────────
  return (
    <>
      <GeniusNavbarSync breadcrumbs={[]} />
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-2xl mx-auto flex flex-col gap-4">
            {messages.map((msg) => (
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

        <div className="bg-background px-4 py-4">
          <div className="max-w-2xl mx-auto">
            <GeniusChatComposer
              input={input}
              onChange={setInput}
              onSend={handleSend}
            />
          </div>
        </div>
      </div>
    </>
  )
}
