import { useEffect, useRef } from 'react'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import type { Message, QuickPrompt } from './types'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'
import { TutorAvatar } from './TutorAvatar'

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
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isTyping && <TypingIndicator />}
          </>
        )}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  )
}
