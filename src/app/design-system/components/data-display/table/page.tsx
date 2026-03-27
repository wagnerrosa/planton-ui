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
      {/* Exemplo básico com zebra stripes e headers mono */}
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Exemplo — Colaboradores (zebra stripes + headers mono)</h2>
        <p className="text-sm text-muted-foreground">
          O <code className="font-mono text-xs bg-muted px-1">TableBody</code> aplica automaticamente zebra stripes nas linhas pares via <code className="font-mono text-xs bg-muted px-1">[&amp;_tr:nth-child(even)]:bg-muted/30</code>.
          O <code className="font-mono text-xs bg-muted px-1">TableHead</code> usa <code className="font-mono text-xs bg-muted px-1">font-mono</code> (Geist Mono) e o <code className="font-mono text-xs bg-muted px-1">TableCell</code> usa <code className="font-mono text-xs bg-muted px-1">font-sans</code> (Instrument Sans).
        </p>
        <div className="border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Colaborador</TableHead>
                <TableHead>Trilha</TableHead>
                <TableHead>Progresso</TableHead>
                <TableHead>Certificado</TableHead>
                <TableHead>Último acesso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { name: 'Ana Beatriz Silva',   trail: 'Gestão de Emissões de GEE', progress: '65%',  cert: 'Pendente', access: '14 mar 2026' },
                { name: 'Carlos Eduardo Mota', trail: 'Fundamentos ESG',           progress: '100%', cert: 'Emitido',  access: '10 mar 2026' },
                { name: 'Fernanda Lima',       trail: 'GHG Protocol Avançado',     progress: '20%',  cert: 'Pendente', access: '15 mar 2026' },
                { name: 'Rafael Gonçalves',    trail: 'Relatórios GRI 400',        progress: '100%', cert: 'Emitido',  access: '12 mar 2026' },
                { name: 'Mariana Costa',       trail: 'Carbono no Solo',           progress: '80%',  cert: 'Pendente', access: '13 mar 2026' },
                { name: 'Pedro Alves',         trail: 'Fundamentos ESG',           progress: '100%', cert: 'Emitido',  access: '09 mar 2026' },
              ].map((row) => (
                <TableRow key={row.name} className="border-border">
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.trail}</TableCell>
                  <TableCell>{row.progress}</TableCell>
                  <TableCell>
                    <Badge variant={row.cert === 'Emitido' ? 'success' : 'outline'}>{row.cert}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{row.access}</TableCell>
                </TableRow>
              ))}
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
