'use client'

import { ComponentPage } from '@/components/ui/ComponentPage'
import { Badge } from '@/components/shadcn/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn/table'
import { findComponent } from '@/lib/components-registry'

const meta = findComponent('data-display', 'table')!

export default function TablePage() {
  return (
    <ComponentPage
      category="Data Display"
      name={meta.name}
      description={meta.description}
      filePath={meta.filePath}
    >
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
                <TableCell><Badge variant="outline" className="rounded-none border-border font-mono text-xs text-muted-foreground">Pendente</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">14 mar 2026</TableCell>
              </TableRow>
              <TableRow className="border-border">
                <TableCell className="text-sm text-foreground">Carlos Eduardo Mota</TableCell>
                <TableCell className="text-sm text-foreground">Fundamentos ESG</TableCell>
                <TableCell className="text-sm text-foreground">100%</TableCell>
                <TableCell><Badge className="rounded-none bg-planton-accent text-planton-ink font-mono text-xs">Emitido</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">10 mar 2026</TableCell>
              </TableRow>
              <TableRow className="border-border">
                <TableCell className="text-sm text-foreground">Fernanda Lima</TableCell>
                <TableCell className="text-sm text-foreground">GHG Protocol Avançado</TableCell>
                <TableCell className="text-sm text-foreground">20%</TableCell>
                <TableCell><Badge variant="outline" className="rounded-none border-border font-mono text-xs text-muted-foreground">Pendente</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">15 mar 2026</TableCell>
              </TableRow>
              <TableRow className="border-border">
                <TableCell className="text-sm text-foreground">Rafael Gonçalves</TableCell>
                <TableCell className="text-sm text-foreground">Relatórios GRI 400</TableCell>
                <TableCell className="text-sm text-foreground">100%</TableCell>
                <TableCell><Badge className="rounded-none bg-planton-accent text-planton-ink font-mono text-xs">Emitido</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">12 mar 2026</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>
    </ComponentPage>
  )
}
