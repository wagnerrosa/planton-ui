'use client'

import { useState, useMemo, useEffect } from 'react'
import { Plus, MoreHorizontal, Pencil, Trash2, FileText, Search, ChevronLeft, ChevronRight, X, Upload, Link2, Image } from 'lucide-react'
import { toast } from 'sonner'
import { AcademyNavbarSync } from '@/components/navigation/AcademyNavbarSync'
import { AcademyFooter } from '@/components/navigation/AcademyFooter'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { Button } from '@/components/primitives/Button'
import { Badge } from '@/components/shadcn/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/shadcn/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/shadcn/dialog'
import { Input } from '@/components/shadcn/input'
import { Textarea } from '@/components/shadcn/textarea'
import { Label } from '@/components/shadcn/label'
import { Skeleton } from '@/components/shadcn/skeleton'
import { CATALOG_CONTENT, CLIENTS, type ContentType, type ContentScope } from '../mock-data'

const BASE = '/design-system/screens/academy'
const PER_PAGE = 10

const TYPE_LABELS: Record<ContentType, string> = {
  video: 'Vídeo',
  artigo: 'Artigo',
  podcast: 'Podcast',
  guia: 'Guia',
}

const STATUS_BADGE: Record<string, 'success' | 'default' | 'info'> = {
  publicado: 'success',
  rascunho: 'default',
  agendado: 'info',
}

const INITIAL_THEMES = ['ESG', 'Emissões', 'ISO', 'Sustentabilidade', 'Carbono', 'Clima']

