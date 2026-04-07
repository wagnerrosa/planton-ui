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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar empresa</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="empresa-nome">Nome da empresa</Label>
              <Input
                id="empresa-nome"
                placeholder="Ex: Verde Embalagens Ltda"
                {...register('nome', { required: true })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="empresa-cnpj">CNPJ</Label>
                <Input
                  id="empresa-cnpj"
                  placeholder="00.000.000/0001-00"
                  className="font-mono"
                  {...register('cnpj', { required: true })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="empresa-setor">Setor</Label>
                <Input
                  id="empresa-setor"
                  placeholder="Ex: Embalagens"
                  {...register('setor', { required: true })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="empresa-responsavel">Nome do responsável</Label>
                <Input
                  id="empresa-responsavel"
                  placeholder="Ex: Ana Souza"
                  {...register('responsavel', { required: true })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="empresa-cargo">Cargo</Label>
                <Input
                  id="empresa-cargo"
                  placeholder="Ex: Diretora de Sustentabilidade"
                  {...register('cargo', { required: true })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="empresa-email">E-mail</Label>
                <Input
                  id="empresa-email"
                  type="email"
                  placeholder="contato@empresa.com.br"
                  {...register('email', { required: true })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="empresa-telefone">Telefone</Label>
                <Input
                  id="empresa-telefone"
                  placeholder="(00) 00000-0000"
                  {...register('telefone')}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="empresa-status">Status</Label>
              <Select
                value={statusValue}
                onValueChange={(val) => setValue('status', val as EmpresaStatus)}
              >
                <SelectTrigger id="empresa-status">
                  <SelectValue placeholder="Selecione o status" />
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
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar empresa
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
