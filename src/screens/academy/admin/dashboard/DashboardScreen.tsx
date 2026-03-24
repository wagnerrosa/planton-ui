'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, ArrowRight, Building2, Award, Clock, Users, BookCheck, HelpCircle } from 'lucide-react'
import { AcademyNavbarSync } from '@/components/navigation/AcademyNavbarSync'
import { AcademyFooter } from '@/components/navigation/AcademyFooter'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { Alert, AlertBody, AlertDescription } from '@/components/shadcn/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { Badge } from '@/components/shadcn/badge'
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

export function DashboardScreen() {
  const [clientFilter, setClientFilter] = useState('all')
  const [periodFilter, setPeriodFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const filteredSummary = useMemo(() => {
    if (clientFilter === 'all') return COMPANY_SUMMARY
    return COMPANY_SUMMARY.filter((c) => c.id === clientFilter)
  }, [clientFilter])

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

          {/* Expiring Plans Alert */}
          {EXPIRING_PLANS.length > 0 && (
            <div className="max-w-[1920px] mx-auto px-6 pb-10">
              <div className="border border-border">
                <div className="px-10 pt-10 pb-6 border-b border-border">
                  <Heading as="h2" size="heading-md">Planos próximos do vencimento</Heading>
                </div>
                <div className="p-6">
                  <Alert variant="warning">
                    <AlertTriangle size={16} />
                    <AlertBody>
                      <AlertDescription>
                        {EXPIRING_PLANS.length} empresa{EXPIRING_PLANS.length > 1 ? 's' : ''} com plano expirando nos próximos 30 dias.
                      </AlertDescription>
                    </AlertBody>
                  </Alert>
                  <Table className="mt-4">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Plano</TableHead>
                        <TableHead>Vencimento</TableHead>
                        <TableHead>Dias restantes</TableHead>
                        <TableHead className="text-right">Ação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {EXPIRING_PLANS.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell className="font-medium">{client.name}</TableCell>
                          <TableCell>{client.plan.name}</TableCell>
                          <TableCell className="font-mono text-sm">{client.plan.expiration}</TableCell>
                          <TableCell>
                            <Badge variant={client.plan.daysRemaining <= 10 ? 'destructive' : 'warning'}>
                              {client.plan.daysRemaining} dias
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Link
                              href={`${BASE}/admin/clients/${client.id}`}
                              className="text-sm text-planton-accent hover:underline"
                            >
                              Ver cliente
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}

          {/* Top Content */}
          <div className="max-w-[1920px] mx-auto px-6 pb-10">
            <div className="border border-border">
              <div className="px-10 pt-10 pb-6 border-b border-border">
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
              <div className="px-10 pt-10 pb-6 border-b border-border">
                <Heading as="h2" size="heading-md">Resumo por empresa</Heading>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead className="text-right">Usuários</TableHead>
                    <TableHead className="text-right">Horas</TableHead>
                    <TableHead className="text-right">Certificados</TableHead>
                    <TableHead className="text-right">Trilhas concluídas</TableHead>
                    <TableHead className="w-12" />
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
                        <TableCell><Skeleton className="h-4 w-4 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredSummary.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-planton-muted">
                        Nenhum dado disponível
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSummary.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell className="font-medium">{company.name}</TableCell>
                        <TableCell className="text-right font-mono text-sm">{company.users}</TableCell>
                        <TableCell className="text-right font-mono text-sm">{company.hours}h</TableCell>
                        <TableCell className="text-right font-mono text-sm">{company.certificates}</TableCell>
                        <TableCell className="text-right font-mono text-sm">{company.trailsCompleted}</TableCell>
                        <TableCell>
                          <Link href={`${BASE}/admin/clients/${company.id}`} className="text-planton-accent hover:text-planton-accent/80 transition-colors">
                            <ArrowRight size={16} />
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <AcademyFooter />
      </div>
    </>
  )
}
