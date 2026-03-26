'use client'

import { useState } from 'react'
import { ComponentPage } from '@/components/ui/ComponentPage'
import { Badge } from '@/components/shadcn/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TablePagination,
} from '@/components/shadcn/table'
import { findComponent } from '@/lib/components-registry'

const meta = findComponent('data-display', 'table')!

const ALL_ROWS = [
  { name: 'Ana Beatriz Silva',    trail: 'Gestão de Emissões de GEE', progress: '65%',  cert: 'Pendente', access: '14 mar 2026' },
  { name: 'Carlos Eduardo Mota',  trail: 'Fundamentos ESG',           progress: '100%', cert: 'Emitido',  access: '10 mar 2026' },
  { name: 'Fernanda Lima',        trail: 'GHG Protocol Avançado',     progress: '20%',  cert: 'Pendente', access: '15 mar 2026' },
  { name: 'Rafael Gonçalves',     trail: 'Relatórios GRI 400',        progress: '100%', cert: 'Emitido',  access: '12 mar 2026' },
  { name: 'Mariana Costa',        trail: 'Carbono no Solo',           progress: '80%',  cert: 'Pendente', access: '13 mar 2026' },
  { name: 'Pedro Alves',          trail: 'Fundamentos ESG',           progress: '100%', cert: 'Emitido',  access: '09 mar 2026' },
  { name: 'Juliana Ferreira',     trail: 'GHG Protocol Avançado',     progress: '45%',  cert: 'Pendente', access: '16 mar 2026' },
  { name: 'Bruno Ribeiro',        trail: 'Gestão de Emissões de GEE', progress: '90%',  cert: 'Pendente', access: '11 mar 2026' },
]

const PER_PAGE = 4

export default function TablePage() {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(ALL_ROWS.length / PER_PAGE)
  const paginated = ALL_ROWS.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <ComponentPage
      category="Data Display"
      name={meta.name}
      description={meta.description}
      filePath={meta.filePath}
    >
      {/* Exemplo básico */}
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Exemplo — Colaboradores</h2>
        <div className="border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground font-mono text-xs uppercase tracking-widest">Colaborador</TableHead>
                <TableHead className="text-muted-foreground font-mono text-xs uppercase tracking-widest">Trilha</TableHead>
                <TableHead className="text-muted-foreground font-mono text-xs uppercase tracking-widest">Progresso</TableHead>
                <TableHead className="text-muted-foreground font-mono text-xs uppercase tracking-widest">Certificado</TableHead>
                <TableHead className="text-muted-foreground font-mono text-xs uppercase tracking-widest">Último acesso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-border">
                <TableCell className="text-sm text-foreground">Ana Beatriz Silva</TableCell>
                <TableCell className="text-sm text-foreground">Gestão de Emissões de GEE</TableCell>
                <TableCell className="text-sm text-foreground">65%</TableCell>
                <TableCell><Badge variant="outline">Pendente</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">14 mar 2026</TableCell>
              </TableRow>
              <TableRow className="border-border">
                <TableCell className="text-sm text-foreground">Carlos Eduardo Mota</TableCell>
                <TableCell className="text-sm text-foreground">Fundamentos ESG</TableCell>
                <TableCell className="text-sm text-foreground">100%</TableCell>
                <TableCell><Badge variant="success">Emitido</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">10 mar 2026</TableCell>
              </TableRow>
              <TableRow className="border-border">
                <TableCell className="text-sm text-foreground">Fernanda Lima</TableCell>
                <TableCell className="text-sm text-foreground">GHG Protocol Avançado</TableCell>
                <TableCell className="text-sm text-foreground">20%</TableCell>
                <TableCell><Badge variant="outline">Pendente</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">15 mar 2026</TableCell>
              </TableRow>
              <TableRow className="border-border">
                <TableCell className="text-sm text-foreground">Rafael Gonçalves</TableCell>
                <TableCell className="text-sm text-foreground">Relatórios GRI 400</TableCell>
                <TableCell className="text-sm text-foreground">100%</TableCell>
                <TableCell><Badge variant="success">Emitido</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">12 mar 2026</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>

      {/* TablePagination */}
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Com paginação — TablePagination</h2>
        <div className="border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground font-mono text-xs uppercase tracking-widest">Colaborador</TableHead>
                <TableHead className="text-muted-foreground font-mono text-xs uppercase tracking-widest">Trilha</TableHead>
                <TableHead className="text-muted-foreground font-mono text-xs uppercase tracking-widest">Progresso</TableHead>
                <TableHead className="text-muted-foreground font-mono text-xs uppercase tracking-widest">Certificado</TableHead>
                <TableHead className="text-muted-foreground font-mono text-xs uppercase tracking-widest">Último acesso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((row) => (
                <TableRow key={row.name} className="border-border">
                  <TableCell className="text-sm text-foreground">{row.name}</TableCell>
                  <TableCell className="text-sm text-foreground">{row.trail}</TableCell>
                  <TableCell className="text-sm text-foreground">{row.progress}</TableCell>
                  <TableCell>
                    <Badge variant={row.cert === 'Emitido' ? 'success' : 'outline'}>{row.cert}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{row.access}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            page={page}
            totalPages={totalPages}
            totalItems={ALL_ROWS.length}
            itemLabel="colaboradores"
            onPageChange={setPage}
          />
        </div>
      </section>
    </ComponentPage>
  )
}
