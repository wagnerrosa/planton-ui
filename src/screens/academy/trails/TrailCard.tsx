import Link from 'next/link'
import { ArrowRight, PlayCircle, Headphones, FileText, BookOpen, Award } from 'lucide-react'
import type { ContentItem } from '../home/mock-data'

type TrailStatus = 'nao-iniciada' | 'em-andamento' | 'concluida' | 'em-breve'

type Trail = {
  id: string
  title: string
  description?: string
  contentsCount: number
  duration: string
  progress?: number
  status?: TrailStatus
  accentColor?: string
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

const statusLabel: Record<TrailStatus, string> = {
  'nao-iniciada': 'Não iniciada',
  'em-andamento': 'Em andamento',
  'concluida': 'Concluída',
  'em-breve': 'Em breve',
}

function getThumb(item: ContentItem): string {
  if (item.type === 'video' && item.thumbnailUrl) return item.thumbnailUrl
  const list = fallbackImages[item.type] ?? fallbackImages.artigo
  return list[item.id.charCodeAt(0) % list.length]
}

export function TrailCard({ trail }: TrailCardProps) {
  const { title, description, contentsCount, duration, progress, status, accentColor, href, contents } = trail
  const thumbs = contents?.slice(0, 5) ?? []
  const accent = accentColor ?? 'var(--color-planton-accent)'
  const isConcluida = status === 'concluida'

  return (
    <Link
      href={href}
      className="group relative flex flex-col bg-card border border-border overflow-hidden hover:border-border/80 transition-colors duration-200 cursor-pointer"
    >
      {/* Faixa de cor superior — identidade da trilha */}
      <div className="h-1 w-full" style={{ backgroundColor: accent }} />

      {/* Corpo do card */}
      <div className="flex flex-col gap-6 p-8">

        {/* 1. Meta topo: status + duração */}
        <div className="flex items-center justify-between">
          {status && (
            <span
              className="inline-flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.12em]"
              style={{ color: isConcluida ? accent : 'var(--color-planton-muted)' }}
            >
              {isConcluida && <Award className="h-3 w-3" />}
              {statusLabel[status]}
            </span>
          )}
          <span className="font-mono text-[0.625rem] text-planton-muted ml-auto">
            {duration}
          </span>
        </div>

        {/* 2. Título + descrição */}
        <div className="flex flex-col gap-2">
          <h3 className="font-heading text-2xl font-semibold leading-snug text-foreground line-clamp-2">
            {title}
          </h3>
          {description && (
            <p className="font-sans text-sm leading-relaxed text-planton-muted line-clamp-2">
              {description}
            </p>
          )}
        </div>

        {/* Divisor */}
        <div className="h-px w-full bg-border" />

        {/* 3. Thumbs — proporção 16/9 */}
        {thumbs.length > 0 && (
          <div className="flex gap-2 items-center">
            {thumbs.map((item) => {
              const Icon = typeIcon[item.type] ?? BookOpen
              return (
                <div
                  key={item.id}
                  className="relative overflow-hidden rounded-sm shrink-0"
                  style={{ width: 80, height: 45 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getThumb(item)}
                    alt=""
                    className="w-full h-full object-cover brightness-75"
                    draggable={false}
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                    <Icon className="h-3.5 w-3.5 text-white/85" />
                  </span>
                </div>
              )
            })}
            {contentsCount > thumbs.length && (
              <span className="font-mono text-[10px] text-planton-muted pl-1">
                +{contentsCount - thumbs.length}
              </span>
            )}
          </div>
        )}

        {/* 4. Progress bar */}
        {progress !== undefined && progress > 0 && (
          <div className="flex flex-col gap-1.5">
            <div className="h-[3px] w-full bg-border rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%`, backgroundColor: accent }}
              />
            </div>
            <span className="font-mono text-[0.625rem] text-planton-muted">
              {progress}% concluído  •  {contentsCount} conteúdo{contentsCount !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* 5. CTA */}
        <span
          className="inline-flex items-center gap-1.5 font-mono text-xs font-medium group-hover:gap-3 transition-all duration-150"
          style={{ color: accent }}
        >
          Ver trilha
          <ArrowRight className="h-3.5 w-3.5" />
        </span>

      </div>
    </Link>
  )
}
