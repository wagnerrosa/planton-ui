'use client'

import { useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, Info, Plus, Check, X, Pencil, Trash2 } from 'lucide-react'
import { MostraNavbarSync } from '@/components/navigation/MostraNavbarSync'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { Button } from '@/components/primitives/Button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/shadcn/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Alert, AlertDescription } from '@/components/shadcn/alert'
import { Separator } from '@/components/shadcn/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'

// ─── Schemas ───────────────────────────────────────────────────────────────

const empresaSchema = z.object({
  nome: z.string().min(2, 'Nome obrigatório'),
  cnpj: z.string().min(14, 'CNPJ inválido').max(18),
  setor: z.string().min(2, 'Setor obrigatório'),
  representanteLegal: z.string().min(2, 'Representante obrigatório'),
  responsavel: z.string().min(2, 'Nome do responsável obrigatório'),
  email: z.string().email('E-mail inválido'),
  cargo: z.string().min(2, 'Cargo obrigatório'),
  telefone: z.string().optional(),
  statusInicial: z.enum(['elegivel', 'cadastrado', 'aguardando-contrato'] as const, {
    error: 'Selecione um status inicial',
  }),
  logotipo: z.any().optional(),
  pegadaCarbono: z.any().optional(),
})

const fornecedorSchema = z.object({
  nome: z.string().min(2, 'Nome obrigatório'),
  cnpj: z.string().min(14, 'CNPJ inválido').max(18),
  site: z.string().url('URL inválida').optional().or(z.literal('')),
  responsavel: z.string().min(2, 'Nome do responsável obrigatório'),
  email: z.string().email('E-mail inválido'),
  cargo: z.string().min(2, 'Cargo obrigatório'),
  telefone: z.string().optional(),
  clientesIndicados: z.array(z.object({ nome: z.string(), cnpj: z.string() })).optional(),
  statusInicial: z.enum(['elegivel', 'cadastrado', 'aguardando-contrato'] as const, {
    error: 'Selecione um status inicial',
  }),
  logotipo: z.any().optional(),
})

type EmpresaForm = z.infer<typeof empresaSchema>
type FornecedorForm = z.infer<typeof fornecedorSchema>

// ─── Clientes Indicados Table ────────────────────────────────────────────────

type ClienteItem = { nome: string; cnpj: string }

