'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { Heading } from '@/components/primitives/Heading'
import { Eyebrow } from '@/components/primitives/Eyebrow'
import { Label } from '@/components/primitives/Label'
import { Button } from '@/components/primitives/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/shadcn/input'
import { Textarea } from '@/components/shadcn/textarea'
import { Badge } from '@/components/shadcn/badge'
import { Separator } from '@/components/shadcn/separator'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/shadcn/tabs'

// New components
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/shadcn/form'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/shadcn/input-otp'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'
import { Checkbox } from '@/components/shadcn/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/shadcn/radio-group'
import { Switch } from '@/components/shadcn/switch'
import { Alert, AlertDescription, AlertTitle } from '@/components/shadcn/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/shadcn/alert-dialog'
import { Progress } from '@/components/shadcn/progress'
import { Slider } from '@/components/shadcn/slider'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/shadcn/pagination'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/shadcn/hover-card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/shadcn/popover'
import { Calendar } from '@/components/shadcn/calendar'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/shadcn/command'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/shadcn/breadcrumb'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/shadcn/collapsible'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/shadcn/accordion'
import { Label as ShadcnLabel } from '@/components/shadcn/label'
import { AlertCircle, Info, ChevronDown } from 'lucide-react'

// Form schema
const profileSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  cargo: z.string().min(2, 'Cargo deve ter ao menos 2 caracteres'),
})
type ProfileForm = z.infer<typeof profileSchema>

