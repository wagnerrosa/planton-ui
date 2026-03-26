import { useEffect, useRef } from 'react'
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
              <p className="font-heading text-sm font-medium text-foreground">Olá! Sou o Tutor Planton</p>
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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Me chame no WhatsApp
              </a>
              <span className="text-[0.625rem] text-muted-foreground/60">Você recebe uma mensagem para começar a conversa</span>
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
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
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