export function AdminContentScreen() {
  const [typeFilter, setTypeFilter] = useState('all')
  const [clientFilter, setClientFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // Upload dialog state
  const [uploadScope, setUploadScope] = useState<ContentScope>('global')
  const [uploadType, setUploadType] = useState<ContentType | ''>('')
  const [selectedClients, setSelectedClients] = useState<string[]>([])
  const [selectedThemes, setSelectedThemes] = useState<string[]>([])
  const [themes, setThemes] = useState<string[]>(INITIAL_THEMES)
  const [newTheme, setNewTheme] = useState('')
  const [deleteThemeConfirm, setDeleteThemeConfirm] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const filtered = useMemo(() => {
    let items = CATALOG_CONTENT
    if (typeFilter !== 'all') items = items.filter((c) => c.type === typeFilter)
    if (statusFilter !== 'all') items = items.filter((c) => c.status === statusFilter)
    if (clientFilter !== 'all') {
      const clientName = CLIENTS.find((cl) => cl.id === clientFilter)?.name
      items = items.filter((c) => c.scope === 'exclusivo' && clientName && c.clients.includes(clientName))
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      items = items.filter((c) => c.title.toLowerCase().includes(q))
    }
    return items
  }, [typeFilter, statusFilter, clientFilter, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  useEffect(() => { setPage(1) }, [typeFilter, statusFilter, clientFilter, search])

  const resetDialog = () => {
    setUploadScope('global')
    setUploadType('')
    setSelectedClients([])
    setSelectedThemes([])
    setNewTheme('')
    setDeleteThemeConfirm(null)
  }

  const toggleClient = (clientId: string) => {
    setSelectedClients((prev) =>
      prev.includes(clientId) ? prev.filter((id) => id !== clientId) : [...prev, clientId]
    )
  }

  const toggleTheme = (theme: string) => {
    setSelectedThemes((prev) =>
      prev.includes(theme) ? prev.filter((t) => t !== theme) : [...prev, theme]
    )
  }

  const addTheme = () => {
    const trimmed = newTheme.trim()
    if (!trimmed || themes.includes(trimmed)) return
    setThemes([...themes, trimmed])
    setSelectedThemes([...selectedThemes, trimmed])
    setNewTheme('')
    toast.success(`Tema "${trimmed}" criado`)
  }

  const confirmDeleteTheme = (theme: string) => {
    setThemes(themes.filter((t) => t !== theme))
    setSelectedThemes(selectedThemes.filter((t) => t !== theme))
    setDeleteThemeConfirm(null)
    toast.success(`Tema "${theme}" removido de todo o sistema`)
  }

  // Check if type needs cover image (non-video types)
  const needsCover = uploadType !== '' && uploadType !== 'video'
  // Check if type is video (needs link OR file upload)
  const isVideo = uploadType === 'video'

  return (
    <>
      <AcademyNavbarSync breadcrumbs={[{ label: 'Admin', href: `${BASE}/admin` }, { label: 'Conteúdo' }]} />

      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          {/* Header */}
          <div className="max-w-[1920px] mx-auto px-6 pt-10 pb-8 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="flex flex-col gap-1">
                <Heading as="h1" size="heading-xl">Conteúdo</Heading>
                <Body muted>Catálogo de conteúdos da plataforma</Body>
              </div>
              <Button onClick={() => { resetDialog(); setDialogOpen(true) }}>
                <Plus size={15} className="mr-1.5" />
                Upload
              </Button>
            </div>
          </div>

          {/* Filters + Search */}
          <div className="max-w-[1920px] mx-auto px-6 pb-6 flex flex-wrap items-center gap-3">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="video">Vídeo</SelectItem>
                <SelectItem value="artigo">Artigo</SelectItem>
                <SelectItem value="podcast">Podcast</SelectItem>
                <SelectItem value="guia">Guia</SelectItem>
              </SelectContent>
            </Select>
            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os clientes</SelectItem>
                {CLIENTS.filter((c) => c.status === 'ativo').map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="publicado">Publicado</SelectItem>
                <SelectItem value="rascunho">Rascunho</SelectItem>
                <SelectItem value="agendado">Agendado</SelectItem>
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

          {/* Table — sem coluna Quiz */}
          <div className="max-w-[1920px] mx-auto px-6 pb-10">
            <div className="border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Escopo</TableHead>
                    <TableHead>Clientes</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-14" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-18" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                      </TableRow>
                    ))
                  ) : paginated.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-16">
                        <div className="flex flex-col items-center gap-3">
                          <FileText size={32} className="text-planton-muted" />
                          <Body muted>Nenhum conteúdo encontrado</Body>
                          <Button onClick={() => { resetDialog(); setDialogOpen(true) }}>
                            <Plus size={15} className="mr-1.5" />
                            Upload
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((content) => (
                      <TableRow key={content.id}>
                        <TableCell className="font-medium">{content.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{TYPE_LABELS[content.type]}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={content.scope === 'global' ? 'default' : 'secondary'}>
                            {content.scope}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {content.scope === 'global' ? '—' : content.clients.join(', ')}
                        </TableCell>
                        <TableCell>
                          <Badge variant={STATUS_BADGE[content.status]}>
                            {content.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger className="p-1 hover:bg-muted rounded transition-colors">
                              <MoreHorizontal size={16} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => toast('Edição de escopo em breve')}>
                                <Pencil size={14} className="mr-2" />
                                Editar escopo
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast.success('Conteúdo excluído')} className="text-destructive">
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
                    {filtered.length} conteúdo{filtered.length !== 1 ? 's' : ''}
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

      {/* Dialog: Upload */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetDialog() }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload de conteúdo</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="content-title">Título</Label>
              <Input id="content-title" placeholder="Nome do conteúdo" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Tipo</Label>
              <Select value={uploadType} onValueChange={(v) => setUploadType(v as ContentType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Vídeo</SelectItem>
                  <SelectItem value="artigo">Artigo</SelectItem>
                  <SelectItem value="podcast">Podcast</SelectItem>
                  <SelectItem value="guia">Guia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Vídeo: link embed OU upload de arquivo */}
            {isVideo && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="content-video-url">Link do vídeo (embed)</Label>
                  <div className="relative">
                    <Link2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-planton-muted" />
                    <Input id="content-video-url" placeholder="https://youtube.com/embed/... ou URL do vídeo" className="pl-9" />
                  </div>
                  <Body muted className="text-xs">Cole a URL do vídeo embedado (YouTube, Vimeo, etc.)</Body>
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-px flex-1 bg-border" />
                  <Body muted className="text-xs">ou</Body>
                  <span className="h-px flex-1 bg-border" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="content-video-file">Upload de arquivo de vídeo</Label>
                  <Input id="content-video-file" type="file" accept="video/*" />
                </div>
              </div>
            )}

            {/* Não é vídeo: upload de arquivo (PDF, etc.) */}
            {uploadType !== '' && !isVideo && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="content-file">
                  <div className="flex items-center gap-1.5">
                    <Upload size={14} />
                    Arquivo do conteúdo
                  </div>
                </Label>
                <Input id="content-file" type="file" accept=".pdf,.doc,.docx,.epub" />
                <Body muted className="text-xs">Formatos aceitos: PDF, DOC, DOCX, EPUB</Body>
              </div>
            )}

            {/* Capa (thumb) — para tipos que não são vídeo */}
            {needsCover && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="content-cover">
                  <div className="flex items-center gap-1.5">
                    <Image size={14} />
                    Imagem de capa
                  </div>
                </Label>
                <Input id="content-cover" type="file" accept="image/*" />
                <Body muted className="text-xs">Essa imagem será usada como thumbnail do conteúdo no catálogo</Body>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="content-desc">Descrição</Label>
              <Textarea id="content-desc" placeholder="Breve descrição do conteúdo" rows={3} />
            </div>

            {/* Escopo */}
            <div className="flex flex-col gap-2">
              <Label>Escopo</Label>
              <Select value={uploadScope} onValueChange={(v) => { setUploadScope(v as ContentScope); if (v === 'global') setSelectedClients([]) }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Global</SelectItem>
                  <SelectItem value="exclusivo">Exclusivo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Multi-select de empresas para escopo exclusivo */}
            {uploadScope === 'exclusivo' && (
              <div className="flex flex-col gap-2">
                <Label>Empresas</Label>
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

            {/* Temas / Keywords */}
            <div className="flex flex-col gap-2">
              <Label>Temas</Label>
              <Body muted className="text-xs">Selecione os temas deste conteúdo. Eles serão usados como filtros para os usuários.</Body>
              <div className="flex flex-wrap gap-1.5">
                {themes.map((theme) => {
                  const isSelected = selectedThemes.includes(theme)
                  return (
                    <div key={theme} className="flex items-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => toggleTheme(theme)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-planton-accent text-planton-ink'
                            : 'bg-planton-accent/10 text-foreground/80 hover:bg-planton-accent/20'
                        }`}
                      >
                        {theme}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteThemeConfirm(theme)}
                        className="p-0.5 text-destructive/60 hover:text-destructive transition-colors"
                        title={`Remover tema "${theme}"`}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )
                })}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  placeholder="Novo tema..."
                  value={newTheme}
                  onChange={(e) => setNewTheme(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTheme() } }}
                  className="flex-1 h-8 text-sm"
                />
                <Button onClick={addTheme} className="h-8 px-3 text-xs" disabled={!newTheme.trim()}>
                  <Plus size={14} className="mr-1" />
                  Criar tema
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => { setDialogOpen(false); resetDialog(); toast.success('Conteúdo enviado com sucesso') }}>
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Confirmar exclusão de tema */}
      <Dialog open={deleteThemeConfirm !== null} onOpenChange={(open) => { if (!open) setDeleteThemeConfirm(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover tema</DialogTitle>
          </DialogHeader>
          <Body>
            Tem certeza que deseja remover o tema <strong>&quot;{deleteThemeConfirm}&quot;</strong>? Ele será removido de todos os conteúdos do sistema.
          </Body>
          <DialogFooter>
            <Button onClick={() => setDeleteThemeConfirm(null)}>
              Cancelar
            </Button>
            <Button onClick={() => deleteThemeConfirm && confirmDeleteTheme(deleteThemeConfirm)}>
              Confirmar exclusão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
