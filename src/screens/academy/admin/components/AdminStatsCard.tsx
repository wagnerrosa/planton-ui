import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

type AdminStatsCardProps = {
  value: string
  label: string
  change: string
  period: string
  icon?: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
}

const trendConfig = {
  up: { icon: TrendingUp, color: 'text-emerald-600 dark:text-emerald-400' },
  down: { icon: TrendingDown, color: 'text-destructive' },
  neutral: { icon: Minus, color: 'text-planton-muted' },
}

export function AdminStatsCard({ value, label, change, period, icon, trend = 'neutral' }: AdminStatsCardProps) {
  const { icon: TrendIcon, color } = trendConfig[trend]

  return (
    <div className="flex flex-col gap-2 border-r border-b border-border p-6">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-[0.12em] text-planton-muted">{label}</span>
        {icon && <span className="text-planton-muted">{icon}</span>}
      </div>
      <span className="font-heading text-3xl font-bold text-foreground">{value}</span>
      <div className="flex items-center gap-1.5">
        <TrendIcon size={13} className={color} />
        <span className={cn('text-sm font-medium', color)}>{change}</span>
        <span className="text-xs text-planton-muted">{period}</span>
      </div>
    </div>
  )
}
