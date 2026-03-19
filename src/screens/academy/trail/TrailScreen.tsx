'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { Progress } from '@/components/shadcn/progress'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import { Button } from '@/components/shadcn/button'
import { RadioGroup, RadioGroupItem } from '@/components/shadcn/radio-group'
import { Label } from '@/components/shadcn/label'
import { AcademyNavbar } from '@/components/navigation/AcademyNavbar'
import { ContentTypeIcon } from '../home/components/ContentTypeIcon'
import {
  CheckCircle,
  Circle,
  CircleDot,
  Award,
  GraduationCap,
  ChevronLeft,
  Lock,
  FileQuestion,
  Download,
  Linkedin,
} from 'lucide-react'
import { MOCK_TRAILS } from '../home/mock-data'
import type { ContentItem, Trail } from '../home/mock-data'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ActiveItem =
  | { kind: 'content'; index: number }
  | { kind: 'quiz' }
  | { kind: 'certificate' }

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatusIcon({ status }: { status: ContentItem['status'] }) {
  if (status === 'concluido') return <CheckCircle className="h-4 w-4 text-planton-accent shrink-0" />
  if (status === 'visualizado') return <CircleDot className="h-4 w-4 text-planton-muted shrink-0" />
  return <Circle className="h-4 w-4 text-planton-muted/50 shrink-0" />
}

function MuxPlayer({ playbackId, title }: { playbackId: string; title: string }) {
  return (
    <iframe
      src={`https://player.mux.com/${playbackId}?metadata-video-title=${encodeURIComponent(title)}`}
      title={title}
      style={{ width: '100%', border: 'none', aspectRatio: '16/9' }}
      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
      allowFullScreen
    />
  )
}

function ArticleView({ content }: { content: ContentItem }) {
  return (
    <div className="w-full max-w-[760px] px-6 py-8 flex flex-col gap-6">
      <Heading as="h1" size="heading-xl">{content.title}</Heading>
      <div className="prose prose-invert max-w-none">
        <p className="text-foreground/80 leading-relaxed">{content.description}</p>
        <p className="text-foreground/60 leading-relaxed mt-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <p className="text-foreground/60 leading-relaxed mt-4">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
    </div>
  )
}

function PodcastView({ content }: { content: ContentItem }) {
  return (
    <div className="w-full" style={{ aspectRatio: '16/9' }}>
      <div className="w-full h-full bg-planton-accent/10 flex flex-col items-center justify-center gap-6 px-8">
        <ContentTypeIcon type="podcast" size="lg" />
        <Heading as="h2" size="heading-lg" className="text-center">{content.title}</Heading>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <audio
          controls
          className="w-full max-w-md"
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        />
      </div>
    </div>
  )
}

function GuideView({ content }: { content: ContentItem }) {
  return (
    <div className="w-full" style={{ aspectRatio: '16/9' }}>
      <div className="w-full h-full bg-planton-accent/10 flex flex-col items-center justify-center gap-4">
        <ContentTypeIcon type="guia" size="lg" />
        <Heading as="h2" size="heading-lg">{content.title}</Heading>
        <Body muted>{content.description}</Body>
        <Button variant="outline" className="mt-2">
          <Download className="h-4 w-4 mr-2" />
          Abrir PDF
        </Button>
      </div>
    </div>
  )
}

function QuizView({ trail }: { trail: Trail }) {
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(trail.quiz.status === 'concluido')

  if (trail.quiz.status === 'bloqueado') {
    return (
      <div className="w-full" style={{ aspectRatio: '16/9' }}>
        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
          <Lock className="h-10 w-10 text-planton-muted/50" />
          <Heading as="h2" size="heading-lg">Quiz bloqueado</Heading>
          <Body muted>Conclua todos os conteúdos da trilha para desbloquear o quiz.</Body>
        </div>
      </div>
    )
  }

  if (finished) {
    return (
      <div className="w-full" style={{ aspectRatio: '16/9' }}>
        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
          <CheckCircle className="h-12 w-12 text-planton-accent" />
          <Heading as="h2" size="heading-lg">Quiz concluído!</Heading>
          <Body muted>Você acertou {score} de {trail.quiz.questions.length} questões.</Body>
        </div>
      </div>
    )
  }

  const question = trail.quiz.questions[currentQ]
  const isLast = currentQ === trail.quiz.questions.length - 1

  function handleNext() {
    const correct = selected !== null && parseInt(selected) === question.correctIndex
    const newScore = score + (correct ? 1 : 0)
    if (isLast) {
      setScore(newScore)
      setFinished(true)
    } else {
      setScore(newScore)
      setCurrentQ((q) => q + 1)
      setSelected(null)
      setAnswered(false)
    }
  }

  return (
    <div className="w-full max-w-[760px] px-6 py-8 flex flex-col gap-6">
      <Body size="sm" muted>Questão {currentQ + 1} de {trail.quiz.questions.length}</Body>
      <Heading as="h2" size="heading-lg">{question.question}</Heading>
      <RadioGroup value={selected ?? ''} onValueChange={(v) => { setSelected(v); setAnswered(true) }}>
        {question.options.map((opt, i) => (
          <div key={i} className="flex items-center gap-3 py-2">
            <RadioGroupItem value={String(i)} id={`opt-${i}`} />
            <Label htmlFor={`opt-${i}`} className="text-base cursor-pointer">{opt}</Label>
          </div>
        ))}
      </RadioGroup>
      <Button onClick={handleNext} disabled={!answered} className="self-start">
        {isLast ? 'Finalizar' : 'Próxima'}
      </Button>
    </div>
  )
}

