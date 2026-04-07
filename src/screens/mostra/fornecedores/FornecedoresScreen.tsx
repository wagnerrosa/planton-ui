'use client'

import { useState, useMemo } from 'react'
import { MoreHorizontal, Plus, Search } from 'lucide-react'
import { MostraNavbarSync } from '@/components/navigation/MostraNavbarSync'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { Button } from '@/components/primitives/Button'
import { Input } from '@/components/shadcn/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TablePagination } from '@/components/shadcn/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/shadcn/dropdown-menu'
import { StatusBadge } from '../components/StatusBadge'
import { FornecedorDetailSheet } from './components/FornecedorDetailSheet'
import { FornecedorEditDialog } from './components/FornecedorEditDialog'
import {
  FORNECEDORES,
  PAGE_SIZE,
  formatDateBR,
  type Fornecedor,
  type FornecedorStatus,
} from '../mock-data'

const STATUS_FILTERS: { label: string; value: FornecedorStatus | 'all' }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Processo Iniciado', value: 'processo-iniciado' },
  { label: 'Ag. Contrato', value: 'aguardando-contrato' },
  { label: 'Elegível', value: 'elegivel' },
  { label: 'Não Elegível', value: 'nao-elegivel' },
  { label: 'Cadastrado', value: 'cadastrado' },
]

export function FornecedoresScreen() {
  const [activeFilter, setActiveFilter] = useState<FornecedorStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selectedFornecedor, setSelectedFornecedor] = useState<Fornecedor | null>(null)
  const [editingFornecedor, setEditingFornecedor] = useState<Fornecedor | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>(FORNECEDORES)

  const filtered = useMemo(() => {
    return fornecedores.filter((f) => {
      const matchStatus = activeFilter === 'all' || f.status === activeFilter
      const q = search.trim().toLowerCase()
      const matchSearch = !q || f.cnpj.toLowerCase().includes(q) || f.nome.toLowerCase().includes(q)
      return matchStatus && matchSearch
    })
  }, [fornecedores, activeFilter, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleFilterChange(value: FornecedorStatus | 'all') {
    setActiveFilter(value)
    setPage(1)
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value)
    setPage(1)
  }

  function openDetail(fornecedor: Fornecedor) {
    setSelectedFornecedor(fornecedor)
    setSheetOpen(true)
  }

  function openEdit(fornecedor: Fornecedor) {
    setEditingFornecedor(fornecedor)
    setEditOpen(true)
  }

  function handleStatusChange(id: string, newStatus: FornecedorStatus) {
    setFornecedores((prev) => prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f)))
  }

  function handleDelete(id: string) {
    setFornecedores((prev) => prev.filter((f) => f.id !== id))
  }

  function handleSave(updated: Fornecedor) {
    setFornecedores((prev) => prev.map((f) => (f.id === updated.id ? updated : f)))
  }

  function getActionsForStatus(fornecedor: Fornecedor) {
    const actions: { label: string; onClick: () => void }[] = []

    if (fornecedor.status === 'elegivel') {
      actions.push({ label: 'Aguardar Contrato', onClick: () => handleStatusChange(fornecedor.id, 'aguardando-contrato') })
    }
    if (fornecedor.status === 'aguardando-contrato') {
      actions.push({ label: 'Marcar como Cadastrado', onClick: () => handleStatusChange(fornecedor.id, 'cadastrado') })
    }
    if (fornecedor.status === 'processo-iniciado') {
      actions.push({ label: 'Marcar como Elegível', onClick: () => handleStatusChange(fornecedor.id, 'elegivel') })
      actions.push({ label: 'Marcar como Não Elegível', onClick: () => handleStatusChange(fornecedor.id, 'nao-elegivel') })
    }

    return actions
  }

  return (
    <>
      <MostraNavbarSync breadcrumbs={[{ label: 'Fornecedores / Consultorias' }]} />

      <div className="px-6 pb-6 pt-10 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <Heading as="h1" size="heading-lg">Fornecedores / Consultorias</Heading>
          <Button variant="primary" size="sm" href="/design-system/screens/mostra/cadastro-manual?tab=fornecedor" className="shrink-0">
            <Plus size={14} />
            Cadastrar Fornecedor
          </Button>
        </div>

        {/* Filters + Search */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
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
                <TableHead>Site</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Clientes Indicados</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center">
                    <Body size="sm" className="text-muted-foreground">Nenhum fornecedor encontrado.</Body>
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((fornecedor) => {
                  const statusActions = getActionsForStatus(fornecedor)
                  return (
                    <TableRow
                      key={fornecedor.id}
                      className="cursor-pointer hover:bg-muted/30"
                      onClick={() => openDetail(fornecedor)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 rounded-sm shrink-0">
                            <AvatarImage src={fornecedor.logoUrl} alt={fornecedor.nome} />
                            <AvatarFallback className="rounded-sm text-xs font-mono">
                              {fornecedor.nome.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{fornecedor.nome}</div>
                            <div className="text-xs text-muted-foreground font-mono">{fornecedor.cnpj}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Body size="sm" className="text-muted-foreground">
                          {fornecedor.site ?? '—'}
                        </Body>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{fornecedor.responsavel}</div>
                        <div className="text-xs text-muted-foreground">{fornecedor.cargo}</div>
                      </TableCell>
                      <TableCell>
                        <Body size="sm" className="text-muted-foreground">
                          {fornecedor.clientesIndicados.length > 0
                            ? fornecedor.clientesIndicados.join(', ')
                            : '—'}
                        </Body>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <StatusBadge status={fornecedor.status} tipo="fornecedor" />
                      </TableCell>
                      <TableCell>
                        <Body size="sm" className="text-muted-foreground whitespace-nowrap">
                          {formatDateBR(fornecedor.dataEntrada)}
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
                            <DropdownMenuItem onClick={() => openDetail(fornecedor)}>
                              Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEdit(fornecedor)}>
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
                              onClick={() => handleDelete(fornecedor.id)}
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
          <TablePagination
            page={page}
            totalPages={totalPages}
            totalItems={filtered.length}
            itemLabel={`de ${fornecedores.length} fornecedores`}
            onPageChange={setPage}
          />
        </div>
      </div>

      {/* Detail Sheet */}
      <FornecedorDetailSheet
        fornecedor={selectedFornecedor}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onStatusChange={(newStatus) => {
          if (selectedFornecedor) {
            handleStatusChange(selectedFornecedor.id, newStatus)
            setSelectedFornecedor((prev) => prev ? { ...prev, status: newStatus } : null)
          }
        }}
        onEdit={() => {
          setSheetOpen(false)
          if (selectedFornecedor) openEdit(selectedFornecedor)
        }}
      />

      {/* Edit Dialog */}
      <FornecedorEditDialog
        fornecedor={editingFornecedor}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={handleSave}
      />
    </>
  )
}
