'use client'

import { Download, FileSpreadsheet, Info } from 'lucide-react'
import { MostraNavbarSync } from '@/components/navigation/MostraNavbarSync'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { Button } from '@/components/primitives/Button'
import { Alert, AlertDescription } from '@/components/shadcn/alert'

// ─── Types ───────────────────────────────────────────────────────────────────

type ReportCard = {
  title: string
  description: string
  count: string
  countLabel: string
  filename: string
}

const REPORTS: ReportCard[] = [
  {
    title: 'Relatório Geral — Todos os Registros',
    description: '47 registros totais',
    count: '47',
    countLabel: 'registros',
    filename: 'relatorio-geral.xlsx',
  },
  {
    title: 'Relatório — Apenas Empresas',
    description: '18 registros — Formato .xlsx',
    count: '18',
    countLabel: 'empresas',
    filename: 'relatorio-empresas.xlsx',
  },
  {
    title: 'Relatório — Apenas Fornecedores',
    description: '10 registros — Formato .xlsx',
    count: '10',
    countLabel: 'fornecedores',
    filename: 'relatorio-fornecedores.xlsx',
  },
  {
    title: 'Relatório de FUP — Não Elegíveis com FUP Ativo',
    description: 'Registros não elegíveis com acompanhamento de próximos passos',
    count: '4',
    countLabel: 'registros',
    filename: 'relatorio-fup-ativo.xlsx',
  },
]

// ─── Card ─────────────────────────────────────────────────────────────────────

function DownloadCard({ report }: { report: ReportCard }) {
  function handleDownload() {
    // Mock download: cria um blob vazio para demonstração
    const blob = new Blob([''], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = report.filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="border border-border p-5 flex items-center justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className="mt-0.5 shrink-0 text-muted-foreground">
          <FileSpreadsheet size={20} />
        </div>
        <div className="space-y-1">
          <Heading as="h3" size="heading-md">{report.title}</Heading>
          <Body size="sm" className="text-muted-foreground">{report.description}</Body>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownload}
        className="shrink-0 flex items-center gap-2"
      >
        <Download size={14} />
        Baixar .xlsx
      </Button>
    </div>
  )
}

// ─── Screen ─────────────────────────────────────────────────────────────────

export function RelatorioScreen() {
  return (
    <>
      <MostraNavbarSync breadcrumbs={[{ label: 'Relatório Geral' }]} />

      <div className="px-6 pb-6 pt-10 space-y-6 max-w-3xl">
        <Heading as="h1" size="heading-lg">Relatório Geral</Heading>

        <Alert variant="info">
          <Info size={14} />
          <AlertDescription>
            O relatório inclui todos os registros (Empresas e Fornecedores) com: CNPJ, tipo, setor, status atual, data de cadastro e data da última atualização de status.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          {REPORTS.map((report) => (
            <DownloadCard key={report.filename} report={report} />
          ))}
        </div>
      </div>
    </>
  )
}
