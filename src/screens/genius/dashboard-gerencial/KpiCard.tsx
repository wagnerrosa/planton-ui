import type { LucideIcon } from 'lucide-react'

export function KpiCard({
  label,
  value,
  sublabel,
  icon: Icon,
  accent,
  onClick,
}: {
  label: string
  value: string | number
  sublabel?: string
  icon?: LucideIcon
  accent?: 'accent' | 'warning' | 'destructive' | 'info' | 'muted'
  onClick?: () => void
}) {
  const accentClass =
    accent === 'accent'
      ? 'text-planton-accent'
      : accent === 'warning'
        ? 'text-warning'
        : accent === 'destructive'
          ? 'text-destructive'
          : accent === 'info'
            ? 'text-info'
            : 'text-foreground'

  const Tag = onClick ? 'button' : 'div'

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`flex flex-col gap-1 border border-border bg-card px-4 py-3.5 text-left transition-colors ${
        onClick ? 'hover:bg-muted/50 cursor-pointer' : ''
      }`}
    >
      <span className="flex items-center gap-1.5 text-[10px] font-sans font-semibold uppercase tracking-wider text-muted-foreground">
        {Icon && <Icon size={12} />}
        {label}
      </span>
      <span className={`font-heading text-2xl font-semibold leading-none ${accentClass}`}>
        {value}
      </span>
      {sublabel && <span className="text-[11px] font-sans text-muted-foreground">{sublabel}</span>}
    </Tag>
  )
}
