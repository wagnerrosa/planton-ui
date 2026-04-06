'use client'

import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, Info } from 'lucide-react'
import { MostraNavbarSync } from '@/components/navigation/MostraNavbarSync'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { Button } from '@/components/primitives/Button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Textarea } from '@/components/shadcn/textarea'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/shadcn/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Alert, AlertDescription } from '@/components/shadcn/alert'

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
  clientesIndicados: z.string().optional(),
  statusInicial: z.enum(['elegivel', 'cadastrado', 'aguardando-contrato'] as const, {
    error: 'Selecione um status inicial',
  }),
  logotipo: z.any().optional(),
})

type EmpresaForm = z.infer<typeof empresaSchema>
type FornecedorForm = z.infer<typeof fornecedorSchema>

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
            <Input placeholder="00.000.000/0000-00" className="font-mono" {...register('cnpj')} />
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

      {/* Documentos */}
      <div className="space-y-4">
        <Heading as="h2" size="heading-md">Documentos</Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FileUploadZone
            label="Logotipo"
            hint="PNG | AI | PDF"
            accept=".png,.ai,.pdf"
            onChange={(file) => setValue('logotipo', file)}
          />
          <FileUploadZone
            label="Documento de pegada de carbono"
            hint="Clique para enviar o arquivo aqui"
            accept=".pdf"
            onChange={(file) => setValue('pegadaCarbono', file)}
          />
        </div>
      </div>

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
            <Input placeholder="00.000.000/0000-00" className="font-mono" {...register('cnpj')} />
            {errors.cnpj && <p className="text-xs text-destructive">{errors.cnpj.message}</p>}
          </div>
          <div className="col-span-full space-y-1.5">
            <Label>Site</Label>
            <Input placeholder="https://www.consultoria.com.br" {...register('site')} />
            {errors.site && <p className="text-xs text-destructive">{errors.site.message}</p>}
          </div>
        </div>
      </div>

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

      {/* Clientes indicados */}
      <div className="space-y-4">
        <Heading as="h2" size="heading-md">Clientes indicados</Heading>
        <div className="space-y-1.5">
          <Label>Empresas <span className="text-muted-foreground">(separadas por vírgula)</span></Label>
          <Textarea
            placeholder="Ex: Natura Cosméticos — 74.678.000.073-71"
            className="min-h-[80px]"
            {...register('clientesIndicados')}
          />
          <p className="text-xs text-muted-foreground">+ Adicionar outro cliente</p>
        </div>
      </div>

      {/* Logotipo */}
      <div className="space-y-4">
        <Heading as="h2" size="heading-md">Logotipo</Heading>
        <FileUploadZone
          label=""
          hint="PNG | AI | PDF"
          accept=".png,.ai,.pdf"
          onChange={(file) => setValue('logotipo', file)}
        />
      </div>

      {/* Status inicial */}
      <div className="space-y-4">
        <Heading as="h2" size="heading-md">Status inicial</Heading>
        <div className="max-w-xs space-y-1.5">
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

      <div className="p-6 space-y-6 max-w-4xl">
        <Heading as="h1" size="heading-lg">Cadastro Manual</Heading>

        <Alert variant="info">
          <Info size={14} />
          <AlertDescription>
            O cadastro manual é para situações onde o registro não passou pelo Fluxo de IA. O status inicial é definido pelo Admin no dropdown.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="empresa">
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
