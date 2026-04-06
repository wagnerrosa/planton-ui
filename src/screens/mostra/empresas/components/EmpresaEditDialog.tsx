'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/shadcn/dialog'
import { Button } from '@/components/primitives/Button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { EMPRESA_STATUS_CONFIG, type Empresa, type EmpresaStatus } from '../../mock-data'

type FormValues = {
  nome: string
  cnpj: string
  setor: string
  responsavel: string
  cargo: string
  email: string
  telefone: string
  status: EmpresaStatus
}

type EmpresaEditDialogProps = {
  empresa: Empresa | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (empresa: Empresa) => void
}

export function EmpresaEditDialog({ empresa, open, onOpenChange, onSave }: EmpresaEditDialogProps) {
  const { register, handleSubmit, reset, setValue, watch } = useForm<FormValues>()

  useEffect(() => {
    if (empresa) {
      reset({
        nome: empresa.nome,
        cnpj: empresa.cnpj,
        setor: empresa.setor,
        responsavel: empresa.responsavel,
        cargo: empresa.cargo,
        email: empresa.email,
        telefone: empresa.telefone ?? '',
        status: empresa.status,
      })
    }
  }, [empresa, reset])

  function onSubmit(values: FormValues) {
    if (!empresa) return
    onSave({
      ...empresa,
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Empresa</DialogTitle>
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
              <Label>Setor</Label>
              <Input {...register('setor', { required: true })} />
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
              <Label>Status</Label>
              <Select
                value={statusValue}
                onValueChange={(val) => setValue('status', val as EmpresaStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(EMPRESA_STATUS_CONFIG) as [EmpresaStatus, { label: string }][]).map(
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
