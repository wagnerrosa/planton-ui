'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Upload, Plus, Check, X, Pencil, Trash2 } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/shadcn/sheet'
import { Button } from '@/components/primitives/Button'
import { Body } from '@/components/primitives/Body'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Separator } from '@/components/shadcn/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { FORNECEDOR_STATUS_CONFIG, type Fornecedor, type FornecedorStatus } from '../../mock-data'

// ─── Clientes Indicados Table ────────────────────────────────────────────────

type ClienteItem = { nome: string; cnpj: string }

function ClientesIndicadosTable({ items, onChange }: { items: ClienteItem[]; onChange: (items: ClienteItem[]) => void }) {
  const [adding, setAdding] = useState(false)
  const [addNome, setAddNome] = useState('')
  const [addCnpj, setAddCnpj] = useState('')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editNome, setEditNome] = useState('')
  const [editCnpj, setEditCnpj] = useState('')
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(null)

  function commitAdd() {
    const nome = addNome.trim()
    const cnpj = addCnpj.trim()
    if (nome && cnpj) onChange([...items, { nome, cnpj }])
    setAddNome('')
    setAddCnpj('')
    setAdding(false)
  }

  function startEdit(i: number) {
    setConfirmDeleteIndex(null)
    setEditingIndex(i)
    setEditNome(items[i].nome)
    setEditCnpj(items[i].cnpj)
  }

  function commitEdit() {
    if (editingIndex !== null) {
      const nome = editNome.trim()
      const cnpj = editCnpj.trim()
      if (nome && cnpj) onChange(items.map((item, idx) => (idx === editingIndex ? { nome, cnpj } : item)))
    }
    setEditingIndex(null)
  }

  function cancelEdit() { setEditingIndex(null) }

  function executeDelete() {
    if (confirmDeleteIndex !== null) onChange(items.filter((_, idx) => idx !== confirmDeleteIndex))
    setConfirmDeleteIndex(null)
  }

  return (
    <div className="border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>CNPJ</TableHead>
            <TableHead className="w-32 text-right pr-4">
              {!adding && (
                <button
                  type="button"
                  onClick={() => setAdding(true)}
                  className="inline-flex items-center gap-1 text-xs font-normal text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Plus size={12} />
                  Adicionar
                </button>
              )}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, i) => (
            <TableRow key={i}>
              {editingIndex === i ? (
                <>
                  <TableCell className="py-2">
                    <Input value={editNome} onChange={(e) => setEditNome(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') cancelEdit() }}
                      className="h-7 text-sm" autoFocus />
                  </TableCell>
                  <TableCell className="py-2">
                    <Input value={editCnpj} onChange={(e) => setEditCnpj(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') cancelEdit() }}
                      className="h-7 text-sm font-mono" />
                  </TableCell>
                  <TableCell className="py-2 text-right pr-4">
                    <div className="flex items-center justify-end gap-1">
                      <button type="button" onClick={commitEdit} className="p-1 text-emerald-600 hover:text-emerald-700"><Check size={14} /></button>
                      <button type="button" onClick={cancelEdit} className="p-1 text-muted-foreground hover:text-foreground"><X size={14} /></button>
                    </div>
                  </TableCell>
                </>
              ) : confirmDeleteIndex === i ? (
                <>
                  <TableCell className="text-sm text-muted-foreground line-through">{item.nome}</TableCell>
                  <TableCell className="text-sm text-muted-foreground line-through font-mono">{item.cnpj}</TableCell>
                  <TableCell className="py-2 text-right pr-4">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-xs text-muted-foreground">Excluir?</span>
                      <button type="button" onClick={executeDelete} className="p-1 text-destructive hover:text-destructive/80"><Check size={14} /></button>
                      <button type="button" onClick={() => setConfirmDeleteIndex(null)} className="p-1 text-muted-foreground hover:text-foreground"><X size={14} /></button>
                    </div>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell className="text-sm">{item.nome}</TableCell>
                  <TableCell className="text-sm font-mono text-muted-foreground">{item.cnpj}</TableCell>
                  <TableCell className="text-right pr-4">
                    <div className="flex items-center justify-end gap-1">
                      <button type="button" onClick={() => startEdit(i)} className="p-1 text-muted-foreground hover:text-foreground"><Pencil size={13} /></button>
                      <button type="button" onClick={() => { setEditingIndex(null); setConfirmDeleteIndex(i) }} className="p-1 text-muted-foreground hover:text-destructive"><Trash2 size={13} /></button>
                    </div>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}

          {adding && (
            <TableRow>
              <TableCell className="py-2">
                <Input value={addNome} onChange={(e) => setAddNome(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') commitAdd(); if (e.key === 'Escape') { setAdding(false); setAddNome(''); setAddCnpj('') } }}
                  placeholder="Nome da empresa" className="h-7 text-sm" autoFocus />
              </TableCell>
              <TableCell className="py-2">
                <Input value={addCnpj} onChange={(e) => setAddCnpj(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') commitAdd(); if (e.key === 'Escape') { setAdding(false); setAddNome(''); setAddCnpj('') } }}
                  placeholder="00.000.000/0000-00" className="h-7 text-sm font-mono" />
              </TableCell>
              <TableCell className="py-2 text-right pr-4">
                <div className="flex items-center justify-end gap-1">
                  <button type="button" onClick={commitAdd} className="p-1 text-emerald-600 hover:text-emerald-700"><Check size={14} /></button>
                  <button type="button" onClick={() => { setAdding(false); setAddNome(''); setAddCnpj('') }} className="p-1 text-muted-foreground hover:text-foreground"><X size={14} /></button>
                </div>
              </TableCell>
            </TableRow>
          )}

          {items.length === 0 && !adding && (
            <TableRow>
              <TableCell colSpan={3} className="py-6 text-center">
                <Body size="sm" className="text-muted-foreground">Nenhum cliente indicado.</Body>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

// ─── File Upload Zone ────────────────────────────────────────────────────────

function FileUploadZone({ label, hint, accept }: { label: string; hint: string; accept: string }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  return (
    <div className="space-y-1.5">
      {label && <Label>{label}</Label>}
      <div
        className="border border-dashed border-border p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-foreground transition-colors"
        onClick={() => inputRef.current?.click()}
      >
        <Upload size={16} className="text-muted-foreground" />
        {fileName ? (
          <Body size="sm" className="text-foreground text-center truncate max-w-full">{fileName}</Body>
        ) : (
          <Body size="sm" className="text-muted-foreground text-center">Clique para enviar</Body>
        )}
        <Body size="sm" className="text-muted-foreground/60 text-xs">{hint}</Body>
        <input ref={inputRef} type="file" accept={accept} className="hidden"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)} />
      </div>
    </div>
  )
}

// ─── Sheet ───────────────────────────────────────────────────────────────────

type FormValues = {
  nome: string
  cnpj: string
  site: string
  responsavel: string
  cargo: string
  email: string
  telefone: string
  status: FornecedorStatus
}

type FornecedorFormSheetProps = {
  fornecedor: Fornecedor | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (fornecedor: Fornecedor) => void
  isNew?: boolean
}

export function FornecedorFormSheet({ fornecedor, open, onOpenChange, onSave, isNew = false }: FornecedorFormSheetProps) {
  const { register, handleSubmit, reset, setValue, watch } = useForm<FormValues>()
  const [clientesIndicados, setClientesIndicados] = useState<ClienteItem[]>([])

  useEffect(() => {
    if (open) {
      if (fornecedor && !isNew) {
        reset({
          nome: fornecedor.nome,
          cnpj: fornecedor.cnpj,
          site: fornecedor.site ?? '',
          responsavel: fornecedor.responsavel,
          cargo: fornecedor.cargo,
          email: fornecedor.email,
          telefone: fornecedor.telefone ?? '',
          status: fornecedor.status,
        })
        setClientesIndicados(fornecedor.clientesIndicados.map((nome) => ({ nome, cnpj: '' })))
      } else {
        reset({ nome: '', cnpj: '', site: '', responsavel: '', cargo: '', email: '', telefone: '', status: 'processo-iniciado' })
        setClientesIndicados([])
      }
    }
  }, [fornecedor, open, isNew, reset])

  function onSubmit(values: FormValues) {
    const base: Fornecedor = fornecedor ?? {
      id: crypto.randomUUID(),
      nome: '',
      cnpj: '',
      responsavel: '',
      cargo: '',
      email: '',
      clientesIndicados: [],
      status: 'processo-iniciado',
      dataEntrada: new Date().toISOString().slice(0, 10),
    }

    onSave({
      ...base,
      nome: values.nome,
      cnpj: values.cnpj,
      site: values.site || undefined,
      responsavel: values.responsavel,
      cargo: values.cargo,
      email: values.email,
      telefone: values.telefone || undefined,
      clientesIndicados: clientesIndicados.map((c) => c.nome).filter(Boolean),
      status: values.status,
    })
    onOpenChange(false)
  }

  const statusValue = watch('status')

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto flex flex-col gap-0 p-0">
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
          <SheetTitle className="text-left text-base font-semibold">
            {isNew ? 'Cadastrar fornecedor' : 'Editar fornecedor'}
          </SheetTitle>
        </SheetHeader>

        {/* Body */}
        <form id="fornecedor-form" onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto">
          <div className="px-6 py-5 space-y-6">

            {/* Dados */}
            <div className="space-y-4">
              <Body className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Dados da Fornecedora</Body>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 flex flex-col gap-2">
                  <Label htmlFor="forn-nome">Nome da empresa *</Label>
                  <Input id="forn-nome" placeholder="Nome completo" {...register('nome', { required: true })} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="forn-cnpj">CNPJ *</Label>
                  <Input id="forn-cnpj" placeholder="00.000.000/0000-00" className="font-mono" {...register('cnpj', { required: true })} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="forn-site">Site</Label>
                  <Input id="forn-site" placeholder="https://www.consultoria.com.br" {...register('site')} />
                </div>
              </div>
            </div>

            <Separator />

            {/* Responsável */}
            <div className="space-y-4">
              <Body className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Responsável</Body>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="forn-responsavel">Nome *</Label>
                  <Input id="forn-responsavel" placeholder="Nome completo" {...register('responsavel', { required: true })} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="forn-cargo">Cargo *</Label>
                  <Input id="forn-cargo" placeholder="Ex: Sócio Diretor" {...register('cargo', { required: true })} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="forn-email">E-mail corporativo *</Label>
                  <Input id="forn-email" type="email" placeholder="responsavel@empresa.com" {...register('email', { required: true })} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="forn-telefone">Telefone <span className="text-muted-foreground">(opcional)</span></Label>
                  <Input id="forn-telefone" placeholder="(00) 00000-0000" {...register('telefone')} />
                </div>
              </div>
            </div>

            <Separator />

            {/* Clientes indicados */}
            <div className="space-y-3">
              <Body className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Clientes Indicados</Body>
              <ClientesIndicadosTable items={clientesIndicados} onChange={setClientesIndicados} />
            </div>

            {isNew && (
              <>
                <Separator />
                <div className="space-y-3">
                  <Body className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Logotipo</Body>
                  <FileUploadZone label="" hint="PNG · JPG · SVG" accept=".png,.jpg,.jpeg,.svg" />
                </div>
              </>
            )}

            <Separator />

            {/* Status */}
            <div className="space-y-4">
              <Body className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Status</Body>
              <div className="max-w-xs flex flex-col gap-2">
                <Label htmlFor="forn-status">Status *</Label>
                <Select value={statusValue} onValueChange={(val) => setValue('status', val as FornecedorStatus)}>
                  <SelectTrigger id="forn-status">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.entries(FORNECEDOR_STATUS_CONFIG) as [FornecedorStatus, { label: string }][]).map(([key, cfg]) => (
                      <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

          </div>
        </form>

        {/* Footer */}
        <SheetFooter className="px-6 py-4 border-t border-border shrink-0 flex flex-row justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button type="submit" form="fornecedor-form">
            {isNew ? 'Criar registro' : 'Salvar fornecedor'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
