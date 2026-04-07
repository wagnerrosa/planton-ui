import { Body } from '@/components/primitives/Body'

export function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="space-y-0.5">
      <Body size="sm" className="text-muted-foreground uppercase tracking-wider">{label}</Body>
      <Body size="sm">{value}</Body>
    </div>
  )
}
