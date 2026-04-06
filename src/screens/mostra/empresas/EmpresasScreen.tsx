'use client'

import { useState, useMemo } from 'react'
import { MoreHorizontal, Plus, Search } from 'lucide-react'
import { MostraNavbarSync } from '@/components/navigation/MostraNavbarSync'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { Button } from '@/components/primitives/Button'
import { Input } from '@/components/shadcn/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/shadcn/dropdown-menu'
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/shadcn/pagination'
import { StatusBadge } from '../components/StatusBadge'
import { EmpresaDetailSheet } from './components/EmpresaDetailSheet'
import { EmpresaEditDialog } from './components/EmpresaEditDialog'
import {
  EMPRESAS,
  EMPRESA_STATUS_CONFIG,
  formatDateBR,
  type Empresa,
  type EmpresaStatus,
} from '../mock-data'

const STATUS_FILTERS: { label: string; value: EmpresaStatus | 'all' }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Processo Iniciado', value: 'processo-iniciado' },
  { label: 'Ag. Revisão', value: 'aguardando-revisao-manual' },
  { label: 'Ag. Contrato', value: 'aguardando-contrato' },
  { label: 'Elegível', value: 'elegivel' },
  { label: 'Não Elegível', value: 'nao-elegivel' },
  { label: 'Cadastrado', value: 'cadastrado' },
]

const PAGE_SIZE = 10

export function EmpresasScreen() {
  const [activeFilter, setActiveFilter] = useState<EmpresaStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null)
  const [editingEmpresa, setEditingEmpresa] = useState<Empresa | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [empresas, setEmpresas] = useState<Empresa[]>(EMPRESAS)

  const filtered = useMemo(() => {
    return empresas.filter((e) => {
      const matchStatus = activeFilter === 'all' || e.status === activeFilter
      const q = search.trim().toLowerCase()
      const matchSearch = !q || e.cnpj.toLowerCase().includes(q) || e.nome.toLowerCase().includes(q)
      return matchStatus && matchSearch
    })
  }, [empresas, activeFilter, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleFilterChange(value: EmpresaStatus | 'all') {
    setActiveFilter(value)
    setPage(1)
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value)
    setPage(1)
  }

  function openDetail(empresa: Empresa) {
    setSelectedEmpresa(empresa)
    setSheetOpen(true)
  }

  function openEdit(empresa: Empresa) {
    setEditingEmpresa(empresa)
    setEditOpen(true)
  }

  function handleStatusChange(id: string, newStatus: EmpresaStatus) {
    setEmpresas((prev) => prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e)))
  }

  function handleDelete(id: string) {
    setEmpresas((prev) => prev.filter((e) => e.id !== id))
  }

  function handleSave(updated: Empresa) {
    setEmpresas((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
  }

  function getActionsForStatus(empresa: Empresa) {
    const actions: { label: string; onClick: () => void }[] = []

    if (empresa.status === 'aguardando-revisao-manual') {
      actions.push({ label: 'Marcar como Elegível', onClick: () => handleStatusChange(empresa.id, 'elegivel') })
      actions.push({ label: 'Marcar como Não Elegível', onClick: () => handleStatusChange(empresa.id, 'nao-elegivel') })
    }
    if (empresa.status === 'elegivel') {
      actions.push({ label: 'Aguardar Contrato', onClick: () => handleStatusChange(empresa.id, 'aguardando-contrato') })
    }
    if (empresa.status === 'aguardando-contrato') {
      actions.push({ label: 'Marcar como Cadastrado', onClick: () => handleStatusChange(empresa.id, 'cadastrado') })
    }

    return actions
  }

  return (
    <>
      <MostraNavbarSync breadcrumbs={[{ label: 'Empresas Participantes' }]} />

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <Heading as="h1" size="heading-lg">Empresas Participantes</Heading>
          <Button variant="primary" size="sm" className="flex items-center gap-2 shrink-0">
            <Plus size={14} />
            Cadastrar empresa
          </Button>
        </div>

        {/* Filters + Search */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Status tabs */}
          <div className="flex flex-wrap gap-1">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => handleFilterChange(f.value)}
                className={
                  'px-3 py-1 text-xs font-medium border transition-colors ' +
                  (activeFilter === f.value
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-background text-muted-foreground border-border hover:border-foreground hover:text-foreground')
                }
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por CNPJ ou nome..."
              value={search}
              onChange={handleSearchChange}
              className="pl-8 h-8 text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome / CNPJ</TableHead>
                <TableHead>Setor</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center">
                    <Body size="sm" className="text-muted-foreground">Nenhuma empresa encontrada.</Body>
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((empresa) => {
                  const statusActions = getActionsForStatus(empresa)
                  return (
                    <TableRow
                      key={empresa.id}
                      className="cursor-pointer hover:bg-muted/30"
                      onClick={() => openDetail(empresa)}
                    >
                      <TableCell>
                        <div className="font-medium text-sm">{empresa.nome}</div>
                        <div className="text-xs text-muted-foreground font-mono">{empresa.cnpj}</div>
                      </TableCell>
                      <TableCell>
                        <Body size="sm">{empresa.setor}</Body>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{empresa.responsavel}</div>
                        <div className="text-xs text-muted-foreground">{empresa.cargo}</div>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <StatusBadge status={empresa.status} tipo="empresa" />
                      </TableCell>
                      <TableCell>
                        <Body size="sm" className="text-muted-foreground whitespace-nowrap">
                          {formatDateBR(empresa.dataEntrada)}
                        </Body>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1 hover:bg-muted rounded-sm">
                              <MoreHorizontal size={16} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52">
                            <DropdownMenuItem onClick={() => openDetail(empresa)}>
                              Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEdit(empresa)}>
                              Editar dados
                            </DropdownMenuItem>
                            {statusActions.length > 0 && (
                              <>
                                <DropdownMenuSeparator />
                                {statusActions.map((action) => (
                                  <DropdownMenuItem key={action.label} onClick={action.onClick}>
                                    {action.label}
                                  </DropdownMenuItem>
                                ))}
                              </>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDelete(empresa.id)}
                            >
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <Body size="sm" className="text-muted-foreground">
            Exibindo {filtered.length} de {empresas.length} registros
          </Body>
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    aria-disabled={page === 1}
                    className={page === 1 ? 'pointer-events-none opacity-40' : ''}
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="px-3 py-2 text-sm">
                    {page} / {totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    aria-disabled={page === totalPages}
                    className={page === totalPages ? 'pointer-events-none opacity-40' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>

      {/* Detail Sheet */}
      <EmpresaDetailSheet
        empresa={selectedEmpresa}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onStatusChange={(newStatus) => {
          if (selectedEmpresa) {
            handleStatusChange(selectedEmpresa.id, newStatus)
            setSelectedEmpresa((prev) => prev ? { ...prev, status: newStatus } : null)
          }
        }}
        onEdit={() => {
          setSheetOpen(false)
          if (selectedEmpresa) openEdit(selectedEmpresa)
        }}
      />

      {/* Edit Dialog */}
      <EmpresaEditDialog
        empresa={editingEmpresa}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={handleSave}
      />
    </>
  )
}
