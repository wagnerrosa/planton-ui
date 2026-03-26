export type MessageRole = 'user' | 'assistant'

export type RichBlock =
  | { type: 'text'; content: string }
  | { type: 'list'; items: string[] }
  | { type: 'highlight'; content: string }

export type Message = {
  id: string
  role: MessageRole
  blocks: RichBlock[]
  timestamp: Date
}

export type QuickPrompt = {
  label: string
  prompt: string
}
