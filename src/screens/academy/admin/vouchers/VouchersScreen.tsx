'use client'

import { useState, useMemo, useEffect } from 'react'
import { Plus, MoreHorizontal, Ban, RefreshCw, Ticket } from 'lucide-react'
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
import { VOUCHERS, CLIENTS, type VoucherStatus } from '../mock-data'

const BASE = '/design-system/screens/academy'

const STATUS_BADGE: Record<VoucherStatus, 'success' | 'default' | 'warning' | 'destructive'> = {
  ativo: 'success',
  usado: 'default',
  expirado: 'warning',
  revogado: 'destructive',
}

const STATUS_LABELS: Record<VoucherStatus, string> = {
  ativo: 'Ativo',
  usado: 'Usado',
  expirado: 'Expirado',
  revogado: 'Revogado',
}

const PER_PAGE = 10

export function VouchersScreen() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [clientFilter, setClientFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const filtered = useMemo(() => {
    let items = VOUCHERS
    if (statusFilter !== 'all') items = items.filter((v) => v.status === statusFilter)
    if (clientFilter !== 'all') items = items.filter((v) => v.clientId === clientFilter)
    return items
  }, [statusFilter, clientFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  useEffect(() => { setPage(1) }, [statusFilter, clientFilter])

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
          <div className="max-w-[1920px] mx-auto px-6 pb-6 flex items-center gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="usado">Usado</SelectItem>
                <SelectItem value="expirado">Expirado</SelectItem>
                <SelectItem value="revogado">Revogado</SelectItem>
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
                    <TableHead>Prazo ativação</TableHead>
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
                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
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
                        <TableCell className="font-mono text-sm">{voucher.activationDeadline}</TableCell>
                        <TableCell className="text-sm">{voucher.planDuration}</TableCell>
                        <TableCell className="text-sm">{voucher.domains.join(', ')}</TableCell>
                        <TableCell>
                          {(voucher.status === 'ativo' || voucher.status === 'expirado') && (
                            <DropdownMenu>
                              <DropdownMenuTrigger className="p-1 hover:bg-muted rounded transition-colors">
                                <MoreHorizontal size={16} />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {voucher.status === 'ativo' && (
                                  <DropdownMenuItem onClick={() => toast.success('Voucher revogado')}>
                                    <Ban size={14} className="mr-2" />
                                    Revogar
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => toast.success('Voucher regenerado')}>
                                  <RefreshCw size={14} className="mr-2" />
                                  Regenerar
                                </DropdownMenuItem>
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
              <Input id="voucher-code" placeholder="PLANTON-2026-XXXX" />
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
              <Label htmlFor="voucher-deadline">Prazo de ativação</Label>
              <Input id="voucher-deadline" type="date" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Duração do plano</Label>
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
    </>
  )
}
