'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { Plus, MoreHorizontal, Eye, Pause, Play, Pencil, Ticket, Building2, Search } from 'lucide-react'
import { toast } from 'sonner'
import { AcademyNavbarSync } from '@/components/navigation/AcademyNavbarSync'
import { AcademyFooter } from '@/components/navigation/AcademyFooter'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { Button } from '@/components/primitives/Button'
import { Badge } from '@/components/shadcn/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TablePagination, tableLinkClass } from '@/components/shadcn/table'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/shadcn/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/shadcn/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/shadcn/dialog'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Skeleton } from '@/components/shadcn/skeleton'
import { CLIENTS, type ClientStatus } from '../mock-data'

const BASE = '/design-system/screens/academy'
const PER_PAGE = 10

const STATUS_BADGE: Record<ClientStatus, 'success' | 'destructive' | 'warning' | 'outline'> = {
  ativo: 'success',
  suspenso: 'destructive',
  'sem-voucher': 'outline',
  inativo: 'outline',
  expirado: 'warning',
}

const STATUS_BADGE_CLASS: Record<ClientStatus, string> = {
  ativo: '',
  suspenso: '',
  'sem-voucher': '',
  inativo: 'text-muted-foreground',
  expirado: '',
}

const STATUS_LABELS: Record<ClientStatus, string> = {
  ativo: 'Ativo',
  suspenso: 'Suspenso',
  'sem-voucher': 'Sem voucher',
  inativo: 'Inativo',
  expirado: 'Expirado',
}

