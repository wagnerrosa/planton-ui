import Link from 'next/link'
import { ArrowRight, PlayCircle, Headphones, FileText, BookOpen } from 'lucide-react'
import type { ContentItem } from '../mock-data'

type Trail = {
  id: string
  title: string
  description?: string
  contentsCount: number
  duration: string
  progress?: number
  category?: string
  href: string
  contents?: ContentItem[]
}

type TrailCardProps = {
  trail: Trail
}

const typeIcon = {
  video: PlayCircle,
  podcast: Headphones,
  artigo: FileText,
  guia: BookOpen,
  trilha: BookOpen,
}

const fallbackImages: Record<string, string[]> = {
  artigo: ['/assets/MATA-ATLANTICA-BG.jpg', '/assets/SERRA-SUL-BG.jpg'],
  guia: ['/assets/PANTANAL-BG.jpg', '/assets/MATA-ATLANTICA-BG.jpg'],
  podcast: ['/assets/CAATINGA-BG.jpg', '/assets/SERRA-SUL-BG.jpg'],
  trilha: ['/assets/PANTANAL-BG.jpg'],
}

function getThumb(item: ContentItem): string {
  if (item.type === 'video' && item.thumbnailUrl) return item.thumbnailUrl
  const list = fallbackImages[item.type] ?? fallbackImages.artigo
  return list[item.id.charCodeAt(0) % list.length]
}

export function TrailCard({ trail }: TrailCardProps) {
  const { title, description, contentsCount, duration, progress, href, contents } = trail
  const thumbs = contents?.slice(0, 5) ?? []

  // Build metadata line: "5 conteúdos • 1h51min • 40% concluído"
  const metaParts = [
    `${contentsCount} conteúdo${contentsCount !== 1 ? 's' : ''}`,
    duration,
  ]
  if (progress !== undefined && progress > 0) {
    metaParts.push(`${progress}% concluído`)
  }

  return (
    <Link
      href={href}
      className="group relative flex flex-col gap-6 border border-border p-8 bg-card hover:bg-secondary/20 hover:shadow-md hover:scale-[1.01] transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Indicator bar — mesmo padrão do Card.tsx */}
      <span
        aria-hidden
        className="absolute left-0 top-0 w-[3px] h-0 bg-planton-accent transition-[height] ease-[cubic-bezier(0.16,1,0.3,1)] duration-500 group-hover:h-full"
      />

      {/* 1. Title + Description */}
      <div className="flex flex-col gap-2 flex-1">
        <h3 className="font-heading text-xl font-semibold leading-snug text-foreground line-clamp-2">
          {title}
        </h3>
        {description && (
          <p className="font-sans text-sm leading-relaxed text-planton-muted line-clamp-3">
            {description}
          </p>
        )}
      </div>

      {/* 2. Miniaturas dos conteúdos */}
      {thumbs.length > 0 && (
        <div className="flex gap-2">
          {thumbs.map((item) => {
            const Icon = typeIcon[item.type] ?? BookOpen
            return (
              <div key={item.id} className="relative w-12 h-12 rounded-sm overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getThumb(item)}
                  alt=""
                  className="w-full h-full object-cover brightness-75"
                  draggable={false}
                />
                <span className="absolute inset-0 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-white/90" />
                </span>
              </div>
            )
          })}
          {contentsCount > thumbs.length && (
            <div className="w-12 h-12 rounded-sm bg-secondary flex items-center justify-center shrink-0">
              <span className="font-mono text-[10px] text-planton-muted">+{contentsCount - thumbs.length}</span>
            </div>
          )}
        </div>
      )}

      {/* 3. Metadata */}
      <p className="font-mono text-xs text-planton-muted">
        {metaParts.join('  •  ')}
      </p>

      {/* 4. Progress bar */}
      {progress !== undefined && progress > 0 && (
        <div className="h-px w-full bg-planton-accent/15">
          <div
            className="h-full bg-planton-accent transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* 5. CTA */}
      <span className="inline-flex items-center gap-1 font-mono text-xs text-planton-accent group-hover:gap-2 transition-all duration-150">
        Ver trilha
        <ArrowRight className="h-3 w-3" />
      </span>
    </Link>
  )
}
