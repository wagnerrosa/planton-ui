'use client'

import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Camera } from 'lucide-react'
import { Body } from '@/components/primitives/Body'
import { Button } from '@/components/primitives/Button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/shadcn/sheet'
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

const profileSchema = z.object({
  fullName: z.string().min(1, 'Nome completo é obrigatório'),
  role: z.string().min(1, 'Cargo é obrigatório'),
  phone: z.string().optional(),
  gender: z.string().optional(),
  birthDate: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

type ProfileSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  userName?: string
  userAvatarUrl?: string
}

export function ProfileSheet({ open, onOpenChange, userName = 'Usuário', userAvatarUrl }: ProfileSheetProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: userName !== 'Usuário' ? userName : '',
      role: '',
      phone: '',
      gender: '',
      birthDate: '',
    },
  })

  function onSubmit() {
    onOpenChange(false)
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setAvatarPreview(url)
  }

  const displayAvatar = avatarPreview || userAvatarUrl
  const initials = userName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[420px] p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-0">
          <SheetTitle className="font-heading text-lg">Meu perfil</SheetTitle>
        </SheetHeader>

        {/* Avatar upload */}
        <div className="flex flex-col items-center gap-2 px-6 pt-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative group w-20 h-20 rounded-full overflow-hidden bg-sidebar-accent"
          >
            {displayAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={displayAvatar} alt={userName} className="w-full h-full object-cover" />
            ) : (
              <span className="flex items-center justify-center w-full h-full font-mono text-xl font-medium text-sidebar-foreground/80 select-none">
                {initials}
              </span>
            )}
            <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="h-5 w-5 text-white" />
            </span>
          </button>
          <span className="font-mono text-[0.625rem] text-planton-muted uppercase tracking-[0.08em]">
            Alterar foto
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
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
                        className="w-full border-b border-border bg-transparent py-2 font-sans text-sm text-foreground outline-none focus:border-planton-accent transition-colors"
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
                        className="w-full border-b border-border bg-transparent py-2 font-sans text-sm text-foreground outline-none focus:border-planton-accent transition-colors"
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
                        className="w-full border-b border-border bg-transparent py-2 font-sans text-sm text-foreground outline-none focus:border-planton-accent transition-colors"
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
                        <SelectTrigger className="border-0 border-b border-border rounded-none bg-transparent px-0 py-2 font-sans text-sm text-foreground shadow-none focus:ring-0">
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
                      Esta informação é opcional e será usada exclusivamente para relatórios de diversidade no formato GRI 404.
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
                        className="w-full border-b border-border bg-transparent py-2 font-sans text-sm text-foreground outline-none focus:border-planton-accent transition-colors"
                      />
                    </FormControl>
                    <Body size="sm" muted className="!text-[0.7rem] !leading-snug">
                      Esta informação é opcional e será usada exclusivamente para relatórios de diversidade no formato GRI 404.
                    </Body>
                  </FormItem>
                )}
              />

              <Button variant="primary" className="w-full justify-center mt-4">
                Salvar
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
