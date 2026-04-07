import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TablePagination, tableLinkClass } from '@/components/shadcn/table'
import { Avatar, AvatarFallback } from '@/components/shadcn/avatar'
import { Heading } from '@/components/primitives/Heading'
import { Skeleton } from '@/components/shadcn/skeleton'
import { StatusBadge } from '../../components/StatusBadge'
import { EmpresaDetailSheet } from '../../empresas/components/EmpresaDetailSheet'
import { FornecedorDetailSheet } from '../../fornecedores/components/FornecedorDetailSheet'
import { PENDENCIAS, EMPRESAS, FORNECEDORES, PAGE_SIZE, formatDateBR, type Empresa, type Fornecedor, type EmpresaStatus, type FornecedorStatus } from '../../mock-data'

type PendingTableProps = {
  loading?: boolean
}

export function PendingTable({ loading = false }: PendingTableProps) {
  const [page, setPage] = useState(1)
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null)
  const [selectedFornecedor, setSelectedFornecedor] = useState<Fornecedor | null>(null)
  const [empresaSheetOpen, setEmpresaSheetOpen] = useState(false)
  const [fornecedorSheetOpen, setFornecedorSheetOpen] = useState(false)

  const totalPages = Math.max(1, Math.ceil(PENDENCIAS.length / PAGE_SIZE))
  const paginated = PENDENCIAS.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function openDetail(cnpj: string, tipo: 'empresa' | 'fornecedor') {
    if (tipo === 'empresa') {
      const empresa = EMPRESAS.find((e) => e.cnpj === cnpj) ?? null
      setSelectedEmpresa(empresa)
      setEmpresaSheetOpen(true)
    } else {
      const fornecedor = FORNECEDORES.find((f) => f.cnpj === cnpj) ?? null
      setSelectedFornecedor(fornecedor)
      setFornecedorSheetOpen(true)
    }
  }

  return (
    <>
    <div className="border border-border">
      <div className="px-6 pt-6 pb-4 border-b border-border">
        <Heading as="h2" size="heading-md">Pendências - Aguardando ação manual</Heading>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome / CNPJ</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-40 mb-1" />
                  <Skeleton className="h-3 w-28" />
                </TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-5 w-28 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
              </TableRow>
            ))
          ) : paginated.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-12 text-planton-muted font-sans text-sm">
                Nenhuma pendência encontrada
              </TableCell>
            </TableRow>
          ) : (
            paginated.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 rounded-sm shrink-0">
                      <AvatarFallback className="rounded-sm text-xs font-mono">
                        {item.nome.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <button
                        className={tableLinkClass + ' font-medium font-sans text-sm'}
                        onClick={() => openDetail(item.cnpj, item.tipo)}
                      >
                        {item.nome}
                      </button>
                      <div className="font-mono text-xs text-planton-muted">{item.cnpj}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-sans text-sm capitalize">{item.tipo}</span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={item.status} tipo={item.tipo} />
                </TableCell>
                <TableCell className="text-right font-sans text-sm text-planton-muted">
                  {formatDateBR(item.dataSolicitacao)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <TablePagination
        page={page}
        totalPages={totalPages}
        totalItems={PENDENCIAS.length}
        itemLabel="pendências"
        onPageChange={setPage}
      />
    </div>

    <EmpresaDetailSheet
      empresa={selectedEmpresa}
      open={empresaSheetOpen}
      onOpenChange={setEmpresaSheetOpen}
      onStatusChange={(newStatus: EmpresaStatus) => {
        setSelectedEmpresa((prev) => prev ? { ...prev, status: newStatus } : null)
      }}
      onEdit={() => setEmpresaSheetOpen(false)}
    />

    <FornecedorDetailSheet
      fornecedor={selectedFornecedor}
      open={fornecedorSheetOpen}
      onOpenChange={setFornecedorSheetOpen}
      onStatusChange={(newStatus: FornecedorStatus) => {
        setSelectedFornecedor((prev) => prev ? { ...prev, status: newStatus } : null)
      }}
      onEdit={() => setFornecedorSheetOpen(false)}
    />
    </>
  )
}
