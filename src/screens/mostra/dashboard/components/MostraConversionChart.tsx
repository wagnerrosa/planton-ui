'use client'

import { Pie, PieChart, Cell } from 'recharts'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/shadcn/chart'
import { Heading } from '@/components/primitives/Heading'
import { MOTIVOS_RECUSA } from '../../mock-data'

const chartConfig = {
  'Não Compatível': { label: 'Não Compatível', color: 'var(--planton-forest)' },
  'Não Adequado': { label: 'Não Adequado', color: 'var(--planton-accent)' },
  'Sem Adequação': { label: 'Sem Adequação', color: 'var(--planton-cream)' },
  'Outros': { label: 'Outros', color: 'var(--info)' },
} satisfies ChartConfig

export function MostraConversionChart() {
  return (
    <div className="border border-border h-full">
      <div className="px-6 pt-6 pb-4 border-b border-border">
        <Heading as="h2" size="heading-md">Motivos de recusa</Heading>
      </div>
      <div className="px-2 py-6 sm:px-6 flex justify-center">
        <ChartContainer config={chartConfig} className="h-[260px] w-full max-w-[320px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="motivo" />} />
            <Pie
              data={MOTIVOS_RECUSA}
              dataKey="quantidade"
              nameKey="motivo"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
            >
              {MOTIVOS_RECUSA.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="motivo" />}
              verticalAlign="bottom"
            />
          </PieChart>
        </ChartContainer>
      </div>
    </div>
  )
}
