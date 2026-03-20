'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Heading } from '@/components/primitives/Heading'
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
import type { AuthStep } from '../LoginFlow'

const passwordSchema = z
  .object({
    password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type PasswordFormValues = z.infer<typeof passwordSchema>

type SetPasswordStepProps = {
  onNavigate: (step: AuthStep) => void
}

export function SetPasswordStep({ onNavigate }: SetPasswordStepProps) {
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  function onSubmit() {
    onNavigate('otp-verification')
  }

  return (
    <AuthCard>
      <div className="flex flex-col gap-2">
        <AcademyLogo />
        <Heading as="h1" size="heading-lg">Defina sua senha</Heading>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono text-xs uppercase tracking-[0.05em] text-planton-muted">
                  Nova senha
                </FormLabel>
                <FormControl>
                  <input
                    {...field}
                    type="password"
                    className="w-full border-b border-border bg-transparent py-2 font-sans text-sm text-planton-forest outline-none focus:border-planton-accent transition-colors"
                    placeholder="••••••••"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono text-xs uppercase tracking-[0.05em] text-planton-muted">
                  Confirmar senha
                </FormLabel>
                <FormControl>
                  <input
                    {...field}
                    type="password"
                    className="w-full border-b border-border bg-transparent py-2 font-sans text-sm text-planton-forest outline-none focus:border-planton-accent transition-colors"
                    placeholder="••••••••"
                  />
                </FormControl>
                <FormMessage />
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
        onClick={() => onNavigate('profile-form')}
        className="font-sans text-xs text-planton-accent underline-offset-2 hover:underline"
      >
        Voltar
      </button>
    </AuthCard>
  )
}
