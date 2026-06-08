'use client'

import { useMemo, useState } from 'react'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { GeniusNavbarSync } from '@/components/navigation/GeniusNavbarSync'
import { EMPRESA, ANO_BASE, FILIAIS, getPeriodos, buildMockImport, getPreenchStatus } from './ghg-form-data'
import { FilialSidebar } from './FilialSidebar'
import { GhgFormToolbar } from './GhgFormToolbar'
import { GhgForm } from './GhgForm'

export function CadastroEmissoesScreen() {
  const periodos = useMemo(() => getPeriodos(), [])

  const [filialId, setFilialId] = useState(FILIAIS[0].id)
  const [periodoId, setPeriodoId] = useState(periodos[0].id)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Usuário logado (mock) — autoria do auto-save.
  const USUARIO = 'Sarah Link'

  // Valores do formulário, escopados por filial+período: outer key = `${filial}|${periodo}`.
  const [valuesByScope, setValuesByScope] = useState<Record<string, Record<string, string>>>({})
  // Carimbo do último auto-save por escopo (texto já formatado).
  const [savedByScope, setSavedByScope] = useState<Record<string, string>>({})

  const scopeKey = `${filialId}|${periodoId}`
  const values = valuesByScope[scopeKey] ?? {}

  // Auto-save: toda mudança carimba data/hora + autor no escopo ativo.
  function stampSave(key: string) {
    const now = new Date()
    const data = now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    const hora = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    setSavedByScope((prev) => ({ ...prev, [key]: `${data} ${hora} · por ${USUARIO}` }))
  }

  function setValue(fieldId: string, value: string) {
    setValuesByScope((prev) => ({
      ...prev,
      [scopeKey]: { ...(prev[scopeKey] ?? {}), [fieldId]: value },
    }))
    stampSave(scopeKey)
  }

  // Mock de importação: a planilha enviada "preenche" o formulário da combinação
  // ativa (filial + mês). Substitui o que já havia no escopo.
  function handleUpload(_file: File) {
    void _file
    setValuesByScope((prev) => ({ ...prev, [scopeKey]: buildMockImport() }))
    stampSave(scopeKey)
  }

  return (
    <div className="flex flex-col h-full">
      <GeniusNavbarSync
        breadcrumbs={[
          { label: EMPRESA },
          { label: `Inventário GEE ${ANO_BASE}`, variant: 'pill', dot: true },
          { label: 'Cadastro de Emissões' },
        ]}
      />

      <div className="flex flex-col flex-1 overflow-hidden bg-background">
        {/* Canvas — toolbar + sidebar + formulário numa moldura (border + shadow) */}
        <div className="flex-1 min-h-0 flex px-6 py-4 bg-muted">
          <div className="flex flex-col flex-1 min-h-0 min-w-0 border border-border bg-background shadow-[4px_4px_0px_0px_hsl(var(--foreground))] overflow-hidden">
            <div className="flex items-stretch shrink-0">
              {/* Toggle da sidebar — alinhado à barra de período */}
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                className="flex items-center justify-center w-12 border-b border-r border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0"
                aria-label={sidebarOpen ? 'Recolher filiais' : 'Expandir filiais'}
                title={sidebarOpen ? 'Recolher filiais' : 'Expandir filiais'}
              >
                {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
              </button>
              <div className="flex-1 min-w-0">
                <GhgFormToolbar
                  filialId={filialId}
                  periodos={periodos}
                  periodoId={periodoId}
                  onPeriodo={setPeriodoId}
                  onUpload={handleUpload}
                  lastSaved={savedByScope[scopeKey] ?? null}
                />
              </div>
            </div>

            <div className="flex flex-1 min-h-0 min-w-0 overflow-hidden">
              <FilialSidebar
                filialId={filialId}
                onFilial={setFilialId}
                open={sidebarOpen}
                statusOf={(id) => getPreenchStatus(valuesByScope[`${id}|${periodoId}`])}
              />

              {/* Corpo: formulário com scroll vertical */}
              <div className="flex-1 min-h-0 min-w-0 overflow-y-auto">
                <GhgForm scopeId={scopeKey} values={values} onChange={setValue} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
