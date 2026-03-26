"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/shadcn/chart"
import { Heading } from "@/components/primitives/Heading"

const chartData = [
  { month: "Jan", usuarios: 312, horas: 780 },
  { month: "Fev", usuarios: 398, horas: 943 },
  { month: "Mar", usuarios: 521, horas: 1204 },
  { month: "Abr", usuarios: 487, horas: 1087 },
  { month: "Mai", usuarios: 634, horas: 1521 },
  { month: "Jun", usuarios: 712, horas: 1840 },
  { month: "Jul", usuarios: 668, horas: 1632 },
  { month: "Ago", usuarios: 891, horas: 2103 },
  { month: "Set", usuarios: 823, horas: 1978 },
  { month: "Out", usuarios: 1047, horas: 2521 },
  { month: "Nov", usuarios: 934, horas: 2287 },
  { month: "Dez", usuarios: 847, horas: 2041 },
]

const SEMESTER_RANGES: Record<string, number[]> = {
  anual: [0, 11],
  s1: [0, 5],
  s2: [6, 11],
}

const chartConfig = {
  usuarios: {
    label: "Usuários ativos",
    color: "var(--chart-1)",
  },
  horas: {
    label: "Horas assistidas",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function AdminUsageChart() {
  const [period, setPeriod] = React.useState("anual")

  const filteredData = chartData.slice(
    SEMESTER_RANGES[period][0],
    SEMESTER_RANGES[period][1] + 1
  )

  return (
    <div className="border border-border">
      <div className="px-6 pt-6 pb-4 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Heading as="h2" size="heading-md">Engajamento da plataforma</Heading>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[160px]" aria-label="Selecionar período">
            <SelectValue placeholder="Ano completo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="anual">Ano completo</SelectItem>
            <SelectItem value="s1">1º semestre</SelectItem>
            <SelectItem value="s2">2º semestre</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="px-2 py-6 sm:px-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="adminFillUsuarios" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-usuarios)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-usuarios)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="adminFillHoras" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-horas)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-horas)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={44} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent labelFormatter={(value) => value} indicator="dot" />
              }
            />
            <Area
              dataKey="horas"
              type="natural"
              fill="url(#adminFillHoras)"
              stroke="var(--color-horas)"
              stackId="a"
            />
            <Area
              dataKey="usuarios"
              type="natural"
              fill="url(#adminFillUsuarios)"
              stroke="var(--color-usuarios)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  )
}
