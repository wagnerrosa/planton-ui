'use client'

import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'primary-dark' | 'icon'
type ButtonSize = 'default' | 'sm'

type ButtonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  children: React.ReactNode
  onClick?: () => void
  href?: string
  disabled?: boolean
  className?: string
}

const variantClasses: Record<ButtonVariant, string> = {
  'primary':      'border-planton-accent text-planton-accent hover:text-planton-white',
  'primary-dark': 'border-planton-accent text-planton-accent hover:text-planton-white',
  'icon':         'border-planton-accent w-10 h-10 p-0 justify-center text-planton-accent hover:text-planton-white',
}

const sizeClasses: Record<ButtonSize, string> = {
  default: 'px-6 py-3 text-sm',
  sm:      'px-4 py-2 text-xs',
}

export function Button({
  variant = 'primary',
  size = 'default',
  children,
  onClick,
  href,
  disabled,
  className,
}: ButtonProps) {
  const baseClasses = cn(
    'relative inline-flex items-center overflow-hidden border rounded-none',
    'font-sans font-medium tracking-[0.02em]',
    'transition-[color] duration-[300ms] ease-out',
    'disabled:opacity-40 disabled:cursor-not-allowed',
    variantClasses[variant],
    variant !== 'icon' && sizeClasses[size],
    className,
  )

  const sweepBg = 'bg-planton-accent'

  const content = (
    <>
      <span
        aria-hidden
        className={cn(
          'absolute inset-0 -translate-x-full transition-transform ease-[cubic-bezier(0.16,1,0.3,1)] duration-500 group-hover:translate-x-0',
          sweepBg,
        )}
      />
      <span className="relative z-10">{children}</span>
    </>
  )

  if (href) {
    return (
      <a href={href} className={cn('group', baseClasses)}>
        {content}
      </a>
    )
  }

  return (
    <button onClick={onClick} disabled={disabled} className={cn('group', baseClasses)}>
      {content}
    </button>
  )
}
