import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Heading } from '@/components/primitives/Heading'
import { Progress } from '@/components/shadcn/progress'
import type { Trail } from '../mock-data'

type Props = {
  trails: Trail[]
}

export function ContinueTrailsCard({ trails }: Props) {
  const active = trails
    .filter((t) => t.status !== 'concluida' && t.progress > 0)
    .sort((a, b) => b.progress - a.progress)

  if (active.length === 0) return null

  return (
    <div className="flex flex-col gap-5">
      <Heading as="h2" size="heading-md">Trilhas em andamento</Heading>

      <div className="flex flex-col gap-[14px] overflow-y-auto pr-1" style={{ maxHeight: '210px' }}>
        {active.map((trail) => (
          <div key={trail.id} className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <Link
                href={`/design-system/screens/academy/trail/${trail.id}`}
                className="flex items-center gap-1 group text-sm text-planton-forest leading-tight hover:text-planton-accent transition-colors"
              >
                {trail.title}
                <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </Link>
              <span className="font-mono text-xs text-planton-muted tabular-nums shrink-0">
                {trail.progress}%
              </span>
            </div>
            <Progress value={trail.progress} className="h-1 bg-planton-accent/10" />
          </div>
        ))}
      </div>
    </div>
  )
}
