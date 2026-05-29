'use client'

import { useMemo, useState } from 'react'
import { Send, Plus, X } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/shadcn/tabs'
import { Input } from '@/components/shadcn/input'
import { Body } from '@/components/primitives/Body'
import { Button } from '@/components/primitives/Button'
import { ClientCombobox } from './components/ClientCombobox'
import { ExistingClientSummary } from './components/ExistingClientSummary'
import { NewClientForm, type NewClientData } from './components/NewClientForm'
import { RecyclingDataEditor } from './components/RecyclingDataEditor'
import type { RecyclingRowData } from './components/RecyclingRow'
import { ConfirmationView } from './components/ConfirmationView'
import { LPHistoryTab } from './components/LPHistoryTab'
import { MOCK_CLIENTS, MOCK_LP_HISTORY, buildLpUrl, type LPRecord } from './mock-data'

type Mode = 'existing' | 'new' | 'history'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CNPJ_DIGITS_RE = /^\d{14}$/

function emptyRow(): RecyclingRowData {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    year: null,
    material: null,
    tons: '',
  }
}


export function EurecicloLPScreen() {
  const [mode, setMode] = useState<Mode>('existing')
  const [selectedCnpj, setSelectedCnpj] = useState<string | null>(null)
  const [emails, setEmails] = useState<string[]>([''])
  const [emailErrors, setEmailErrors] = useState<(string | null)[]>([null])

  const [newClient, setNewClient] = useState<NewClientData>({ cnpj: '', name: '', sector: '' })
  const [newClientErrors, setNewClientErrors] = useState<Partial<Record<keyof NewClientData, string>>>({})
  const [rows, setRows] = useState<RecyclingRowData[]>([emptyRow()])
  const [rowsError, setRowsError] = useState<string | null>(null)

  const [submitted, setSubmitted] = useState<{ emails: string[]; clientName: string; lpUrl: string } | null>(null)
  const [history, setHistory] = useState<LPRecord[]>(() => [...MOCK_LP_HISTORY])

  const selectedClient = useMemo(
    () => MOCK_CLIENTS.find((c) => c.cnpj === selectedCnpj) ?? null,
    [selectedCnpj],
  )

  const duplicateIds = useMemo(() => {
    const seen = new Map<string, string>()
    const dups = new Set<string>()
    for (const r of rows) {
      if (!r.year || !r.material) continue
      const key = `${r.year}-${r.material}`
      const prev = seen.get(key)
      if (prev) {
        dups.add(prev)
        dups.add(r.id)
      } else {
        seen.set(key, r.id)
      }
    }
    return dups
  }, [rows])

  function reset() {
    setMode('existing')
    setSelectedCnpj(null)
    setEmails([''])
    setEmailErrors([null])
    setNewClient({ cnpj: '', name: '', sector: '' })
    setNewClientErrors({})
    setRows([emptyRow()])
    setRowsError(null)
    setSubmitted(null)
  }

  function validateEmails(): boolean {
    const errs = emails.map((e) => {
      if (!e.trim()) return 'Informe o email.'
      if (!EMAIL_RE.test(e.trim())) return 'Email inválido.'
      return null
    })
    setEmailErrors(errs)
    return errs.every((e) => e === null)
  }

  function pushToHistory(clientName: string, cnpj: string, trimmedEmails: string[], lpUrl: string) {
    const record: LPRecord = {
      id: `session-${Date.now()}`,
      clientName,
      cnpj,
      emails: trimmedEmails,
      lpUrl,
      sentAt: new Date(),
      accessCount: 0,
    }
    setHistory((prev) => [record, ...prev])
  }

  function handleSubmitExisting() {
    const okEmails = validateEmails()
    if (!selectedClient || !okEmails) return
    const lpUrl = buildLpUrl(selectedClient.name, selectedClient.cnpj)
    const trimmedEmails = emails.map((e) => e.trim())
    pushToHistory(selectedClient.name, selectedClient.cnpj, trimmedEmails, lpUrl)
    setSubmitted({ emails: trimmedEmails, clientName: selectedClient.name, lpUrl })
  }

  function handleSubmitNew() {
    const errs: Partial<Record<keyof NewClientData, string>> = {}
    const digits = newClient.cnpj.replace(/\D/g, '')
    if (!CNPJ_DIGITS_RE.test(digits)) errs.cnpj = 'CNPJ deve ter 14 dígitos.'
    if (!newClient.name.trim()) errs.name = 'Informe o nome.'
    if (!newClient.sector) errs.sector = 'Selecione o setor.'
    setNewClientErrors(errs)

    let rowsOk = true
    if (rows.length === 0) {
      setRowsError('Adicione ao menos um registro de reciclagem.')
      rowsOk = false
    } else if (rows.some((r) => !r.year || !r.material || !r.tons || Number(r.tons) <= 0)) {
      setRowsError('Preencha ano, material e toneladas em todos os registros.')
      rowsOk = false
    } else if (duplicateIds.size > 0) {
      setRowsError('Resolva os registros duplicados antes de enviar.')
      rowsOk = false
    } else {
      setRowsError(null)
    }

    const okEmails = validateEmails()

    if (Object.keys(errs).length > 0 || !rowsOk || !okEmails) return

    const clientName = newClient.name.trim()
    const lpUrl = buildLpUrl(clientName, newClient.cnpj)
    const trimmedEmails = emails.map((e) => e.trim())
    pushToHistory(clientName, newClient.cnpj, trimmedEmails, lpUrl)
    setSubmitted({ emails: trimmedEmails, clientName, lpUrl })
  }

  if (submitted) {
    return (
      <main className="min-h-screen w-full bg-background">
        <div className="max-w-2xl mx-auto px-4 py-6 md:py-10">
          <ConfirmationView
            emails={submitted.emails}
            clientName={submitted.clientName}
            lpUrl={submitted.lpUrl}
            onReset={reset}
          />
        </div>
      </main>
    )
  }

  const canSubmitExisting = !!selectedClient

  return (
    <main className="min-h-screen w-full bg-background">
      <div className="max-w-2xl mx-auto px-4 py-6 md:py-10 flex flex-col gap-6">
        <header className="flex flex-col items-start gap-10">
          <div className="flex items-center gap-4">
            <img src="/eureciclo.svg" alt="eureciclo" className="h-10 w-auto" />
            <div className="h-8 w-px bg-border" />
            <img src="/Logo_Planton_01.svg" alt="Planton" className="h-[26px] w-auto" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-lg font-semibold tracking-tight text-foreground font-sans">
              Jornada de Descarbonização
            </p>
            <Body size="sm" muted>
              Selecione um cliente existente do banco ou cadastre um novo para gerar uma plataforma de dados personalizada.
            </Body>
          </div>
        </header>

        <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)} className="flex flex-col gap-5">
          <TabsList className="w-full grid grid-cols-3 h-12 p-1">
            <TabsTrigger value="existing" className="h-10 text-sm">Existente</TabsTrigger>
            <TabsTrigger value="new" className="h-10 text-sm">Novo</TabsTrigger>
            <TabsTrigger value="history" className="h-10 text-sm">
              Links enviados
              {history.length > 0 && (
                <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-planton-accent/20 px-1 text-[10px] font-medium text-planton-accent">
                  {history.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="existing" className="mt-0 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground font-sans">Cliente</label>
              <ClientCombobox
                clients={MOCK_CLIENTS}
                selectedCnpj={selectedCnpj}
                onSelect={setSelectedCnpj}
              />
            </div>

            {selectedClient && <ExistingClientSummary client={selectedClient} />}

            <EmailsField
              emails={emails}
              errors={emailErrors}
              onChange={(next, errs) => { setEmails(next); setEmailErrors(errs) }}
            />

            <Button
              variant="secondary"
              onClick={handleSubmitExisting}
              disabled={!canSubmitExisting}
              className="w-full justify-center"
            >
              <Send size={14} />
              Gerar e enviar LP
            </Button>
          </TabsContent>

          <TabsContent value="new" className="mt-0 flex flex-col gap-6">
            <NewClientForm data={newClient} errors={newClientErrors} onChange={setNewClient} />

            <RecyclingDataEditor
              rows={rows}
              duplicateIds={duplicateIds}
              error={rowsError ?? undefined}
              onChange={(next) => {
                setRows(next)
                if (rowsError) setRowsError(null)
              }}
            />

            <EmailsField
              emails={emails}
              errors={emailErrors}
              onChange={(next, errs) => { setEmails(next); setEmailErrors(errs) }}
            />

            <Button
              variant="secondary"
              onClick={handleSubmitNew}
              className="w-full justify-center"
            >
              <Send size={14} />
              Gerar e enviar LP
            </Button>
          </TabsContent>
          <TabsContent value="history" className="mt-0">
            <LPHistoryTab records={history} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

function EmailsField({
  emails,
  errors,
  onChange,
}: {
  emails: string[]
  errors: (string | null)[]
  onChange: (emails: string[], errors: (string | null)[]) => void
}) {
  function update(idx: number, value: string) {
    const next = emails.map((e, i) => (i === idx ? value : e))
    const nextErrs = errors.map((e, i) => (i === idx ? null : e))
    onChange(next, nextErrs)
  }

  function add() {
    onChange([...emails, ''], [...errors, null])
  }

  function remove(idx: number) {
    onChange(emails.filter((_, i) => i !== idx), errors.filter((_, i) => i !== idx))
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <label className="text-xs font-medium text-foreground font-sans">
          Email{emails.length > 1 ? 's' : ''} destino
        </label>
        <span className="text-[11px] text-muted-foreground">
          {emails.length} {emails.length === 1 ? 'destinatário' : 'destinatários'}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {emails.map((email, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Input
                type="email"
                inputMode="email"
                autoComplete={idx === 0 ? 'email' : 'off'}
                value={email}
                onChange={(e) => update(idx, e.target.value)}
                placeholder="contato@cliente.com.br"
                className="h-12 text-base flex-1"
              />
              {emails.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  aria-label="Remover email"
                  className="flex items-center justify-center h-12 w-12 shrink-0 rounded-md border border-border text-muted-foreground hover:text-destructive hover:border-destructive transition-colors"
                >
                  <X size={15} />
                </button>
              )}
            </div>
            {errors[idx] && (
              <span className="text-xs text-destructive">{errors[idx]}</span>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="flex items-center justify-center gap-2 h-11 rounded-md border border-dashed border-border text-sm text-muted-foreground hover:border-planton-accent hover:text-planton-accent transition-colors"
      >
        <Plus size={14} />
        Adicionar outro email
      </button>

      <span className="text-[11px] text-muted-foreground">
        O link da LP será enviado para todos os destinatários.
      </span>
    </div>
  )
}
