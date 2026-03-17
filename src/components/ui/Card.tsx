import { cn } from '@/lib/utils'

type CardProps = {
  index?: string
  headline: string
  description?: string
  ctaLabel?: string
  href?: string
  surface?: 'white' | 'forest'
  className?: string
}

export function Card({
  index,
  headline,
  description,
  ctaLabel,
  href,
  surface = 'white',
  className,
}: CardProps) {
  const isDark = surface === 'forest'

  return (
    <div
      className={cn(
        'group relative overflow-hidden border-b border-r border-[var(--border-light)] min-h-[260px]',
        isDark ? 'bg-surface-forest text-planton-cream [--border-light:var(--border-dark)]' : 'bg-white text-planton-forest',
        className,
      )}
    >
      {/* Indicator bar */}
      <span
        aria-hidden
        className="absolute left-0 top-0 w-[3px] h-0 bg-planton-accent transition-[height] ease-[cubic-bezier(0.16,1,0.3,1)] duration-500 group-hover:h-full"
      />

      <div className="relative z-10 p-8 md:p-12 flex flex-col justify-between h-full min-h-[260px]">
        <div className="flex flex-col gap-3">
          {index && (
            <span className="font-mono text-[0.75rem] text-planton-accent">{index}</span>
          )}
          <h3 className={cn('font-heading text-xl leading-[1.1] tracking-[-0.02em]', isDark ? 'text-planton-cream' : 'text-planton-forest')}>
            {headline}
          </h3>
          {description && (
            <p className={cn('font-sans text-sm leading-[1.65]', isDark ? 'text-planton-cream/80' : 'text-planton-muted')}>
              {description}
            </p>
          )}
        </div>
        {ctaLabel && (
          <a
            href={href ?? '#'}
            className="mt-6 font-mono text-xs uppercase tracking-[0.05em] text-planton-accent"
          >
            {ctaLabel} →
          </a>
        )}
      </div>
    </div>
  )
}