function CertificateView({ trail }: { trail: Trail }) {
  if (trail.certificate.status === 'bloqueado') {
    return (
      <div className="w-full" style={{ aspectRatio: '16/9' }}>
        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
          <Lock className="h-10 w-10 text-planton-muted/50" />
          <Heading as="h2" size="heading-lg">Certificado bloqueado</Heading>
          <Body muted>Seja aprovado no quiz para liberar seu certificado.</Body>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full" style={{ aspectRatio: '16/9' }}>
      <div className="w-full h-full bg-planton-accent/10 flex flex-col items-center justify-center gap-6 px-8">
        <GraduationCap className="h-16 w-16 text-planton-accent" />
        <div className="text-center flex flex-col gap-2">
          <Heading as="h2" size="heading-xl">Certificado de Conclusão</Heading>
          <Body muted>{trail.certificate.title}</Body>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Baixar PDF
          </Button>
          <Button variant="outline">
            <Linkedin className="h-4 w-4 mr-2" />
            Adicionar ao LinkedIn
          </Button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

type TrailScreenProps = {
  trailId: string
}

export function TrailScreen({ trailId }: TrailScreenProps) {
  const trail = MOCK_TRAILS.find((t) => t.id === trailId)
  const [active, setActive] = useState<ActiveItem>({ kind: 'content', index: 0 })

  if (!trail) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Body muted>Trilha não encontrada.</Body>
      </div>
    )
  }

  const activeContent = active.kind === 'content' ? trail.contents[active.index] : null

  function SidebarItem({
    isActive,
    onClick,
    children,
  }: {
    isActive: boolean
    onClick: () => void
    children: React.ReactNode
  }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors border-l-2 ${
          isActive
            ? 'bg-sidebar-accent border-planton-accent'
            : 'hover:bg-card/80 border-transparent'
        }`}
      >
        {children}
      </button>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AcademyNavbar
        userName="Wagner Rosa"
        breadcrumbs={[
          { label: 'Trilhas', href: '/design-system/screens/academy/home' },
          { label: trail.title },
        ]}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* ---- Sidebar ---- */}
        <aside className="w-[340px] shrink-0 border-r border-border bg-card hidden md:flex flex-col">
          {/* Back + Trail header */}
          <div className="p-5 border-b border-border flex flex-col gap-3">
            <Link
              href="/design-system/screens/academy/home"
              className="flex items-center gap-1 text-xs text-planton-muted hover:text-foreground transition-colors w-fit"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Voltar para trilhas
            </Link>
            <Heading as="h2" size="heading-lg">{trail.title}</Heading>
            <Body size="sm" muted>{trail.totalItems} conteúdos · {trail.totalDuration}</Body>
            <div className="flex items-center gap-3">
              <Progress value={trail.progress} className="flex-1 h-2" />
              <span className="text-sm font-medium text-foreground">{trail.progress}%</span>
            </div>
          </div>

          {/* Content list */}
          <ScrollArea className="flex-1">
            <div className="flex flex-col py-2">
              {/* Contents */}
              {trail.contents.map((item, i) => {
                const isActive = active.kind === 'content' && active.index === i
                return (
                  <SidebarItem key={item.id} isActive={isActive} onClick={() => setActive({ kind: 'content', index: i })}>
                    <span className="text-xs text-planton-muted w-5 shrink-0 text-right">{i + 1}</span>
                    <StatusIcon status={item.status} />
                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                      <span className={`text-sm truncate ${isActive ? 'text-planton-accent font-medium' : 'text-foreground'}`}>
                        {item.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <ContentTypeIcon type={item.type} showLabel />
                        <span className="text-xs text-planton-muted">{item.duration}</span>
                      </div>
                    </div>
                  </SidebarItem>
                )
              })}

              {/* Quiz */}
              <div className="border-t border-border mt-2">
                <SidebarItem
                  isActive={active.kind === 'quiz'}
                  onClick={() => setActive({ kind: 'quiz' })}
                >
                  <span className="w-5 shrink-0" />
                  {trail.quiz.status === 'concluido' ? (
                    <CheckCircle className="h-4 w-4 text-planton-accent shrink-0" />
                  ) : trail.quiz.status === 'disponivel' ? (
                    <FileQuestion className="h-4 w-4 text-planton-accent shrink-0" />
                  ) : (
                    <Lock className="h-4 w-4 text-planton-muted/50 shrink-0" />
                  )}
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <span className={`text-sm truncate ${active.kind === 'quiz' ? 'text-planton-accent font-medium' : trail.quiz.status === 'bloqueado' ? 'text-planton-muted/50' : 'text-foreground'}`}>
                      Quiz
                    </span>
                    <span className="text-xs text-planton-muted capitalize">
                      {trail.quiz.status === 'bloqueado' ? 'Bloqueado' : trail.quiz.status === 'disponivel' ? 'Disponível' : 'Concluído'}
                    </span>
                  </div>
                </SidebarItem>

                {/* Certificate */}
                <SidebarItem
                  isActive={active.kind === 'certificate'}
                  onClick={() => setActive({ kind: 'certificate' })}
                >
                  <span className="w-5 shrink-0" />
                  {trail.certificate.status === 'disponivel' ? (
                    <GraduationCap className="h-4 w-4 text-planton-accent shrink-0" />
                  ) : (
                    <Lock className="h-4 w-4 text-planton-muted/50 shrink-0" />
                  )}
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <span className={`text-sm truncate ${active.kind === 'certificate' ? 'text-planton-accent font-medium' : trail.certificate.status === 'bloqueado' ? 'text-planton-muted/50' : 'text-foreground'}`}>
                      Certificado
                    </span>
                    <span className="text-xs text-planton-muted">
                      {trail.certificate.status === 'disponivel' ? 'Disponível' : 'Bloqueado'}
                    </span>
                  </div>
                </SidebarItem>
              </div>
            </div>
          </ScrollArea>
        </aside>

        {/* ---- Player / Content area ---- */}
        <div className="flex-1 flex flex-col overflow-auto">
          {/* Dynamic content */}
          {active.kind === 'quiz' ? (
            <QuizView trail={trail} />
          ) : active.kind === 'certificate' ? (
            <CertificateView trail={trail} />
          ) : activeContent ? (
            <>
              {activeContent.type === 'video' && (
                <MuxPlayer playbackId={activeContent.muxPlaybackId} title={activeContent.title} />
              )}
              {activeContent.type === 'artigo' && (
                <ArticleView content={activeContent} />
              )}
              {activeContent.type === 'podcast' && (
                <PodcastView content={activeContent} />
              )}
              {activeContent.type === 'guia' && (
                <GuideView content={activeContent} />
              )}

              {/* Content info — only for media types (not article which renders inline) */}
              {activeContent.type !== 'artigo' && (
                <div className="max-w-[900px] px-6 py-6 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <ContentTypeIcon type={activeContent.type} showLabel />
                    <Body size="sm" muted>{activeContent.duration}</Body>
                  </div>
                  <Heading as="h1" size="heading-xl">{activeContent.title}</Heading>
                  <Body muted>{activeContent.description}</Body>
                </div>
              )}
            </>
          ) : (
            <div className="w-full bg-muted flex items-center justify-center" style={{ aspectRatio: '16/9' }}>
              <Body muted>Nenhum conteúdo selecionado</Body>
            </div>
          )}

          {/* Mobile: content list below player */}
          <div className="md:hidden px-6 pb-6">
            <div className="flex flex-col gap-1 border-t border-border pt-4">
              <Body size="sm" muted className="mb-2">{trail.totalItems} conteúdos</Body>
              {trail.contents.map((item, i) => {
                const isActive = active.kind === 'content' && active.index === i
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActive({ kind: 'content', index: i })}
                    className={`flex items-center gap-3 py-2 px-2 text-left transition-colors ${
                      isActive ? 'bg-sidebar-accent' : 'hover:bg-card/80'
                    }`}
                  >
                    <span className="text-xs text-planton-muted w-5 shrink-0 text-right">{i + 1}</span>
                    <StatusIcon status={item.status} />
                    <span className={`text-sm truncate flex-1 ${isActive ? 'text-planton-accent font-medium' : 'text-foreground'}`}>
                      {item.title}
                    </span>
                    <span className="text-xs text-planton-muted shrink-0">{item.duration}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
