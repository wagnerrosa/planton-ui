'use client'

import { useState, useMemo, useEffect } from 'react'
import { Users, UserCheck, Clock, Award, Search, Plus, Send } from 'lucide-react'
import { toast } from 'sonner'
import { AcademyNavbarSync } from '@/components/navigation/AcademyNavbarSync'
import { AcademyFooter } from '@/components/navigation/AcademyFooter'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { Button } from '@/components/primitives/Button'
import { Badge } from '@/components/shadcn/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TablePagination, tableLinkClass } from '@/components/shadcn/table'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/shadcn/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/shadcn/dialog'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Skeleton } from '@/components/shadcn/skeleton'
import { AdminStatsCard } from '../admin/components/AdminStatsCard'
import { GMUsageChart } from './components/GMUsageChart'
import {
  GM_COMPANY,
  GM_PLAN,
  GM_KPIS,
  GM_TOP_TRAILS,
  GM_COLLABORATORS,
  formatDateBR,
  type CollaboratorStatus,
  type Collaborator,
} from './mock-data'

const BASE = '/design-system/screens/academy'

const PER_PAGE = 5

const KPI_ICONS = [
  <Users key="u" size={16} />,
  <UserCheck key="ua" size={16} />,
  <Clock key="c" size={16} />,
  <Award key="a" size={16} />,
]

const STATUS_BADGE: Record<CollaboratorStatus, 'success' | 'info' | 'outline'> = {
  ativo: 'success',
  'convite-enviado': 'info',
  'nunca-acessou': 'outline',
}

const STATUS_LABELS: Record<CollaboratorStatus, string> = {
  ativo: 'Ativo',
  'convite-enviado': 'Convite enviado',
  'nunca-acessou': 'Nunca acessou',
}

const CONTENT_TYPE_LABELS: Record<string, string> = {
  video: 'Vídeo',
  artigo: 'Artigo',
  podcast: 'Podcast',
  guia: 'Guia',
}

