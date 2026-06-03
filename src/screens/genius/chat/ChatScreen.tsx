'use client'

import { useState, useRef, useEffect } from 'react'
import { marked } from 'marked'
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, CheckCircle2, Send, Loader2, AlertTriangle, Table2, FileText, Paperclip, MessageSquare, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/shadcn/dialog'
import { useIsMobile } from '@/hooks/use-mobile'
import { GeniusNavbarSync } from '@/components/navigation/GeniusNavbarSync'
import { GeniusChatComposer, type SentFile } from '@/components/genius/GeniusChatComposer'
import { InventoryDataGrid, type GridSelectionInfo } from '@/components/genius/InventoryDataGrid'
import { GridToolbar } from '@/components/genius/GridToolbar'
import { ResumoTab } from '@/components/genius/ResumoTab'
import { CategoryIcon } from '@/components/genius/CategoryIcon'
import { CATEGORIES, DEFAULT_CATEGORY_ID, findCategory, getCategoryWorstStatus, getSchemaWorstStatus, type CellStatus, type ChatMessage, type EmissionCategory } from './mock-data'

type ValidationState = 'idle' | 'checking' | 'has-issues' | 'ready'

type ProcessingFile = {
  id: string
  name: string
  categoryId: string
  schemaId: string
  status: 'processing' | 'done' | 'error'
}

function cloneCategories(): EmissionCategory[] {
  return CATEGORIES.map((cat) => ({
    ...cat,
    schemas: cat.schemas.map((s) => ({
      ...s,
      rows: s.rows.map((r) => ({ ...r, _cellStatus: r._cellStatus ? { ...r._cellStatus } : undefined })),
    })),
  }))
}

function countIssuesForCategory(cat: EmissionCategory): { errors: number; warnings: number } {
  let errors = 0
  let warnings = 0
  for (const schema of cat.schemas) {
    for (const row of schema.rows) {
      if (!row._cellStatus) continue
      for (const status of Object.values(row._cellStatus)) {
        if (status === 'error') errors++
        else if (status === 'warning') warnings++
      }
    }
  }
  return { errors, warnings }
}

const STATUS_DOT_CLASS: Record<CellStatus, string> = {
  error: 'bg-destructive',
  warning: 'bg-warning',
}

const STATUS_BORDER_CLASS: Record<CellStatus, string> = {
  error: 'border-destructive',
  warning: 'border-warning',
}

type ViewMode = 'empty' | 'chat' | 'split'

// Estatísticas operacionais por categoria — mostradas no modal de sucesso pós-envio
type SubmitStats = { registros: number; filiais: number }
const SUBMIT_STATS: Record<string, SubmitStats> = {
  'combustao-movel':          { registros: 100, filiais: 9 },
  'energia-eletrica':         { registros: 64,  filiais: 9 },
  'emissoes-fugitivas':       { registros: 28,  filiais: 5 },
  'combustao-estacionaria':   { registros: 47,  filiais: 7 },
  'viagens-negocios':         { registros: 73,  filiais: 6 },
  'residuos':                 { registros: 39,  filiais: 8 },
}
const DEFAULT_SUBMIT_STATS: SubmitStats = { registros: 50, filiais: 6 }

// Insights corporativos rotativos — selecionados por (categoryIndex % length) para determinismo
const CLIMATE_INSIGHTS = [
  'Empresas com inventários GHG completos respondem com mais agilidade a exigências de clientes, auditorias e cadeias globais.',
  'A maior parte das emissões corporativas está fora da operação direta — em média, mais de 70% se concentra no Escopo 3.',
  'O inventário é o ponto de partida para metas de redução, compromissos Net Zero e relatórios TCFD e CSRD.',
  'Cadeias de fornecimento globais já exigem dados climáticos de fornecedores em processos de compra e due diligence.',
  'Risco climático é tratado como risco financeiro material por investidores institucionais e reguladores em todo o mundo.',
  'Inventários consistentes permitem identificar ineficiências energéticas e oportunidades de redução de custos operacionais.',
]

// Burst de confete brand — dispara 1x no mount (tela de sucesso).
// Trajetórias determinísticas por índice → sem hydration mismatch.
const CONFETTI_COLORS = ['#ADCF78', '#7BA05B', '#2E5339', '#C8E6A0', '#4A7C59']
function Confetti({ count = 28 }: { count?: number }) {
  const pieces = Array.from({ length: count }, (_, i) => {
    const angle = (Math.PI * i) / (count - 1) // 0..π → leque para cima
    const spread = 120 + (i % 5) * 26
    const dx = Math.cos(angle) * spread
    const dy = -Math.abs(Math.sin(angle)) * (140 + (i % 4) * 34) + (i % 3) * 22
    const rot = 180 + (i % 7) * 40
    const dur = 950 + (i % 6) * 130
    const delay = (i % 9) * 22
    const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length]
    const round = i % 3 === 0
    return (
      <span
        key={i}
        className="genius-confetti-piece"
        style={{
          backgroundColor: color,
          borderRadius: round ? '9999px' : '1px',
          ['--dx' as string]: `${dx}px`,
          ['--dy' as string]: `${dy}px`,
          ['--rot' as string]: `${rot}deg`,
          ['--dur' as string]: `${dur}ms`,
          ['--delay' as string]: `${delay}ms`,
        }}
      />
    )
  })
  return <div className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden>{pieces}</div>
}

// Conta de 0 até `value` com easing, dispara no mount
function CountUp({ value, decimals = 0, durationMs = 1100, delayMs = 0 }: { value: number; decimals?: number; durationMs?: number; delayMs?: number }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value)
      return
    }
    let raf = 0
    let start = 0
    const ease = (t: number) => 1 - Math.pow(1 - t, 3) // easeOutCubic
    function tick(ts: number) {
      if (!start) start = ts
      const elapsed = ts - start - delayMs
      if (elapsed < 0) { raf = requestAnimationFrame(tick); return }
      const p = Math.min(elapsed / durationMs, 1)
      setDisplay(value * ease(p))
      if (p < 1) raf = requestAnimationFrame(tick)
      else setDisplay(value)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, durationMs, delayMs])
  return <>{display.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</>
}

const INVENTORY_PATTERN =
  /\b(\d+[\.,]?\d*)\s*(kg|ton|t\b|tco2|tco2e|kwh|mwh|gwh|litros?|m³|m3|galões?|km|milhas?)\b/i

