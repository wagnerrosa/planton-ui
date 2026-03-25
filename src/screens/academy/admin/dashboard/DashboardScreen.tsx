'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, Building2, Award, Clock, Users, BookCheck, HelpCircle, Search } from 'lucide-react'
import { AcademyNavbarSync } from '@/components/navigation/AcademyNavbarSync'
import { AcademyFooter } from '@/components/navigation/AcademyFooter'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { Alert, AlertBody, AlertDescription } from '@/components/shadcn/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TablePagination, tableLinkClass } from '@/components/shadcn/table'
import { Badge } from '@/components/shadcn/badge'
import { Input } from '@/components/shadcn/input'
import { Skeleton } from '@/components/shadcn/skeleton'
import { AdminStatsCard } from '../components/AdminStatsCard'
import {
  ADMIN_KPIS,
  EXPIRING_PLANS,
  TOP_CONTENT,
  COMPANY_SUMMARY,
  CLIENTS,
} from '../mock-data'

const BASE = '/design-system/screens/academy'

const PERIOD_OPTIONS = [
  { value: 'all', label: 'Todo o período' },
  { value: '30d', label: 'Últimos 30 dias' },
  { value: '90d', label: 'Últimos 90 dias' },
]

const KPI_ICONS = [
  <Building2 key="b" size={16} />,
  <Users key="u" size={16} />,
  <Clock key="c" size={16} />,
  <Award key="a" size={16} />,
  <HelpCircle key="h" size={16} />,
  <BookCheck key="bc" size={16} />,
]

const SUMMARY_PER_PAGE = 5

