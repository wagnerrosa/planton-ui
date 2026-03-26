'use client'

import { useState, useMemo, useEffect } from 'react'
import { Plus, MoreHorizontal, Ban, RefreshCw, Ticket, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { AcademyNavbarSync } from '@/components/navigation/AcademyNavbarSync'
import { AcademyFooter } from '@/components/navigation/AcademyFooter'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { Button } from '@/components/primitives/Button'
import { Badge } from '@/components/shadcn/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TablePagination } from '@/components/shadcn/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/shadcn/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/shadcn/dialog'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Skeleton } from '@/components/shadcn/skeleton'
import { VOUCHERS, CLIENTS, formatDateBR, type VoucherStatus } from '../mock-data'

const BASE = '/design-system/screens/academy'

const STATUS_BADGE: Record<VoucherStatus, 'warning' | 'success' | 'destructive' | 'outline'> = {
  'aguardando-ativacao': 'warning',
  ativo: 'success',
  expirado: 'destructive',
  bloqueado: 'outline',
}

const STATUS_LABELS: Record<VoucherStatus, string> = {
  'aguardando-ativacao': 'Aguardando ativação',
  ativo: 'Ativo',
  expirado: 'Expirado',
  bloqueado: 'Bloqueado',
}

const PERIOD_OPTIONS = [
  { value: 'all', label: 'Todos os períodos' },
  { value: '7d', label: 'Últimos 7 dias' },
  { value: '30d', label: 'Últimos 30 dias' },
  { value: '90d', label: 'Últimos 90 dias' },
]

const PER_PAGE = 10

function isWithinDays(dateStr: string, days: number): boolean {
  const date = new Date(dateStr)
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  return date >= cutoff
}

export function VouchersScreen() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [clientFilter, setClientFilter] = useState('all')
  const [periodFilter, setPeriodFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [reactivateOpen, setReactivateOpen] = useState(false)
  const [reactivateDuration, setReactivateDuration] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const filtered = useMemo(() => {
    let items = VOUCHERS
    if (statusFilter !== 'all') items = items.filter((v) => v.status === statusFilter)
    if (clientFilter !== 'all') items = items.filter((v) => v.clientId === clientFilter)
    if (periodFilter !== 'all') {
      const days = parseInt(periodFilter)
      items = items.filter((v) => isWithinDays(v.createdAt, days))
    }
    return items
  }, [statusFilter, clientFilter, periodFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  useEffect(() => { setPage(1) }, [statusFilter, clientFilter, periodFilter])

  function handleReactivate() {
    setReactivateOpen(false)
    setReactivateDuration('')
    toast.success('Voucher reativado com sucesso')
  }

  return (
    <>
      <AcademyNavbarSync breadcrumbs={[{ label: 'Admin', href: `${BASE}/admin` }, { label: 'Vouchers' }]} />

      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          {/* Header */}
          <div className="max-w-[1920px] mx-auto px-6 pt-10 pb-8 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="flex flex-col gap-1">
                <Heading as="h1" size="heading-xl">Vouchers</Heading>
                <Body muted>Gestão de vouchers de ativação</Body>
              </div>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus size={15} className="mr-1.5" />
                Novo voucher
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="max-w-[1920px] mx-auto px-6 pb-6 flex flex-wrap items-center gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <span>{statusFilter === 'all' ? 'Todos os status' : STATUS_LABELS[statusFilter as VoucherStatus]}</span>
              </SelectTrigger>
              <SelectContent className="w-[280px]">
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="aguardando-ativacao" textValue="Aguardando ativação" className="items-start">
                  <span className="flex flex-col gap-0.5">
                    <span>Aguardando ativação</span>
                    <span className="text-xs text-muted-foreground font-normal normal-case tracking-normal">Voucher criado, aguardando ativação em até 7 dias</span>
                  </span>
                </SelectItem>
                <SelectItem value="ativo" textValue="Ativo" className="items-start">
                  <span className="flex flex-col gap-0.5">
                    <span>Ativo</span>
                    <span className="text-xs text-muted-foreground font-normal normal-case tracking-normal">Voucher utilizado, empresa ativa no sistema</span>
                  </span>
                </SelectItem>
                <SelectItem value="expirado" textValue="Expirado" className="items-start">
                  <span className="flex flex-col gap-0.5">
                    <span>Expirado</span>
                    <span className="text-xs text-muted-foreground font-normal normal-case tracking-normal">Tempo de acesso do cliente encerrado</span>
                  </span>
                </SelectItem>
                <SelectItem value="bloqueado" textValue="Bloqueado" className="items-start">
                  <span className="flex flex-col gap-0.5">
                    <span>Bloqueado</span>
                    <span className="text-xs text-muted-foreground font-normal normal-case tracking-normal">Prazo de 7 dias expirou sem ativação</span>
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Empresa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as empresas</SelectItem>
                {CLIENTS.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                {PERIOD_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="max-w-[1920px] mx-auto px-6 pb-10">
            <div className="border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Prazo ativação</TableHead>
                    <TableHead>Duração plano</TableHead>
                    <TableHead>Domínios</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                      </TableRow>
                    ))
                  ) : paginated.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-16">
                        <div className="flex flex-col items-center gap-3">
                          <Ticket size={32} className="text-planton-muted" />
                          <Body muted>Nenhum voucher encontrado</Body>
                          <Button onClick={() => setDialogOpen(true)}>
                            <Plus size={15} className="mr-1.5" />
                            Novo voucher
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((voucher) => (
                      <TableRow key={voucher.id}>
                        <TableCell className="font-mono text-sm font-medium">{voucher.code}</TableCell>
                        <TableCell>{voucher.clientName}</TableCell>
                        <TableCell>
                          <Badge variant={STATUS_BADGE[voucher.status]}>
                            {STATUS_LABELS[voucher.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-sm">{formatDateBR(voucher.activationDeadline)}</TableCell>
                        <TableCell className="text-sm">{voucher.planDuration}</TableCell>
                        <TableCell className="text-sm">{voucher.domains.join(', ')}</TableCell>
                        <TableCell>
                          {voucher.status !== 'ativo' && (
                            <DropdownMenu>
                              <DropdownMenuTrigger className="p-1 hover:bg-muted rounded transition-colors">
                                <MoreHorizontal size={16} />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {voucher.status === 'aguardando-ativacao' && (
                                  <DropdownMenuItem onClick={() => toast.success('Voucher deletado')}>
                                    <Ban size={14} className="mr-2" />
                                    Deletar
                                  </DropdownMenuItem>
                                )}
                                {voucher.status === 'bloqueado' && (
                                  <DropdownMenuItem onClick={() => toast.success('Voucher regenerado — aguardando ativação por mais 7 dias')}>
                                    <RefreshCw size={14} className="mr-2" />
                                    Regenerar
                                  </DropdownMenuItem>
                                )}
                                {voucher.status === 'expirado' && (
                                  <DropdownMenuItem onClick={() => setReactivateOpen(true)}>
                                    <RotateCcw size={14} className="mr-2" />
                                    Reativar
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
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
                itemLabel={`voucher${filtered.length !== 1 ? 's' : ''}`}
                onPageChange={setPage}
              />
            </div>
          </div>
        </div>

        <AcademyFooter />
      </div>

      {/* Dialog: Novo voucher */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo voucher</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="voucher-code">Código</Label>
              <Input id="voucher-code" placeholder="NOMEDAEMPRESA-ANO-XXXX" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Empresa</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a empresa" />
                </SelectTrigger>
                <SelectContent>
                  {CLIENTS.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Duração do acesso</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 meses</SelectItem>
                  <SelectItem value="6">6 meses</SelectItem>
                  <SelectItem value="12">12 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="voucher-domains">Domínio(s)</Label>
              <Input id="voucher-domains" placeholder="empresa.com.br, outrodominio.com.br" />
              <Body muted className="text-xs">Separe múltiplos domínios por vírgula</Body>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => { setDialogOpen(false); toast.success('Voucher criado com sucesso') }}>
              Criar voucher
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Reativar voucher */}
      <Dialog open={reactivateOpen} onOpenChange={setReactivateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reativar voucher</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Body muted>Selecione por quanto tempo o acesso desta empresa será renovado.</Body>
            <div className="flex flex-col gap-2">
              <Label>Duração da reativação</Label>
              <Select value={reactivateDuration} onValueChange={setReactivateDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 meses</SelectItem>
                  <SelectItem value="6">6 meses</SelectItem>
                  <SelectItem value="12">12 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReactivateOpen(false)}>Cancelar</Button>
            <Button onClick={handleReactivate} disabled={!reactivateDuration}>
              Confirmar reativação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