function detectsInventoryData(text: string): boolean {
  return INVENTORY_PATTERN.test(text)
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function buildInitialChats(): Record<string, ChatMessage[]> {
  return Object.fromEntries(CATEGORIES.map((c) => [c.id, c.initialChat]))
}

function buildInitialSchemas(): Record<string, string> {
  return Object.fromEntries(CATEGORIES.map((c) => [c.id, c.schemas[0].id]))
}

export function ChatScreen({ userName = 'Usuário' }: { userName?: string } = {}) {
  const isMobile = useIsMobile()
  const [input, setInput] = useState('')
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('empty')
  const [activeCategoryId, setActiveCategoryId] = useState(DEFAULT_CATEGORY_ID)
  const [activeSchemaByCategory, setActiveSchemaByCategory] = useState<Record<string, string>>(buildInitialSchemas)
  const [chatsByCategory, setChatsByCategory] = useState<Record<string, ChatMessage[]>>(buildInitialChats)
  const [categoriesOpen, setCategoriesOpen] = useState(true)
  const [chatOpen, setChatOpen] = useState(true)
  const [categoriesData, setCategoriesData] = useState<EmissionCategory[]>(cloneCategories)

  // Per-category state
  const [validationByCategory, setValidationByCategory] = useState<Record<string, ValidationState>>({})
  const [issueCountsByCategory, setIssueCountsByCategory] = useState<Record<string, { errors: number; warnings: number }>>({})
  const [glowKeyByCategory, setGlowKeyByCategory] = useState<Record<string, number>>({})
  const [verifyClicksByCategory, setVerifyClicksByCategory] = useState<Record<string, number>>({})
  const [submittedCategories, setSubmittedCategories] = useState<Set<string>>(new Set())

  const [dirtyCategories, setDirtyCategories] = useState<Set<string>>(new Set())
  const [filesExpanded, setFilesExpanded] = useState(false)
  const [highlightedRows, setHighlightedRows] = useState<number[]>([])
  const [selectedCellInfo, setSelectedCellInfo] = useState<GridSelectionInfo>({ type: 'cells', count: 0 })
  const [gridSearch, setGridSearch] = useState('')
  const [selectedHistoryFile, setSelectedHistoryFile] = useState<number | null>(null)
  const clearGridSelectionRef = useRef<(() => void) | null>(null)
  const deleteFileRef = useRef<((index: number) => void) | null>(null)
  const [deleteFileTarget, setDeleteFileTarget] = useState<{ index: number; file: SentFile } | null>(null)
  const resetFilesRef = useRef<(() => void) | null>(null)
  const [resetModalOpen, setResetModalOpen] = useState(false)

  function handleSentFileClick(fileIndex: number) {
    if (fileIndex < 0) { setHighlightedRows([]); setSelectedHistoryFile(null); return }
    if (selectedHistoryFile === fileIndex) {
      setHighlightedRows([])
      setSelectedHistoryFile(null)
      return
    }
    setSelectedHistoryFile(fileIndex)
    // mock: cada arquivo mapeia para 3 linhas baseado no seu índice
    const base = (fileIndex * 3) % Math.max(activeCategory.schemas[0].rows.length, 1)
    const rows = [base, base + 1, base + 2].filter((r) => r < activeCategory.schemas[0].rows.length)
    setHighlightedRows(rows)
  }
  const [processingFiles, setProcessingFiles] = useState<ProcessingFile[]>([])

  // Linhas da tabela atreladas a um arquivo enviado (mesmo mapeamento do clique no arquivo).
  function linkedRowsForFile(fileIndex: number): number[] {
    const total = activeCategory.schemas[0].rows.length
    if (total === 0) return []
    const base = (fileIndex * 3) % total
    return [base, base + 1, base + 2].filter((r) => r < total)
  }

  function handleRequestDeleteFile(index: number, file: SentFile) {
    setDeleteFileTarget({ index, file })
  }

  function handleConfirmDeleteFile() {
    const target = deleteFileTarget
    if (!target) return
    const rowsToRemove = new Set(linkedRowsForFile(target.index))

    // Remove as linhas atreladas da primeira schema da categoria ativa.
    if (rowsToRemove.size > 0) {
      const schemaId = activeCategory.schemas[0].id
      setCategoriesData((prev) =>
        prev.map((cat) => {
          if (cat.id !== activeCategoryId) return cat
          return {
            ...cat,
            schemas: cat.schemas.map((s) =>
              s.id === schemaId
                ? { ...s, rows: s.rows.filter((_, i) => !rowsToRemove.has(i)) }
                : s
            ),
          }
        })
      )
    }

    // Remove o arquivo do shelf do composer.
    deleteFileRef.current?.(target.index)

    // Limpa estado derivado do arquivo removido.
    setHighlightedRows([])
    setSelectedHistoryFile(null)
    setProcessingFiles((prev) => prev.filter((p) => p.name !== target.file.name))

    pushChatMsg(activeCategoryId, `Arquivo "${target.file.name}" excluído. Os dados atrelados foram removidos da planilha.`, 'warning')
    setDeleteFileTarget(null)
  }

  function handleRequestReset() {
    setResetModalOpen(true)
  }

  function handleConfirmReset() {
    const catId = activeCategoryId
    const original = CATEGORIES.find((c) => c.id === catId)

    // Tabela: volta a categoria ativa ao estado original (re-clone dos schemas).
    if (original) {
      setCategoriesData((prev) =>
        prev.map((cat) =>
          cat.id === catId
            ? {
                ...cat,
                schemas: original.schemas.map((s) => ({
                  ...s,
                  rows: s.rows.map((r) => ({ ...r, _cellStatus: r._cellStatus ? { ...r._cellStatus } : undefined })),
                })),
              }
            : cat
        )
      )
    }

    // Chat: volta à conversa inicial da categoria.
    setChatsByCategory((prev) => ({ ...prev, [catId]: original ? original.initialChat : [] }))

    // Schema ativo: volta para o primeiro.
    setActiveSchemaByCategory((prev) => ({ ...prev, [catId]: (original ?? activeCategory).schemas[0].id }))

    // Estado derivado por categoria.
    setValidationByCategory((prev) => ({ ...prev, [catId]: 'idle' }))
    setIssueCountsByCategory((prev) => ({ ...prev, [catId]: { errors: 0, warnings: 0 } }))
    setVerifyClicksByCategory((prev) => ({ ...prev, [catId]: 0 }))
    setSubmittedCategories((prev) => { const s = new Set(prev); s.delete(catId); return s })
    setDirtyCategories((prev) => { const s = new Set(prev); s.delete(catId); return s })

    // Arquivos enviados, processamento e seleções.
    resetFilesRef.current?.()
    setProcessingFiles((prev) => prev.filter((p) => p.categoryId !== catId))
    clearGridSelectionRef.current?.()
    setSelectedCellInfo({ type: 'cells', count: 0 })
    setHighlightedRows([])
    setSelectedHistoryFile(null)
    setFilesExpanded(false)

    setResetModalOpen(false)
  }

  const [submitModalOpen, setSubmitModalOpen] = useState(false)
  const [submitPhase, setSubmitPhase] = useState<'form' | 'success'>('form')
  const [submitConfirmText, setSubmitConfirmText] = useState('')
  const [splitMounted, setSplitMounted] = useState(false)
  const [chatWidth, setChatWidth] = useState(360)
  const chatDragRef = useRef<{ startX: number; startWidth: number } | null>(null)

  function handleChatDragStart(e: React.MouseEvent) {
    e.preventDefault()
    chatDragRef.current = { startX: e.clientX, startWidth: chatWidth }

    function onMove(ev: MouseEvent) {
      if (!chatDragRef.current) return
      const delta = chatDragRef.current.startX - ev.clientX
      const next = chatDragRef.current.startWidth + delta
      if (next < 300) {
        setChatOpen(false)
        onUp()
        return
      }
      setChatWidth(Math.min(next, 700))
    }

    function onUp() {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      chatDragRef.current = null
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }
  const collapsedFileInputRef = useRef<HTMLInputElement>(null)

  const validationState: ValidationState = validationByCategory[activeCategoryId] ?? 'idle'
  const issueCounts = issueCountsByCategory[activeCategoryId] ?? { errors: 0, warnings: 0 }
  const glowKey = glowKeyByCategory[activeCategoryId] ?? 0
  const submitted = submittedCategories.has(activeCategoryId)
  const isDirty = dirtyCategories.has(activeCategoryId)

  function markDirty() {
    setDirtyCategories((prev) => new Set([...prev, activeCategoryId]))
    // reset validation so user must re-verify after edits
    setValidationByCategory((prev) => {
      const cur = prev[activeCategoryId]
      if (cur === 'ready' || cur === 'has-issues') {
        return { ...prev, [activeCategoryId]: 'idle' }
      }
      return prev
    })
  }

  function pushChatMsg(catId: string, content: string, variant?: ChatMessage['variant']) {
    const msg: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content,
      timestamp: new Date(),
      variant,
    }
    setChatsByCategory((prev) => ({
      ...prev,
      [catId]: [...(prev[catId] ?? []), msg],
    }))
  }

  function handleVerify() {
    if (validationState === 'checking') return
    setDirtyCategories((prev) => { const s = new Set(prev); s.delete(activeCategoryId); return s })
    const nextClicks = (verifyClicksByCategory[activeCategoryId] ?? 0) + 1
    setVerifyClicksByCategory((prev) => ({ ...prev, [activeCategoryId]: nextClicks }))
    setValidationByCategory((prev) => ({ ...prev, [activeCategoryId]: 'checking' }))

    setTimeout(() => {
      const activeCategory = categoriesData.find((c) => c.id === activeCategoryId)!
      if (nextClicks >= 2) {
        const cleared = categoriesData.map((cat) => {
          if (cat.id !== activeCategoryId) return cat
          return {
            ...cat,
            schemas: cat.schemas.map((s) => ({
              ...s,
              rows: s.rows.map((r) => {
                const { _cellStatus: _drop, ...rest } = r
                void _drop
                return rest
              }),
            })),
          }
        })
        setCategoriesData(cleared)
        setIssueCountsByCategory((prev) => ({ ...prev, [activeCategoryId]: { errors: 0, warnings: 0 } }))
        setValidationByCategory((prev) => ({ ...prev, [activeCategoryId]: 'ready' }))
        setGlowKeyByCategory((prev) => ({ ...prev, [activeCategoryId]: (prev[activeCategoryId] ?? 0) + 1 }))
        pushChatMsg(activeCategoryId, `${activeCategory.label} verificado com sucesso — nenhum erro encontrado. Pronto para envio.`, 'success')
        return
      }

      const counts = countIssuesForCategory(activeCategory)
      setIssueCountsByCategory((prev) => ({ ...prev, [activeCategoryId]: counts }))
      setValidationByCategory((prev) => ({ ...prev, [activeCategoryId]: 'has-issues' }))
      pushChatMsg(
        activeCategoryId,
        `${counts.errors} ${counts.errors === 1 ? 'erro' : 'erros'}${counts.warnings ? ` · ${counts.warnings} ${counts.warnings === 1 ? 'aviso' : 'avisos'}` : ''} encontrados. Revise os dados destacados e verifique novamente.`,
        counts.errors > 0 ? 'error' : 'warning',
      )
    }, 900)
  }

  function handleSubmit() {
    if (validationState !== 'ready') return
    setSubmitConfirmText('')
    setSubmitPhase('form')
    setSubmitModalOpen(true)
  }

  function handleConfirmSubmit() {
    const activeCategory = categoriesData.find((c) => c.id === activeCategoryId)!
    // Não fecha o modal — transiciona para a tela de sucesso
    setSubmitPhase('success')
    setValidationByCategory((prev) => ({ ...prev, [activeCategoryId]: 'idle' }))
    setVerifyClicksByCategory((prev) => ({ ...prev, [activeCategoryId]: 0 }))
    setSubmitConfirmText('')
    setSubmittedCategories((prev) => new Set([...prev, activeCategoryId]))
    pushChatMsg(activeCategoryId, `${activeCategory.label} enviado com sucesso! Os dados foram registrados oficialmente.`, 'success')
  }

  function handleCloseSubmitModal() {
    setSubmitModalOpen(false)
    // limpa a fase após a animação de fechamento do dialog
    setTimeout(() => setSubmitPhase('form'), 200)
  }

  const bottomRef = useRef<HTMLDivElement>(null)

  // Empty-state: alinha a camada borrada (dentro do card) ao fundo nítido (no stage).
  // Mede a posição do card e seta offsets como CSS vars → blur real sem backdrop-filter.
  const emptyStageRef = useRef<HTMLDivElement>(null)
  const emptyCardRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (viewMode !== 'empty') return
    const stage = emptyStageRef.current
    const card = emptyCardRef.current
    if (!stage || !card) return
    function sync() {
      const s = stage!.getBoundingClientRect()
      const c = card!.getBoundingClientRect()
      card!.style.setProperty('--blur-w', `${s.width}px`)
      card!.style.setProperty('--blur-h', `${s.height}px`)
      card!.style.setProperty('--blur-x', `${s.left - c.left}px`)
      card!.style.setProperty('--blur-y', `${s.top - c.top}px`)
    }
    sync()
    const ro = new ResizeObserver(sync)
    ro.observe(stage)
    ro.observe(card)
    window.addEventListener('resize', sync)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', sync)
    }
  }, [viewMode, userName])

  const activeCategory = categoriesData.find((c) => c.id === activeCategoryId) ?? findCategory(activeCategoryId)
  const RESUMO_ID = '__resumo__'
  const activeSchemaId = activeSchemaByCategory[activeCategoryId] ?? activeCategory.schemas[0].id
  const isResumoActive = activeSchemaId === RESUMO_ID
  const activeSchema = activeCategory.schemas.find((s) => s.id === activeSchemaId) ?? activeCategory.schemas[0]
  const activeChat = chatsByCategory[activeCategoryId] ?? []
  const hasInventoryInChat = activeChat.some((m) => m.hasInventoryData)
  function schemaProcessingCount(schemaId: string) {
    return processingFiles.filter(
      (p) => p.categoryId === activeCategoryId && p.schemaId === schemaId && p.status === 'processing'
    ).length
  }

  useEffect(() => {
    if (activeChat.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [activeChat])

  // Mobile: sidebar de categorias vira overlay e começa fechada para não espremer o chat
  useEffect(() => {
    if (isMobile) setCategoriesOpen(false)
  }, [isMobile])

  useEffect(() => {
    if (viewMode === 'split' && !splitMounted) {
      const timer = setTimeout(() => setSplitMounted(true), 30)
      return () => clearTimeout(timer)
    }
    if (viewMode !== 'split' && splitMounted) {
      setSplitMounted(false)
    }
  }, [viewMode, splitMounted])

  function handleSend(files: File[] = []): string[] {
    const text = input.trim()
    if (!text && files.length === 0) return []

    const isInventory = detectsInventoryData(text)
    const now = new Date()

    const newProcessingFiles: ProcessingFile[] = files.map((f) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: f.name,
      categoryId: activeCategoryId,
      schemaId: activeSchemaId,
      status: 'processing' as const,
    }))

    if (newProcessingFiles.length > 0) {
      setProcessingFiles((prev) => [...prev, ...newProcessingFiles])
      newProcessingFiles.forEach((pf) => {
        setTimeout(() => {
          setProcessingFiles((prev) =>
            prev.map((p) => (p.id === pf.id ? { ...p, status: 'done' } : p))
          )
        }, 8000 + Math.random() * 4000)
      })
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      hasInventoryData: isInventory,
      timestamp: now,
      attachments: files.map((f, i) => ({
        name: f.name,
        ext: f.name.split('.').pop()?.toLowerCase() ?? '',
        processingId: newProcessingFiles[i]?.id,
      })),
    }
    const assistantMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: isInventory
        ? `Identifiquei dados de ${activeCategory.label.toLowerCase()} na sua mensagem. Adicionei à aba "${activeSchema.label}". Deseja ajustar algum valor?`
        : `Envie dados de ${activeCategory.label.toLowerCase()} — por exemplo, consumos, quantidades ou faturas relacionados a essa categoria.`,
      timestamp: new Date(now.getTime() + 500),
    }

    setChatsByCategory((prev) => ({
      ...prev,
      [activeCategoryId]: [
        ...(prev[activeCategoryId] ?? []),
        userMsg,
        assistantMsg,
      ],
    }))

    if (isInventory) {
      const catId = activeCategoryId
      setTimeout(() => {
        const onboardingMsg: ChatMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: '',
          isOnboarding: true,
          timestamp: new Date(),
        }
        setChatsByCategory((prev) => ({
          ...prev,
          [catId]: [...(prev[catId] ?? []), onboardingMsg],
        }))
      }, 800)
    }
    setInput('')
    setFilesExpanded(false)

    if (isInventory) {
      // Mobile: não abre o split (tabela densa). Mantém chat + banner orienta a continuar no desktop/tablet.
      if (isMobile) {
        if (viewMode === 'empty') setViewMode('chat')
      } else {
        setViewMode('split')
      }
    } else if (viewMode === 'empty') {
      setViewMode('chat')
    }

    return newProcessingFiles.map((p) => p.id)
  }

  function handleSelectCategory(id: string) {
    const doUpdate = () => {
      setActiveCategoryId(id)
      if (viewMode === 'empty') setViewMode('chat')
      if (isMobile) setCategoriesOpen(false)
    }
    if (viewMode === 'empty' && typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as Document & { startViewTransition: (cb: () => void) => void }).startViewTransition(doUpdate)
    } else {
      doUpdate()
    }
  }

  function handleSelectSchema(id: string) {
    setActiveSchemaByCategory((prev) => ({ ...prev, [activeCategoryId]: id }))
  }

  // ── Onboarding message JSX ───────────────────────────────────────────────
  function OnboardingMessage({ timestamp }: { timestamp: Date }) {
    return (
      <div className="flex flex-col gap-2.5 leading-relaxed text-foreground text-[12px] [&_p]:text-[12px]">
        <p>Os dados já estão na planilha. A partir de agora, entramos na fase de preenchimento:</p>

        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <span className="shrink-0">1.</span>
            <p>Edite diretamente nas células ou me peça para editar.</p>
          </div>

          <div className="flex gap-2">
            <span className="shrink-0">2.</span>
            <p>Colunas não podem ser adicionadas ou removidas.</p>
          </div>

          <div className="flex gap-2">
            <span className="shrink-0">3.</span>
            <div className="flex flex-col gap-1">
              <p>Selecione linhas para me enviar como contexto.</p>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-planton-accent/10 text-planton-accent text-[10px] font-sans font-medium border border-planton-accent/25 w-fit">
                3 células selecionadas no contexto
                <span className="ml-0.5 opacity-60 cursor-default"><X size={9} /></span>
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <span className="shrink-0">4.</span>
            <div className="flex flex-col gap-1">
              <p>Envie arquivos a qualquer momento.</p>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1.5 border border-border bg-background px-2 py-1">
                  <div className="flex items-center justify-center w-6 h-6 text-[9px] font-mono font-bold shrink-0" style={{ backgroundColor: '#dcfce7', color: '#15803d' }}>XLS</div>
                  <span className="text-[10px] text-foreground font-medium">planilha.xlsx</span>
                  <CheckCircle2 size={10} className="text-planton-accent shrink-0" />
                </div>
                <div className="flex items-center gap-1.5 border border-border bg-background px-2 py-1">
                  <div className="flex items-center justify-center w-6 h-6 text-[9px] font-mono font-bold shrink-0" style={{ backgroundColor: '#fee2e2', color: '#b91c1c' }}>PDF</div>
                  <span className="text-[10px] text-foreground font-medium">fatura.pdf</span>
                  <Loader2 size={10} className="text-muted-foreground shrink-0 animate-spin" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <span className="shrink-0">5.</span>
            <div className="flex flex-col gap-1">
              <p>
                Clique em{' '}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-border bg-background text-[10px] font-medium align-middle mx-0.5">
                  <CheckCircle2 size={9} />
                  Verificar
                </span>
                {' '}para checar o preenchimento da categoria.
              </p>
              <div className="flex flex-col gap-1 pl-0.5">
                <span className="flex items-center gap-1.5 text-destructive">
                  <span className="w-2 h-2 rounded-full bg-destructive shrink-0" />
                  Erros bloqueantes — precisam ser corrigidos antes do envio
                </span>
                <span className="flex items-center gap-1.5 text-warning">
                  <span className="w-2 h-2 rounded-full bg-warning shrink-0" />
                  Alertas — valores incomuns, não bloqueiam o envio
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <span className="shrink-0">6.</span>
            <p>
              Acompanhe o status na aba{' '}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-border bg-background text-[10px] font-medium align-middle mx-0.5">
                <Table2 size={9} />
                Resumo
              </span>
              .
            </p>
          </div>

          <div className="flex gap-2">
            <span className="shrink-0">7.</span>
            <p>
              O botão{' '}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-planton-accent text-white text-[10px] font-medium align-middle mx-0.5">
                <Send size={9} />
                Enviar
              </span>
              {' '}será habilitado quando todas as abas estiverem sem erros bloqueantes.
            </p>
          </div>
        </div>

        <span className="text-[10px] text-muted-foreground/60 mt-0.5">{formatTime(timestamp)}</span>
      </div>
    )
  }

  // ── Chat message variant styles ───────────────────────────────────────────
  const VARIANT_CLASS: Record<NonNullable<ChatMessage['variant']>, string> = {
    error: 'text-destructive bg-destructive-surface border border-destructive-border',
    warning: 'text-warning bg-warning-surface border border-warning-border',
    success: 'text-success bg-success-surface border border-success-border',
  }

  function renderMessages(msgs: ChatMessage[], opts?: { wide?: boolean; size?: 'xs' | 'sm' }) {
    const wide = opts?.wide ?? false
    const textSize = (opts?.size ?? (wide ? 'sm' : 'xs')) === 'sm' ? 'text-[14px]' : 'text-[12px]'
    let attachmentOffset = 0
    return msgs.map((msg) => {
      const msgAttachmentOffset = attachmentOffset
      attachmentOffset += msg.attachments?.length ?? 0
      if (msg.isOnboarding) {
        return (
          <div key={msg.id} className="flex justify-start">
            <div className={`${wide ? 'max-w-[80%]' : 'max-w-[90%]'} px-3 py-2.5 ${textSize} font-sans leading-relaxed`}>
              <OnboardingMessage timestamp={msg.timestamp} />
            </div>
          </div>
        )
      }
      return (
      <div
        key={msg.id}
        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`${wide ? 'max-w-[80%]' : 'max-w-[90%]'} px-3 py-2.5 ${textSize} font-sans leading-relaxed ${msg.role === 'assistant' && !msg.variant ? 'rounded-2xl' : ''} ${
            msg.role === 'user'
              ? 'bg-muted/40 text-foreground border border-border'
              : msg.variant
                ? VARIANT_CLASS[msg.variant]
                : 'text-foreground'
          }`}
        >
          {msg.attachments && msg.attachments.length > 0 && (
            <div className="flex flex-col gap-1.5 mb-2">
              {msg.attachments.map((att, i) => {
                const colorStyles: Record<string, { backgroundColor: string; color: string }> = {
                  xlsx: { backgroundColor: '#dcfce7', color: '#15803d' },
                  xls:  { backgroundColor: '#dcfce7', color: '#15803d' },
                  csv:  { backgroundColor: '#dbeafe', color: '#1d4ed8' },
                  pdf:  { backgroundColor: '#fee2e2', color: '#b91c1c' },
                  json: { backgroundColor: '#fef9c3', color: '#a16207' },
                }
                const badgeStyle = colorStyles[att.ext] ?? {}
                const typeLabel = att.ext ? att.ext.toUpperCase() : 'Arquivo'
                const pf = att.processingId ? processingFiles.find((p) => p.id === att.processingId) : null
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSentFileClick(msgAttachmentOffset + i)}
                    className={`flex items-center gap-2 border px-2.5 py-1.5 w-full text-left transition-colors ${
                      selectedHistoryFile === msgAttachmentOffset + i
                        ? 'border-planton-accent bg-planton-accent/5'
                        : 'border-border bg-background hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center justify-center w-7 h-7 shrink-0 text-[10px] font-mono font-bold" style={badgeStyle}>
                      {att.ext ? att.ext.slice(0, 3).toUpperCase() : <FileText size={12} />}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-xs font-medium text-foreground truncate leading-tight">{att.name}</span>
                      <span className="text-[10px] text-muted-foreground leading-tight">{typeLabel}</span>
                    </div>
                    {pf?.status === 'processing' && (
                      <Loader2 size={12} className="animate-spin text-muted-foreground shrink-0" />
                    )}
                    {pf?.status === 'done' && (
                      <CheckCircle2 size={12} className="text-planton-accent shrink-0" />
                    )}
                  </button>
                )
              })}
            </div>
          )}
          {msg.hasInventoryData && msg.role === 'user' && (
            <span className="flex items-center gap-1 text-[10px] text-planton-accent font-medium mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-planton-accent shrink-0" />
              Dados de emissão detectados
            </span>
          )}
          {msg.role === 'assistant'
            ? <div className="prose prose-sm max-w-none dark:prose-invert [&_p]:text-[12px] [&_li]:text-[12px] [&_ol]:list-decimal [&_ul]:list-disc [&_li]:my-0.5 [&_p]:my-0 [&_p+p]:mt-2 [&_strong]:font-semibold" dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) as string }} />
            : msg.content
          }
          <span className={`block text-[10px] mt-1 opacity-60 ${msg.role === 'user' ? 'text-right' : 'text-left'} ${msg.variant ? '' : 'text-muted-foreground'}`}>
            {formatTime(msg.timestamp)}
          </span>
        </div>
      </div>
      )
    })
  }

  // ── Modal de exclusão de arquivo (renderizado em ambos os layouts) ────────
  function renderDeleteFileDialog() {
    const linkedCount = deleteFileTarget ? linkedRowsForFile(deleteFileTarget.index).length : 0
    return (
      <Dialog open={deleteFileTarget !== null} onOpenChange={(open) => { if (!open) setDeleteFileTarget(null) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Excluir arquivo</DialogTitle>
            <DialogDescription className="pt-2 leading-relaxed">
              Excluir <span className="font-medium text-foreground">&quot;{deleteFileTarget?.file.name}&quot;</span> também removerá os dados que este arquivo adicionou à planilha.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 rounded-md border border-border bg-muted/40 px-4 py-4">
            {linkedCount > 0 && (
              <p className="text-sm text-muted-foreground font-sans">
                Serão removidas{' '}
                <span className="font-medium text-foreground">
                  {linkedCount} {linkedCount === 1 ? 'linha' : 'linhas'}
                </span>{' '}
                da aba <span className="font-medium text-foreground">{activeCategory.schemas[0].label}</span> atreladas a este arquivo.
              </p>
            )}
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-md bg-destructive/8 border border-destructive/20 text-sm font-sans text-destructive">
              <AlertTriangle size={14} className="shrink-0" />
              Esta ação não pode ser desfeita.
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <button
              type="button"
              onClick={() => setDeleteFileTarget(null)}
              className="px-4 h-9 rounded-md text-sm font-sans border border-border bg-background text-foreground hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmDeleteFile}
              className="flex items-center gap-1.5 px-4 h-9 rounded-md text-sm font-sans font-medium bg-destructive text-white hover:bg-destructive/90 transition-colors"
            >
              Excluir arquivo
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  // ── Modal de reinício da categoria ────────────────────────────────────────
  function renderResetDialog() {
    return (
      <Dialog open={resetModalOpen} onOpenChange={setResetModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reiniciar {activeCategory.label}</DialogTitle>
            <DialogDescription className="pt-2 leading-relaxed">
              Reiniciar apaga toda a conversa e todos os dados desta categoria, voltando ao estado inicial.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 rounded-md border border-border bg-muted/40 px-4 py-4">
            <p className="text-sm text-muted-foreground font-sans">
              Serão removidos a conversa, os dados de todas as abas e os arquivos enviados de{' '}
              <span className="font-medium text-foreground">{activeCategory.label}</span>.
            </p>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-md bg-destructive/8 border border-destructive/20 text-sm font-sans text-destructive">
              <AlertTriangle size={14} className="shrink-0" />
              Esta ação não pode ser desfeita.
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <button
              type="button"
              onClick={() => setResetModalOpen(false)}
              className="px-4 h-9 rounded-md text-sm font-sans border border-border bg-background text-foreground hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmReset}
              className="px-4 h-9 rounded-md text-sm font-sans font-medium bg-destructive text-white hover:bg-destructive/90 transition-colors"
            >
              Reiniciar categoria
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  // ── Action bar (per-category, rendered inside canvas header) ──────────────
  function renderActionBar() {
    if (submitted) {
      return (
        <div className="flex items-center gap-2 text-xs font-sans">
          <CheckCircle2 size={13} className="text-planton-accent shrink-0" />
          <span className="text-planton-accent font-medium">Categoria enviada</span>
          <span className="text-white/50">· somente leitura</span>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs text-white/60 font-sans">
          {validationState === 'checking' ? (
            <>
              <Loader2 size={12} className="animate-spin" />
              <span>Verificando…</span>
            </>
          ) : validationState === 'has-issues' ? (
            <>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${issueCounts.errors > 0 ? 'bg-destructive' : 'bg-warning'}`} />
              <span>
                {issueCounts.errors > 0 ? (
                  <span className="text-red-400 font-medium">Corrija os erros e verifique novamente</span>
                ) : (
                  <span className="text-yellow-400 font-medium">Verifique novamente para enviar</span>
                )}
              </span>
            </>
          ) : validationState === 'ready' ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-planton-accent" />
              <span className="text-planton-accent font-medium">Categoria pronta para enviar</span>
            </>
          ) : isDirty ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-white/40" />
              <span className="text-white/60">Verifique a categoria antes de enviar</span>
            </>
          ) : (
            <span className="text-white/40">Edite ou acrescente dados para verificar</span>
          )}
        </div>

        <button
          onClick={handleVerify}
          disabled={validationState === 'checking' || !isDirty}
          className={`relative flex items-center gap-1.5 px-3 h-7 text-xs font-sans font-medium border transition-colors disabled:cursor-not-allowed ${
            isDirty && validationState !== 'checking'
              ? 'border-white/30 bg-white/15 text-white hover:bg-white/25 genius-btn-verify-ready'
              : 'border-white/15 bg-white/8 text-white/30'
          }`}
        >
          {validationState === 'checking' ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <CheckCircle2 size={12} />
          )}
          Verificar
        </button>

        <button
          key={glowKey}
          onClick={handleSubmit}
          disabled={validationState !== 'ready'}
          className={`flex items-center gap-1.5 px-3 h-7 text-xs font-sans font-medium transition-colors ${
            validationState === 'ready'
              ? 'bg-planton-accent text-white hover:bg-planton-accent/90 genius-btn-ready'
              : 'bg-white/10 text-white/30 cursor-not-allowed border border-white/10'
          }`}
        >
          <Send size={12} />
          Enviar
        </button>
      </div>
    )
  }

  // ── Estado vazio ──────────────────────────────────────────────
  if (viewMode === 'empty') {
    const hoveredCat = hoveredCategoryId ? categoriesData.find((c) => c.id === hoveredCategoryId) : null
    const bgUrl = hoveredCat
      ? `/assets_ilutracoes/Escopo_0${hoveredCat.scope}.jpg`
      : '/assets_ilutracoes/Escopo_todos.jpg'
    return (
      <>
        <GeniusNavbarSync breadcrumbs={[]} />
        {/* Container do empty-state — ref de coordenadas para o blur clipado */}
        <div ref={emptyStageRef} className="genius-empty-stage relative flex flex-col items-start justify-center h-full px-8 md:px-16 overflow-hidden">
          {/* Base sempre visível — Escopo_todos */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(/assets_ilutracoes/Escopo_todos.jpg)' }}
            aria-hidden
          />
          {/* Layers de escopo — fade-in sobre a base, sem crossfade simultâneo */}
          {[
            '/assets_ilutracoes/Escopo_01.jpg',
            '/assets_ilutracoes/Escopo_02.jpg',
            '/assets_ilutracoes/Escopo_03.jpg',
          ].map((url) => (
            <div
              key={url}
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
              style={{ backgroundImage: `url(${url})`, opacity: bgUrl === url ? 1 : 0 }}
              aria-hidden
            />
          ))}
          {/* Overlay — gradiente: mais escuro na direita, mais transparente à esquerda (onde fica o card) */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 100%)' }} aria-hidden />

          {/* Legenda — categoria/escopo sob hover, canto inferior */}
          <div className="absolute bottom-0 inset-x-0 z-10 p-6 md:p-8 bg-gradient-to-t from-black/50 to-transparent pointer-events-none">
            <p className="text-white/90 text-sm font-sans font-medium drop-shadow transition-opacity duration-300">
              {hoveredCat ? `Escopo ${hoveredCat.scope} · ${hoveredCat.label}` : 'Todos os escopos'}
            </p>
          </div>

          {/* Glass card */}
          <div ref={emptyCardRef} className="genius-empty-card relative z-10 flex flex-col items-start gap-5 px-5 py-6 sm:px-8 sm:py-8 max-w-sm w-full overflow-hidden" style={{ viewTransitionName: 'genius-canvas' }}>
            {/* Blur base sempre visível */}
            <div
              className="genius-card-blur absolute z-0 bg-cover bg-center"
              style={{ backgroundImage: 'url(/assets_ilutracoes/Escopo_todos.jpg)' }}
              aria-hidden
            />
            {/* Blur layers de escopo — fade-in sobre a base */}
            {[
              '/assets_ilutracoes/Escopo_01.jpg',
              '/assets_ilutracoes/Escopo_02.jpg',
              '/assets_ilutracoes/Escopo_03.jpg',
            ].map((url) => (
              <div
                key={url}
                className="genius-card-blur absolute z-0 bg-cover bg-center transition-opacity duration-500"
                style={{ backgroundImage: `url(${url})`, opacity: bgUrl === url ? 1 : 0 }}
                aria-hidden
              />
            ))}
            {/* Tint por cima do blur */}
            <div className="absolute inset-0 z-0 bg-black/25 dark:bg-black/35" aria-hidden />

            <div className="relative z-10 flex flex-col items-start">
              <p className="text-white text-xl sm:text-2xl font-heading font-normal leading-snug text-left text-balance drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                {userName
                  ? `Olá, ${userName}! Por onde vamos começar o inventário de emissões?`
                  : 'Por onde você quer começar o inventário de emissões?'}
              </p>
            </div>
            <div className="relative z-10 grid grid-cols-2 gap-2 w-full">
              {categoriesData.map((cat, i) => (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.id)}
                  onMouseEnter={() => setHoveredCategoryId(cat.id)}
                  onMouseLeave={() => setHoveredCategoryId(null)}
                  style={{ animationDelay: `${260 + i * 70}ms` }}
                  className="genius-chip flex items-center gap-2 px-3 py-2.5 border border-white/20 bg-white/10 text-sm font-sans text-white hover:bg-white/20"
                >
                  <CategoryIcon icon={cat.icon} categoryId={cat.id} variant="hover" className="text-white/80" />
                  <span className="truncate text-left text-xs">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </>
    )
  }

  // ── Estado chat (split sem tabela — aguardando dados de inventário) ──
  // Mobile força o chat mesmo em viewMode 'split' (ex: tablet rotacionado p/ retrato com split ativo):
  // a tabela densa é experiência de tela larga, então degrada para o layout de chat + banner.
  if (viewMode === 'chat' || (isMobile && viewMode === 'split')) {
    return (
      <div className="flex flex-col h-full">
        <GeniusNavbarSync breadcrumbs={[]} />
        <div className="relative flex flex-col flex-1 overflow-hidden md:px-6 md:pt-5 md:pb-8">
          {/* Imagem de fundo persistente — borrada e escurecida */}
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/assets_ilutracoes/Escopo_todos.jpg)' }} aria-hidden />
          <div className="absolute inset-0 bg-black/55" aria-hidden />

          {/* Header glass — fora do canvas branco, diretamente sobre a imagem */}
          <div className="genius-canvas-header relative z-10 flex items-center px-4 h-12 shrink-0 gap-2">
            {/* Mobile: hamburguer esquerda */}
            {isMobile && (
              <button
                onClick={() => setCategoriesOpen((v) => !v)}
                className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-white/10 transition-colors text-white/80 hover:text-white shrink-0"
                aria-label="Categorias"
              >
                <PanelLeftOpen size={16} />
              </button>
            )}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <activeCategory.icon size={16} className="text-white/70 shrink-0" />
              <h2 className="text-sm font-semibold text-white font-sans truncate">
                {activeCategory.label}
              </h2>
            </div>
            {!isMobile && (
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setCategoriesOpen((v) => !v)}
                  className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                  aria-label={categoriesOpen ? 'Recolher categorias' : 'Expandir categorias'}
                  title={categoriesOpen ? 'Recolher categorias' : 'Expandir categorias'}
                >
                  {categoriesOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
                </button>
              </div>
            )}
          </div>

          <div className="relative flex flex-1 overflow-hidden bg-background md:border md:border-border md:shadow-[4px_4px_0px_0px_hsl(var(--foreground))]" style={{ viewTransitionName: 'genius-canvas' }}>
            <div className="flex flex-col flex-1 overflow-hidden">

              {/* Corpo: sidebar categorias + chat full width */}
              <div className="flex flex-1 overflow-hidden relative">

                {/* Backdrop — só mobile, quando a sidebar overlay está aberta */}
                {isMobile && categoriesOpen && (
                  <div
                    onClick={() => setCategoriesOpen(false)}
                    className="absolute inset-0 z-20 bg-foreground/20"
                    aria-hidden
                  />
                )}

                {/* Sidebar categorias — overlay no mobile, coluna no desktop */}
                <div
                  className={`shrink-0 overflow-y-auto overflow-x-hidden py-2 transition-[width] duration-200 genius-enter-sidebar-left ${
                    isMobile
                      ? `absolute inset-y-0 left-0 z-30 bg-background shadow-xl border-r border-border ${categoriesOpen ? 'w-64' : 'w-0 border-0 overflow-hidden'}`
                      : `border-r border-border bg-muted/20 ${categoriesOpen ? 'w-56' : 'w-12'}`
                  }`}
                >
                  {([1, 2, 3] as const).map((scope) => {
                    const scopeCats = categoriesData.filter((c) => c.scope === scope)
                    if (scopeCats.length === 0) return null
                    return (
                      <div key={scope} className="flex flex-col">
                        {categoriesOpen && (
                          <div className="px-3 pt-3 pb-1 text-[9px] uppercase tracking-wider text-muted-foreground/60 font-medium">
                            Escopo {scope}
                          </div>
                        )}
                        {!categoriesOpen && scope > 1 && <div className="mx-3 my-1 border-t border-border/40" />}
                        <ul className="flex flex-col">
                          {scopeCats.map((cat) => {
                            const Icon = cat.icon
                            const isActive = cat.id === activeCategoryId
                            return (
                              <li key={cat.id}>
                                <button
                                  onClick={() => handleSelectCategory(cat.id)}
                                  title={!categoriesOpen ? cat.label : undefined}
                                  className={`w-full flex items-center ${categoriesOpen ? 'gap-2.5 px-3 justify-start' : 'justify-center px-0'} py-2 text-xs font-sans transition-colors border-l-2 ${
                                    isActive ? 'border-planton-accent' : 'border-transparent'
                                  } ${
                                    isActive
                                      ? 'bg-background text-foreground font-medium'
                                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                                  }`}
                                >
                                  <Icon size={15} className="shrink-0" />
                                  {categoriesOpen && <span className="truncate text-left">{cat.label}</span>}
                                </button>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    )
                  })}
                </div>

                {/* Chat full width */}
                <div className="flex flex-col flex-1 overflow-hidden relative genius-enter-sidebar-right">
                  <div className="hidden md:block px-4 py-3 border-b border-border shrink-0">
                    <h3 className="text-xs font-semibold text-foreground font-sans">
                      Envie dados de {activeCategory.label.toLowerCase()}
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-1 leading-snug">{activeCategory.hint}</p>
                  </div>

                  <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
                    <div className="flex flex-col gap-3 max-w-2xl mx-auto">
                      {renderMessages(activeChat, { wide: true, size: 'xs' })}
                      <div ref={bottomRef} />
                    </div>
                  </div>

                  <div className="shrink-0 bg-background px-4 pb-4">
                    <div className="max-w-2xl mx-auto">
                      <GeniusChatComposer
                        input={input}
                        onChange={setInput}
                        onSend={handleSend}
                        onSentFileClick={handleSentFileClick}
                        placeholder="Envie dados ou faça uma pergunta…"
                        disabled={submitted}
                        fileProcessingStatus={(id) => processingFiles.find((p) => p.id === id)?.status}
                        mobileInventoryBanner={isMobile && hasInventoryInChat}
                        onRequestDeleteFile={handleRequestDeleteFile}
                        deleteFileRef={deleteFileRef}
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
        {renderDeleteFileDialog()}
      </div>
    )
  }

  // ── Estado split (canvas com categorias + tabela + chat + abas) ──
  return (
    <div className="flex flex-col h-full">
      <GeniusNavbarSync breadcrumbs={[]} />
      <div className="relative flex flex-col flex-1 overflow-hidden px-6 pt-5 pb-8">
        {/* Imagem de fundo persistente — borrada e escurecida */}
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/assets_ilutracoes/Escopo_todos.jpg)' }} aria-hidden />
        <div className="absolute inset-0 bg-black/55" aria-hidden />

        {/* Header glass — outside canvas, directly over image */}
        <div className="genius-canvas-header relative z-10 flex items-center px-4 h-12 shrink-0">
            {/* Esquerda: ícone + label categoria */}
            <div className="flex items-center gap-2 min-w-0">
              <activeCategory.icon size={16} className="text-white/70 shrink-0" />
              <h2 className="text-sm font-semibold text-white font-sans truncate">
                {activeCategory.label}
              </h2>
              <span className="text-xs text-white/50 hidden sm:inline">
                {isResumoActive
                  ? '·  Resumo'
                  : `·  ${activeSchema.label}`}
              </span>
            </div>

            {/* Centro: action bar — absolutamente centralizado */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
              {renderActionBar()}
            </div>

            {/* Direita: toggles */}
            <div className="flex items-center justify-end ml-auto">
              <button
                onClick={() => setCategoriesOpen((v) => !v)}
                className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                aria-label={categoriesOpen ? 'Recolher categorias' : 'Expandir categorias'}
                title={categoriesOpen ? 'Recolher categorias' : 'Expandir categorias'}
              >
                {categoriesOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
              </button>
              <button
                onClick={() => setChatOpen((v) => !v)}
                className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                aria-label={chatOpen ? 'Recolher chat' : 'Expandir chat'}
                title={chatOpen ? 'Recolher chat' : 'Expandir chat'}
              >
                {chatOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
              </button>
            </div>
          </div>

        <div className={`relative flex flex-1 overflow-hidden bg-background border border-border shadow-[4px_4px_0px_0px_hsl(var(--foreground))] ${!splitMounted ? 'genius-enter-canvas' : ''}`}>
        <div className="flex flex-col flex-1 overflow-hidden">

          {/* Corpo: categorias + tabela + chat */}
          <div className="flex flex-1 overflow-hidden">

            {/* Sidebar categorias */}
            <div className={`${categoriesOpen ? 'w-56' : 'w-12'} shrink-0 border-r border-border overflow-y-auto overflow-x-hidden py-2 bg-muted/20 transition-[width] duration-200 ${!splitMounted ? 'genius-enter-sidebar-left' : ''}`}>
              {([1, 2, 3] as const).map((scope) => {
                const scopeCats = categoriesData.filter((c) => c.scope === scope)
                if (scopeCats.length === 0) return null
                return (
                  <div key={scope} className="flex flex-col">
                    {categoriesOpen && (
                      <div className="px-3 pt-3 pb-1 text-[9px] uppercase tracking-wider text-muted-foreground/60 font-medium">
                        Escopo {scope}
                      </div>
                    )}
                    {!categoriesOpen && scope > 1 && <div className="mx-3 my-1 border-t border-border/40" />}
                    <ul className="flex flex-col">
                      {scopeCats.map((cat) => {
                        const Icon = cat.icon
                        const isActive = cat.id === activeCategoryId
                        const isCatSubmitted = submittedCategories.has(cat.id)
                        const worst = getCategoryWorstStatus(cat)
                        const borderClass = isActive
                          ? 'border-planton-accent'
                          : worst
                            ? STATUS_BORDER_CLASS[worst]
                            : 'border-transparent'
                        return (
                          <li key={cat.id}>
                            <button
                              onClick={() => handleSelectCategory(cat.id)}
                              title={!categoriesOpen ? cat.label : undefined}
                              className={`w-full flex items-center ${categoriesOpen ? 'gap-2.5 px-3 justify-start' : 'justify-center px-0'} py-2 text-xs font-sans transition-colors border-l-2 ${borderClass} ${
                                isActive
                                  ? 'bg-background text-foreground font-medium'
                                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                              }`}
                            >
                              <span className="relative shrink-0">
                                <Icon size={15} />
                                {isCatSubmitted ? (
                                  <span
                                    className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-planton-accent ring-1 ring-background"
                                  />
                                ) : worst && (
                                  <span
                                    className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${STATUS_DOT_CLASS[worst]} ring-1 ring-background`}
                                  />
                                )}
                              </span>
                              {categoriesOpen && <span className="truncate text-left">{cat.label}</span>}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )
              })}
            </div>

            {/* Centro: tabela + rodapé abas */}
            <div className={`flex flex-col flex-1 overflow-hidden genius-split-expand ${splitMounted ? 'max-w-full opacity-100' : 'max-w-0 opacity-0'}`}>
              <div className="flex flex-col flex-1 min-h-0">
                {schemaProcessingCount(activeSchemaId) > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/40 shrink-0 text-xs font-sans text-muted-foreground">
                    <Loader2 size={12} className="animate-spin shrink-0" />
                    <span>
                      {(() => {
                        const pfs = processingFiles.filter(
                          (p) => p.categoryId === activeCategoryId && p.schemaId === activeSchemaId && p.status === 'processing'
                        )
                        return pfs.length === 1
                          ? `Processando ${pfs[0].name}…`
                          : `Processando ${pfs.length} arquivos…`
                      })()}
                    </span>
                    <span className="text-muted-foreground/60">Novas linhas serão adicionadas em breve.</span>
                  </div>
                )}
                {isResumoActive ? (
                  <ResumoTab
                    schemas={activeCategory.schemas}
                    validationState={validationState}
                    onCellClick={handleSelectSchema}
                    pendingUnidades={['Escritório Curitiba', 'Filial Fortaleza', 'Hub Manaus', 'Loja Brasília', 'Loja Porto Alegre']}
                  />
                ) : (
                  <div className="flex flex-col flex-1 min-h-0">
                    {!submitted && (
                      <GridToolbar
                        selection={selectedCellInfo}
                        onDelete={() => { clearGridSelectionRef.current?.(); setSelectedCellInfo({ type: 'cells', count: 0 }); markDirty() }}
                        search={gridSearch}
                        onSearchChange={setGridSearch}
                      />
                    )}
                    <div className="flex-1 min-h-0">
                      <InventoryDataGrid columns={activeSchema.columns} rows={activeSchema.rows} readOnly={submitted || schemaProcessingCount(activeSchemaId) > 0} highlightedRows={highlightedRows} onSelectionChange={setSelectedCellInfo} clearSelectionRef={clearGridSelectionRef} onEdit={markDirty} />
                    </div>
                  </div>
                )}
              </div>

              {/* Abas Excel */}
              <div className="flex items-stretch h-9 border-t border-border bg-muted/30 shrink-0 overflow-x-auto">
                {/* Aba Resumo — sempre primeiro */}
                <button
                  onClick={() => handleSelectSchema(RESUMO_ID)}
                  className={`px-4 text-xs font-sans whitespace-nowrap transition-colors border-r border-border flex items-center gap-1.5 ${
                    isResumoActive
                      ? 'bg-background text-foreground font-medium border-t-2 border-t-planton-accent -mt-px'
                      : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                  }`}
                >
                  <Table2 size={11} />
                  Resumo
                </button>
                {activeCategory.schemas.map((schema) => {
                  const isActive = schema.id === activeSchemaId
                  const worst = getSchemaWorstStatus(schema)
                  const showProcessingDot = !worst && schemaProcessingCount(schema.id) > 0
                  return (
                    <button
                      key={schema.id}
                      onClick={() => handleSelectSchema(schema.id)}
                      className={`px-4 text-xs font-sans whitespace-nowrap transition-colors border-r border-border flex items-center gap-2 ${
                        isActive
                          ? 'bg-background text-foreground font-medium border-t-2 border-t-planton-accent -mt-px'
                          : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                      }`}
                    >
                      {worst ? (
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_DOT_CLASS[worst]}`} />
                      ) : showProcessingDot ? (
                        <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-muted-foreground/50 animate-pulse" />
                      ) : null}
                      {schema.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Sidebar chat */}
            {chatOpen ? (
              <div className="shrink-0 border-l border-border relative overflow-hidden flex flex-col" style={{ width: chatWidth }}>
                {/* Drag handle */}
                <div
                  onMouseDown={handleChatDragStart}
                  className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-planton-accent/30 z-20 transition-colors"
                />
                {!filesExpanded && (
                  <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
                    <div className="flex flex-col gap-3">
                      {renderMessages(activeChat, { size: 'xs' })}
                      <div ref={bottomRef} />
                    </div>
                  </div>
                )}

                <div className={`${filesExpanded ? 'flex-1 flex flex-col overflow-hidden' : 'shrink-0'} bg-background px-3 pb-3`}>
                  <GeniusChatComposer
                    input={input}
                    onChange={setInput}
                    onSend={handleSend}
                    onSentFileClick={handleSentFileClick}
                    onClearSelection={() => { clearGridSelectionRef.current?.(); setSelectedCellInfo({ type: 'cells', count: 0 }) }}
                    placeholder="Pergunte ou envie mais dados…"
                    disabled={submitted}
                    selectionContext={selectedCellInfo}
                    fileProcessingStatus={(id) => processingFiles.find((p) => p.id === id)?.status}
                    filesExpanded={filesExpanded}
                    onFilesExpandedChange={setFilesExpanded}
                    onRequestDeleteFile={handleRequestDeleteFile}
                    deleteFileRef={deleteFileRef}
                    showReset
                    onRequestReset={handleRequestReset}
                    resetFilesRef={resetFilesRef}
                  />
                </div>
              </div>
            ) : (
              /* Collapsed chat sidebar — w-12, 4 ícones verticais */
              <div className="w-12 shrink-0 border-l border-border flex flex-col items-center py-2 gap-1 bg-muted/20">
                <input
                  ref={collapsedFileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? [])
                    if (files.length > 0) {
                      handleSend(files)
                      setChatOpen(true)
                    }
                    e.target.value = ''
                  }}
                />
                <button
                  onClick={() => collapsedFileInputRef.current?.click()}
                  disabled={submitted}
                  title="Anexar arquivo"
                  className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Paperclip size={16} />
                </button>
                <button
                  onClick={() => setChatOpen(true)}
                  title="Abrir chat"
                  className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  <MessageSquare size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>

      <Dialog open={submitModalOpen} onOpenChange={(open) => { if (!open) handleCloseSubmitModal() }}>
        <DialogContent className="sm:max-w-md">
          {submitPhase === 'form' ? (
            <>
              <DialogHeader>
                <DialogTitle>
                  Enviar {activeCategory.label}
                </DialogTitle>
                <DialogDescription className="pt-2 leading-relaxed">
                  Após o envio, os dados dessa categoria serão registrados oficialmente e não poderão ser editados.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-5 rounded-md border border-border bg-muted/40 px-4 py-4">
                <p className="text-sm text-muted-foreground font-sans">
                  Confirme que revisou todos os dados e não há mais nada a acrescentar.
                </p>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="confirm-input" className="text-sm text-muted-foreground font-sans">
                    Digite <span className="font-mono font-semibold text-foreground">"{activeCategory.label}"</span> para confirmar:
                  </label>
                  <input
                    id="confirm-input"
                    type="text"
                    value={submitConfirmText}
                    onChange={(e) => setSubmitConfirmText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && submitConfirmText.trim().toLowerCase() === activeCategory.label.toLowerCase()) handleConfirmSubmit() }}
                    autoComplete="off"
                    autoFocus
                    className="px-3 py-2 rounded-md border border-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-planton-accent focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-md bg-destructive/8 border border-destructive/20 text-sm font-sans text-destructive">
                  <AlertTriangle size={14} className="shrink-0" />
                  Esta ação não pode ser desfeita.
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-2">
                <button
                  type="button"
                  onClick={handleCloseSubmitModal}
                  className="px-4 h-9 rounded-md text-sm font-sans border border-border bg-background text-foreground hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSubmit}
                  disabled={submitConfirmText.trim().toLowerCase() !== activeCategory.label.toLowerCase()}
                  className="flex items-center gap-1.5 px-4 h-9 rounded-md text-sm font-sans font-medium bg-planton-accent text-white hover:bg-planton-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={14} />
                  Enviar {activeCategory.label}
                </button>
              </DialogFooter>
            </>
          ) : (
            <SubmitSuccess
              category={activeCategory}
              submittedCount={submittedCategories.size}
              totalCount={categoriesData.length}
              onClose={handleCloseSubmitModal}
            />
          )}
        </DialogContent>
      </Dialog>

      {renderDeleteFileDialog()}
      {renderResetDialog()}
    </div>
  )
}

// ── Tela de sucesso pós-envio (dentro do mesmo modal) ─────────────────────
function SubmitSuccess({
  category,
  submittedCount,
  totalCount,
  onClose,
}: {
  category: EmissionCategory
  submittedCount: number
  totalCount: number
  onClose: () => void
}) {
  const stats = SUBMIT_STATS[category.id] ?? DEFAULT_SUBMIT_STATS
  const remaining = Math.max(totalCount - submittedCount, 0)
  const progress = totalCount > 0 ? submittedCount / totalCount : 0
  const catIndex = CATEGORIES.findIndex((c) => c.id === category.id)
  const insight = CLIMATE_INSIGHTS[(catIndex < 0 ? 0 : catIndex) % CLIMATE_INSIGHTS.length]

  return (
    <div className="genius-success-enter flex flex-col items-center text-center pt-2">
      <DialogTitle className="sr-only">Categoria {category.label} registrada no inventário</DialogTitle>

      {/* Ícone da categoria — pop + ring pulsante + cinético + confete */}
      <div className="relative mb-4">
        <Confetti />
        <div className="genius-success-icon genius-success-ring relative flex items-center justify-center w-16 h-16 rounded-full bg-planton-accent/12">
          <CategoryIcon icon={category.icon} categoryId={category.id} size={30} variant="loop" className="text-planton-accent" />

          <span className="absolute -bottom-1 -right-1 flex items-center justify-center w-6 h-6 rounded-full bg-planton-accent text-white ring-2 ring-background">
            <CheckCircle2 size={14} />
          </span>
        </div>
      </div>

      <h2 className="text-lg font-heading font-normal text-planton-forest dark:text-foreground">
        Categoria registrada
      </h2>
      <p className="text-sm text-muted-foreground mt-1 max-w-xs leading-relaxed">
        <span className="font-medium text-foreground">{category.label}</span> consolidada. O inventário foi atualizado automaticamente.
      </p>

      {/* Progresso do inventário — elemento principal */}
      <div className="genius-success-cta w-full mt-5 p-4 border border-border bg-muted/20 text-left" style={{ animationDelay: '200ms' }}>
        <div className="flex items-end justify-between gap-2 mb-2">
          <div>
            <span className="text-sm font-sans font-semibold text-foreground">
              {submittedCount} {submittedCount === 1 ? 'categoria concluída' : 'categorias concluídas'}
            </span>
            {remaining > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">
                Faltam <span className="font-medium text-foreground">{remaining}</span> para finalizar o inventário
              </p>
            )}
            {remaining === 0 && (
              <p className="text-xs text-planton-accent font-medium mt-0.5">
                Inventário completo
              </p>
            )}
          </div>
          <span className="text-[10px] text-muted-foreground/40 tabular-nums shrink-0">{Math.round(progress * 100)}%</span>
        </div>
        <div className="h-1 w-full bg-planton-accent/15 overflow-hidden">
          <div className="genius-progress-bar h-full w-full bg-planton-accent" style={{ ['--progress' as string]: progress }} />
        </div>
      </div>

      {/* Métricas operacionais — informação secundária */}
      <div className="grid grid-cols-2 gap-2 w-full mt-3">
        {[
          { value: stats.registros, decimals: 0, label: 'registros processados', delay: 320 },
          { value: stats.filiais,   decimals: 0, label: 'filiais incluídas',     delay: 420 },
        ].map((s, i) => (
          <div
            key={i}
            className="genius-success-stat flex flex-col items-center gap-0.5 py-3 px-2 border border-border bg-muted/30"
            style={{ animationDelay: `${s.delay}ms` }}
          >
            <span className="text-xl font-heading font-normal text-foreground tabular-nums leading-none">
              <CountUp value={s.value} decimals={s.decimals} delayMs={s.delay + 120} />
            </span>
            <span className="text-xs text-muted-foreground leading-tight">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Insight corporativo rotativo */}
      <div className="genius-success-stat w-full mt-3 px-3.5 py-3 border border-border/60 bg-background text-left" style={{ animationDelay: '540ms' }}>
        <span className="block text-[10px] uppercase tracking-widest text-muted-foreground/50 font-sans font-medium mb-1.5">Insight Climático</span>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {insight}
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mt-4 px-5 h-9 rounded-md text-sm font-sans font-medium bg-planton-accent text-white hover:bg-planton-accent/90 transition-colors"
      >
        {remaining > 0 ? 'Próxima categoria' : 'Concluir'}
      </button>
    </div>
  )
}
