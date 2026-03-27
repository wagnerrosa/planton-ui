'use client'

import { ComponentPage } from '@/components/ui/ComponentPage'
import { findComponent } from '@/lib/components-registry'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/shadcn/chart'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts'

const meta = findComponent('data-viz', 'chart')!

// ---------------------------------------------------------------------------
// Area chart data
// ---------------------------------------------------------------------------

const areaData = [
  { mes: 'Jan', usuarios: 28, horas: 72 },
  { mes: 'Fev', usuarios: 34, horas: 89 },
  { mes: 'Mar', usuarios: 41, horas: 105 },
  { mes: 'Abr', usuarios: 38, horas: 98 },
  { mes: 'Mai', usuarios: 52, horas: 134 },
  { mes: 'Jun', usuarios: 61, horas: 153 },
  { mes: 'Jul', usuarios: 48, horas: 121 },
  { mes: 'Ago', usuarios: 55, horas: 140 },
  { mes: 'Set', usuarios: 63, horas: 162 },
  { mes: 'Out', usuarios: 58, horas: 148 },
  { mes: 'Nov', usuarios: 71, horas: 179 },
  { mes: 'Dez', usuarios: 67, horas: 169 },
]

const areaConfig: ChartConfig = {
  usuarios: { label: 'Usuários ativos', color: 'var(--info)' },
  horas: { label: 'Horas assistidas', color: 'var(--planton-accent)' },
}

// ---------------------------------------------------------------------------
// Bar chart data
// ---------------------------------------------------------------------------

const barData = [
  { trilha: 'GHG Protocol', acessos: 142 },
  { trilha: 'ESG Fundamentos', acessos: 118 },
  { trilha: 'GRI 400', acessos: 97 },
  { trilha: 'Carbono no Solo', acessos: 83 },
  { trilha: 'ISO 14064', acessos: 74 },
]

const barConfig: ChartConfig = {
  acessos: { label: 'Acessos', color: 'var(--planton-accent)' },
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ChartPage() {
  return (
    <ComponentPage
      category="Data & Charts"
      name={meta.name}
      description={meta.description}
      filePath={meta.filePath}
    >
      {/* AreaChart */}
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">
          AreaChart — Engajamento mensal (dual métrica)
        </h2>
        <div className="border border-border p-6">
          <ChartContainer config={areaConfig} className="h-[280px] w-full">
            <AreaChart data={areaData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillUsuarios" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-usuarios)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-usuarios)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillHoras" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-horas)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-horas)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="mes"
                tick={{ fontSize: 11, fontFamily: 'var(--font-mono)', fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fontFamily: 'var(--font-mono)', fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent labelFormatter={(v) => String(v)} indicator="dot" />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                type="monotone"
                dataKey="usuarios"
                stroke="var(--color-usuarios)"
                strokeWidth={2}
                fill="url(#fillUsuarios)"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="horas"
                stroke="var(--color-horas)"
                strokeWidth={2}
                fill="url(#fillHoras)"
                dot={false}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </section>

      {/* BarChart */}
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">
          BarChart — Top trilhas por acessos
        </h2>
        <div className="border border-border p-6">
          <ChartContainer config={barConfig} className="h-[240px] w-full">
            <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 8, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fontFamily: 'var(--font-mono)', fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="trilha"
                width={120}
                tick={{ fontSize: 11, fontFamily: 'var(--font-mono)', fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
              <Bar dataKey="acessos" fill="var(--color-acessos)" radius={0} />
            </BarChart>
          </ChartContainer>
        </div>
      </section>

      {/* ChartConfig usage */}
      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">
          ChartConfig — Estrutura
        </h2>
        <div className="border border-border p-6 bg-card">
          <pre className="font-mono text-xs text-foreground/80 leading-relaxed overflow-auto">{`const chartConfig: ChartConfig = {
  usuarios: {
    label: 'Usuários ativos',
    color: 'var(--info)',          // CSS variable
  },
  horas: {
    label: 'Horas assistidas',
    color: 'var(--planton-accent)',
  },
}

// Usar no JSX:
<ChartContainer config={chartConfig} className="h-[280px] w-full">
  <AreaChart data={data}>
    ...
    <Tooltip content={<ChartTooltipContent config={chartConfig} />} />
    <Legend content={<ChartLegendContent config={chartConfig} />} />
  </AreaChart>
</ChartContainer>`}</pre>
        </div>
      </section>

      {/* ResponsiveContainer note */}
      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">
          Notas de uso
        </h2>
        <div className="border border-border p-6 flex flex-col gap-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">ChartContainer</strong> já inclui um <code className="font-mono text-xs bg-muted px-1">ResponsiveContainer</code>. Defina altura via <code className="font-mono text-xs bg-muted px-1">className=&quot;h-[Npx]&quot;</code> no container, não no componente Recharts diretamente.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Cores</strong> devem usar variáveis CSS do design system (<code className="font-mono text-xs bg-muted px-1">var(--planton-accent)</code>, <code className="font-mono text-xs bg-muted px-1">var(--info)</code>) — nunca valores hardcoded. Isso garante suporte automático ao dark mode.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Radius zero</strong>: barras e áreas seguem o padrão do design system — sem border-radius. Configure <code className="font-mono text-xs bg-muted px-1">radius={'{0}'}</code> em <code className="font-mono text-xs bg-muted px-1">Bar</code>.
          </p>
        </div>
      </section>
    </ComponentPage>
  )
}
