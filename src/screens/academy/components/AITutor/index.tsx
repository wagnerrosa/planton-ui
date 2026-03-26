'use client'

import { useState, useCallback, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import type { Message } from './types'
import { QUICK_PROMPTS, getMockResponse } from './mock-data'
import { FloatingButton } from './FloatingButton'
import { TutorPanel } from './TutorPanel'

/** Rotas onde o tutor deve aparecer (prefixos). */
const ALLOWED_PREFIXES = ['/home', '/trilhas', '/trail/', '/content/']

let msgId = 0
function nextId() {
  return `msg-${++msgId}`
}

export function AITutor() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)

  const handleSend = useCallback((text: string) => {
    const userMsg: Message = {
      id: nextId(),
      role: 'user',
      blocks: [{ type: 'text', content: text }],
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])
    setIsTyping(true)

    // Simula resposta da IA com delay
    setTimeout(() => {
      const aiMsg: Message = {
        id: nextId(),
        role: 'assistant',
        blocks: getMockResponse(text),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMsg])
      setIsTyping(false)
    }, 1200)
  }, [])

  const handleQuickPrompt = useCallback((prompt: string) => {
    handleSend(prompt)
  }, [handleSend])

  // Verifica se deve renderizar com base na rota — DEPOIS de todos os hooks
  const segments = pathname.split('/design-system/screens/academy').pop() ?? pathname
  const shouldShow = useMemo(
    () => ALLOWED_PREFIXES.some((prefix) => segments.startsWith(prefix)),
    [segments],
  )

  if (!shouldShow) return null

  return (
    <>
      <TutorPanel
        open={open}
        messages={messages}
        isTyping={isTyping}
        quickPrompts={QUICK_PROMPTS}
        onClose={() => setOpen(false)}
        onSend={handleSend}
        onQuickPrompt={handleQuickPrompt}
      />
      <FloatingButton open={open} onClick={() => setOpen((o) => !o)} />
    </>
  )
}
