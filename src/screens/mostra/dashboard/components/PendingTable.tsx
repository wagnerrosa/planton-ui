import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TablePagination } from '@/components/shadcn/table'
import { Heading } from '@/components/primitives/Heading'
import { Skeleton } from '@/components/shadcn/skeleton'
import { StatusBadge } from '../../components/StatusBadge'
import { PENDENCIAS, PAGE_SIZE, formatDateBR } from '../../mock-data'

type PendingTableProps = {
  loading?: boolean
}

export function PendingTable({ loading = false }: PendingTableProps) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(PENDENCIAS.length / PAGE_SIZE))
  const paginated = PENDENCIAS.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
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
                  <div className="font-medium font-sans text-sm">{item.nome}</div>
                  <div className="font-mono text-xs text-planton-muted">{item.cnpj}</div>
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
  )
}
