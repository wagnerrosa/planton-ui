'use client'

import { useState, useCallback } from 'react'
import { Eyebrow } from '@/components/primitives/Eyebrow'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { CopyPath } from '@/components/ui/CopyButton'
import { FloatingButton } from '@/screens/academy/components/AITutor/FloatingButton'
import { TutorPanel } from '@/screens/academy/components/AITutor/TutorPanel'
import { QUICK_PROMPTS, getMockResponse } from '@/screens/academy/components/AITutor/mock-data'
import type { Message } from '@/screens/academy/components/AITutor/types'

let msgId = 0
function nextId() { return `msg-${++msgId}` }

export default function AITutorPatternPage() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)

  const handleSend = useCallback((text: string) => {
    const userMsg: Message = { id: nextId(), role: 'user', blocks: [{ type: 'text', content: text }], timestamp: new Date() }
    setMessages((prev) => [...prev, userMsg])
    setIsTyping(true)
    setTimeout(() => {
      const aiMsg: Message = { id: nextId(), role: 'assistant', blocks: getMockResponse(text), timestamp: new Date() }
      setMessages((prev) => [...prev, aiMsg])
      setIsTyping(false)
    }, 1200)
  }, [])

  return (
    <main className="min-h-screen bg-surface-default max-w-[1400px] mx-auto px-6 py-16 flex flex-col gap-12">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Eyebrow>Pattern — Academy</Eyebrow>
        <Heading as="h1" size="heading-xl">AI Tutor</Heading>
        <Body muted className="max-w-2xl">
          Assistente de IA flutuante integrado ao Academy. Aparece como botão pill glassmorphism no canto inferior direito e expande para um painel de chat. Disponível em rotas de conteúdo (/home, /trilhas, /trail/, /content/).
        </Body>
        <div className="mt-2">
          <CopyPath path="src/screens/academy/components/AITutor/index.tsx" />
        </div>
      </div>

      {/* Live demo */}
      <section className="flex flex-col gap-6">
        <span className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Demo ao vivo</span>
        <div className="border border-border p-6 bg-card min-h-[200px] relative flex items-center justify-center">
          <Body muted>O botão <strong className="text-foreground">Tutor IA</strong> aparece no canto inferior direito. Clique para abrir o painel de chat.</Body>
        </div>
      </section>

      {/* Anatomy */}
      <section className="flex flex-col gap-6">
        <span className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Anatomia</span>
        <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden border-t border-l border-border">
          {[
            {
              file: 'FloatingButton.tsx',
              desc: 'Botão pill fixo bottom-right. Glassmorphism: backdrop-blur-2xl + bg-background/60. Contém "Tutor IA" + separador + "Powered by Genius" + favicon. Hover: scale 1.02. Some quando painel está aberto.',
            },
            {
              file: 'TutorPanel.tsx',
              desc: 'Painel 380px × max-580px. Frosted glass com border-white/15. Animação sweep na abertura (scale 0.95→1.0, opacity 0→1, translateY 16px→0). Responsivo: inset-x-4 no mobile.',
            },
            {
              file: 'TutorHeader.tsx',
              desc: 'Barra superior com avatar (TutorAvatar lg), label "Tutor IA", separador vertical, logo "Powered by Genius" e botão X de fechar.',
            },
            {
              file: 'MessagesList.tsx',
              desc: 'ScrollArea com bolhas de mensagem, indicador de digitação, quick prompts no estado vazio e link para WhatsApp (resume as 6 últimas mensagens no link).',
            },
            {
              file: 'MessageBubble.tsx',
              desc: '3 tipos de bloco: text (parágrafo), list (bullets) e highlight (callout com destaque). Usuário: bg-planton-accent/10, alinhado à direita. Assistente: bg-card, alinhado à esquerda.',
            },
            {
              file: 'InputArea.tsx',
              desc: 'Input de texto + botão Send. Desabilitado durante digitação da IA. Enter para enviar, Shift+Enter para nova linha.',
            },
          ].map((item) => (
            <div key={item.file} className="border-r border-b border-border p-6 flex flex-col gap-2">
              <code className="font-mono text-xs text-planton-accent">{item.file}</code>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Routing logic */}
      <section className="flex flex-col gap-4">
        <span className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Lógica de roteamento</span>
        <div className="border border-border p-6 bg-card">
          <pre className="font-mono text-xs text-foreground/80 leading-relaxed overflow-auto">{`// index.tsx — rotas onde o tutor aparece
const ALLOWED_PREFIXES = ['/home', '/trilhas', '/trail/', '/content/']

// Extrai o segmento após /design-system/screens/academy
const segments = pathname.split('/design-system/screens/academy').pop() ?? pathname
const shouldShow = ALLOWED_PREFIXES.some((prefix) => segments.startsWith(prefix))

if (!shouldShow) return null`}</pre>
        </div>
        <Body size="sm" muted>
          Em produção, remover o split de design-system. O Tutor IA deve ser montado no layout da aplicação Academy, não em rotas individuais.
        </Body>
      </section>

      {/* Integration */}
      <section className="flex flex-col gap-4">
        <span className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Como integrar</span>
        <div className="border border-border p-6 bg-card">
          <pre className="font-mono text-xs text-foreground/80 leading-relaxed overflow-auto">{`// Montar no layout do Academy — renderiza automaticamente por pathname
import { AITutor } from '@/screens/academy/components/AITutor'

export default function AcademyLayout({ children }) {
  return (
    <>
      <AcademyNavbar />
      {children}
      <AITutor />
    </>
  )
}`}</pre>
        </div>
      </section>

      {/* Message types */}
      <section className="flex flex-col gap-4">
        <span className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Tipos de bloco de mensagem</span>
        <div className="border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground uppercase tracking-widest">Tipo</th>
                <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground uppercase tracking-widest">Estrutura</th>
                <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground uppercase tracking-widest">Visual</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['text', '{ type: "text", content: string }', 'Parágrafo de texto simples'],
                ['list', '{ type: "list", items: string[] }', 'Lista com bullets (•)'],
                ['highlight', '{ type: "highlight", content: string }', 'Callout com borda esquerda accent e fundo tinted'],
              ].map(([type, structure, visual]) => (
                <tr key={type} className="border-b border-border even:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs text-planton-accent">{type}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{structure}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{visual}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <TutorPanel
        open={open}
        messages={messages}
        isTyping={isTyping}
        quickPrompts={QUICK_PROMPTS}
        onClose={() => setOpen(false)}
        onSend={handleSend}
        onQuickPrompt={handleSend}
      />
      <FloatingButton open={open} onClick={() => setOpen((o) => !o)} />
    </main>
  )
}
