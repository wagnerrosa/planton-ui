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

const chartData = [
  { month: "Jan", usuarios: 18, horas: 42 },
  { month: "Fev", usuarios: 24, horas: 58 },
  { month: "Mar", usuarios: 31, horas: 74 },
  { month: "Abr", usuarios: 28, horas: 66 },
  { month: "Mai", usuarios: 37, horas: 91 },
  { month: "Jun", usuarios: 43, horas: 108 },
  { month: "Jul", usuarios: 39, horas: 97 },
  { month: "Ago", usuarios: 52, horas: 130 },
  { month: "Set", usuarios: 47, horas: 118 },
  { month: "Out", usuarios: 61, horas: 153 },
  { month: "Nov", usuarios: 55, horas: 138 },
  { month: "Dez", usuarios: 48, horas: 121 },
]

const SEMESTER_RANGES: Record<string, number[]> = {
  anual: [0, 11],
  s1: [0, 5],
  s2: [6, 11],
}

const chartConfig = {
  usuarios: {
    label: "Usuários ativos",
    color: "var(--info)",
  },
  horas: {
    label: "Horas assistidas",
    color: "var(--planton-accent)",
  },
} satisfies ChartConfig

export function GMUsageChart() {
  const [period, setPeriod] = React.useState("anual")

  const filteredData = chartData.slice(
    SEMESTER_RANGES[period][0],
    SEMESTER_RANGES[period][1] + 1
  )

  return (
    <div className="border-r border-b border-border flex flex-col">
      {/* Header — segue o mesmo padrão eyebrow das outras seções */}
      <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-border">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-planton-muted">
            Engajamento anual
          </span>
          <span className="text-sm text-muted-foreground">
            Usuários ativos e horas de visualização por mês
          </span>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="hidden w-[160px] sm:ml-auto sm:flex" aria-label="Selecionar período">
            <SelectValue placeholder="Ano completo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="anual">Ano completo</SelectItem>
            <SelectItem value="s1">1º semestre</SelectItem>
            <SelectItem value="s2">2º semestre</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Chart */}
      <div className="px-2 py-6 sm:px-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillUsuarios" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-usuarios)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-usuarios)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillHoras" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-horas)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-horas)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={36} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent labelFormatter={(value) => value} indicator="dot" />
              }
            />
            <Area
              dataKey="horas"
              type="natural"
              fill="url(#fillHoras)"
              stroke="var(--color-horas)"
            />
            <Area
              dataKey="usuarios"
              type="natural"
              fill="url(#fillUsuarios)"
              stroke="var(--color-usuarios)"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  )
}
