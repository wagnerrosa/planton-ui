'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

type CopyButtonProps = {
  value: string
  title?: string
}

export function CopyButton({ value, title = 'Copiar' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      onClick={handleCopy}
      className="shrink-0 p-1 text-planton-muted hover:text-planton-accent transition-colors"
      title={title}
    >
      {copied
        ? <Check size={13} className="text-planton-accent" />
        : <Copy size={13} />
      }
    </button>
  )
}

type CopyPathProps = {
  path: string
}

export function CopyPath({ path }: CopyPathProps) {
  return (
    <div className="flex items-center gap-2">
      <code className="font-mono text-xs text-planton-accent bg-planton-forest/10 px-2 py-1 flex-1 truncate">
        {path}
      </code>
      <CopyButton value={path} title="Copiar path" />
    </div>
  )
}
