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
import { EmpresaDetailSheet } from './components/EmpresaDetailSheet'
import { EmpresaFormSheet } from './components/EmpresaFormSheet'
import {
  EMPRESAS,
  formatDateBR,
  type Empresa,
  type EmpresaStatus,
} from '../mock-data'

const STATUS_OPTIONS: { label: string; value: EmpresaStatus }[] = [
  { label: 'Processo Iniciado', value: 'processo-iniciado' },
  { label: 'Ag. Revisão', value: 'aguardando-revisao-manual' },
  { label: 'Ag. Contrato', value: 'aguardando-contrato' },
  { label: 'Elegível', value: 'elegivel' },
  { label: 'Não Elegível', value: 'nao-elegivel' },
  { label: 'Cadastrado', value: 'cadastrado' },
]

const PAGE_SIZE = 5

export function EmpresasScreen() {
  const [statusFilters, setStatusFilters] = useState<EmpresaStatus[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null)
  const [editingEmpresa, setEditingEmpresa] = useState<Empresa | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [empresas, setEmpresas] = useState<Empresa[]>(EMPRESAS)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return empresas.filter((e) => {
      const matchStatus = statusFilters.length === 0 || statusFilters.includes(e.status)
      const q = search.trim().toLowerCase()
      const matchSearch = !q || e.cnpj.toLowerCase().includes(q) || e.nome.toLowerCase().includes(q)
      return matchStatus && matchSearch
    })
  }, [empresas, statusFilters, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function toggleStatusFilter(value: EmpresaStatus) {
    setStatusFilters((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    )
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
    setConfirmDeleteId(null)
  }

  function handleSave(updated: Empresa) {
    setEmpresas((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
  }

  const statusFilterLabel = statusFilters.length === 0
    ? 'Status'
    : statusFilters.length === 1
      ? STATUS_OPTIONS.find((o) => o.value === statusFilters[0])?.label ?? 'Status'
      : `${statusFilters.length} status`

  return (
    <>
      <MostraNavbarSync breadcrumbs={[{ label: 'Empresas Participantes' }]} />

      <div className="px-6 pb-6 pt-10 space-y-6">
        {/* Header */}
        <Heading as="h1" size="heading-lg">Empresas Participantes</Heading>

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
          <Button variant="primary" size="sm" className="shrink-0" onClick={() => { setEditingEmpresa(null); setEditOpen(true) }}>
            <Plus size={14} />
            Cadastrar Empresa
          </Button>
        </div>

        {/* Table */}
        <div className="border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome / CNPJ</TableHead>
                <TableHead>Setor</TableHead>
                <TableHead>Responsável</TableHead>
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
                  <TableCell colSpan={6} className="py-12 text-center">
                    <Body size="sm" className="text-muted-foreground">Nenhuma empresa encontrada.</Body>
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((empresa) => (
                    <TableRow
                      key={empresa.id}
                      className="cursor-pointer hover:bg-muted/30"
                      onClick={() => openDetail(empresa)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 rounded-sm shrink-0">
                            <AvatarImage src={empresa.logoUrl} alt={empresa.nome} />
                            <AvatarFallback className="rounded-sm text-xs font-mono">
                              {empresa.nome.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className={tableLinkClass + ' font-medium text-sm'}>{empresa.nome}</span>
                            <div className="text-xs text-muted-foreground font-mono">{empresa.cnpj}</div>
                          </div>
                        </div>
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
                        <DropdownMenu
                          onOpenChange={(open) => { if (!open) setConfirmDeleteId(null) }}
                        >
                          <DropdownMenuTrigger asChild>
                            <button className="p-1 hover:bg-muted rounded-sm">
                              <MoreHorizontal size={16} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52">
                            {confirmDeleteId === empresa.id ? (
                              <>
                                <div className="px-2 py-1.5 text-xs text-muted-foreground">Confirmar exclusão?</div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleDelete(empresa.id)}
                                >
                                  Sim, excluir
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setConfirmDeleteId(null)}>
                                  Cancelar
                                </DropdownMenuItem>
                              </>
                            ) : (
                              <>
                                <DropdownMenuItem onClick={() => openDetail(empresa)}>
                                  Ver detalhes
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => setConfirmDeleteId(empresa.id)}
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
            itemLabel={`de ${empresas.length} empresas`}
            onPageChange={setPage}
          />
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

      {/* Edit / New Sheet */}
      <EmpresaFormSheet
        empresa={editingEmpresa}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={handleSave}
        isNew={editingEmpresa === null}
      />
    </>
  )
}
