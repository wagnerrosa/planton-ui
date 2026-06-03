import { STATUS_META, type CombinationStatus } from './dashboard-data'

export function StatusPill({
  status,
  size = 'sm',
}: {
  status: CombinationStatus
  size?: 'sm' | 'xs'
}) {
  const meta = STATUS_META[status]
  const pad = size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-[11px]'
  return (
    <span
      className={`inline-flex items-center gap-1.5 border font-sans font-medium whitespace-nowrap ${pad} ${meta.cellClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${meta.dotClass}`} />
      {meta.label}
    </span>
  )
}
