'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { Plus, MoreHorizontal, Eye, Pause, Play, Pencil, Building2 } from 'lucide-react'
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
import { Label } from '@/components/shadcn/label'
import { Skeleton } from '@/components/shadcn/skeleton'
import { CLIENTS, type ClientStatus } from '../mock-data'

const BASE = '/design-system/screens/academy'

const STATUS_BADGE: Record<ClientStatus, 'success' | 'destructive'> = {
  ativo: 'success',
  suspenso: 'destructive',
}

export function ClientsScreen() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return CLIENTS
    return CLIENTS.filter((c) => c.status === statusFilter)
  }, [statusFilter])

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

          {/* Filters */}
          <div className="max-w-[1920px] mx-auto px-6 pb-6">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="suspenso">Suspenso</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="max-w-[1920px] mx-auto px-6 pb-10">
            <div className="border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead>CNPJ</TableHead>
                    <TableHead>Domínios</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Usuários</TableHead>
                    <TableHead>Plano (vencimento)</TableHead>
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
                  ) : filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-16">
                        <div className="flex flex-col items-center gap-3">
                          <Building2 size={32} className="text-planton-muted" />
                          <Body muted>Nenhum cliente cadastrado</Body>
                          <Button onClick={() => setDialogOpen(true)}>
                            <Plus size={15} className="mr-1.5" />
                            Novo cliente
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">
                          <Link href={`${BASE}/admin/clients/${client.id}`} className="hover:text-planton-accent transition-colors">
                            {client.name}
                          </Link>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{client.cnpj}</TableCell>
                        <TableCell className="text-sm">{client.domains.join(', ')}</TableCell>
                        <TableCell>
                          <Badge variant={STATUS_BADGE[client.status]}>
                            {client.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">{client.totalUsers}</TableCell>
                        <TableCell className="text-sm">
                          {client.plan.name} ({client.plan.expiration})
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
                              <DropdownMenuItem onClick={() => toast.success(`Cliente ${client.status === 'ativo' ? 'suspenso' : 'ativado'}`)}>
                                {client.status === 'ativo' ? (
                                  <><Pause size={14} className="mr-2" />Suspender</>
                                ) : (
                                  <><Play size={14} className="mr-2" />Ativar</>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast('Edição em breve')}>
                                <Pencil size={14} className="mr-2" />
                                Editar
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
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input id="cnpj" placeholder="00.000.000/0001-00" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="domain">Domínio(s)</Label>
              <Input id="domain" placeholder="empresa.com.br" />
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
