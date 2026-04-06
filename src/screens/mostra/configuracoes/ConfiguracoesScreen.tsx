'use client'

import { useState } from 'react'
import { Plus, Trash2, Pencil, Check, X, Info } from 'lucide-react'
import { MostraNavbarSync } from '@/components/navigation/MostraNavbarSync'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { Button } from '@/components/primitives/Button'
import { Input } from '@/components/shadcn/input'
import { Alert, AlertDescription } from '@/components/shadcn/alert'
import { Separator } from '@/components/shadcn/separator'
import {
  SETORES_CONTROVERSOS,
  EMPRESAS_CLIENTES,
  CONSULTORIAS_PARCEIRAS,
} from '../mock-data'

// ─── Inline CRUD List ───────────────────────────────────────────────────────

type InlineListProps = {
  items: string[]
  onAdd: (value: string) => void
  onEdit: (index: number, value: string) => void
  onRemove: (index: number) => void
  addPlaceholder?: string
  renderItem?: (item: string) => React.ReactNode
}

function InlineList({
  items,
  onAdd,
  onEdit,
  onRemove,
  addPlaceholder = 'Adicionar...',
  renderItem,
}: InlineListProps) {
  const [adding, setAdding] = useState(false)
  const [addValue, setAddValue] = useState('')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')

  function commitAdd() {
    const trimmed = addValue.trim()
    if (trimmed) onAdd(trimmed)
    setAddValue('')
    setAdding(false)
  }

  function startEdit(index: number) {
    setEditingIndex(index)
    setEditValue(items[index])
  }

  function commitEdit() {
    if (editingIndex !== null) {
      const trimmed = editValue.trim()
      if (trimmed) onEdit(editingIndex, trimmed)
    }
    setEditingIndex(null)
    setEditValue('')
  }

  function cancelEdit() {
    setEditingIndex(null)
    setEditValue('')
  }

  return (
    <div className="space-y-2">
      {/* Items list */}
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 group">
          {editingIndex === i ? (
            <>
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitEdit()
                  if (e.key === 'Escape') cancelEdit()
                }}
                className="h-8 text-sm flex-1"
                autoFocus
              />
              <button onClick={commitEdit} className="p-1 text-emerald-600 hover:text-emerald-700">
                <Check size={14} />
              </button>
              <button onClick={cancelEdit} className="p-1 text-muted-foreground hover:text-foreground">
                <X size={14} />
              </button>
            </>
          ) : (
            <>
              <div className="flex-1 text-sm py-1">
                {renderItem ? renderItem(item) : item}
              </div>
              <button
                onClick={() => startEdit(i)}
                className="p-1 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Pencil size={13} />
              </button>
              <button
                onClick={() => onRemove(i)}
                className="p-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={13} />
              </button>
            </>
          )}
        </div>
      ))}

      {/* Add row */}
      {adding ? (
        <div className="flex items-center gap-2">
          <Input
            value={addValue}
            onChange={(e) => setAddValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitAdd()
              if (e.key === 'Escape') { setAdding(false); setAddValue('') }
            }}
            placeholder={addPlaceholder}
            className="h-8 text-sm flex-1"
            autoFocus
          />
          <button onClick={commitAdd} className="p-1 text-emerald-600 hover:text-emerald-700">
            <Check size={14} />
          </button>
          <button
            onClick={() => { setAdding(false); setAddValue('') }}
            className="p-1 text-muted-foreground hover:text-foreground"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
        >
          <Plus size={13} />
          Adicionar
        </button>
      )}
    </div>
  )
}

// ─── Section ─────────────────────────────────────────────────────────────────

function Section({
  title,
  description,
  alert,
  children,
}: {
  title: string
  description?: string
  alert?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <Heading as="h2" size="heading-md">{title}</Heading>
          {description && (
            <Body size="sm" className="text-muted-foreground">{description}</Body>
          )}
        </div>
      </div>
      {alert && (
        <Alert variant="warning">
          <Info size={14} />
          <AlertDescription>{alert}</AlertDescription>
        </Alert>
      )}
      {children}
    </div>
  )
}

