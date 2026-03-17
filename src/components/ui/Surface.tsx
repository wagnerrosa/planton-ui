import { cn } from '@/lib/utils'

type SurfaceVariant = 'white' | 'card' | 'forest' | 'dark'

type SurfaceProps = {
  variant: SurfaceVariant
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<SurfaceVariant, string> = {
  white:  'bg-surface-default text-planton-forest [--current-border:var(--border-light)]',
  card:   'bg-surface-card text-planton-forest [--current-border:var(--border-light)]',
  forest: 'bg-surface-forest text-planton-cream [--current-border:var(--border-dark)]',
  dark:   'bg-surface-dark text-planton-cream [--current-border:var(--border-dark)]',
}

export function Surface({ variant, children, className }: SurfaceProps) {
  return (
    <div className={cn(variantClasses[variant], className)}>
      {children}
    </div>
  )
}
