'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/shadcn/dialog'
import { Button } from '@/components/primitives/Button'
import { Body } from '@/components/primitives/Body'
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar fornecedor</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="forn-nome">Nome do fornecedor</Label>
              <Input
                id="forn-nome"
                placeholder="Ex: BioClean Produtos"
                {...register('nome', { required: true })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="forn-cnpj">CNPJ</Label>
                <Input
                  id="forn-cnpj"
                  placeholder="00.000.000/0001-00"
                  className="font-mono"
                  {...register('cnpj', { required: true })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="forn-site">Site</Label>
                <Input
                  id="forn-site"
                  placeholder="www.empresa.com.br"
                  {...register('site')}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="forn-responsavel">Nome do responsável</Label>
                <Input
                  id="forn-responsavel"
                  placeholder="Ex: Juliana Ramos"
                  {...register('responsavel', { required: true })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="forn-cargo">Cargo</Label>
                <Input
                  id="forn-cargo"
                  placeholder="Ex: Gerente Comercial"
                  {...register('cargo', { required: true })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="forn-email">E-mail</Label>
                <Input
                  id="forn-email"
                  type="email"
                  placeholder="contato@fornecedor.com.br"
                  {...register('email', { required: true })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="forn-telefone">Telefone</Label>
                <Input
                  id="forn-telefone"
                  placeholder="(00) 00000-0000"
                  {...register('telefone')}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="forn-clientes">Clientes indicados</Label>
              <Input
                id="forn-clientes"
                placeholder="Ex: Empresa A, Empresa B"
                {...register('clientesIndicados')}
              />
              <Body muted className="text-xs">Separe múltiplos clientes por vírgula</Body>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="forn-status">Status</Label>
              <Select
                value={statusValue}
                onValueChange={(val) => setValue('status', val as FornecedorStatus)}
              >
                <SelectTrigger id="forn-status">
                  <SelectValue placeholder="Selecione o status" />
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
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar fornecedor
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
