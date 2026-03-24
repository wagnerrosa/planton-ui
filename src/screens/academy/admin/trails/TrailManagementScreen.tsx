'use client'

import { useState, useMemo, useEffect } from 'react'
import { Plus, MoreHorizontal, Pencil, Trash2, Globe, Lock, ArrowUp, ArrowDown, X, Search, Route, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { AcademyNavbarSync } from '@/components/navigation/AcademyNavbarSync'
import { AcademyFooter } from '@/components/navigation/AcademyFooter'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { Button } from '@/components/primitives/Button'
import { Badge } from '@/components/shadcn/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Switch } from '@/components/shadcn/switch'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/shadcn/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/shadcn/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/tabs'
import { Input } from '@/components/shadcn/input'
import { Textarea } from '@/components/shadcn/textarea'
import { Label } from '@/components/shadcn/label'
import { Skeleton } from '@/components/shadcn/skeleton'
import {
  ADMIN_TRAILS,
  CATALOG_CONTENT,
  CLIENTS,
  type TrailStatus,
  type TrailVisibility,
  type QuizQuestion,
} from '../mock-data'

const BASE = '/design-system/screens/academy'
const PER_PAGE = 10

const STATUS_BADGE: Record<TrailStatus, 'success' | 'default' | 'warning'> = {
  ativa: 'success',
  rascunho: 'default',
  'em-breve': 'warning',
}

export function TrailManagementScreen() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [visibilityFilter, setVisibilityFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // Dialog state
  const [dialogTab, setDialogTab] = useState('dados')
  const [trailVisibility, setTrailVisibility] = useState<TrailVisibility>('global')
  const [selectedClients, setSelectedClients] = useState<string[]>([])
  const [selectedContents, setSelectedContents] = useState<string[]>([])
  const [contentSearch, setContentSearch] = useState('')
  const [quizEnabled, setQuizEnabled] = useState(false)
  const [quizVisibility, setQuizVisibility] = useState<'all' | 'specific'>('all')
  const [quizClients, setQuizClients] = useState<string[]>([])
  const [questions, setQuestions] = useState<QuizQuestion[]>([])

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const filtered = useMemo(() => {
    let items = ADMIN_TRAILS
    if (statusFilter !== 'all') items = items.filter((t) => t.status === statusFilter)
    if (visibilityFilter !== 'all') items = items.filter((t) => t.visibility === visibilityFilter)
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      items = items.filter((t) => t.title.toLowerCase().includes(q))
    }
    return items
  }, [statusFilter, visibilityFilter, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  useEffect(() => { setPage(1) }, [statusFilter, visibilityFilter, search])

  const availableContents = useMemo(() => {
    const query = contentSearch.toLowerCase().trim()
    const published = CATALOG_CONTENT.filter((c) => c.status === 'publicado')
    if (!query) return published
    return published.filter((c) => c.title.toLowerCase().includes(query))
  }, [contentSearch])

  const resetDialog = () => {
    setDialogTab('dados')
    setTrailVisibility('global')
    setSelectedClients([])
    setSelectedContents([])
    setContentSearch('')
    setQuizEnabled(false)
    setQuizVisibility('all')
    setQuizClients([])
    setQuestions([])
  }

  const moveContent = (index: number, direction: 'up' | 'down') => {
    const newList = [...selectedContents]
    const swapIdx = direction === 'up' ? index - 1 : index + 1
    if (swapIdx < 0 || swapIdx >= newList.length) return
    ;[newList[index], newList[swapIdx]] = [newList[swapIdx], newList[index]]
    setSelectedContents(newList)
  }

  const toggleClient = (clientId: string) => {
    setSelectedClients((prev) =>
      prev.includes(clientId) ? prev.filter((id) => id !== clientId) : [...prev, clientId]
    )
  }

  const toggleQuizClient = (clientId: string) => {
    setQuizClients((prev) =>
      prev.includes(clientId) ? prev.filter((id) => id !== clientId) : [...prev, clientId]
    )
  }

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: `new-${questions.length + 1}`,
        question: '',
        options: ['', '', '', ''],
        correctIndex: 0,
      },
    ])
  }

  const removeQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx))
  }

  return (
    <>
      <AcademyNavbarSync breadcrumbs={[{ label: 'Admin', href: `${BASE}/admin` }, { label: 'Trilhas' }]} />

      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          {/* Header */}
          <div className="max-w-[1920px] mx-auto px-6 pt-10 pb-8 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="flex flex-col gap-1">
                <Heading as="h1" size="heading-xl">Trilhas</Heading>
                <Body muted>Gestão de trilhas de aprendizagem</Body>
              </div>
              <Button onClick={() => { resetDialog(); setDialogOpen(true) }}>
                <Plus size={15} className="mr-1.5" />
                Nova trilha
              </Button>
            </div>
          </div>

          {/* Filters + Search */}
          <div className="max-w-[1920px] mx-auto px-6 pb-6 flex flex-wrap items-center gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="ativa">Ativa</SelectItem>
                <SelectItem value="rascunho">Rascunho</SelectItem>
                <SelectItem value="em-breve">Em breve</SelectItem>
              </SelectContent>
            </Select>
            <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Visibilidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="global">Global</SelectItem>
                <SelectItem value="exclusiva">Exclusiva</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative w-full sm:w-[280px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-planton-muted" />
              <Input
                placeholder="Buscar por título..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Table */}
          <div className="max-w-[1920px] mx-auto px-6 pb-10">
            <div className="border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Visibilidade</TableHead>
                    <TableHead className="text-right">Conteúdos</TableHead>
                    <TableHead>Quiz</TableHead>
                    <TableHead>Clientes</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-6 ml-auto" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                      </TableRow>
                    ))
                  ) : paginated.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-16">
                        <div className="flex flex-col items-center gap-3">
                          <Route size={32} className="text-planton-muted" />
                          <Body muted>Nenhuma trilha encontrada</Body>
                          <Button onClick={() => { resetDialog(); setDialogOpen(true) }}>
                            <Plus size={15} className="mr-1.5" />
                            Nova trilha
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((trail) => (
                      <TableRow key={trail.id}>
                        <TableCell className="font-medium">{trail.title}</TableCell>
                        <TableCell>
                          <Badge variant={STATUS_BADGE[trail.status]}>{trail.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1.5 text-sm">
                            {trail.visibility === 'global' ? <Globe size={13} /> : <Lock size={13} />}
                            {trail.visibility}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">{trail.contents.length}</TableCell>
                        <TableCell>
                          <Badge variant={trail.quizEnabled ? 'success' : 'outline'}>
                            {trail.quizEnabled ? 'sim' : 'não'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {trail.visibility === 'global' ? '—' : trail.clients.join(', ')}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger className="p-1 hover:bg-muted rounded transition-colors">
                              <MoreHorizontal size={16} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => toast('Edição em breve')}>
                                <Pencil size={14} className="mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast.success(trail.status === 'ativa' ? 'Trilha despublicada' : 'Trilha publicada')}>
                                {trail.status === 'ativa' ? 'Despublicar' : 'Publicar'}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast.success('Trilha excluída')} className="text-destructive">
                                <Trash2 size={14} className="mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {/* Pagination */}
              {filtered.length > PER_PAGE && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                  <Body muted className="text-sm">
                    {filtered.length} trilha{filtered.length !== 1 ? 's' : ''}
                  </Body>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft size={16} />
                    </Button>
                    <Body muted className="text-sm font-mono">{page} / {totalPages}</Body>
                    <Button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <AcademyFooter />
      </div>

      {/* Dialog: Nova trilha — 3 etapas */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetDialog() }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova trilha</DialogTitle>
          </DialogHeader>

          <Tabs value={dialogTab} onValueChange={setDialogTab} className="mt-2">
            <TabsList className="w-full">
              <TabsTrigger value="dados" className="flex-1">1. Dados</TabsTrigger>
              <TabsTrigger value="conteudos" className="flex-1">2. Conteúdos</TabsTrigger>
              <TabsTrigger value="quiz" className="flex-1">3. Quiz</TabsTrigger>
            </TabsList>

            {/* Step 1: Dados — sem campo de imagem de capa */}
            <TabsContent value="dados" className="flex flex-col gap-4 pt-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="trail-title">Título</Label>
                <Input id="trail-title" placeholder="Nome da trilha" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="trail-desc">Descrição</Label>
                <Textarea id="trail-desc" placeholder="Descrição da trilha" rows={3} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Visibilidade</Label>
                <Select value={trailVisibility} onValueChange={(v) => { setTrailVisibility(v as TrailVisibility); if (v === 'global') setSelectedClients([]) }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Global (todas as empresas)</SelectItem>
                    <SelectItem value="exclusiva">Exclusiva (empresas específicas)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {trailVisibility === 'exclusiva' && (
                <div className="flex flex-col gap-2">
                  <Label>Empresas com acesso</Label>
                  <Body muted className="text-xs">Selecione uma ou mais empresas que terão acesso a esta trilha</Body>
                  <div className="border border-border max-h-[160px] overflow-y-auto">
                    {CLIENTS.filter((c) => c.status === 'ativo').map((c) => {
                      const isSelected = selectedClients.includes(c.id)
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => toggleClient(c.id)}
                          className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between border-b border-border last:border-b-0 transition-colors ${
                            isSelected ? 'bg-planton-accent/10 text-planton-accent' : 'hover:bg-muted'
                          }`}
                        >
                          <span>{c.name}</span>
                          {isSelected && <Badge variant="outline" className="text-xs">selecionado</Badge>}
                        </button>
                      )
                    })}
                  </div>
                  {selectedClients.length > 0 && (
                    <Body muted className="text-xs">{selectedClients.length} empresa{selectedClients.length !== 1 ? 's' : ''} selecionada{selectedClients.length !== 1 ? 's' : ''}</Body>
                  )}
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Label>Status inicial</Label>
                <Select defaultValue="rascunho">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rascunho">Rascunho</SelectItem>
                    <SelectItem value="em-breve">Em breve</SelectItem>
                    <SelectItem value="ativa">Ativa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            {/* Step 2: Conteúdos */}
            <TabsContent value="conteudos" className="flex flex-col gap-4 pt-4">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-planton-muted" />
                <Input
                  placeholder="Buscar conteúdo no catálogo..."
                  value={contentSearch}
                  onChange={(e) => setContentSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Available contents */}
              <div className="border border-border max-h-[200px] overflow-y-auto">
                {availableContents.map((content) => {
                  const isSelected = selectedContents.includes(content.id)
                  return (
                    <button
                      key={content.id}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedContents(selectedContents.filter((id) => id !== content.id))
                        } else {
                          setSelectedContents([...selectedContents, content.id])
                        }
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between border-b border-border last:border-b-0 transition-colors ${
                        isSelected ? 'bg-planton-accent/10 text-planton-accent' : 'hover:bg-muted'
                      }`}
                    >
                      <span>{content.title}</span>
                      <Badge variant="outline" className="text-xs">{content.type}</Badge>
                    </button>
                  )
                })}
              </div>

              {/* Selected contents (ordered) */}
              {selectedContents.length > 0 && (
                <div className="flex flex-col gap-1">
                  <Label className="mb-1">Conteúdos selecionados ({selectedContents.length})</Label>
                  {selectedContents.map((id, i) => {
                    const content = CATALOG_CONTENT.find((c) => c.id === id)
                    if (!content) return null
                    return (
                      <div key={id} className="flex items-center gap-2 border border-border px-3 py-2">
                        <span className="font-mono text-xs text-planton-muted w-5">{i + 1}</span>
                        <span className="flex-1 text-sm">{content.title}</span>
                        <button type="button" onClick={() => moveContent(i, 'up')} disabled={i === 0} className="p-1 hover:bg-muted rounded disabled:opacity-30 transition-colors">
                          <ArrowUp size={14} />
                        </button>
                        <button type="button" onClick={() => moveContent(i, 'down')} disabled={i === selectedContents.length - 1} className="p-1 hover:bg-muted rounded disabled:opacity-30 transition-colors">
                          <ArrowDown size={14} />
                        </button>
                        <button type="button" onClick={() => setSelectedContents(selectedContents.filter((cid) => cid !== id))} className="p-1 hover:bg-muted rounded text-destructive transition-colors">
                          <X size={14} />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </TabsContent>

            {/* Step 3: Quiz */}
            <TabsContent value="quiz" className="flex flex-col gap-4 pt-4">
              <div className="flex items-center gap-3">
                <Switch checked={quizEnabled} onCheckedChange={setQuizEnabled} />
                <Label>Habilitar quiz nesta trilha</Label>
              </div>

              {quizEnabled && (
                <>
                  {/* Visibilidade do quiz por empresa */}
                  <div className="flex flex-col gap-2">
                    <Label>Visibilidade do quiz</Label>
                    <Body muted className="text-xs">Selecione se o quiz deve aparecer para todas as empresas ou apenas para algumas</Body>
                    <Select value={quizVisibility} onValueChange={(v) => { setQuizVisibility(v as 'all' | 'specific'); if (v === 'all') setQuizClients([]) }}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as empresas</SelectItem>
                        <SelectItem value="specific">Empresas específicas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {quizVisibility === 'specific' && (
                    <div className="flex flex-col gap-2">
                      <Label>Empresas que verão o quiz</Label>
                      <div className="border border-border max-h-[140px] overflow-y-auto">
                        {CLIENTS.filter((c) => c.status === 'ativo').map((c) => {
                          const isSelected = quizClients.includes(c.id)
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => toggleQuizClient(c.id)}
                              className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between border-b border-border last:border-b-0 transition-colors ${
                                isSelected ? 'bg-planton-accent/10 text-planton-accent' : 'hover:bg-muted'
                              }`}
                            >
                              <span>{c.name}</span>
                              {isSelected && <Badge variant="outline" className="text-xs">selecionado</Badge>}
                            </button>
                          )
                        })}
                      </div>
                      {quizClients.length > 0 && (
                        <Body muted className="text-xs">{quizClients.length} empresa{quizClients.length !== 1 ? 's' : ''} selecionada{quizClients.length !== 1 ? 's' : ''}</Body>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <Body muted className="text-sm">{questions.length} questão(ões)</Body>
                    <Button onClick={addQuestion}>
                      <Plus size={15} className="mr-1.5" />
                      Adicionar questão
                    </Button>
                  </div>

                  {questions.length === 0 && (
                    <div className="text-center py-8 border border-dashed border-border">
                      <Body muted>Nenhuma questão adicionada</Body>
                    </div>
                  )}

                  {questions.map((q, qi) => (
                    <div key={q.id} className="border border-border p-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <Label className="font-mono text-xs">Questão {qi + 1}</Label>
                        <button type="button" onClick={() => removeQuestion(qi)} className="p-1 hover:bg-muted rounded text-destructive transition-colors">
                          <X size={14} />
                        </button>
                      </div>
                      <Input placeholder="Enunciado da questão" />
                      <div className="grid grid-cols-2 gap-2">
                        {q.options.map((_, oi) => (
                          <div key={oi} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${qi}`}
                              defaultChecked={oi === q.correctIndex}
                              className="accent-planton-accent"
                            />
                            <Input placeholder={`Alternativa ${String.fromCharCode(65 + oi)}`} className="h-8 text-sm" />
                          </div>
                        ))}
                      </div>
                      <Body muted className="text-xs">Selecione o radio da alternativa correta</Body>
                    </div>
                  ))}
                </>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-4">
            {dialogTab !== 'dados' && (
              <Button
                onClick={() => setDialogTab(dialogTab === 'quiz' ? 'conteudos' : 'dados')}
              >
                Voltar
              </Button>
            )}
            {dialogTab !== 'quiz' ? (
              <Button
                onClick={() => setDialogTab(dialogTab === 'dados' ? 'conteudos' : 'quiz')}
              >
                Próximo
              </Button>
            ) : (
              <Button onClick={() => { setDialogOpen(false); resetDialog(); toast.success('Trilha criada com sucesso') }}>
                Criar trilha
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
