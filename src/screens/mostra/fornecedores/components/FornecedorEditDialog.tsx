'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/shadcn/dialog'
import { Button } from '@/components/primitives/Button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { FORNECEDOR_STATUS_CONFIG, type Fornecedor, type FornecedorStatus } from '../../mock-data'

type FormValues = {
  nome: string
  cnpj: string
  site: string
  responsavel: string
  cargo: string
  email: string
  telefone: string
  clientesIndicados: string
  status: FornecedorStatus
}

type FornecedorEditDialogProps = {
  fornecedor: Fornecedor | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (fornecedor: Fornecedor) => void
}

export function FornecedorEditDialog({ fornecedor, open, onOpenChange, onSave }: FornecedorEditDialogProps) {
  const { register, handleSubmit, reset, setValue, watch } = useForm<FormValues>()

  useEffect(() => {
    if (fornecedor) {
      reset({
        nome: fornecedor.nome,
        cnpj: fornecedor.cnpj,
        site: fornecedor.site ?? '',
        responsavel: fornecedor.responsavel,
        cargo: fornecedor.cargo,
        email: fornecedor.email,
        telefone: fornecedor.telefone ?? '',
        clientesIndicados: fornecedor.clientesIndicados.join(', '),
        status: fornecedor.status,
      })
    }
  }, [fornecedor, reset])

  function onSubmit(values: FormValues) {
    if (!fornecedor) return
    onSave({
      ...fornecedor,
      nome: values.nome,
      cnpj: values.cnpj,
      site: values.site || undefined,
      responsavel: values.responsavel,
      cargo: values.cargo,
      email: values.email,
      telefone: values.telefone || undefined,
      clientesIndicados: values.clientesIndicados
        ? values.clientesIndicados.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      status: values.status,
    })
    onOpenChange(false)
  }

  const statusValue = watch('status')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Fornecedor</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label>Nome</Label>
              <Input {...register('nome', { required: true })} />
            </div>
            <div className="space-y-1.5">
              <Label>CNPJ</Label>
              <Input {...register('cnpj', { required: true })} className="font-mono" />
            </div>
            <div className="space-y-1.5">
              <Label>Site</Label>
              <Input {...register('site')} />
            </div>
            <div className="space-y-1.5">
              <Label>Responsável</Label>
              <Input {...register('responsavel', { required: true })} />
            </div>
            <div className="space-y-1.5">
              <Label>Cargo</Label>
              <Input {...register('cargo', { required: true })} />
            </div>
            <div className="space-y-1.5">
              <Label>E-mail</Label>
              <Input type="email" {...register('email', { required: true })} />
            </div>
            <div className="space-y-1.5">
              <Label>Telefone</Label>
              <Input {...register('telefone')} />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Clientes Indicados <span className="text-muted-foreground">(separados por vírgula)</span></Label>
              <Input {...register('clientesIndicados')} placeholder="Ex: Empresa A, Empresa B" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Status</Label>
              <Select
                value={statusValue}
                onValueChange={(val) => setValue('status', val as FornecedorStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(FORNECEDOR_STATUS_CONFIG) as [FornecedorStatus, { label: string }][]).map(
                    ([key, cfg]) => (
                      <SelectItem key={key} value={key}>
                        {cfg.label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={() => handleSubmit(onSubmit)()}>
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
