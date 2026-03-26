import { cn } from '@/lib/utils'
import type { Message, QuickPrompt } from './types'
import { TutorHeader } from './TutorHeader'
import { MessagesList } from './MessagesList'
import { InputArea } from './InputArea'

type TutorPanelProps = {
  open: boolean
  messages: Message[]
  isTyping: boolean
  quickPrompts: QuickPrompt[]
  onClose: () => void
  onSend: (text: string) => void
  onQuickPrompt: (prompt: string) => void
}

export function TutorPanel({
  open,
  messages,
  isTyping,
  quickPrompts,
  onClose,
  onSend,
  onQuickPrompt,
}: TutorPanelProps) {
  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-[60] flex h-[min(580px,calc(100dvh-4rem))] w-[380px] flex-col overflow-hidden',
        'rounded-2xl border border-white/15 bg-background/60 shadow-2xl shadow-black/20 backdrop-blur-2xl backdrop-saturate-150',
        'transition-all duration-300 ease-[var(--ease-sweep)]',
        'max-md:inset-x-4 max-md:bottom-6 max-md:right-auto max-md:w-auto',
        open
          ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
          : 'pointer-events-none translate-y-4 scale-95 opacity-0',
      )}
    >
      <TutorHeader onClose={onClose} />
      <MessagesList
        messages={messages}
        isTyping={isTyping}
        quickPrompts={quickPrompts}
        onQuickPrompt={onQuickPrompt}
      />
      <InputArea onSend={onSend} disabled={isTyping} />
    </div>
  )
}
