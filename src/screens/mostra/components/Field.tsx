import { Body } from '@/components/primitives/Body'

export function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="space-y-0.5">
      <span className="text-xs text-muted-foreground uppercase tracking-wider font-sans">{label}</span>
      <Body size="sm">{value}</Body>
    </div>
  )
}