function CollaboratorDetailModal({
  collab,
  open,
  onClose,
}: {
  collab: Collaborator | null
  open: boolean
  onClose: () => void
}) {
  if (!collab) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{collab.name}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-2">
          {/* Info */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-planton-muted">{collab.email}</span>
            <Badge variant={STATUS_BADGE[collab.status]}>{STATUS_LABELS[collab.status]}</Badge>
          </div>

          {/* KPIs individuais */}
          <div className="grid grid-cols-3 border-t border-l border-border">
            <div className="border-r border-b border-border p-4 flex flex-col gap-1">
              <span className="font-mono text-xs uppercase tracking-[0.1em] text-planton-muted">Trilhas</span>
              <span className="font-heading text-2xl font-bold">{collab.trailsCompleted}</span>
            </div>
            <div className="border-r border-b border-border p-4 flex flex-col gap-1">
              <span className="font-mono text-xs uppercase tracking-[0.1em] text-planton-muted">Horas</span>
              <span className="font-heading text-2xl font-bold">{collab.hoursWatched}h</span>
            </div>
            <div className="border-r border-b border-border p-4 flex flex-col gap-1">
              <span className="font-mono text-xs uppercase tracking-[0.1em] text-planton-muted">Certificados</span>
              <span className="font-heading text-2xl font-bold">{collab.certificates}</span>
            </div>
          </div>

          {/* Certificados obtidos */}
          {collab.certificateNames.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs uppercase tracking-[0.1em] text-planton-muted">Certificados obtidos</span>
              <div className="flex flex-col gap-1">
                {collab.certificateNames.map((name) => (
                  <div key={name} className="flex items-center gap-2 px-3 py-2 border border-border">
                    <Award size={13} className="text-planton-muted shrink-0" />
                    <span className="text-sm">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conteúdos assistidos */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.1em] text-planton-muted">Conteúdos assistidos</span>
            {collab.watchedContents.length === 0 ? (
              <Body muted className="text-sm">Nenhum conteúdo assistido ainda</Body>
            ) : (
              <div className="flex flex-col gap-1">
                {collab.watchedContents.map((c) => (
                  <div key={c.id} className="flex items-center justify-between px-3 py-2 border border-border">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{CONTENT_TYPE_LABELS[c.type] ?? c.type}</Badge>
                      <span className="text-sm">{c.title}</span>
                    </div>
                    <span className="text-xs text-planton-muted shrink-0 ml-2">{formatDateBR(c.watchedAt)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function GMDashboardScreen() {
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [selectedCollab, setSelectedCollab] = useState<Collaborator | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const filtered = useMemo(() => {
    let items = GM_COLLABORATORS
    if (statusFilter !== 'all') items = items.filter((c) => c.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      items = items.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
      )
    }
    return items
  }, [statusFilter, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  useEffect(() => { setPage(1) }, [statusFilter, search])

  // Plan progress
  const planProgress = Math.max(0, Math.min(100, ((GM_PLAN.totalDays - GM_PLAN.daysRemaining) / GM_PLAN.totalDays) * 100))
  const planUrgent = GM_PLAN.daysRemaining <= 30

  return (
    <>
      <AcademyNavbarSync breadcrumbs={[{ label: 'Gestor', href: `${BASE}/gm` }, { label: 'Painel' }]} />

      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          {/* Header */}
          <div className="max-w-[1920px] mx-auto px-6 pt-10 pb-8">
            <div className="flex flex-col gap-1">
              <Heading as="h1" size="heading-xl">Painel do Gestor</Heading>
              <Body muted>{GM_COMPANY.name}</Body>
            </div>
          </div>

          {/* KPI Cards + Plan Timeline (mesmo grupo) */}
          <div className="max-w-[1920px] mx-auto px-6 pb-10">
            <div className="overflow-hidden border-t border-l border-border">
              {/* KPIs */}
              {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="border-r border-b border-border p-6 flex flex-col gap-3">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4">
                  {GM_KPIS.map((kpi, i) => (
                    <AdminStatsCard
                      key={kpi.label}
                      value={kpi.value}
                      label={kpi.label}
                      change={kpi.change}
                      period={kpi.period}
                      trend={kpi.trend}
                      icon={KPI_ICONS[i]}
                    />
                  ))}
                </div>
              )}

              {/* Plan Timeline — mesma grade, ocupa linha inteira */}
              <div className="border-r border-b border-border px-6 py-6 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-xs uppercase tracking-[0.12em] text-planton-muted">Vigência do contrato</span>
                  {!loading && (
                    <Badge variant={planUrgent ? 'destructive' : 'warning'}>
                      {GM_PLAN.daysRemaining} dias restantes
                    </Badge>
                  )}
                </div>
                {loading ? (
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-2 w-full" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                ) : (
                  <>
                    <div className="h-2 w-full bg-muted overflow-hidden">
                      <div
                        className={`h-full transition-all ${planUrgent ? 'bg-destructive' : 'bg-planton-accent'}`}
                        style={{ width: `${planProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-planton-muted">
                      <span>Início: {formatDateBR(GM_PLAN.startDate)}</span>
                      <span>Vencimento: {formatDateBR(GM_PLAN.expiration)}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Usage Chart — continua na mesma grade */}
              <GMUsageChart />
            </div>
          </div>

          {/* Top Trails */}
          <div className="max-w-[1920px] mx-auto px-6 pb-10">
            <div className="border border-border">
              <div className="px-6 pt-6 pb-4 border-b border-border">
                <Heading as="h2" size="heading-md">Trilhas mais acessadas</Heading>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Trilha</TableHead>
                    <TableHead className="text-right">Acessos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-6" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-10 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    GM_TOP_TRAILS.map((trail, i) => (
                      <TableRow key={trail.id}>
                        <TableCell className="text-planton-muted">{i + 1}</TableCell>
                        <TableCell className="font-medium">{trail.title}</TableCell>
                        <TableCell className="text-right text-sm tabular-nums">{trail.accessCount}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Collaborators Section */}
          <div className="max-w-[1920px] mx-auto px-6 pb-10">
            <div className="border border-border">
              {/* Section header + filters */}
              <div className="px-6 pt-6 pb-4 border-b border-border flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <Heading as="h2" size="heading-md">Colaboradores</Heading>
                  <Button onClick={() => setInviteOpen(true)}>
                    <Send size={15} className="mr-1.5" />
                    Convidar colaborador
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <span>{statusFilter === 'all' ? 'Todos' : STATUS_LABELS[statusFilter as CollaboratorStatus]}</span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="convite-enviado">Convite enviado</SelectItem>
                      <SelectItem value="nunca-acessou">Nunca acessou</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="relative w-full sm:w-[280px]">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-planton-muted" />
                    <Input
                      placeholder="Buscar por nome ou e-mail..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              {/* Collaborators table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Trilhas</TableHead>
                    <TableHead className="text-right">Horas</TableHead>
                    <TableHead className="text-right">Certificados</TableHead>
                    <TableHead className="text-right">Último acesso</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-8 ml-auto" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-10 ml-auto" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-8 ml-auto" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : paginated.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-16">
                        <div className="flex flex-col items-center gap-3">
                          <Users size={32} className="text-planton-muted" />
                          <Body muted>Nenhum colaborador encontrado</Body>
                          <Button onClick={() => setInviteOpen(true)}>
                            <Plus size={15} className="mr-1.5" />
                            Convidar colaborador
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((collab) => (
                      <TableRow key={collab.id}>
                        <TableCell className="font-medium">
                          <button
                            type="button"
                            onClick={() => setSelectedCollab(collab)}
                            className={`${tableLinkClass} text-left`}
                          >
                            {collab.name}
                          </button>
                        </TableCell>
                        <TableCell className="text-sm">{collab.email}</TableCell>
                        <TableCell>
                          <Badge variant={STATUS_BADGE[collab.status]}>
                            {STATUS_LABELS[collab.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-sm tabular-nums">{collab.trailsCompleted}</TableCell>
                        <TableCell className="text-right text-sm tabular-nums">{collab.hoursWatched}h</TableCell>
                        <TableCell className="text-right text-sm tabular-nums">{collab.certificates}</TableCell>
                        <TableCell className="text-right text-sm tabular-nums">
                          {collab.lastAccess ? formatDateBR(collab.lastAccess) : <span className="text-planton-muted">—</span>}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <TablePagination
                page={page}
                totalPages={totalPages}
                totalItems={filtered.length}
                itemLabel={`colaborador${filtered.length !== 1 ? 'es' : ''}`}
                onPageChange={setPage}
              />
            </div>
          </div>
        </div>

        <AcademyFooter />
      </div>

      {/* Dialog: Convidar colaborador */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convidar colaborador</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="invite-email">E-mail</Label>
              <Input id="invite-email" placeholder="colaborador@agrotech.com.br" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="invite-name">Nome</Label>
              <Input id="invite-name" placeholder="Nome completo" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => { setInviteOpen(false); toast.success('Convite enviado com sucesso') }}>
              <Send size={15} className="mr-1.5" />
              Enviar convite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Detalhe do colaborador */}
      <CollaboratorDetailModal
        collab={selectedCollab}
        open={selectedCollab !== null}
        onClose={() => setSelectedCollab(null)}
      />
    </>
  )
}
