import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
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
  const isMobile = useIsMobile()

  return (
    <div
      className={cn(
        'fixed z-[60] flex flex-col overflow-hidden',
        'transition-all duration-300 ease-[var(--ease-sweep)]',
        isMobile
          ? 'inset-0 bg-background rounded-none'
          : 'bottom-6 right-6 h-[min(580px,calc(100dvh-4rem))] w-[380px] rounded-2xl border border-white/15 bg-background/60 shadow-2xl shadow-black/20 backdrop-blur-2xl backdrop-saturate-150',
        open
          ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
          : 'pointer-events-none translate-y-4 scale-95 opacity-0',
      )}
    >
      <TutorHeader onClose={onClose} isMobile={isMobile} />
      <MessagesList
        messages={messages}
        isTyping={isTyping}
        quickPrompts={quickPrompts}
        onQuickPrompt={onQuickPrompt}
      />
      <InputArea onSend={onSend} disabled={isTyping} isMobile={isMobile} />
    </div>
  )
}