export function DashboardScreen() {
  const [clientFilter, setClientFilter] = useState('all')
  const [periodFilter, setPeriodFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [summarySearch, setSummarySearch] = useState('')
  const [summaryPage, setSummaryPage] = useState(1)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const filteredSummary = useMemo(() => {
    let items = COMPANY_SUMMARY
    if (clientFilter !== 'all') items = items.filter((c) => c.id === clientFilter)
    if (summarySearch.trim()) {
      const q = summarySearch.toLowerCase().trim()
      items = items.filter((c) => c.name.toLowerCase().includes(q))
    }
    return items
  }, [clientFilter, summarySearch])

  const summaryTotalPages = Math.max(1, Math.ceil(filteredSummary.length / SUMMARY_PER_PAGE))
  const paginatedSummary = filteredSummary.slice((summaryPage - 1) * SUMMARY_PER_PAGE, summaryPage * SUMMARY_PER_PAGE)

  useEffect(() => { setSummaryPage(1) }, [summarySearch, clientFilter])

  const contentTypeLabels: Record<string, string> = {
    video: 'Vídeo',
    artigo: 'Artigo',
    podcast: 'Podcast',
    guia: 'Guia',
  }

  return (
    <>
      <AcademyNavbarSync breadcrumbs={[{ label: 'Admin', href: `${BASE}/admin` }, { label: 'Dashboard' }]} />

      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          {/* Header */}
          <div className="max-w-[1920px] mx-auto px-6 pt-10 pb-8 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="flex flex-col gap-1">
                <Heading as="h1" size="heading-xl">Dashboard</Heading>
                <Body muted>Visão geral da plataforma</Body>
              </div>
              <div className="flex items-center gap-3">
                <Select value={clientFilter} onValueChange={setClientFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as empresas</SelectItem>
                    {CLIENTS.filter((c) => c.status === 'ativo').map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={periodFilter} onValueChange={setPeriodFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    {PERIOD_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="max-w-[1920px] mx-auto px-6 pb-10">
            <div className="overflow-hidden border-t border-l border-border">
              {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="border-r border-b border-border p-6 flex flex-col gap-3">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3">
                  {ADMIN_KPIS.map((kpi, i) => (
                    <AdminStatsCard
                      key={kpi.label}
                      value={kpi.value}
                      label={kpi.label}
                      change={kpi.change}
                      period={kpi.period}
                      trend={kpi.trend}
                      icon={KPI_ICONS[i]}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Expiring Plans */}
          {EXPIRING_PLANS.length > 0 && (
            <div className="max-w-[1920px] mx-auto px-6 pb-10">
              <div className="border border-border">
                <div className="px-6 pt-6 pb-4 border-b border-border flex items-center justify-between gap-4">
                  <Heading as="h2" size="heading-md">Planos próximos do vencimento</Heading>
                  <Alert variant="warning" className="w-fit">
                    <AlertTriangle size={16} />
                    <AlertBody>
                      <AlertDescription>
                        {EXPIRING_PLANS.length} empresa{EXPIRING_PLANS.length > 1 ? 's' : ''} com plano expirando nos próximos 30 dias.
                      </AlertDescription>
                    </AlertBody>
                  </Alert>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Dias restantes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {EXPIRING_PLANS.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">
                          <Link href={`${BASE}/admin/clients/${client.id}`} className={tableLinkClass}>
                            {client.name}
                          </Link>
                        </TableCell>
                        <TableCell>{client.plan.name}</TableCell>
                        <TableCell className="text-right font-mono text-sm tabular-nums">{client.plan.expiration}</TableCell>
                        <TableCell>
                          <Badge variant={client.plan.daysRemaining <= 10 ? 'destructive' : 'warning'}>
                            {client.plan.daysRemaining} dias
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Top Content */}
          <div className="max-w-[1920px] mx-auto px-6 pb-10">
            <div className="border border-border">
              <div className="px-6 pt-6 pb-4 border-b border-border">
                <Heading as="h2" size="heading-md">Top conteúdos mais assistidos</Heading>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Visualizações</TableHead>
                    <TableHead className="text-right">Horas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-6" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-10 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    TOP_CONTENT.map((content, i) => (
                      <TableRow key={content.id}>
                        <TableCell className="font-mono text-planton-muted">{i + 1}</TableCell>
                        <TableCell className="font-medium">{content.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{contentTypeLabels[content.type] || content.type}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">{content.views.toLocaleString('pt-BR')}</TableCell>
                        <TableCell className="text-right font-mono text-sm">{content.totalHours}h</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Company Summary (Drill-down) */}
          <div className="max-w-[1920px] mx-auto px-6 pb-10">
            <div className="border border-border">
              <div className="px-6 pt-6 pb-4 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Heading as="h2" size="heading-md">Resumo por empresa</Heading>
                <div className="relative w-full sm:w-[260px]">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-planton-muted" />
                  <Input
                    placeholder="Buscar empresa..."
                    value={summarySearch}
                    onChange={(e) => setSummarySearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead className="text-right">Usuários</TableHead>
                    <TableHead className="text-right">Horas</TableHead>
                    <TableHead className="text-right">Certificados</TableHead>
                    <TableHead className="text-right">Trilhas concluídas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-10 ml-auto" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-10 ml-auto" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-10 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : paginatedSummary.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-planton-muted">
                        Nenhum dado disponível
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedSummary.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell className="font-medium">
                          <Link href={`${BASE}/admin/clients/${company.id}`} className={tableLinkClass}>
                            {company.name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm tabular-nums">{company.users}</TableCell>
                        <TableCell className="text-right font-mono text-sm tabular-nums">{company.hours}h</TableCell>
                        <TableCell className="text-right font-mono text-sm tabular-nums">{company.certificates}</TableCell>
                        <TableCell className="text-right font-mono text-sm tabular-nums">{company.trailsCompleted}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <TablePagination
                page={summaryPage}
                totalPages={summaryTotalPages}
                totalItems={filteredSummary.length}
                itemLabel={`empresa${filteredSummary.length !== 1 ? 's' : ''}`}
                onPageChange={setSummaryPage}
              />
            </div>
          </div>
        </div>

        <AcademyFooter />
      </div>
    </>
  )
}
