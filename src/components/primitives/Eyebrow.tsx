import { cn } from '@/lib/utils'

type EyebrowProps = {
  children: React.ReactNode
  className?: string
}

export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <span
      className={cn(
        'font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-planton-accent',
        className,
      )}
    >
      {children}
    </span>
  )
}
