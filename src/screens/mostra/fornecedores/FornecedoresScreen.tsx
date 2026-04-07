'use client'

import { useState, useMemo } from 'react'
import { MoreHorizontal, Plus, Search, ChevronDown } from 'lucide-react'
import { MostraNavbarSync } from '@/components/navigation/MostraNavbarSync'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { Button } from '@/components/primitives/Button'
import { Input } from '@/components/shadcn/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TablePagination, tableLinkClass } from '@/components/shadcn/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/shadcn/dropdown-menu'
import { StatusBadge } from '../components/StatusBadge'
import { FornecedorDetailSheet } from './components/FornecedorDetailSheet'
import { FornecedorFormSheet } from './components/FornecedorFormSheet'
import {
  FORNECEDORES,
  PAGE_SIZE,
  formatDateBR,
  type Fornecedor,
  type FornecedorStatus,
} from '../mock-data'

const STATUS_OPTIONS: { label: string; value: FornecedorStatus }[] = [
  { label: 'Processo Iniciado', value: 'processo-iniciado' },
  { label: 'Ag. Contrato', value: 'aguardando-contrato' },
  { label: 'Elegível', value: 'elegivel' },
  { label: 'Não Elegível', value: 'nao-elegivel' },
  { label: 'Cadastrado', value: 'cadastrado' },
]

export function FornecedoresScreen() {
  const [statusFilters, setStatusFilters] = useState<FornecedorStatus[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selectedFornecedor, setSelectedFornecedor] = useState<Fornecedor | null>(null)
  const [editingFornecedor, setEditingFornecedor] = useState<Fornecedor | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>(FORNECEDORES)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return fornecedores.filter((f) => {
      const matchStatus = statusFilters.length === 0 || statusFilters.includes(f.status)
      const q = search.trim().toLowerCase()
      const matchSearch = !q || f.cnpj.toLowerCase().includes(q) || f.nome.toLowerCase().includes(q)
      return matchStatus && matchSearch
    })
  }, [fornecedores, statusFilters, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function toggleStatusFilter(value: FornecedorStatus) {
    setStatusFilters((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    )
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
    setConfirmDeleteId(null)
  }

  function handleSave(updated: Fornecedor) {
    setFornecedores((prev) => prev.map((f) => (f.id === updated.id ? updated : f)))
  }

  const statusFilterLabel = statusFilters.length === 0
    ? 'Status'
    : statusFilters.length === 1
      ? STATUS_OPTIONS.find((o) => o.value === statusFilters[0])?.label ?? 'Status'
      : `${statusFilters.length} status`

  return (
    <>
      <MostraNavbarSync breadcrumbs={[{ label: 'Fornecedores / Consultorias' }]} />

      <div className="px-6 pb-6 pt-10 space-y-6">
        {/* Header */}
        <Heading as="h1" size="heading-lg">Fornecedores / Consultorias</Heading>

        {/* Search + Cadastrar */}
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por CNPJ ou nome..."
              value={search}
              onChange={handleSearchChange}
              className="pl-8 h-8 text-sm"
            />
          </div>
          <Button variant="primary" size="sm" className="shrink-0" onClick={() => { setEditingFornecedor(null); setEditOpen(true) }}>
            <Plus size={14} />
            Cadastrar Fornecedor
          </Button>
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
                <TableHead>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                        <span className={statusFilters.length > 0 ? 'text-foreground font-semibold' : ''}>
                          {statusFilterLabel}
                        </span>
                        <ChevronDown size={12} className="opacity-60" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-52">
                      {STATUS_OPTIONS.map((option) => (
                        <DropdownMenuCheckboxItem
                          key={option.value}
                          checked={statusFilters.includes(option.value)}
                          onCheckedChange={() => toggleStatusFilter(option.value)}
                        >
                          {option.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                      {statusFilters.length > 0 && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-muted-foreground text-xs justify-center"
                            onClick={() => { setStatusFilters([]); setPage(1) }}
                          >
                            Limpar filtro
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableHead>
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
                paginated.map((fornecedor) => (
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
                            <span className={tableLinkClass + ' font-medium text-sm'}>{fornecedor.nome}</span>
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
                        <DropdownMenu
                          onOpenChange={(open) => { if (!open) setConfirmDeleteId(null) }}
                        >
                          <DropdownMenuTrigger asChild>
                            <button className="p-1 hover:bg-muted rounded-sm">
                              <MoreHorizontal size={16} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52">
                            {confirmDeleteId === fornecedor.id ? (
                              <>
                                <div className="px-2 py-1.5 text-xs text-muted-foreground">Confirmar exclusão?</div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleDelete(fornecedor.id)}
                                >
                                  Sim, excluir
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setConfirmDeleteId(null)}>
                                  Cancelar
                                </DropdownMenuItem>
                              </>
                            ) : (
                              <>
                                <DropdownMenuItem onClick={() => openDetail(fornecedor)}>
                                  Ver detalhes
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => setConfirmDeleteId(fornecedor.id)}
                                >
                                  Excluir
                                </DropdownMenuItem>
                              </>
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

      {/* Edit / New Sheet */}
      <FornecedorFormSheet
        fornecedor={editingFornecedor}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={handleSave}
        isNew={editingFornecedor === null}
      />
    </>
  )
}
