import { useEffect, useRef } from 'react'
import { MessageCircle } from 'lucide-react'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import type { Message, QuickPrompt } from './types'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'
import { TutorAvatar } from './TutorAvatar'

const WHATSAPP_NUMBER = '5511999999999'

function buildWhatsAppUrl(messages: Message[]) {
  const lastMessages = messages.slice(-6)
  const summary = lastMessages
    .map((m) => `${m.role === 'user' ? 'Eu' : 'Tutor'}: ${m.blocks.map((b) => ('content' in b ? b.content : '')).join(' ')}`)
    .join('\n')

  const text = summary
    ? `Oi! Quero continuar a conversa do Tutor Planton.\n\nResumo:\n${summary}`
    : 'Oi! Quero conversar com o Tutor Planton pelo WhatsApp.'

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}

type MessagesListProps = {
  messages: Message[]
  isTyping: boolean
  quickPrompts: QuickPrompt[]
  onQuickPrompt: (prompt: string) => void
}

export function MessagesList({ messages, isTyping, quickPrompts, onQuickPrompt }: MessagesListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const isEmpty = messages.length === 0

  return (
    <ScrollArea className="flex-1">
      <div className="flex flex-col gap-4 p-5">
        {isEmpty ? (
          <div className="flex flex-col items-center gap-6 py-8">
            <TutorAvatar size="lg" />
            <div className="text-center">
              <p className="font-heading text-sm font-medium text-foreground">Ola! Sou o Tutor Planton</p>
              <p className="mt-1 text-xs text-muted-foreground">Como posso te ajudar hoje?</p>
            </div>
            <div className="flex w-full flex-col gap-2">
              {quickPrompts.map((qp) => (
                <button
                  key={qp.prompt}
                  type="button"
                  onClick={() => onQuickPrompt(qp.prompt)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-foreground backdrop-blur-sm transition-colors hover:border-planton-accent/40 hover:bg-planton-accent/10"
                >
                  {qp.label}
                </button>
              ))}
            </div>

            <div className="mt-2 flex flex-col items-center gap-1">
              <a
                href={buildWhatsAppUrl(messages)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-xs text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
              >
                <MessageCircle size={14} />
                Continuar pelo WhatsApp
              </a>
              <span className="text-[0.625rem] text-muted-foreground/60">Leve essa conversa com você</span>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isTyping && <TypingIndicator />}
            {!isTyping && messages.length >= 2 && (
              <div className="flex justify-center pt-2">
                <a
                  href={buildWhatsAppUrl(messages)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[0.625rem] text-muted-foreground transition-colors hover:border-planton-accent/30 hover:text-foreground"
                >
                  <MessageCircle size={12} />
                  Continuar pelo WhatsApp
                </a>
              </div>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  )
}
