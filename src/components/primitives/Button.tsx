'use client'

import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'primary-dark' | 'secondary' | 'outline' | 'ghost' | 'icon'
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

/** Variantes com efeito sweep (fundo desliza no hover) */
const SWEEP_VARIANTS: ButtonVariant[] = ['primary', 'primary-dark', 'icon']

const variantClasses: Record<ButtonVariant, string> = {
  'primary':    'border-planton-accent text-planton-accent hover:text-button-on-accent',
  'primary-dark': 'border-planton-accent text-planton-accent hover:text-button-on-accent',
  'secondary':  'border-planton-accent bg-planton-accent text-button-on-accent hover:bg-planton-accent/80 hover:border-planton-accent/80',
  'outline':    'border-border text-foreground hover:border-planton-accent hover:text-planton-accent',
  'ghost':      'border-transparent text-foreground hover:text-planton-accent',
  'icon':       'border-planton-accent w-10 h-10 p-0 justify-center text-planton-accent hover:text-button-on-accent',
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
  const hasSweep = SWEEP_VARIANTS.includes(variant)

  const baseClasses = cn(
    'relative inline-flex items-center gap-2 overflow-hidden border rounded-none',
    'font-sans font-medium tracking-[0.02em]',
    'transition-colors duration-200 ease-out',
    'disabled:opacity-40 disabled:cursor-not-allowed',
    '[&_svg]:shrink-0',
    variantClasses[variant],
    variant !== 'icon' && sizeClasses[size],
    className,
  )

  const innerContent = hasSweep ? (
    <>
      <span
        aria-hidden
        className="absolute inset-0 -translate-x-full transition-transform ease-[cubic-bezier(0.16,1,0.3,1)] duration-500 group-hover:translate-x-0 bg-planton-accent"
      />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </>
  ) : (
    <>{children}</>
  )

  if (href) {
    return (
      <a href={href} className={cn(hasSweep && 'group', baseClasses)}>
        {innerContent}
      </a>
    )
  }

  return (
    <button onClick={onClick} disabled={disabled} className={cn(hasSweep && 'group', baseClasses)}>
      {innerContent}
    </button>
  )
}