export function ClientsScreen() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const filtered = useMemo(() => {
    let items = CLIENTS
    if (statusFilter !== 'all') items = items.filter((c) => c.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      items = items.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.cnpj.includes(q) ||
        c.domains.some((d) => d.toLowerCase().includes(q))
      )
    }
    return items
  }, [statusFilter, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  useEffect(() => { setPage(1) }, [statusFilter, search])

  return (
    <>
      <AcademyNavbarSync breadcrumbs={[{ label: 'Admin', href: `${BASE}/admin` }, { label: 'Clientes' }]} />

      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          {/* Header */}
          <div className="max-w-[1920px] mx-auto px-6 pt-10 pb-8 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="flex flex-col gap-1">
                <Heading as="h1" size="heading-xl">Clientes</Heading>
                <Body muted>Gestão de empresas da plataforma</Body>
              </div>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus size={15} className="mr-1.5" />
                Novo cliente
              </Button>
            </div>
          </div>

          {/* Filters + Search */}
          <div className="max-w-[1920px] mx-auto px-6 pb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <span>{statusFilter === 'all' ? 'Todos' : STATUS_LABELS[statusFilter as ClientStatus]}</span>
              </SelectTrigger>
              <SelectContent className="w-[260px]">
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="ativo" textValue="Ativo" className="items-start">
                  <span className="flex flex-col gap-0.5">
                    <span>Ativo</span>
                    <span className="text-xs text-muted-foreground font-normal normal-case tracking-normal">Possui voucher ativo e acesso liberado</span>
                  </span>
                </SelectItem>
                <SelectItem value="suspenso" textValue="Suspenso" className="items-start">
                  <span className="flex flex-col gap-0.5">
                    <span>Suspenso</span>
                    <span className="text-xs text-muted-foreground font-normal normal-case tracking-normal">Acesso bloqueado manualmente pelo admin</span>
                  </span>
                </SelectItem>
                <SelectItem value="sem-voucher" textValue="Sem voucher" className="items-start">
                  <span className="flex flex-col gap-0.5">
                    <span>Sem voucher</span>
                    <span className="text-xs text-muted-foreground font-normal normal-case tracking-normal">Cadastrado, mas ainda sem voucher associado</span>
                  </span>
                </SelectItem>
                <SelectItem value="inativo" textValue="Inativo" className="items-start">
                  <span className="flex flex-col gap-0.5">
                    <span>Inativo</span>
                    <span className="text-xs text-muted-foreground font-normal normal-case tracking-normal">Voucher vinculado, mas nunca acessou</span>
                  </span>
                </SelectItem>
                <SelectItem value="expirado" textValue="Expirado" className="items-start">
                  <span className="flex flex-col gap-0.5">
                    <span>Expirado</span>
                    <span className="text-xs text-muted-foreground font-normal normal-case tracking-normal">Voucher vencido, acesso encerrado</span>
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="relative w-full sm:w-[280px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-planton-muted" />
              <Input
                placeholder="Buscar por nome, CNPJ ou domínio..."
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
                    <TableHead>Empresa</TableHead>
                    <TableHead className="text-right">CNPJ / CPF</TableHead>
                    <TableHead>Domínios</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Usuários</TableHead>
                    <TableHead className="text-right">Vencimento</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-14" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-8 ml-auto" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                      </TableRow>
                    ))
                  ) : paginated.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-16">
                        <div className="flex flex-col items-center gap-3">
                          <Building2 size={32} className="text-planton-muted" />
                          <Body muted>Nenhum cliente encontrado</Body>
                          <Button onClick={() => setDialogOpen(true)}>
                            <Plus size={15} className="mr-1.5" />
                            Novo cliente
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">
                          <Link href={`${BASE}/admin/clients/${client.id}`} className={tableLinkClass}>
                            {client.name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm tabular-nums">{client.cnpj}</TableCell>
                        <TableCell className="text-sm">{client.domains.join(', ')}</TableCell>
                        <TableCell>
                          <Badge variant={STATUS_BADGE[client.status]} className={STATUS_BADGE_CLASS[client.status]}>
                            {STATUS_LABELS[client.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">{client.totalUsers}</TableCell>
                        <TableCell className="text-right font-mono text-sm tabular-nums">
                          {client.plan.expiration}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger className="p-1 hover:bg-muted rounded transition-colors">
                              <MoreHorizontal size={16} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`${BASE}/admin/clients/${client.id}`}>
                                  <Eye size={14} className="mr-2" />
                                  Ver detalhe
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast('Edição em breve')}>
                                <Pencil size={14} className="mr-2" />
                                Editar
                              </DropdownMenuItem>
                              {client.status === 'ativo' && (
                                <DropdownMenuItem onClick={() => toast.success('Cliente suspenso')}>
                                  <Pause size={14} className="mr-2" />
                                  Suspender
                                </DropdownMenuItem>
                              )}
                              {client.status === 'suspenso' && (
                                <DropdownMenuItem onClick={() => toast.success('Cliente ativado')}>
                                  <Play size={14} className="mr-2" />
                                  Ativar
                                </DropdownMenuItem>
                              )}
                              {client.status === 'sem-voucher' && (
                                <DropdownMenuItem asChild>
                                  <Link href={`${BASE}/admin/vouchers`}>
                                    <Ticket size={14} className="mr-2" />
                                    Criar voucher
                                  </Link>
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
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
                itemLabel={`cliente${filtered.length !== 1 ? 's' : ''}`}
                onPageChange={setPage}
              />
            </div>
          </div>
        </div>

        <AcademyFooter />
      </div>

      {/* Dialog: Novo cliente */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo cliente</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="company-name">Nome da empresa</Label>
              <Input id="company-name" placeholder="Ex: AgroTech Solutions" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="cnpj">CNPJ / CPF</Label>
              <Input id="cnpj" placeholder="00.000.000/0001-00 ou 000.000.000-00" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="domain">Domínio(s)</Label>
              <Input id="domain" placeholder="empresa.com.br, outrodominio.com.br" />
              <Body muted className="text-xs">Separe múltiplos domínios por vírgula</Body>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => { setDialogOpen(false); toast.success('Cliente criado com sucesso') }}>
              Criar cliente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
