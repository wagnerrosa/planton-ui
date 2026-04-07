"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/shadcn/chart"
import { Heading } from "@/components/primitives/Heading"
import { SOLICITANTES_POR_MES } from "../../mock-data"

const chartConfig = {
  empresas: {
    label: "Empresas",
    color: "var(--planton-accent)",
  },
  fornecedores: {
    label: "Fornecedores",
    color: "var(--info)",
  },
} satisfies ChartConfig

export function MostraUsageChart() {
  return (
    <div className="border border-border">
      <div className="px-6 pt-6 pb-4 border-b border-border">
        <Heading as="h2" size="heading-md">Solicitantes por mês</Heading>
      </div>
      <div className="px-2 py-6 sm:px-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
          <AreaChart data={SOLICITANTES_POR_MES}>
            <defs>
              <linearGradient id="mostraFillEmpresas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-empresas)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-empresas)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="mostraFillFornecedores" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-fornecedores)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-fornecedores)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="mes" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={32} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent labelFormatter={(value) => value as string} indicator="dot" />
              }
            />
            <Area
              dataKey="fornecedores"
              type="natural"
              fill="url(#mostraFillFornecedores)"
              stroke="var(--color-fornecedores)"
            />
            <Area
              dataKey="empresas"
              type="natural"
              fill="url(#mostraFillEmpresas)"
              stroke="var(--color-empresas)"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  )
}
