'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ComponentPage } from '@/components/ui/ComponentPage'
import { Input } from '@/components/shadcn/input'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/shadcn/form'
import { findComponent } from '@/lib/components-registry'

const meta = findComponent('inputs', 'form')!

const profileSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  cargo: z.string().min(2, 'Cargo deve ter ao menos 2 caracteres'),
})
type ProfileForm = z.infer<typeof profileSchema>

export default function FormPage() {
  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { nome: '', cargo: '' },
  })

  function onProfileSubmit(values: ProfileForm) {
    toast.success(`Perfil de ${values.nome} salvo com sucesso`)
  }

  return (
    <ComponentPage
      category="Inputs & Forms"
      name={meta.name}
      description={meta.description}
      filePath={meta.filePath}
    >
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Exemplo com validação</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onProfileSubmit)} className="flex flex-col gap-4 max-w-sm">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex.: Ana Beatriz Silva" className="rounded-none border-border" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cargo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex.: Analista de Sustentabilidade" className="rounded-none border-border" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button type="submit" className="self-start inline-flex items-center overflow-hidden border rounded-none font-sans font-medium tracking-[0.02em] transition-[color] duration-[300ms] ease-out border-planton-accent text-planton-accent hover:text-planton-white px-6 py-3 text-sm group relative">
              <span aria-hidden className="absolute inset-0 -translate-x-full transition-transform ease-[cubic-bezier(0.16,1,0.3,1)] duration-500 group-hover:translate-x-0 bg-planton-accent" />
              <span className="relative z-10">Salvar perfil</span>
            </button>
          </form>
        </Form>
      </section>
    </ComponentPage>
  )
}