function ClientesIndicadosTable({
  items,
  onChange,
}: {
  items: ClienteItem[]
  onChange: (items: ClienteItem[]) => void
}) {
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
      if (nome && cnpj) {
        onChange(items.map((item, idx) => (idx === editingIndex ? { nome, cnpj } : item)))
      }
    }
    setEditingIndex(null)
  }

  function cancelEdit() {
    setEditingIndex(null)
  }

  function executeDelete() {
    if (confirmDeleteIndex !== null) {
      onChange(items.filter((_, idx) => idx !== confirmDeleteIndex))
    }
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
                    <Input
                      value={editNome}
                      onChange={(e) => setEditNome(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') cancelEdit() }}
                      className="h-7 text-sm"
                      autoFocus
                    />
                  </TableCell>
                  <TableCell className="py-2">
                    <Input
                      value={editCnpj}
                      onChange={(e) => setEditCnpj(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') cancelEdit() }}
                      className="h-7 text-sm font-mono"
                    />
                  </TableCell>
                  <TableCell className="py-2 text-right pr-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={commitEdit} className="p-1 text-emerald-600 hover:text-emerald-700"><Check size={14} /></button>
                      <button onClick={cancelEdit} className="p-1 text-muted-foreground hover:text-foreground"><X size={14} /></button>
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
                      <button onClick={executeDelete} className="p-1 text-destructive hover:text-destructive/80"><Check size={14} /></button>
                      <button onClick={() => setConfirmDeleteIndex(null)} className="p-1 text-muted-foreground hover:text-foreground"><X size={14} /></button>
                    </div>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell className="text-sm">{item.nome}</TableCell>
                  <TableCell className="text-sm font-mono text-muted-foreground">{item.cnpj}</TableCell>
                  <TableCell className="text-right pr-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => startEdit(i)} className="p-1 text-muted-foreground hover:text-foreground"><Pencil size={13} /></button>
                      <button onClick={() => { setEditingIndex(null); setConfirmDeleteIndex(i) }} className="p-1 text-muted-foreground hover:text-destructive"><Trash2 size={13} /></button>
                    </div>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}

          {adding && (
            <TableRow>
              <TableCell className="py-2">
                <Input
                  value={addNome}
                  onChange={(e) => setAddNome(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') commitAdd(); if (e.key === 'Escape') { setAdding(false); setAddNome(''); setAddCnpj('') } }}
                  placeholder="Nome da empresa"
                  className="h-7 text-sm"
                  autoFocus
                />
              </TableCell>
              <TableCell className="py-2">
                <Input
                  value={addCnpj}
                  onChange={(e) => setAddCnpj(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') commitAdd(); if (e.key === 'Escape') { setAdding(false); setAddNome(''); setAddCnpj('') } }}
                  placeholder="00.000.000/0000-00"
                  className="h-7 text-sm font-mono"
                />
              </TableCell>
              <TableCell className="py-2 text-right pr-4">
                <div className="flex items-center justify-end gap-1">
                  <button onClick={commitAdd} className="p-1 text-emerald-600 hover:text-emerald-700"><Check size={14} /></button>
                  <button onClick={() => { setAdding(false); setAddNome(''); setAddCnpj('') }} className="p-1 text-muted-foreground hover:text-foreground"><X size={14} /></button>
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

// ─── File Upload Zone ───────────────────────────────────────────────────────

function FileUploadZone({
  label,
  hint,
  accept,
  onChange,
}: {
  label: string
  hint: string
  accept: string
  onChange?: (file: File | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div
        className="border border-dashed border-border p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-foreground transition-colors"
        onClick={() => inputRef.current?.click()}
      >
        <Upload size={18} className="text-muted-foreground" />
        <Body size="sm" className="text-muted-foreground text-center">
          Clique para enviar o arquivo aqui
        </Body>
        <Body size="sm" className="text-muted-foreground/60 text-center text-xs">{hint}</Body>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => onChange?.(e.target.files?.[0] ?? null)}
        />
      </div>
    </div>
  )
}

// ─── Empresa Form ───────────────────────────────────────────────────────────

function EmpresaFormTab() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EmpresaForm>({ resolver: zodResolver(empresaSchema) })

  const statusValue = watch('statusInicial')

  function onSubmit(data: EmpresaForm) {
    // eslint-disable-next-line no-console
    console.log('Empresa cadastrada:', data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Dados da empresa */}
      <div className="space-y-4">
        <Heading as="h2" size="heading-md">Dados da Empresa</Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Nome da empresa *</Label>
            <Input placeholder="Nome completo da empresa" {...register('nome')} />
            {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>CNPJ *</Label>
            <Input placeholder="00.000.000/0000-00" {...register('cnpj')} />
            {errors.cnpj && <p className="text-xs text-destructive">{errors.cnpj.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Setor *</Label>
            <Input placeholder="Ex: Alimentos, Cosméticos..." {...register('setor')} />
            {errors.setor && <p className="text-xs text-destructive">{errors.setor.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Representante legal *</Label>
            <Input placeholder="Nome do representante" {...register('representanteLegal')} />
            {errors.representanteLegal && (
              <p className="text-xs text-destructive">{errors.representanteLegal.message}</p>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Responsável pelo cadastro */}
      <div className="space-y-4">
        <Heading as="h2" size="heading-md">Responsável pelo cadastro</Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Nome do responsável *</Label>
            <Input placeholder="Nome completo" {...register('responsavel')} />
            {errors.responsavel && (
              <p className="text-xs text-destructive">{errors.responsavel.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>E-mail *</Label>
            <Input type="email" placeholder="responsavel@empresa.com" {...register('email')} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Cargo *</Label>
            <Input placeholder="Ex: Gerente de Sustentabilidade" {...register('cargo')} />
            {errors.cargo && <p className="text-xs text-destructive">{errors.cargo.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Telefone <span className="text-muted-foreground">(opcional)</span></Label>
            <Input placeholder="+55 000.00000-0000" {...register('telefone')} />
          </div>
        </div>
      </div>

      <Separator />

      {/* Documentos */}
      <div className="space-y-4">
        <Heading as="h2" size="heading-md">Documentos</Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FileUploadZone
            label="Logotipo"
            hint="PNG | JPG | SVG"
            accept=".png,.jpg,.jpeg,.svg"
            onChange={(file) => setValue('logotipo', file)}
          />
          <FileUploadZone
            label="Documento de pegada de carbono"
            hint="PDF, JPG, DOC"
            accept=".pdf,.jpg,.jpeg,.doc"
            onChange={(file) => setValue('pegadaCarbono', file)}
          />
        </div>
      </div>

      <Separator />

      {/* Status inicial */}
      <div className="space-y-4">
        <Heading as="h2" size="heading-md">Status inicial</Heading>
        <div className="max-w-xs space-y-1.5">
          <Label>Status *</Label>
          <Select
            value={statusValue}
            onValueChange={(val) =>
              setValue('statusInicial', val as EmpresaForm['statusInicial'], { shouldValidate: true })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecionar um status..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="elegivel">Elegível</SelectItem>
              <SelectItem value="cadastrado">Cadastrado</SelectItem>
              <SelectItem value="aguardando-contrato">Aguardando Contrato Personalizado</SelectItem>
            </SelectContent>
          </Select>
          {errors.statusInicial && (
            <p className="text-xs text-destructive">{errors.statusInicial.message}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
        <Button variant="ghost" onClick={() => {}}>Cancelar</Button>
        <Button variant="primary" onClick={() => handleSubmit(onSubmit)()}>Criar Registro</Button>
      </div>
    </form>
  )
}

// ─── Fornecedor Form ────────────────────────────────────────────────────────

function FornecedorFormTab() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FornecedorForm>({ resolver: zodResolver(fornecedorSchema) })

  const statusValue = watch('statusInicial')

  function onSubmit(data: FornecedorForm) {
    // eslint-disable-next-line no-console
    console.log('Fornecedor cadastrado:', data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Dados do fornecedor */}
      <div className="space-y-4">
        <Heading as="h2" size="heading-md">Dados da Fornecedora</Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Nome da empresa *</Label>
            <Input placeholder="Nome completo" {...register('nome')} />
            {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>CNPJ *</Label>
            <Input placeholder="00.000.000/0000-00" {...register('cnpj')} />
            {errors.cnpj && <p className="text-xs text-destructive">{errors.cnpj.message}</p>}
          </div>
          <div className="col-span-full space-y-1.5">
            <Label>Site</Label>
            <Input placeholder="https://www.consultoria.com.br" {...register('site')} />
            {errors.site && <p className="text-xs text-destructive">{errors.site.message}</p>}
          </div>
        </div>
      </div>

      <Separator />

      {/* Responsável */}
      <div className="space-y-4">
        <Heading as="h2" size="heading-md">Responsável</Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Nome do responsável *</Label>
            <Input placeholder="Nome completo" {...register('responsavel')} />
            {errors.responsavel && (
              <p className="text-xs text-destructive">{errors.responsavel.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>E-mail corporativo *</Label>
            <Input type="email" placeholder="responsavel@empresa.com" {...register('email')} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Cargo *</Label>
            <Input placeholder="Ex: Sócio Diretor" {...register('cargo')} />
            {errors.cargo && <p className="text-xs text-destructive">{errors.cargo.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Telefone</Label>
            <Input placeholder="+55 000.00000-0000" {...register('telefone')} />
          </div>
        </div>
      </div>

      <Separator />

      {/* Clientes indicados */}
      <div className="space-y-4">
        <Heading as="h2" size="heading-md">Clientes indicados</Heading>
        <ClientesIndicadosTable
          items={watch('clientesIndicados') ?? []}
          onChange={(val) => setValue('clientesIndicados', val)}
        />
      </div>

      <Separator />

      {/* Logotipo + Status inicial */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <Heading as="h2" size="heading-md">Logotipo</Heading>
          <FileUploadZone
            label=""
            hint="PNG | JPG | SVG"
            accept=".png,.jpg,.jpeg,.svg"
            onChange={(file) => setValue('logotipo', file)}
          />
        </div>

        <div className="space-y-4">
          <Heading as="h2" size="heading-md">Status inicial</Heading>
          <div className="space-y-1.5">
            <Label>Status *</Label>
            <Select
              value={statusValue}
              onValueChange={(val) =>
                setValue('statusInicial', val as FornecedorForm['statusInicial'], { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar um status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="elegivel">Elegível</SelectItem>
                <SelectItem value="cadastrado">Cadastrado</SelectItem>
                <SelectItem value="aguardando-contrato">Aguardando Contrato Personalizado</SelectItem>
              </SelectContent>
            </Select>
            {errors.statusInicial && (
              <p className="text-xs text-destructive">{errors.statusInicial.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
        <Button variant="ghost" onClick={() => {}}>Cancelar</Button>
        <Button variant="primary" onClick={() => handleSubmit(onSubmit)()}>Criar Registro</Button>
      </div>
    </form>
  )
}

// ─── Screen ─────────────────────────────────────────────────────────────────

export function CadastroManualScreen() {
  return (
    <>
      <MostraNavbarSync breadcrumbs={[{ label: 'Cadastro Manual' }]} />

      <div className="px-6 pb-6 pt-10 space-y-6 max-w-4xl">
        <Heading as="h1" size="heading-lg">Cadastro Manual</Heading>

        <Alert variant="info">
          <Info size={14} />
          <AlertDescription>
            O cadastro manual é para situações onde o registro não passou pelo Fluxo de IA. O status inicial é definido pelo Admin no dropdown.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue={useSearchParams().get('tab') === 'fornecedor' ? 'fornecedor' : 'empresa'}>
          <TabsList className="mb-6">
            <TabsTrigger value="empresa">Cadastro Empresa</TabsTrigger>
            <TabsTrigger value="fornecedor">Cadastro Fornecedor</TabsTrigger>
          </TabsList>

          <TabsContent value="empresa">
            <EmpresaFormTab />
          </TabsContent>

          <TabsContent value="fornecedor">
            <FornecedorFormTab />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
