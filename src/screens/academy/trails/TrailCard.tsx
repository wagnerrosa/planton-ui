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

function getFeaturedThumb(contents: ContentItem[]): ContentItem | undefined {
  return (
    contents.find((c) => c.progress > 0 && c.progress < 100) ??
    contents.find((c) => c.status === 'nao-iniciado') ??
    contents[0]
  )
}

export function TrailCard({ trail }: TrailCardProps) {
  const { title, description, contentsCount, duration, progress, status, href, contents = [] } = trail
  const isConcluida = status === 'concluida'

  const featuredItem = getFeaturedThumb(contents)
  const otherThumbs = contents.filter((c) => c.id !== featuredItem?.id).slice(0, 4)

  return (
    <Link href={href} className="group flex flex-col gap-4 py-8 cursor-pointer">

      {/* Linha 1: Título + Status */}
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-heading text-2xl font-normal leading-snug text-foreground group-hover:text-planton-accent transition-colors duration-150">
          {title}
        </h3>
        {status && (
          <span className={`inline-flex items-center gap-1 font-mono text-[0.625rem] uppercase tracking-[0.10em] shrink-0 pt-0.5 ${isConcluida ? 'text-planton-accent' : 'text-planton-muted'}`}>
            {isConcluida && <Award className="h-3 w-3" />}
            {statusLabel[status]}
          </span>
        )}
      </div>

      {/* Linha 2: Thumb esquerda + metadados direita */}
      <div className="flex gap-5">

        {/* Thumb principal — proporção 4:5 */}
        {featuredItem && (
          <div className="relative shrink-0 overflow-hidden rounded-sm" style={{ width: 160, height: 200 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getThumb(featuredItem)}
              alt=""
              className="w-full h-full object-cover brightness-75 group-hover:brightness-90 transition-all duration-300"
              draggable={false}
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/20">
              {(() => {
                const Icon = typeIcon[featuredItem.type] ?? BookOpen
                return <Icon className="h-6 w-6 text-white/80" />
              })()}
            </span>
            {featuredItem.progress > 0 && featuredItem.progress < 100 && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/20">
                <div className="h-full bg-planton-accent" style={{ width: `${featuredItem.progress}%` }} />
              </div>
            )}
          </div>
        )}

        {/* Metadados */}
        <div className="flex flex-col gap-3 flex-1 min-w-0 justify-center">

          {/* Descrição */}
          {description && (
            <p className="font-sans text-sm leading-relaxed text-planton-muted line-clamp-2">
              {description}
            </p>
          )}

          {/* Thumbs dos outros conteúdos */}
          {otherThumbs.length > 0 && (
            <div className="flex gap-1.5 items-center">
              {otherThumbs.map((item) => {
                const Icon = typeIcon[item.type] ?? BookOpen
                return (
                  <div
                    key={item.id}
                    className="relative overflow-hidden rounded-sm shrink-0"
                    style={{ width: 88, height: 50 }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getThumb(item)}
                      alt=""
                      className="w-full h-full object-cover brightness-75"
                      draggable={false}
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Icon className="h-3 w-3 text-white/75" />
                    </span>
                  </div>
                )
              })}
              {contentsCount > otherThumbs.length + 1 && (
                <span className="font-mono text-[10px] text-planton-muted pl-0.5">
                  +{contentsCount - otherThumbs.length - 1}
                </span>
              )}
            </div>
          )}

          {/* Meta + progress */}
          <div className="flex items-center gap-4">
            <span className="font-mono text-[0.625rem] text-planton-muted shrink-0">
              {contentsCount} conteúdo{contentsCount !== 1 ? 's' : ''}  ·  {duration}
            </span>
            {progress !== undefined && progress > 0 && (
              <div className="flex items-center gap-2 flex-1">
                <div className="flex-1 h-[2px] bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-planton-accent rounded-full" style={{ width: `${progress}%` }} />
                </div>
                <span className="font-mono text-[0.625rem] text-planton-muted shrink-0">{progress}%</span>
              </div>
            )}
          </div>

          {/* CTA */}
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-planton-accent group-hover:gap-3 transition-all duration-150">
            Ver trilha
            <ArrowRight className="h-3.5 w-3.5" />
          </span>

        </div>
      </div>

    </Link>
  )
}
