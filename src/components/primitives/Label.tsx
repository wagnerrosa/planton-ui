import { cn } from '@/lib/utils'

type LabelProps = {
  children: React.ReactNode
  className?: string
}

export function Label({ children, className }: LabelProps) {
  return (
    <span
      className={cn(
        'font-mono text-[0.75rem] uppercase tracking-[0.05em] text-planton-accent',
        className,
      )}
    >
      {children}
    </span>
  )
}
