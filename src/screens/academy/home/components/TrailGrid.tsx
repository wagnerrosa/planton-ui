import { TrailCard } from './TrailCard'
import type { Trail } from '../mock-data'

type TrailGridProps = {
  trails: Trail[]
}

export function TrailGrid({ trails }: TrailGridProps) {
  if (trails.length === 0) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {trails.map((t) => (
        <TrailCard
          key={t.id}
          trail={{
            id: t.id,
            title: t.title,
            description: t.description,
            contentsCount: t.totalItems,
            duration: t.totalDuration,
            progress: t.progress,
            href: `/design-system/screens/academy/trail/${t.id}`,
          }}
        />
      ))}
    </div>
  )
}
