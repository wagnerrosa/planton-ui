'use client'

import '@glideapps/glide-data-grid/dist/index.css'
import { useCallback, useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import {
  DataEditor,
  GridCellKind,
  type GridColumn,
  type Item,
  type GridCell,
  type Theme,
} from '@glideapps/glide-data-grid'

type Row = {
  fonte: string
  categoria: string
  unidadeOp: string
  responsavel: string
  quantidade: string
  unidade: string
  periodo: string
  escopo: string
  fatorEmissao: string
  tco2e: string
  metodologia: string
  fonteDado: string
  status: string
  observacoes: string
}

const COLUMNS: GridColumn[] = [
  { title: 'Fonte de Emissão', id: 'fonte', width: 220 },
  { title: 'Categoria', id: 'categoria', width: 160 },
  { title: 'Unidade Operacional', id: 'unidadeOp', width: 180 },
  { title: 'Responsável', id: 'responsavel', width: 160 },
  { title: 'Quantidade', id: 'quantidade', width: 120 },
  { title: 'Unidade', id: 'unidade', width: 100 },
  { title: 'Período', id: 'periodo', width: 130 },
  { title: 'Escopo', id: 'escopo', width: 110 },
  { title: 'Fator Emissão', id: 'fatorEmissao', width: 140 },
  { title: 'tCO₂e', id: 'tco2e', width: 100 },
  { title: 'Metodologia', id: 'metodologia', width: 160 },
  { title: 'Fonte do Dado', id: 'fonteDado', width: 180 },
  { title: 'Status', id: 'status', width: 130 },
  { title: 'Observações', id: 'observacoes', width: 260 },
]

const DATA: Row[] = [
  { fonte: 'Frota de veículos leves', categoria: 'Combustão móvel', unidadeOp: 'Matriz - São Paulo', responsavel: 'Carlos Mendes', quantidade: '12.450', unidade: 'litros', periodo: 'Jan/2026', escopo: 'Escopo 1', fatorEmissao: '2,67 kg/L', tco2e: '33,2', metodologia: 'GHG Protocol', fonteDado: 'Notas fiscais Shell', status: 'Validado', observacoes: 'Diesel S10 - frota comercial' },
  { fonte: 'Energia elétrica', categoria: 'Energia adquirida', unidadeOp: 'Matriz - São Paulo', responsavel: 'Ana Paula Rocha', quantidade: '87.300', unidade: 'kWh', periodo: 'Jan/2026', escopo: 'Escopo 2', fatorEmissao: '0,0385 tCO₂/MWh', tco2e: '17,5', metodologia: 'SIN - ONS', fonteDado: 'Fatura Enel', status: 'Validado', observacoes: 'Fator médio do SIN' },
  { fonte: 'Viagens aéreas', categoria: 'Transporte funcionários', unidadeOp: 'Diretoria', responsavel: 'Roberta Lima', quantidade: '42', unidade: 'voos', periodo: 'Q1/2026', escopo: 'Escopo 3', fatorEmissao: '0,683 tCO₂/voo', tco2e: '28,7', metodologia: 'DEFRA 2025', fonteDado: 'Relatório TravelCo', status: 'Em revisão', observacoes: 'Voos médio curso - médio nacional' },
  { fonte: 'Gás natural (caldeira)', categoria: 'Combustão estacionária', unidadeOp: 'Fábrica - Campinas', responsavel: 'Felipe Ramos', quantidade: '1.200', unidade: 'm³', periodo: 'Jan/2026', escopo: 'Escopo 1', fatorEmissao: '2,0 kg/m³', tco2e: '2,4', metodologia: 'GHG Protocol', fonteDado: 'Comgás - leitura', status: 'Validado', observacoes: 'Caldeira de processo' },
  { fonte: 'Resíduos sólidos', categoria: 'Resíduos gerados', unidadeOp: 'Fábrica - Campinas', responsavel: 'Mariana Costa', quantidade: '8,5', unidade: 'ton', periodo: 'Jan/2026', escopo: 'Escopo 3', fatorEmissao: '0,467 tCO₂/ton', tco2e: '3,97', metodologia: 'IPCC 2019', fonteDado: 'Pesagem interna', status: 'Validado', observacoes: 'Aterro sanitário licenciado' },
  { fonte: 'Refrigerante R-410A', categoria: 'Emissões fugitivas', unidadeOp: 'Matriz - São Paulo', responsavel: 'João Pedro Alves', quantidade: '4,2', unidade: 'kg', periodo: '2025', escopo: 'Escopo 1', fatorEmissao: '2.088 tCO₂/kg', tco2e: '8,77', metodologia: 'IPCC AR5', fonteDado: 'Manutenção predial', status: 'Em revisão', observacoes: 'Recarga de chillers' },
  { fonte: 'Transporte de carga', categoria: 'Logística upstream', unidadeOp: 'CD - Guarulhos', responsavel: 'Patrícia Souza', quantidade: '145.800', unidade: 'km', periodo: 'Q1/2026', escopo: 'Escopo 3', fatorEmissao: '0,089 kg/km', tco2e: '12,98', metodologia: 'GHG Protocol', fonteDado: 'TMS interno', status: 'Validado', observacoes: 'Frota terceirizada - médio porte' },
  { fonte: 'Água consumida', categoria: 'Consumo de água', unidadeOp: 'Fábrica - Campinas', responsavel: 'Felipe Ramos', quantidade: '2.340', unidade: 'm³', periodo: 'Jan/2026', escopo: 'Escopo 3', fatorEmissao: '0,344 kg/m³', tco2e: '0,80', metodologia: 'SABESP', fonteDado: 'Hidrômetro', status: 'Validado', observacoes: 'Uso industrial + sanitário' },
  { fonte: 'Etanol - frota', categoria: 'Combustão móvel', unidadeOp: 'Matriz - São Paulo', responsavel: 'Carlos Mendes', quantidade: '5.620', unidade: 'litros', periodo: 'Jan/2026', escopo: 'Escopo 1', fatorEmissao: '1,52 kg/L', tco2e: '8,54', metodologia: 'GHG Protocol', fonteDado: 'Notas fiscais Ipiranga', status: 'Validado', observacoes: 'Etanol hidratado' },
  { fonte: 'Diesel - geradores', categoria: 'Combustão estacionária', unidadeOp: 'CD - Guarulhos', responsavel: 'Patrícia Souza', quantidade: '890', unidade: 'litros', periodo: 'Jan/2026', escopo: 'Escopo 1', fatorEmissao: '2,67 kg/L', tco2e: '2,37', metodologia: 'GHG Protocol', fonteDado: 'Controle interno', status: 'Pendente', observacoes: 'Backup energético' },
  { fonte: 'Bens adquiridos', categoria: 'Cadeia upstream', unidadeOp: 'Compras corporativas', responsavel: 'Lucas Ferreira', quantidade: '1,2M', unidade: 'BRL', periodo: 'Q1/2026', escopo: 'Escopo 3', fatorEmissao: '0,42 kg/BRL', tco2e: '504,00', metodologia: 'EEIO Brasil', fonteDado: 'ERP - Compras', status: 'Em revisão', observacoes: 'Análise input-output' },
  { fonte: 'Deslocamento funcionários', categoria: 'Commuting', unidadeOp: 'Matriz - São Paulo', responsavel: 'Ana Paula Rocha', quantidade: '120', unidade: 'colaboradores', periodo: '2025', escopo: 'Escopo 3', fatorEmissao: '1,8 tCO₂/pessoa', tco2e: '216,00', metodologia: 'GHG Protocol', fonteDado: 'Pesquisa interna 2025', status: 'Validado', observacoes: 'Casa-trabalho - média anual' },
  { fonte: 'GLP - cozinha', categoria: 'Combustão estacionária', unidadeOp: 'Matriz - São Paulo', responsavel: 'Ana Paula Rocha', quantidade: '340', unidade: 'kg', periodo: 'Jan/2026', escopo: 'Escopo 1', fatorEmissao: '3,0 kg/kg', tco2e: '1,02', metodologia: 'GHG Protocol', fonteDado: 'Fornecedor Ultragaz', status: 'Validado', observacoes: 'Refeitório corporativo' },
  { fonte: 'Papel e impressão', categoria: 'Bens consumíveis', unidadeOp: 'Administrativo', responsavel: 'Lucas Ferreira', quantidade: '1.250', unidade: 'kg', periodo: 'Q1/2026', escopo: 'Escopo 3', fatorEmissao: '1,29 kg/kg', tco2e: '1,61', metodologia: 'DEFRA 2025', fonteDado: 'Compras escritório', status: 'Validado', observacoes: 'Papel A4 não certificado' },
  { fonte: 'Servidores cloud', categoria: 'Cloud computing', unidadeOp: 'TI', responsavel: 'Diego Martins', quantidade: '48.200', unidade: 'kWh', periodo: 'Q1/2026', escopo: 'Escopo 3', fatorEmissao: '0,0385 tCO₂/MWh', tco2e: '1,86', metodologia: 'AWS Sustainability', fonteDado: 'AWS Customer Carbon', status: 'Validado', observacoes: 'Região sa-east-1' },
  { fonte: 'Hospedagem - eventos', categoria: 'Transporte funcionários', unidadeOp: 'Marketing', responsavel: 'Roberta Lima', quantidade: '85', unidade: 'diárias', periodo: 'Q1/2026', escopo: 'Escopo 3', fatorEmissao: '14,4 kg/diária', tco2e: '1,22', metodologia: 'DEFRA 2025', fonteDado: 'Booking corporativo', status: 'Em revisão', observacoes: 'Hotéis 4-5 estrelas' },
  { fonte: 'Veículos elétricos', categoria: 'Combustão móvel', unidadeOp: 'Matriz - São Paulo', responsavel: 'Carlos Mendes', quantidade: '8.400', unidade: 'kWh', periodo: 'Jan/2026', escopo: 'Escopo 2', fatorEmissao: '0,0385 tCO₂/MWh', tco2e: '0,32', metodologia: 'SIN - ONS', fonteDado: 'Carregadores internos', status: 'Validado', observacoes: 'Frota executiva BEV' },
  { fonte: 'Materiais de embalagem', categoria: 'Cadeia upstream', unidadeOp: 'Fábrica - Campinas', responsavel: 'Mariana Costa', quantidade: '3.200', unidade: 'kg', periodo: 'Jan/2026', escopo: 'Escopo 3', fatorEmissao: '2,1 kg/kg', tco2e: '6,72', metodologia: 'Ecoinvent 3.10', fonteDado: 'Recebimento fiscal', status: 'Pendente', observacoes: 'Plástico + papelão' },
  { fonte: 'Manutenção predial', categoria: 'Serviços terceirizados', unidadeOp: 'Facilities', responsavel: 'João Pedro Alves', quantidade: '180.000', unidade: 'BRL', periodo: 'Q1/2026', escopo: 'Escopo 3', fatorEmissao: '0,18 kg/BRL', tco2e: '32,40', metodologia: 'EEIO Brasil', fonteDado: 'ERP - Contratos', status: 'Em revisão', observacoes: 'Limpeza + jardinagem' },
  { fonte: 'Uso de produto vendido', categoria: 'Downstream', unidadeOp: 'Comercial', responsavel: 'Beatriz Andrade', quantidade: '12.500', unidade: 'unidades', periodo: 'Q1/2026', escopo: 'Escopo 3', fatorEmissao: '4,8 kg/un', tco2e: '60,00', metodologia: 'LCA interno', fonteDado: 'Vendas + uso médio', status: 'Em revisão', observacoes: 'Modelagem ciclo de vida' },
]

const LIGHT_THEME: Partial<Theme> = {
  accentColor: '#ADCF78',
  accentLight: 'rgba(173, 207, 120, 0.15)',
  textDark: '#0A2D30',
  textMedium: '#5b5b5b',
  textLight: '#8a8a8a',
  textBubble: '#0A2D30',
  textHeader: '#5b5b5b',
  textHeaderSelected: '#0A2D30',
  bgCell: '#ffffff',
  bgCellMedium: '#f7f7f7',
  bgHeader: '#fafafa',
  bgHeaderHasFocus: '#f0f0f0',
  bgHeaderHovered: '#f4f4f4',
  bgBubble: '#f0f0f0',
  bgBubbleSelected: '#e6e6e6',
  borderColor: 'rgba(0, 0, 0, 0.08)',
  drilldownBorder: 'rgba(0, 0, 0, 0.1)',
  linkColor: '#ADCF78',
  cellHorizontalPadding: 12,
  cellVerticalPadding: 10,
  headerFontStyle: '600 12px',
  baseFontStyle: '13px',
  fontFamily: 'var(--font-sans), system-ui, sans-serif',
}

const DARK_THEME: Partial<Theme> = {
  accentColor: '#ADCF78',
  accentLight: 'rgba(173, 207, 120, 0.2)',
  textDark: '#fafafa',
  textMedium: '#b4b4b4',
  textLight: '#8a8a8a',
  textBubble: '#fafafa',
  textHeader: '#b4b4b4',
  textHeaderSelected: '#fafafa',
  bgCell: '#0a0a0a',
  bgCellMedium: '#161616',
  bgHeader: '#121212',
  bgHeaderHasFocus: '#1c1c1c',
  bgHeaderHovered: '#181818',
  bgBubble: '#222222',
  bgBubbleSelected: '#2a2a2a',
  borderColor: 'rgba(255, 255, 255, 0.08)',
  drilldownBorder: 'rgba(255, 255, 255, 0.12)',
  linkColor: '#ADCF78',
  cellHorizontalPadding: 12,
  cellVerticalPadding: 10,
  headerFontStyle: '600 12px',
  baseFontStyle: '13px',
  fontFamily: 'var(--font-sans), system-ui, sans-serif',
}

export function InventoryDataGridImpl() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const getCellContent = useCallback(([col, row]: Item): GridCell => {
    const r = DATA[row]
    const colId = COLUMNS[col].id as keyof Row
    const val = r[colId]

    if (colId === 'escopo') {
      return {
        kind: GridCellKind.Bubble,
        data: [val],
        allowOverlay: false,
      }
    }

    return {
      kind: GridCellKind.Text,
      data: val,
      displayData: val,
      allowOverlay: true,
      readonly: false,
    }
  }, [])

  if (!mounted) return null

  const theme = resolvedTheme === 'dark' ? DARK_THEME : LIGHT_THEME

  return (
    <div className="h-full w-full">
      <DataEditor
        columns={COLUMNS}
        rows={DATA.length}
        getCellContent={getCellContent}
        width="100%"
        height="100%"
        theme={theme}
        smoothScrollX
        smoothScrollY
        rowHeight={40}
        headerHeight={36}
        getCellsForSelection
      />
    </div>
  )
}
