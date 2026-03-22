'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

type TopNotificationBarProps = {
  message: string
  variant?: 'default' | 'warning' | 'danger' | 'success' | 'accent'
  ctaLabel?: string
  onCtaClick?: () => void
  onClose?: () => void
  dismissible?: boolean
}

const variantStyles: Record<string, string> = {
  default: 'bg-card text-foreground border-b border-border',
  warning: 'bg-yellow-400 text-black',
  danger: 'bg-red-500 text-white',
  success: 'bg-emerald-500 text-white',
  accent: 'bg-planton-accent text-planton-forest',
}

export function TopNotificationBar({
  message,
  variant = 'default',
  ctaLabel,
  onCtaClick,
  onClose,
  dismissible = false,
}: TopNotificationBarProps) {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  function handleClose() {
    setVisible(false)
    onClose?.()
  }

  return (
    <div
      role="status"
      className={cn(
        'w-full sticky top-0 z-50 animate-in slide-in-from-top-2 fade-in duration-300',
        variantStyles[variant]
      )}
    >
      <div className="flex items-center justify-center gap-3 px-4 py-2 text-sm">
        <span>{message}</span>

        {ctaLabel && (
          <button
            onClick={onCtaClick}
            className="font-medium underline underline-offset-2 cursor-pointer"
          >
            {ctaLabel}
          </button>
        )}
        {dismissible && (
          <button
            onClick={handleClose}
            aria-label="Fechar notificação"
            className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