export default function ComponentsPage() {
  const [sliderValue, setSliderValue] = useState([1])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [collapsibleOpen, setCollapsibleOpen] = useState(false)

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { nome: '', cargo: '' },
  })

  function onProfileSubmit(values: ProfileForm) {
    toast.success(`Perfil de ${values.nome} salvo com sucesso`)
  }

  return (
    <main className="min-h-screen bg-surface-default max-w-[1400px] mx-auto px-6 py-16 flex flex-col gap-20">
      <div className="flex flex-col gap-2">
        <Eyebrow>Catalog</Eyebrow>
        <Heading as="h1" size="heading-xl">Componentes</Heading>
      </div>

      {/* Button */}
      <section className="flex flex-col gap-6">
        <Label>Button</Label>
        <Separator />
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary">Primary</Button>
          <div className="bg-planton-forest p-4">
            <Button variant="primary-dark">Primary Dark</Button>
          </div>
          <Button variant="primary" disabled>Disabled</Button>
        </div>
      </section>

      {/* Card */}
      <section className="flex flex-col gap-6">
        <Label>Card</Label>
        <Separator />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 overflow-hidden border-t border-l border-border">
          <Card index="01" headline="Gestão de Insumos" description="Controle de estoque e pedidos integrados à sua operação." ctaLabel="Saiba mais" />
          <Card index="02" headline="Monitoramento de Lavoura" description="Dados em tempo real para decisões mais rápidas." ctaLabel="Ver demo" />
          <Card index="03" headline="Análise de Solo" description="Laudos digitais e recomendações de correção." ctaLabel="Explorar" />
        </div>
      </section>

      {/* Input / Textarea */}
      <section className="flex flex-col gap-6">
        <Label>Input / Textarea</Label>
        <Separator />
        <div className="flex flex-col gap-4 max-w-sm">
          <Input placeholder="Digite seu nome" className="rounded-none border-border focus-visible:ring-0 focus-visible:outline focus-visible:outline-1 focus-visible:outline-planton-accent" />
          <Textarea placeholder="Mensagem..." className="rounded-none border-border focus-visible:ring-0 focus-visible:outline focus-visible:outline-1 focus-visible:outline-planton-accent" />
        </div>
      </section>

      {/* Badge */}
      <section className="flex flex-col gap-6">
        <Label>Badge</Label>
        <Separator />
        <div className="flex flex-wrap gap-3">
          <Badge className="rounded-none bg-planton-accent text-planton-ink font-mono text-xs">Ativo</Badge>
          <Badge variant="outline" className="rounded-none border-border font-mono text-xs text-planton-muted">Pendente</Badge>
          <Badge variant="destructive" className="rounded-none font-mono text-xs">Erro</Badge>
        </div>
      </section>

      {/* Tabs */}
      <section className="flex flex-col gap-6">
        <Label>Tabs</Label>
        <Separator />
        <Tabs defaultValue="overview" className="max-w-lg">
          <TabsList className="rounded-none bg-surface-card gap-0 p-0">
            <TabsTrigger value="overview" className="rounded-none font-mono text-xs uppercase tracking-[0.05em]">Visão Geral</TabsTrigger>
            <TabsTrigger value="details"  className="rounded-none font-mono text-xs uppercase tracking-[0.05em]">Detalhes</TabsTrigger>
            <TabsTrigger value="history"  className="rounded-none font-mono text-xs uppercase tracking-[0.05em]">Histórico</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="pt-4 font-sans text-sm text-planton-muted leading-[1.65]">
            Resumo da operação atual com principais métricas.
          </TabsContent>
          <TabsContent value="details" className="pt-4 font-sans text-sm text-planton-muted leading-[1.65]">
            Detalhes técnicos e configurações avançadas.
          </TabsContent>
          <TabsContent value="history" className="pt-4 font-sans text-sm text-planton-muted leading-[1.65]">
            Registro de ações e alterações recentes.
          </TabsContent>
        </Tabs>
      </section>

      {/* Form */}
      <section className="flex flex-col gap-6">
        <Label>Form</Label>
        <Separator />
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

      {/* Input OTP */}
      <section className="flex flex-col gap-6">
        <Label>Input OTP</Label>
        <Separator />
        <div className="flex flex-col gap-3">
          <ShadcnLabel className="text-sm font-medium text-foreground">Código de verificação</ShadcnLabel>
          <InputOTP maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <p className="text-sm text-muted-foreground">Digite o código enviado para seu e-mail corporativo.</p>
        </div>
      </section>

      {/* Select */}
      <section className="flex flex-col gap-6">
        <Label>Select</Label>
        <Separator />
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col gap-2 w-56">
            <ShadcnLabel className="text-sm font-medium text-foreground">Cargo / Função</ShadcnLabel>
            <Select>
              <SelectTrigger className="rounded-none border-border">
                <SelectValue placeholder="Selecione o cargo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="analista">Analista</SelectItem>
                <SelectItem value="coordenador">Coordenador</SelectItem>
                <SelectItem value="gerente">Gerente</SelectItem>
                <SelectItem value="diretor">Diretor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2 w-56">
            <ShadcnLabel className="text-sm font-medium text-foreground">Status do Voucher</ShadcnLabel>
            <Select>
              <SelectTrigger className="rounded-none border-border">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="usado">Usado</SelectItem>
                <SelectItem value="expirado">Expirado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Checkbox */}
      <section className="flex flex-col gap-6">
        <Label>Checkbox</Label>
        <Separator />
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <Checkbox id="termos" />
            <ShadcnLabel htmlFor="termos" className="text-sm text-foreground leading-snug cursor-pointer">
              Aceito os termos de uso e política de privacidade
            </ShadcnLabel>
          </div>
          <div className="flex items-start gap-3">
            <Checkbox id="gri" />
            <ShadcnLabel htmlFor="gri" className="text-sm text-foreground leading-snug cursor-pointer">
              Autorizo o uso dos dados para relatórios GRI 404 (opcional)
            </ShadcnLabel>
          </div>
        </div>
      </section>

      {/* Radio Group */}
      <section className="flex flex-col gap-6">
        <Label>Radio Group</Label>
        <Separator />
        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium text-foreground">O que significa GHG Protocol?</p>
          <RadioGroup defaultValue="b" className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <RadioGroupItem value="a" id="r-a" />
              <ShadcnLabel htmlFor="r-a" className="text-sm text-foreground cursor-pointer">A. Protocolo de gestão hídrica global</ShadcnLabel>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="b" id="r-b" />
              <ShadcnLabel htmlFor="r-b" className="text-sm text-foreground cursor-pointer">B. Padrão para inventário de gases de efeito estufa</ShadcnLabel>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="c" id="r-c" />
              <ShadcnLabel htmlFor="r-c" className="text-sm text-foreground cursor-pointer">C. Regulamento de emissões industriais da ONU</ShadcnLabel>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="d" id="r-d" />
              <ShadcnLabel htmlFor="r-d" className="text-sm text-foreground cursor-pointer">D. Índice de desempenho ambiental corporativo</ShadcnLabel>
            </div>
          </RadioGroup>
        </div>
      </section>

      {/* Switch */}
      <section className="flex flex-col gap-6">
        <Label>Switch</Label>
        <Separator />
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Switch id="quiz-switch" defaultChecked />
            <ShadcnLabel htmlFor="quiz-switch" className="text-sm text-foreground cursor-pointer">Quiz habilitado para esta trilha</ShadcnLabel>
          </div>
          <div className="flex items-center gap-3">
            <Switch id="visibility-switch" />
            <ShadcnLabel htmlFor="visibility-switch" className="text-sm text-foreground cursor-pointer">Trilha visível para todos os clientes</ShadcnLabel>
          </div>
        </div>
      </section>

      {/* Alert */}
      <section className="flex flex-col gap-6">
        <Label>Alert</Label>
        <Separator />
        <div className="flex flex-col gap-4 max-w-xl">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Acesso não ativado</AlertTitle>
            <AlertDescription>
              Sua empresa ainda não tem acesso ativo ao Planton Academy.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Código inválido</AlertTitle>
            <AlertDescription>
              Código inválido ou expirado.
            </AlertDescription>
          </Alert>
          <Alert>
            <AlertDescription>
              O GRI 404 aborda treinamento e educação, incluindo horas médias de treinamento por colaborador e programas de aprimoramento de habilidades.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Alert Dialog */}
      <section className="flex flex-col gap-6">
        <Label>Alert Dialog</Label>
        <Separator />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="primary">Revogar voucher</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Revogar voucher?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. O voucher será invalidado imediatamente e o colaborador perderá o acesso ao conteúdo vinculado.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction>Revogar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>

      {/* Sonner */}
      <section className="flex flex-col gap-6">
        <Label>Sonner</Label>
        <Separator />
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" onClick={() => toast.success('Certificado emitido com sucesso')}>
            Toast: sucesso
          </Button>
          <Button variant="primary" onClick={() => toast.info('Conteúdo salvo e agendado para publicação')}>
            Toast: informação
          </Button>
          <Button variant="primary" onClick={() => toast.error('Erro ao validar domínio')}>
            Toast: erro
          </Button>
        </div>
      </section>

      {/* Progress */}
      <section className="flex flex-col gap-6">
        <Label>Progress</Label>
        <Separator />
        <div className="flex flex-col gap-5 max-w-xl">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground">Trilha: Gestão de Emissões de GEE</span>
              <span className="text-sm text-muted-foreground">65%</span>
            </div>
            <Progress value={65} />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground">Trilha: Fundamentos ESG</span>
              <Badge className="rounded-none bg-planton-accent text-planton-ink font-mono text-xs">Concluída</Badge>
            </div>
            <Progress value={100} />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground">Trilha: GHG Protocol Avançado</span>
              <span className="text-sm text-muted-foreground">20%</span>
            </div>
            <Progress value={20} />
          </div>
        </div>
      </section>

      {/* Slider */}
      <section className="flex flex-col gap-6">
        <Label>Slider</Label>
        <Separator />
        <div className="flex flex-col gap-3 max-w-sm">
          <div className="flex justify-between items-center">
            <ShadcnLabel className="text-sm font-medium text-foreground">Velocidade de reprodução</ShadcnLabel>
            <span className="text-sm text-muted-foreground">{sliderValue[0]}x</span>
          </div>
          <Slider
            min={0.5}
            max={2}
            step={0.25}
            value={sliderValue}
            onValueChange={setSliderValue}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0.5x</span>
            <span>2x</span>
          </div>
        </div>
      </section>

      {/* Table */}
      <section className="flex flex-col gap-6">
        <Label>Table</Label>
        <Separator />
        <div className="border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground font-mono text-xs uppercase tracking-widest">Colaborador</TableHead>
                <TableHead className="text-muted-foreground font-mono text-xs uppercase tracking-widest">Trilha</TableHead>
                <TableHead className="text-muted-foreground font-mono text-xs uppercase tracking-widest">Progresso</TableHead>
                <TableHead className="text-muted-foreground font-mono text-xs uppercase tracking-widest">Certificado</TableHead>
                <TableHead className="text-muted-foreground font-mono text-xs uppercase tracking-widest">Último acesso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-border">
                <TableCell className="text-sm text-foreground">Ana Beatriz Silva</TableCell>
                <TableCell className="text-sm text-foreground">Gestão de Emissões de GEE</TableCell>
                <TableCell className="text-sm text-foreground">65%</TableCell>
                <TableCell><Badge variant="outline" className="rounded-none border-border font-mono text-xs text-muted-foreground">Pendente</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">14 mar 2026</TableCell>
              </TableRow>
              <TableRow className="border-border">
                <TableCell className="text-sm text-foreground">Carlos Eduardo Mota</TableCell>
                <TableCell className="text-sm text-foreground">Fundamentos ESG</TableCell>
                <TableCell className="text-sm text-foreground">100%</TableCell>
                <TableCell><Badge className="rounded-none bg-planton-accent text-planton-ink font-mono text-xs">Emitido</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">10 mar 2026</TableCell>
              </TableRow>
              <TableRow className="border-border">
                <TableCell className="text-sm text-foreground">Fernanda Lima</TableCell>
                <TableCell className="text-sm text-foreground">GHG Protocol Avançado</TableCell>
                <TableCell className="text-sm text-foreground">20%</TableCell>
                <TableCell><Badge variant="outline" className="rounded-none border-border font-mono text-xs text-muted-foreground">Pendente</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">15 mar 2026</TableCell>
              </TableRow>
              <TableRow className="border-border">
                <TableCell className="text-sm text-foreground">Rafael Gonçalves</TableCell>
                <TableCell className="text-sm text-foreground">Relatórios GRI 400</TableCell>
                <TableCell className="text-sm text-foreground">100%</TableCell>
                <TableCell><Badge className="rounded-none bg-planton-accent text-planton-ink font-mono text-xs">Emitido</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">12 mar 2026</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Dropdown Menu */}
      <section className="flex flex-col gap-6">
        <Label>Dropdown Menu</Label>
        <Separator />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="primary">Ações</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuItem>Revogar voucher</DropdownMenuItem>
            <DropdownMenuItem>Reativar empresa</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">Excluir</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>

      {/* Pagination */}
      <section className="flex flex-col gap-6">
        <Label>Pagination</Label>
        <Separator />
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">4</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">5</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">10</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </section>

      {/* Scroll Area */}
      <section className="flex flex-col gap-6">
        <Label>Scroll Area</Label>
        <Separator />
        <ScrollArea className="h-48 w-72 border border-border p-4">
          <div className="flex flex-col gap-2">
            {[
              'Ana Beatriz Silva',
              'Carlos Eduardo Mota',
              'Fernanda Lima',
              'Rafael Gonçalves',
              'Juliana Pereira',
              'Marcos Oliveira',
              'Patrícia Almeida',
              'Bruno Nascimento',
              'Camila Rocha',
              'Diego Ferreira',
              'Larissa Santos',
              'Thiago Monteiro',
            ].map((name) => (
              <p key={name} className="text-sm text-foreground border-b border-border pb-2 last:border-0">
                {name}
              </p>
            ))}
          </div>
        </ScrollArea>
      </section>

      {/* Avatar */}
      <section className="flex flex-col gap-6">
        <Label>Avatar</Label>
        <Separator />
        <div className="flex flex-wrap gap-6 items-center">
          <div className="flex flex-col gap-2 items-center">
            <Avatar>
              <AvatarImage src="https://placehold.co/40x40/png" alt="Colaborador" />
              <AvatarFallback>CO</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">Com imagem</span>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <Avatar>
              <AvatarFallback>WR</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">Wagner Rosa</span>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="text-lg">SA</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">SA — maior</span>
          </div>
        </div>
      </section>

      {/* Hover Card */}
      <section className="flex flex-col gap-6">
        <Label>Hover Card</Label>
        <Separator />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Conteúdo vinculado:</span>
          <HoverCard>
            <HoverCardTrigger asChild>
              <button className="text-sm text-foreground underline underline-offset-4 cursor-pointer hover:text-muted-foreground transition-colors">
                Gestão de Emissões de GEE
              </button>
            </HoverCardTrigger>
            <HoverCardContent className="w-72">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-foreground">Gestão de Emissões de GEE</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Trilha completa sobre inventário e gestão de gases de efeito estufa seguindo o GHG Protocol.
                </p>
                <div className="flex gap-4 pt-1">
                  <span className="text-xs text-muted-foreground">Duração: 4h 30min</span>
                  <span className="text-xs text-muted-foreground">12 conteúdos</span>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </section>

      {/* Popover */}
      <section className="flex flex-col gap-6">
        <Label>Popover</Label>
        <Separator />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="primary">Filtrar por status</Button>
          </PopoverTrigger>
          <PopoverContent className="w-52" align="start">
            <div className="flex flex-col gap-3">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Status</p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Checkbox id="f-ativo" />
                  <ShadcnLabel htmlFor="f-ativo" className="text-sm text-foreground cursor-pointer">Ativo</ShadcnLabel>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="f-inativo" />
                  <ShadcnLabel htmlFor="f-inativo" className="text-sm text-foreground cursor-pointer">Inativo</ShadcnLabel>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="f-pendente" />
                  <ShadcnLabel htmlFor="f-pendente" className="text-sm text-foreground cursor-pointer">Pendente</ShadcnLabel>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </section>

      {/* Calendar */}
      <section className="flex flex-col gap-6">
        <Label>Calendar</Label>
        <Separator />
        <div className="flex flex-col gap-3">
          <ShadcnLabel className="text-sm font-medium text-foreground">Agendar publicação do conteúdo</ShadcnLabel>
          <div className="border border-border w-fit">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
            />
          </div>
          {selectedDate && (
            <p className="text-sm text-muted-foreground">
              Data selecionada: {selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          )}
        </div>
      </section>

      {/* Command */}
      <section className="flex flex-col gap-6">
        <Label>Command</Label>
        <Separator />
        <div className="border border-border max-w-sm">
          <Command>
            <CommandInput placeholder="Buscar conteúdo ou trilha..." />
            <CommandList>
              <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
              <CommandGroup heading="Trilhas">
                <CommandItem>Gestão de Emissões de GEE</CommandItem>
                <CommandItem>Fundamentos ESG</CommandItem>
                <CommandItem>GHG Protocol Avançado</CommandItem>
              </CommandGroup>
              <CommandGroup heading="Conteúdos">
                <CommandItem>Introdução ao Inventário de GEE</CommandItem>
                <CommandItem>Relatórios GRI 404 na Prática</CommandItem>
                <CommandItem>Escopo 1, 2 e 3 — Diferenças</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="flex flex-col gap-6">
        <Label>Breadcrumb</Label>
        <Separator />
        <div className="flex flex-col gap-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Trilhas</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Gestão de Emissões de GEE</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Admin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Clientes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Empresa XPTO</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Usuários</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>

      {/* Collapsible */}
      <section className="flex flex-col gap-6">
        <Label>Collapsible</Label>
        <Separator />
        <Collapsible
          open={collapsibleOpen}
          onOpenChange={setCollapsibleOpen}
          className="border border-border max-w-sm"
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors">
            Configurações avançadas da trilha
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${collapsibleOpen ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="border-t border-border px-4 py-4 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Switch id="col-quiz" defaultChecked />
                <ShadcnLabel htmlFor="col-quiz" className="text-sm text-foreground cursor-pointer">Quiz habilitado</ShadcnLabel>
              </div>
              <div className="flex flex-col gap-2">
                <ShadcnLabel className="text-sm font-medium text-foreground">Visibilidade</ShadcnLabel>
                <Select>
                  <SelectTrigger className="rounded-none border-border">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os clientes</SelectItem>
                    <SelectItem value="selecionados">Clientes selecionados</SelectItem>
                    <SelectItem value="privado">Privado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <ShadcnLabel className="text-sm font-medium text-foreground">Status</ShadcnLabel>
                <Select>
                  <SelectTrigger className="rounded-none border-border">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rascunho">Rascunho</SelectItem>
                    <SelectItem value="publicado">Publicado</SelectItem>
                    <SelectItem value="arquivado">Arquivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </section>

      {/* Accordion */}
      <section className="flex flex-col gap-6">
        <Label>Accordion</Label>
        <Separator />
        <Accordion type="single" collapsible className="max-w-xl border border-border divide-y divide-border">
          <AccordionItem value="cert" className="border-0 px-4">
            <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline">
              Como funciona a certificação?
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
              Ao concluir todos os conteúdos e obter aprovação no quiz final com nota mínima de 70%, o certificado é emitido automaticamente e disponibilizado na sua área do aluno.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="quiz" className="border-0 px-4">
            <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline">
              O que acontece se eu não passar no quiz?
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
              Você pode refazer o quiz quantas vezes precisar, sem restrição de tentativas. Recomendamos revisar os conteúdos da trilha antes de tentar novamente.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="offline" className="border-0 px-4">
            <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline">
              Posso acessar os conteúdos offline?
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
              No momento, o Planton Academy requer conexão com a internet para reprodução dos conteúdos. O suporte a modo offline está previsto para versões futuras da plataforma.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </main>
  )
}
