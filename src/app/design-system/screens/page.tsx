import { ExternalLink } from 'lucide-react'
import { Heading } from '@/components/primitives/Heading'
import { Eyebrow } from '@/components/primitives/Eyebrow'
import { Body } from '@/components/primitives/Body'

const LOGIN_STEPS = [
  { step: 'login',                label: 'Login' },
  { step: 'forgot-password',      label: 'Esqueci a senha' },
  { step: 'reset-password-sent',  label: 'E-mail enviado' },
  { step: 'email-entry',          label: 'Entrada por e-mail' },
  { step: 'otp-verification',     label: 'Verificação OTP' },
  { step: 'domain-active',        label: 'Domínio ativo' },
  { step: 'domain-inactive',      label: 'Domínio inativo' },
  { step: 'domain-unknown',       label: 'Domínio desconhecido' },
  { step: 'access-denied',        label: 'Acesso negado' },
  { step: 'profile-form',         label: 'Formulário de perfil' },
  { step: 'set-password',         label: 'Definir senha' },
  { step: 'onboarding',           label: 'Onboarding' },
  { step: 'success',              label: 'Sucesso' },
]

const screens = [
  {
    product: 'Academy - Aluno',
    items: [
      { href: '/design-system/screens/academy/login',           label: 'Login',    description: 'Tela de autenticação' },
      { href: '/design-system/screens/academy/home',            label: 'Home',     description: 'Listagem de trilhas e cursos' },
      { href: '/design-system/screens/academy/trilhas',         label: 'Trilhas',  description: 'Listagem de trilhas disponíveis com gutters laterais' },
      { href: '/design-system/screens/academy/trail/trail-1',   label: 'Trilha',   description: 'Player de trilha com sidebar de conteúdos e certificado' },
      { href: '/design-system/screens/academy/content/c1',      label: 'Conteúdo', description: 'Tela individual de conteúdo' },
    ],
  },
  {
    product: 'Academy - Gestor Master',
    items: [
      { href: '/design-system/screens/academy/gm', label: 'Dashboard GM', description: 'KPIs da empresa, colaboradores, trilhas e chart de engajamento' },
    ],
  },
  {
    product: 'Academy - Super Admin',
    items: [
      { href: '/design-system/screens/academy/admin',             label: 'Dashboard',  description: 'KPIs globais e resumo da plataforma' },
      { href: '/design-system/screens/academy/admin/clients',     label: 'Clientes',   description: 'Gestão de empresas e membros' },
      { href: '/design-system/screens/academy/admin/clients/c1',  label: 'Detalhe do Cliente', description: 'Membros, domínios e KPIs do cliente' },
      { href: '/design-system/screens/academy/admin/vouchers',    label: 'Vouchers',   description: 'Gestão de vouchers de ativação' },
      { href: '/design-system/screens/academy/admin/content',     label: 'Conteúdo',   description: 'Catálogo de conteúdos' },
      { href: '/design-system/screens/academy/admin/trails',      label: 'Trilhas',    description: 'CRUD de trilhas com criação em etapas' },
    ],
  },
  {
    product: 'Academy - Patterns',
    items: [
      { href: '/design-system/screens/academy/patterns/ai-tutor',  label: 'AI Tutor',  description: 'Assistente de IA flutuante com painel de chat (glassmorphism)' },
      { href: '/design-system/screens/academy/patterns/trail-card', label: 'TrailCard', description: 'Card de trilha duas colunas com imagem bioma e CTA overlay' },
    ],
  },
  {
    product: 'Mostra Sua Pegada',
    items: [
      { href: '/design-system/screens/mostra/login',            label: 'Login',        description: 'Tela de autenticação do admin' },
      { href: '/design-system/screens/mostra/dashboard',        label: 'Dashboard',    description: 'KPIs, gráficos de solicitantes e pendências' },
      { href: '/design-system/screens/mostra/empresas',         label: 'Empresas',     description: 'Listagem de empresas com filtros e detalhes' },
      { href: '/design-system/screens/mostra/fornecedores',     label: 'Fornecedores', description: 'Listagem de fornecedores e consultorias' },
      { href: '/design-system/screens/mostra/cadastro-manual',  label: 'Cadastro Manual', description: 'Formulário de cadastro empresa/fornecedor' },
      { href: '/design-system/screens/mostra/configuracoes',    label: 'Configurações', description: 'Setores, clientes e consultorias' },
      { href: '/design-system/screens/mostra/relatorio',        label: 'Relatório',    description: 'Downloads de relatórios em Excel' },
    ],
  },
]

export default function ScreensPage() {
  return (
    <main className="min-h-screen bg-surface-default max-w-[1400px] mx-auto px-6 py-16 flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <Eyebrow>Screens</Eyebrow>
        <Heading as="h1" size="heading-xl">Screens</Heading>
        <Body muted className="max-w-2xl">
          Telas reais dos produtos Planton. Cada screen compõe componentes do design system para formar interfaces completas.
        </Body>
      </div>

      {screens.map((product) => (
        <section key={product.product} className="flex flex-col gap-4">
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">{product.product}</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 overflow-hidden border-t border-l border-border">
            {product.items.map((item) => (
              <div key={item.href} className="border-r border-b border-border p-6 flex flex-col gap-3">
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col gap-1"
                >
                  <span className="flex items-center gap-2 font-sans text-base font-medium text-foreground group-hover:text-planton-accent transition-colors">
                    {item.label}
                    <ExternalLink size={13} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                  </span>
                  <span className="text-sm text-planton-muted leading-[1.65]">{item.description}</span>
                </a>
                {item.label === 'Login' && (
                  <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1 border-t border-border">
                    {LOGIN_STEPS.map(({ step, label }) => (
                      <a
                        key={step}
                        href={`${item.href}?step=${step}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-planton-muted hover:text-planton-accent transition-colors"
                      >
                        {label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}
