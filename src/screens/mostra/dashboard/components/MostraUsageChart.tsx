'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/shadcn/chart'
import { Heading } from '@/components/primitives/Heading'
import { SOLICITANTES_POR_MES } from '../../mock-data'

const chartConfig = {
  empresas: {
    label: 'Empresas',
    color: 'var(--planton-accent)',
  },
  fornecedores: {
    label: 'Fornecedores',
    color: 'var(--info)',
  },
} satisfies ChartConfig

export function MostraUsageChart() {
  return (
    <div className="border border-border">
      <div className="px-6 pt-6 pb-4 border-b border-border">
        <Heading as="h2" size="heading-md">Solicitantes por mês</Heading>
      </div>
      <div className="px-2 py-6 sm:px-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[260px] w-full">
          <BarChart data={SOLICITANTES_POR_MES} barGap={4}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="mes" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={32} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Bar dataKey="empresas" fill="var(--color-empresas)" radius={[2, 2, 0, 0]} />
            <Bar dataKey="fornecedores" fill="var(--color-fornecedores)" radius={[2, 2, 0, 0]} />
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  )
}