// ─── Email Notification Section ──────────────────────────────────────────────

function EmailNotificacaoSection() {
  const [email, setEmail] = useState('mail@empresa-planton.com.br')
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(email)

  function save() {
    setEmail(value)
    setEditing(false)
  }

  return (
    <div className="space-y-4">
      <div>
        <Heading as="h2" size="heading-md">E-mail de Notificação</Heading>
        <Body size="sm" className="text-muted-foreground mt-1">
          Endereço que recebe os e-mails automáticos do programa Mostra Sua Pegada Planton.
        </Body>
      </div>
      <div className="space-y-1.5 max-w-sm">
        <Body size="sm" className="text-muted-foreground uppercase tracking-wider text-xs">
          E-mail de notificação
        </Body>
        {editing ? (
          <div className="flex items-center gap-2">
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false) }}
              className="h-8 text-sm"
              autoFocus
            />
            <Button size="sm" variant="primary" onClick={save}>Salvar</Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Body size="sm">{email}</Body>
            <button
              onClick={() => { setEditing(true); setValue(email) }}
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
            >
              Editar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Screen ─────────────────────────────────────────────────────────────────

export function ConfiguracoesScreen() {
  const [setores, setSetores] = useState<string[]>(SETORES_CONTROVERSOS)
  const [clientes, setClientes] = useState<string[]>(EMPRESAS_CLIENTES)
  const [consultorias, setConsultorias] = useState<string[]>(CONSULTORIAS_PARCEIRAS)

  function listHandlers(setter: React.Dispatch<React.SetStateAction<string[]>>) {
    return {
      onAdd: (val: string) => setter((prev) => [...prev, val]),
      onEdit: (i: number, val: string) =>
        setter((prev) => prev.map((item, idx) => (idx === i ? val : item))),
      onRemove: (i: number) => setter((prev) => prev.filter((_, idx) => idx !== i)),
    }
  }

  return (
    <>
      <MostraNavbarSync breadcrumbs={[{ label: 'Configurações do Programa' }]} />

      <div className="p-6 space-y-10 max-w-2xl">
        <Heading as="h1" size="heading-lg">Configurações do Programa</Heading>

        {/* Setores Controversos */}
        <Section
          title="Setores Controversos"
          description="Empresas nestes setores são automaticamente marcadas como &quot;Aguardando Revisão Manual&quot;. Alterações válidas para o próximo cadastro."
          alert="Alterações serão aplicadas no próximo cadastro. Registros existentes não são afetados retroativamente."
        >
          <InlineList
            items={setores}
            {...listHandlers(setSetores)}
            addPlaceholder="Nome do setor"
          />
        </Section>

        <Separator />

        {/* Empresas Clientes */}
        <Section
          title="Lista de Empresas Clientes"
          description="Fornecedoras que já são clientes da Planton. Esta informação aparece no cadastro dos fornecedores. Alterações aplicadas imediatamente nos novos cadastros."
        >
          <InlineList
            items={clientes}
            {...listHandlers(setClientes)}
            addPlaceholder="Nome da empresa cliente"
            renderItem={(item) => (
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{item}</span>
              </div>
            )}
          />
        </Section>

        <Separator />

        {/* Consultorias Parceiras */}
        <Section
          title="Lista de Consultorias Parceiras"
          description="Empresas parceiras que podem participar do programa. Esta informação é exibida para os fornecedores durante o processo de cadastro."
        >
          <InlineList
            items={consultorias}
            {...listHandlers(setConsultorias)}
            addPlaceholder="Nome da consultoria parceira"
          />
        </Section>

        <Separator />

        {/* Email de notificação */}
        <EmailNotificacaoSection />
      </div>
    </>
  )
}
