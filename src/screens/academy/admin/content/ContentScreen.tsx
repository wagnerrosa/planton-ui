'use client'

import { useState, useMemo, useEffect } from 'react'
import { Plus, MoreHorizontal, Pencil, Trash2, CalendarClock, FileText } from 'lucide-react'
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
import { Input } from '@/components/shadcn/input'
import { Textarea } from '@/components/shadcn/textarea'
import { Label } from '@/components/shadcn/label'
import { Skeleton } from '@/components/shadcn/skeleton'
import { CATALOG_CONTENT, CLIENTS, type ContentType, type ContentScope } from '../mock-data'

const BASE = '/design-system/screens/academy'

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

export function AdminContentScreen() {
  const [typeFilter, setTypeFilter] = useState('all')
  const [scopeFilter, setScopeFilter] = useState('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [uploadScope, setUploadScope] = useState<ContentScope>('global')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const filtered = useMemo(() => {
    let items = CATALOG_CONTENT
    if (typeFilter !== 'all') items = items.filter((c) => c.type === typeFilter)
    if (scopeFilter !== 'all') items = items.filter((c) => c.scope === scopeFilter)
    return items
  }, [typeFilter, scopeFilter])

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
              <Button onClick={() => setDialogOpen(true)}>
                <Plus size={15} className="mr-1.5" />
                Upload
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="max-w-[1920px] mx-auto px-6 pb-6 flex items-center gap-3">
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
            <Select value={scopeFilter} onValueChange={setScopeFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Escopo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="global">Global</SelectItem>
                <SelectItem value="exclusivo">Exclusivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
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
                    <TableHead>Quiz</TableHead>
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
                        <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                      </TableRow>
                    ))
                  ) : filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-16">
                        <div className="flex flex-col items-center gap-3">
                          <FileText size={32} className="text-planton-muted" />
                          <Body muted>Nenhum conteúdo no catálogo</Body>
                          <Button onClick={() => setDialogOpen(true)}>
                            <Plus size={15} className="mr-1.5" />
                            Upload
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((content) => (
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
                          <Switch
                            checked={content.quizEnabled}
                            onCheckedChange={(checked) =>
                              toast.success(`Quiz ${checked ? 'habilitado' : 'desabilitado'}`)
                            }
                          />
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
                              <DropdownMenuItem onClick={() => toast('Agendamento em breve')}>
                                <CalendarClock size={14} className="mr-2" />
                                Agendar publicação
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
            </div>
          </div>
        </div>

        <AcademyFooter />
      </div>

      {/* Dialog: Upload */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
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
              <Select>
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
            <div className="flex flex-col gap-2">
              <Label htmlFor="content-desc">Descrição</Label>
              <Textarea id="content-desc" placeholder="Breve descrição do conteúdo" rows={3} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Escopo</Label>
              <Select value={uploadScope} onValueChange={(v) => setUploadScope(v as ContentScope)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Global</SelectItem>
                  <SelectItem value="exclusivo">Exclusivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {uploadScope === 'exclusivo' && (
              <div className="flex flex-col gap-2">
                <Label>Clientes</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLIENTS.filter((c) => c.status === 'ativo').map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => { setDialogOpen(false); toast.success('Conteúdo enviado com sucesso') }}>
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
