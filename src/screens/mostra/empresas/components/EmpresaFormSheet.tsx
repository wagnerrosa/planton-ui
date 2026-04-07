'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Upload } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/shadcn/sheet'
import { Button } from '@/components/primitives/Button'
import { Body } from '@/components/primitives/Body'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Separator } from '@/components/shadcn/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { EMPRESA_STATUS_CONFIG, type Empresa, type EmpresaStatus } from '../../mock-data'

type FormValues = {
  nome: string
  cnpj: string
  setor: string
  representanteLegal: string
  responsavel: string
  cargo: string
  email: string
  telefone: string
  status: EmpresaStatus
}

type EmpresaFormSheetProps = {
  empresa: Empresa | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (empresa: Empresa) => void
  isNew?: boolean
}

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
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
        />
      </div>
    </div>
  )
}

export function EmpresaFormSheet({ empresa, open, onOpenChange, onSave, isNew = false }: EmpresaFormSheetProps) {
  const { register, handleSubmit, reset, setValue, watch } = useForm<FormValues>()

  useEffect(() => {
    if (open) {
      if (empresa && !isNew) {
        reset({
          nome: empresa.nome,
          cnpj: empresa.cnpj,
          setor: empresa.setor,
          representanteLegal: '',
          responsavel: empresa.responsavel,
          cargo: empresa.cargo,
          email: empresa.email,
          telefone: empresa.telefone ?? '',
          status: empresa.status,
        })
      } else {
        reset({
          nome: '',
          cnpj: '',
          setor: '',
          representanteLegal: '',
          responsavel: '',
          cargo: '',
          email: '',
          telefone: '',
          status: 'processo-iniciado',
        })
      }
    }
  }, [empresa, open, isNew, reset])

  function onSubmit(values: FormValues) {
    const base: Empresa = empresa ?? {
      id: crypto.randomUUID(),
      nome: '',
      cnpj: '',
      setor: '',
      responsavel: '',
      cargo: '',
      email: '',
      status: 'processo-iniciado',
      dataEntrada: new Date().toISOString().slice(0, 10),
    }

    onSave({
      ...base,
      nome: values.nome,
      cnpj: values.cnpj,
      setor: values.setor,
      responsavel: values.responsavel,
      cargo: values.cargo,
      email: values.email,
      telefone: values.telefone || undefined,
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
            {isNew ? 'Cadastrar empresa' : 'Editar empresa'}
          </SheetTitle>
        </SheetHeader>

        {/* Body */}
        <form id="empresa-form" onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto">
          <div className="px-6 py-5 space-y-6">

            {/* Dados da empresa */}
            <div className="space-y-4">
              <Body className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Dados da Empresa</Body>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 flex flex-col gap-2">
                  <Label htmlFor="empresa-nome">Nome da empresa *</Label>
                  <Input id="empresa-nome" placeholder="Nome completo da empresa" {...register('nome', { required: true })} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="empresa-cnpj">CNPJ *</Label>
                  <Input id="empresa-cnpj" placeholder="00.000.000/0000-00" className="font-mono" {...register('cnpj', { required: true })} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="empresa-setor">Setor *</Label>
                  <Input id="empresa-setor" placeholder="Ex: Alimentos, Cosméticos..." {...register('setor', { required: true })} />
                </div>
                <div className="col-span-2 flex flex-col gap-2">
                  <Label htmlFor="empresa-rep">Representante legal *</Label>
                  <Input id="empresa-rep" placeholder="Nome do representante" {...register('representanteLegal', { required: isNew })} />
                </div>
              </div>
            </div>

            <Separator />

            {/* Responsável */}
            <div className="space-y-4">
              <Body className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Responsável pelo cadastro</Body>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="empresa-responsavel">Nome *</Label>
                  <Input id="empresa-responsavel" placeholder="Nome completo" {...register('responsavel', { required: true })} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="empresa-cargo">Cargo *</Label>
                  <Input id="empresa-cargo" placeholder="Ex: Gerente de Sustentabilidade" {...register('cargo', { required: true })} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="empresa-email">E-mail *</Label>
                  <Input id="empresa-email" type="email" placeholder="contato@empresa.com.br" {...register('email', { required: true })} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="empresa-telefone">Telefone <span className="text-muted-foreground">(opcional)</span></Label>
                  <Input id="empresa-telefone" placeholder="(00) 00000-0000" {...register('telefone')} />
                </div>
              </div>
            </div>

            {isNew && (
              <>
                <Separator />
                <div className="space-y-4">
                  <Body className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Documentos</Body>
                  <div className="grid grid-cols-2 gap-4">
                    <FileUploadZone label="Logotipo" hint="PNG · JPG · SVG" accept=".png,.jpg,.jpeg,.svg" />
                    <FileUploadZone label="Pegada de carbono" hint="PDF · JPG · DOC" accept=".pdf,.jpg,.jpeg,.doc" />
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Status */}
            <div className="space-y-4">
              <Body className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Status</Body>
              <div className="max-w-xs flex flex-col gap-2">
                <Label htmlFor="empresa-status">Status *</Label>
                <Select value={statusValue} onValueChange={(val) => setValue('status', val as EmpresaStatus)}>
                  <SelectTrigger id="empresa-status">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.entries(EMPRESA_STATUS_CONFIG) as [EmpresaStatus, { label: string }][]).map(([key, cfg]) => (
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
          <Button type="submit" form="empresa-form">
            {isNew ? 'Criar registro' : 'Salvar empresa'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
