'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { AcademyLogo } from '../AcademyLogo'
import { AuthCard } from '../AuthCard'
import { Button } from '@/components/primitives/Button'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/shadcn/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'
import type { AuthStep } from '../LoginFlow'

const profileSchema = z.object({
  fullName: z.string().min(1, 'Nome completo é obrigatório'),
  role: z.string().min(1, 'Cargo é obrigatório'),
  phone: z.string().optional(),
  gender: z.string().optional(),
  birthDate: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

type ProfileFormStepProps = {
  scenario?: 'A' | 'B' | 'C'
  onNavigate: (step: AuthStep) => void
}

export function ProfileFormStep({ scenario, onNavigate }: ProfileFormStepProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      role: '',
      phone: '',
      gender: '',
      birthDate: '',
    },
  })

  function onSubmit() {
    onNavigate('set-password')
  }

  function handleBack() {
    if (scenario === 'A') {
      onNavigate('domain-active')
    } else {
      onNavigate('domain-inactive')
    }
  }

  return (
    <AuthCard>
      <div className="flex flex-col gap-6">
        <AcademyLogo />
        <Heading as="h1" size="heading-lg">Complete seu perfil</Heading>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono text-xs uppercase tracking-[0.05em] text-planton-muted">
                  Nome completo *
                </FormLabel>
                <FormControl>
                  <input
                    {...field}
                    className="w-full border-b border-border bg-transparent py-2 font-sans text-sm text-planton-forest outline-none focus:border-planton-accent transition-colors"
                    placeholder="Seu nome completo"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono text-xs uppercase tracking-[0.05em] text-planton-muted">
                  Cargo / Função *
                </FormLabel>
                <FormControl>
                  <input
                    {...field}
                    className="w-full border-b border-border bg-transparent py-2 font-sans text-sm text-planton-forest outline-none focus:border-planton-accent transition-colors"
                    placeholder="Ex: Analista de Sustentabilidade"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono text-xs uppercase tracking-[0.05em] text-planton-muted">
                  Telefone
                </FormLabel>
                <FormControl>
                  <input
                    {...field}
                    type="tel"
                    className="w-full border-b border-border bg-transparent py-2 font-sans text-sm text-planton-forest outline-none focus:border-planton-accent transition-colors"
                    placeholder="(11) 99999-9999"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono text-xs uppercase tracking-[0.05em] text-planton-muted">
                  Gênero
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-0 border-b border-border rounded-none bg-transparent px-0 py-2 font-sans text-sm text-planton-forest shadow-none focus:ring-0">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                    <SelectItem value="nao-binario">Não-binário</SelectItem>
                    <SelectItem value="prefiro-nao-informar">Prefiro não informar</SelectItem>
                  </SelectContent>
                </Select>
                <Body size="sm" muted className="!text-[0.7rem] !leading-snug">
                  Esta informação é opcional e será usada exclusivamente para relatórios de diversidade no formato GRI 404. Você pode alterar ou remover a qualquer momento nas configurações.
                </Body>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono text-xs uppercase tracking-[0.05em] text-planton-muted">
                  Data de nascimento
                </FormLabel>
                <FormControl>
                  <input
                    {...field}
                    type="date"
                    className="w-full border-b border-border bg-transparent py-2 font-sans text-sm text-planton-forest outline-none focus:border-planton-accent transition-colors"
                  />
                </FormControl>
                <Body size="sm" muted className="!text-[0.7rem] !leading-snug">
                  Esta informação é opcional e será usada exclusivamente para relatórios de diversidade no formato GRI 404. Você pode alterar ou remover a qualquer momento nas configurações.
                </Body>
              </FormItem>
            )}
          />

          <Button variant="primary" className="w-full justify-center mt-2">
            Continuar
          </Button>
        </form>
      </Form>

      <button
        type="button"
        onClick={handleBack}
        className="font-sans text-xs text-planton-accent underline-offset-2 hover:underline"
      >
        Voltar
      </button>
    </AuthCard>
  )
}
