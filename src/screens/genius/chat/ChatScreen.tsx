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
import { GeniusNavbarSync } from '@/components/navigation/GeniusNavbarSync'
import { GeniusChatComposer } from '@/components/genius/GeniusChatComposer'
import { InventoryDataGrid } from '@/components/genius/InventoryDataGrid'
import { ResumoTab } from '@/components/genius/ResumoTab'
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

export function ChatScreen() {
  const [input, setInput] = useState('')
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

  const [highlightedRows, setHighlightedRows] = useState<number[]>([])
  const [selectedCellCount, setSelectedCellCount] = useState(0)
  const [selectedHistoryFile, setSelectedHistoryFile] = useState<number | null>(null)
  const clearGridSelectionRef = useRef<(() => void) | null>(null)

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

  const [submitModalOpen, setSubmitModalOpen] = useState(false)
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
    const nextClicks = (verifyClicksByCategory[activeCategoryId] ?? 0) + 1
    setVerifyClicksByCategory((prev) => ({ ...prev, [activeCategoryId]: nextClicks }))
    setValidationByCategory((prev) => ({ ...prev, [activeCategoryId]: 'checking' }))

    setTimeout(() => {
      const activeCategory = categoriesData.find((c) => c.id === activeCategoryId)!
      if (nextClicks >= 3) {
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
    setSubmitModalOpen(true)
  }

  function handleConfirmSubmit() {
    const activeCategory = categoriesData.find((c) => c.id === activeCategoryId)!
    setSubmitModalOpen(false)
    setValidationByCategory((prev) => ({ ...prev, [activeCategoryId]: 'idle' }))
    setVerifyClicksByCategory((prev) => ({ ...prev, [activeCategoryId]: 0 }))
    setSubmitConfirmText('')
    setSubmittedCategories((prev) => new Set([...prev, activeCategoryId]))
    pushChatMsg(activeCategoryId, `${activeCategory.label} enviado com sucesso! Os dados foram registrados oficialmente.`, 'success')
  }

  const bottomRef = useRef<HTMLDivElement>(null)

  const activeCategory = categoriesData.find((c) => c.id === activeCategoryId) ?? findCategory(activeCategoryId)
  const RESUMO_ID = '__resumo__'
  const activeSchemaId = activeSchemaByCategory[activeCategoryId] ?? activeCategory.schemas[0].id
  const isResumoActive = activeSchemaId === RESUMO_ID
  const activeSchema = activeCategory.schemas.find((s) => s.id === activeSchemaId) ?? activeCategory.schemas[0]
  const activeChat = chatsByCategory[activeCategoryId] ?? []
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
        ? `Identifiquei dados de ${activeCategory.label.toLowerCase()} na sua mensagem. Adicionei à guia "${activeSchema.label}". Deseja ajustar algum valor?`
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

    if (isInventory) {
      setViewMode('split')
    } else if (viewMode === 'empty') {
      setViewMode('chat')
    }

    return newProcessingFiles.map((p) => p.id)
  }

  function handleSelectCategory(id: string) {
    setActiveCategoryId(id)
    if (viewMode === 'empty') setViewMode('chat')
  }

  function handleSelectSchema(id: string) {
    setActiveSchemaByCategory((prev) => ({ ...prev, [activeCategoryId]: id }))
  }

  // ── Onboarding message JSX ───────────────────────────────────────────────
  function OnboardingMessage({ timestamp }: { timestamp: Date }) {
    return (
      <div className="flex flex-col gap-3 text-foreground">
        <p>Ótimo, os dados estão na planilha! Agora entramos na fase de preenchimento — deixa eu te mostrar como funciona:</p>

        <div className="flex flex-col gap-6">
          <div className="flex gap-2.5">
            <span className="shrink-0 mt-0.5">1.</span>
            <p><span className="font-semibold">Edite diretamente nas células</span> — Clique em qualquer célula e edite à vontade. Cada aba corresponde a um schema desta categoria. A estrutura de colunas é fixa e não pode ser alterada.</p>
          </div>

          <div className="flex gap-2.5">
            <span className="shrink-0 mt-0.5">2.</span>
            <p><span className="font-semibold">Ou me peça para editar</span> — Se preferir, descreva aqui o que precisa e eu faço as alterações na planilha.</p>
          </div>

          <div className="flex gap-2.5">
            <span className="shrink-0 mt-0.5">3.</span>
            <div className="flex flex-col gap-1.5">
              <p><span className="font-semibold">Selecione linhas para me dar contexto</span> — Ao clicar em uma ou mais linhas da planilha, elas são automaticamente enviadas como contexto para mim. Atenção: seleções muito extensas podem reduzir a precisão da análise.</p>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-planton-accent/10 text-planton-accent text-[10px] font-sans font-medium border border-planton-accent/25 w-fit">
                3 células selecionadas no contexto
                <span className="ml-0.5 opacity-60 cursor-default"><X size={9} /></span>
              </span>
            </div>
          </div>

          <div className="flex gap-2.5">
            <span className="shrink-0 mt-0.5">4.</span>
            <div className="flex flex-col gap-1.5">
              <p><span className="font-semibold">Envie arquivos a qualquer momento</span> — Planilhas e PDFs aqui no chat:</p>
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

          <div className="flex gap-2.5">
            <span className="shrink-0 mt-0.5">5.</span>
            <div className="flex flex-col gap-1">
              <p>
                Clique em{' '}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-border bg-background text-[10px] font-medium align-middle mx-0.5">
                  <CheckCircle2 size={9} />
                  Verificar
                </span>
                {' '}para checar o preenchimento
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

          <div className="flex gap-2.5">
            <span className="shrink-0 mt-0.5">6.</span>
            <p>
              Acesse a aba{' '}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-border bg-background text-[10px] font-medium align-middle mx-0.5">
                <Table2 size={9} />
                Resumo
              </span>
              {' '}para visualizar o estado de todos os schemas desta categoria de uma só vez.
            </p>
          </div>

          <div className="flex gap-2.5">
            <span className="shrink-0 mt-0.5">7.</span>
            <div>
              <p>
                <span className="font-semibold">Quando estiver pronto, clique em{' '}</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-planton-accent text-white text-[10px] font-medium align-middle mx-0.5">
                  <Send size={9} />
                  Enviar
                </span>
                {' '}— disponível quando não houver erros bloqueantes.
              </p>
            </div>
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

  function renderMessages(msgs: ChatMessage[], wide?: boolean) {
    let attachmentOffset = 0
    return msgs.map((msg) => {
      const msgAttachmentOffset = attachmentOffset
      attachmentOffset += msg.attachments?.length ?? 0
      if (msg.isOnboarding) {
        return (
          <div key={msg.id} className="flex justify-start">
            <div className={`${wide ? 'max-w-[80%]' : 'max-w-[90%]'} px-3 py-2.5 ${wide ? 'text-sm' : 'text-xs'} font-sans leading-relaxed`}>
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
          className={`${wide ? 'max-w-[80%]' : 'max-w-[90%]'} px-3 py-2.5 ${wide ? 'text-sm' : 'text-xs'} font-sans leading-relaxed ${msg.role === 'assistant' && !msg.variant ? 'rounded-2xl' : ''} ${
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
            ? <div className="prose prose-xs max-w-none dark:prose-invert [&_ol]:list-decimal [&_ul]:list-disc [&_li]:my-0.5 [&_p]:my-0 [&_p+p]:mt-2 [&_strong]:font-semibold" dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) as string }} />
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

  // ── Action bar (per-category, rendered inside canvas header) ──────────────
  function renderActionBar() {
    if (submitted) {
      return (
        <div className="flex items-center gap-2 text-xs font-sans">
          <CheckCircle2 size={13} className="text-planton-accent shrink-0" />
          <span className="text-planton-accent font-medium">Categoria enviada</span>
          <span className="text-muted-foreground">· somente leitura</span>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-sans">
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
                  <span className="text-destructive font-medium">Corrija os erros e verifique novamente</span>
                ) : (
                  <span className="text-warning font-medium">Verifique novamente para enviar</span>
                )}
              </span>
            </>
          ) : validationState === 'ready' ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-planton-accent" />
              <span className="text-planton-accent font-medium">Categoria pronta para enviar</span>
            </>
          ) : (
            <span>Verifique a categoria antes de enviar</span>
          )}
        </div>


        <button
          onClick={handleVerify}
          disabled={validationState === 'checking'}
          className="flex items-center gap-1.5 px-3 h-7 text-xs font-sans font-medium border border-border bg-background text-foreground hover:bg-muted transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
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
              : 'bg-muted text-muted-foreground cursor-not-allowed'
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
    return (
      <>
        <GeniusNavbarSync breadcrumbs={[]} />
        <div className="flex flex-col items-center justify-center h-full px-8 gap-10">
          <div className="flex flex-col items-center gap-4">
            <img
              src="/logos_planton/planton_square_inside.svg"
              alt="Planton"
              className="h-14 w-auto"
            />
            <p className="text-planton-forest dark:text-foreground text-4xl font-heading font-normal leading-[1.2] text-center max-w-2xl">
              Por onde você quer começar<br />
              o inventário de emissões?
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
            {categoriesData.map((cat) => {
              const Icon = cat.icon
              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.id)}
                  className="flex items-center gap-2.5 px-5 py-3 border border-border bg-background text-sm font-sans text-foreground hover:bg-muted hover:border-planton-accent/40 transition-colors"
                >
                  <Icon size={16} className="text-muted-foreground shrink-0" />
                  {cat.label}
                </button>
              )
            })}
          </div>
        </div>
      </>
    )
  }

  // ── Estado chat (split sem tabela — aguardando dados de inventário) ──
  if (viewMode === 'chat') {
    return (
      <div className="flex flex-col h-full">
        <GeniusNavbarSync breadcrumbs={[]} />
        <div className="flex flex-col flex-1 overflow-hidden bg-muted px-6 pt-5 pb-8 dark:bg-muted/60 gap-4">

          <div className="flex flex-1 overflow-hidden bg-background border border-border shadow-[4px_4px_0px_0px_hsl(var(--foreground))] genius-enter-canvas">
            <div className="flex flex-col flex-1 overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between px-4 h-12 border-b border-border shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <activeCategory.icon size={16} className="text-muted-foreground shrink-0" />
                  <h2 className="text-sm font-semibold text-foreground font-sans truncate">
                    {activeCategory.label}
                  </h2>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setCategoriesOpen((v) => !v)}
                    className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    aria-label={categoriesOpen ? 'Recolher categorias' : 'Expandir categorias'}
                    title={categoriesOpen ? 'Recolher categorias' : 'Expandir categorias'}
                  >
                    {categoriesOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
                  </button>
                </div>
              </div>

              {/* Corpo: sidebar categorias + chat full width */}
              <div className="flex flex-1 overflow-hidden">

                {/* Sidebar categorias */}
                <div className={`${categoriesOpen ? 'w-56' : 'w-12'} shrink-0 border-r border-border overflow-y-auto overflow-x-hidden py-2 bg-muted/20 transition-[width] duration-200 genius-enter-sidebar-left`}>
                  {categoriesOpen && (
                    <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                      Categorias
                    </div>
                  )}
                  <ul className="flex flex-col">
                    {categoriesData.map((cat) => {
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

                {/* Chat full width */}
                <div className="flex flex-col flex-1 overflow-hidden relative genius-enter-sidebar-right">
                  <div className="px-4 py-3 border-b border-border shrink-0">
                    <h3 className="text-xs font-semibold text-foreground font-sans">
                      Envie dados de {activeCategory.label.toLowerCase()}
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-1 leading-snug">{activeCategory.hint}</p>
                  </div>

                  <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
                    <div className="flex flex-col gap-3 max-w-2xl mx-auto">
                      {renderMessages(activeChat, true)}
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
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }

  // ── Estado split (canvas com categorias + tabela + chat + guias) ──
  return (
    <div className="flex flex-col h-full">
      <GeniusNavbarSync breadcrumbs={[]} />
      <div className="flex flex-col flex-1 overflow-hidden bg-muted px-6 pt-5 pb-8 dark:bg-muted/60 gap-4">

        <div className={`flex flex-1 overflow-hidden bg-background border border-border shadow-[4px_4px_0px_0px_hsl(var(--foreground))] ${!splitMounted ? 'genius-enter-canvas' : ''}`}>
        <div className="flex flex-col flex-1 overflow-hidden">

          {/* Header da janela */}
          <div className="flex items-center px-4 h-12 border-b border-border shrink-0">
            {/* Esquerda: ícone + label categoria */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <activeCategory.icon size={16} className="text-muted-foreground shrink-0" />
              <h2 className="text-sm font-semibold text-foreground font-sans truncate">
                {activeCategory.label}
              </h2>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                {isResumoActive
                  ? '·  Resumo dos schemas'
                  : `·  Schema ${activeSchema.label.toLowerCase()}`}
              </span>
            </div>

            {/* Direita: toggles */}
            <div className="flex items-center flex-1 justify-end">
              <button
                onClick={() => setCategoriesOpen((v) => !v)}
                className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                aria-label={categoriesOpen ? 'Recolher categorias' : 'Expandir categorias'}
                title={categoriesOpen ? 'Recolher categorias' : 'Expandir categorias'}
              >
                {categoriesOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
              </button>
              <button
                onClick={() => setChatOpen((v) => !v)}
                className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                aria-label={chatOpen ? 'Recolher chat' : 'Expandir chat'}
                title={chatOpen ? 'Recolher chat' : 'Expandir chat'}
              >
                {chatOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
              </button>
            </div>
          </div>

          {/* Corpo: categorias + tabela + chat */}
          <div className="flex flex-1 overflow-hidden">

            {/* Sidebar categorias */}
            <div className={`${categoriesOpen ? 'w-56' : 'w-12'} shrink-0 border-r border-border overflow-y-auto overflow-x-hidden py-2 bg-muted/20 transition-[width] duration-200 ${!splitMounted ? 'genius-enter-sidebar-left' : ''}`}>
              {categoriesOpen && (
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                  Categorias
                </div>
              )}
              <ul className="flex flex-col">
                {categoriesData.map((cat) => {
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

            {/* Centro: tabela + rodapé guias */}
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
                  <div className="flex-1 min-h-0">
                    <InventoryDataGrid columns={activeSchema.columns} rows={activeSchema.rows} readOnly={submitted} highlightedRows={highlightedRows} onSelectionChange={setSelectedCellCount} clearSelectionRef={clearGridSelectionRef} />
                  </div>
                )}
              </div>

              {/* Guias Excel */}
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
                {/* Action bar no header do chat */}
                <div className="px-4 py-3 border-b border-border shrink-0">
                  {renderActionBar()}
                </div>

                <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
                  <div className="flex flex-col gap-3">
                    {renderMessages(activeChat)}
                    <div ref={bottomRef} />
                  </div>
                </div>

                <div className="shrink-0 bg-background px-3 pb-3">
                  <GeniusChatComposer
                    input={input}
                    onChange={setInput}
                    onSend={handleSend}
                    onSentFileClick={handleSentFileClick}
                    onClearSelection={() => { clearGridSelectionRef.current?.(); setSelectedCellCount(0) }}
                    placeholder="Pergunte ou envie mais dados…"
                    disabled={submitted}
                    selectionContext={selectedCellCount}
                    fileProcessingStatus={(id) => processingFiles.find((p) => p.id === id)?.status}
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
                  onClick={handleVerify}
                  disabled={validationState === 'checking' || submitted}
                  title="Verificar"
                  className="relative flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {validationState === 'checking' ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                  {validationState === 'has-issues' && (
                    <span className={`absolute top-0.5 right-0.5 w-2 h-2 rounded-full ring-1 ring-background ${issueCounts.errors > 0 ? 'bg-destructive' : 'bg-warning'}`} />
                  )}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={validationState !== 'ready'}
                  title="Enviar"
                  className="relative flex items-center justify-center w-8 h-8 rounded-md transition-colors text-muted-foreground disabled:opacity-60 disabled:cursor-not-allowed hover:bg-muted"
                >
                  <Send size={16} />
                  {validationState === 'ready' && (
                    <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-planton-accent ring-1 ring-background genius-dot-ready" />
                  )}
                </button>
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

      <Dialog open={submitModalOpen} onOpenChange={setSubmitModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-warning shrink-0" />
              Enviar {activeCategory.label}
            </DialogTitle>
            <DialogDescription className="pt-2 leading-relaxed">
              Esta ação é <span className="font-semibold text-foreground">irreversível</span>. Após o envio, os dados de <span className="font-semibold text-foreground">{activeCategory.label}</span> serão registrados oficialmente e não poderão ser editados.
              <br /><br />
              Confirme que revisou todos os dados e não há mais nada a acrescentar.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <label htmlFor="confirm-input" className="text-xs text-muted-foreground font-sans">
              Digite <span className="font-mono font-semibold text-foreground">{activeCategory.label.toUpperCase()}</span> para confirmar:
            </label>
            <input
              id="confirm-input"
              type="text"
              value={submitConfirmText}
              onChange={(e) => setSubmitConfirmText(e.target.value)}
              autoComplete="off"
              autoFocus
              className="px-3 py-2 rounded-md border border-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-planton-accent focus:border-transparent"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <button
              type="button"
              onClick={() => setSubmitModalOpen(false)}
              className="px-4 h-9 rounded-md text-sm font-sans border border-border bg-background text-foreground hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmSubmit}
              disabled={submitConfirmText.trim().toUpperCase() !== activeCategory.label.toUpperCase()}
              className="flex items-center gap-1.5 px-4 h-9 rounded-md text-sm font-sans font-medium bg-planton-accent text-white hover:bg-planton-accent/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors"
            >
              <Send size={14} />
              Enviar {activeCategory.label}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
