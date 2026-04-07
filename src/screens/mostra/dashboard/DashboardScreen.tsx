'use client'

import { useEffect, useState } from 'react'
import { Users, Building2, Truck, AlertCircle } from 'lucide-react'
import { MostraNavbarSync } from '@/components/navigation/MostraNavbarSync'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { Skeleton } from '@/components/shadcn/skeleton'
import { MostraStatsCard } from '../components/MostraStatsCard'
import { MostraUsageChart } from './components/MostraUsageChart'
import { MostraConversionChart } from './components/MostraConversionChart'
import { PendingTable } from './components/PendingTable'
import { MOSTRA_KPIS } from '../mock-data'

const KPI_ICONS = [
  <Users key="u" size={16} />,
  <Building2 key="b" size={16} />,
  <Truck key="t" size={16} />,
  <AlertCircle key="a" size={16} />,
]

export function DashboardScreen() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <MostraNavbarSync breadcrumbs={[{ label: 'Dashboard' }]} />

      <div className="px-6 pb-6 pt-10 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <Heading as="h1" size="heading-lg">Dashboard</Heading>
          <Body muted>Visão geral do programa Mostra Sua Pegada</Body>
        </div>

        {/* KPI Cards */}
        <div className="overflow-hidden border-t border-l border-border">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="border-r border-b border-border p-6 flex flex-col gap-3">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4">
              {MOSTRA_KPIS.map((kpi, i) => (
                <MostraStatsCard
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

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MostraUsageChart />
          </div>
          <div className="lg:col-span-1">
            <MostraConversionChart />
          </div>
        </div>

        {/* Pending Table */}
        <PendingTable loading={loading} />
      </div>
    </>
  )
}
