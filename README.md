# Planton UI

Design system do **Planton Academy V2** - plataforma educacional B2B focada em sustentabilidade, gestão de emissões de GEE e ESG.

Este repositório centraliza tokens de design, componentes e padrões de tela usados em todos os produtos Planton. O objetivo é garantir consistência visual e acelerar o desenvolvimento da plataforma.

---

## Stack

| Tecnologia | Versão |
|---|---|
| Next.js (App Router) | 16 |
| React | 19 |
| Tailwind CSS | 4 |
| shadcn/ui (Radix UI) | latest |
| TypeScript | 5 |
| next-themes | dark mode |
| react-hook-form + zod | formulários |
| sonner | toasts |

---

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000/` para visualizar o design system completo.

---

## Estrutura do projeto

```
src/
├── app/
│   ├── design-system/
│   │   ├── page.tsx                    # Índice do design system
│   │   ├── colors/                     # Paleta, tokens e dark mode
│   │   ├── typography/                 # Escalas tipográficas
│   │   ├── components/
│   │   │   ├── page.tsx                # Índice de componentes por categoria
│   │   │   ├── button/                 # Button (standalone)
│   │   │   ├── inputs/                 # Inputs & Forms (9 componentes)
│   │   │   ├── data-display/           # Data Display (5 componentes)
│   │   │   ├── feedback/               # Feedback (3 componentes)
│   │   │   ├── navigation/             # Navigation (4 componentes)
│   │   │   ├── overlays/               # Overlays (4 componentes)
│   │   │   └── layout/                 # Layout & Structure (3 componentes)
│   │   └── patterns/                   # Padrões de tela (em construção)
│   └── layout.tsx                      # ThemeProvider + Toaster
│
├── components/
│   ├── navigation/                     # Componentes de navegação
│   │   ├── DesignSystemSidebar.tsx     # Sidebar do design system
│   │   ├── AcademyNavbar.tsx           # Navbar responsiva do Academy (exports: ThemeToggleButton, UserAvatar)
│   │   ├── AcademyNavbarContext.tsx    # Context para breadcrumbs dinâmicos
│   │   ├── AcademyNavbarSync.tsx       # Componente invisível para injetar breadcrumbs
│   │   ├── AcademySidebar.tsx          # Sidebar do Academy (push desktop / overlay mobile)
│   │   └── AcademyFooter.tsx           # Footer do Academy (default + overlay variants)
│   ├── primitives/                     # Componentes próprios base
│   │   ├── Button.tsx
│   │   ├── Heading.tsx
│   │   ├── Body.tsx
│   │   ├── Eyebrow.tsx
│   │   └── Label.tsx
│   ├── ui/                             # Componentes UI compostos
│   │   ├── Card.tsx
│   │   ├── ComponentPage.tsx
│   │   ├── CourseGrid.tsx
│   │   ├── Surface.tsx
│   │   ├── ThemeProvider.tsx
│   │   └── ThemeToggle.tsx
│   └── shadcn/                         # Componentes shadcn/ui
│
├── hooks/
│   └── use-mobile.tsx                  # Hook para detecção de viewport mobile
│
├── lib/
│   └── components-registry.ts          # Registro central de componentes e categorias
│
├── screens/
│   └── academy/
│       ├── auth/
│       │   ├── LoginFlow.tsx           # Fluxo de autenticação multi-step
│       │   ├── LoginScreen.tsx         # Tela de login estática (legado)
│       │   └── steps/                  # 12 step components do fluxo (onboarding movido para Home)
│       ├── home/
│       │   ├── HomeScreen.tsx          # Home do Academy (hero + content rows + onboarding dialog)
│       │   ├── mock-data.ts            # Dados mockados (trilhas, conteúdos)
│       │   └── components/
│       │       ├── HeroContent.tsx         # Banner hero com conteúdo em destaque
│       │       ├── ContentRow.tsx          # Row horizontal de cards de conteúdo (loop opcional)
│       │       ├── ContentCard.tsx         # Card de conteúdo (vídeo, podcast, artigo)
│       │       ├── ContentTypeIcon.tsx     # Ícone por tipo de conteúdo
│       │       ├── ContinueTrailsCard.tsx  # Lista de trilhas em andamento com progress bars
│       │       └── OnboardingDialog.tsx    # Dialog de boas-vindas com vídeo (abre ao entrar na Home)
│       ├── trail/
│       │   └── TrailScreen.tsx         # Tela de trilha (lista de conteúdos)
│       └── content/
│           └── ContentScreen.tsx       # Player de conteúdo (vídeo/podcast/artigo)
│
└── styles/
    ├── theme.css                       # Tokens de design (cores, bordas, superfícies)
    └── globals.css                     # Base CSS
```

---

## Tokens de design

Definidos em `src/styles/theme.css`, adaptam automaticamente entre light e dark mode.

### Cores da marca

| Token | Descrição |
|---|---|
| `planton-accent` | Verde lima - cor principal de destaque e CTAs |
| `planton-forest` | Verde escuro - texto principal no light mode |
| `planton-cream` | Creme - texto em superfícies escuras |
| `planton-muted` | Cinza - texto secundário |
| `planton-ink` | Tinta escura - texto sobre accent |

### Tokens semânticos

| Token | Light | Dark |
|---|---|---|
| `--background` | Branco puro | Cinza muito escuro |
| `--card` | Branco | Cinza escuro |
| `--border` | Cinza claro | Branco 10% |
| `--foreground` | `planton-forest` | Branco |

> **Regra:** sempre use tokens semânticos (`bg-card`, `border-border`, `text-foreground`) - nunca cores hardcoded como `bg-white` ou `border-gray-200`. Isso garante que o dark mode funcione automaticamente.

---

## Componentes

### Primitivos (`src/components/primitives/`)

Construídos do zero, sem dependência de shadcn.

**Button**
```tsx
<Button variant="primary">Entrar</Button>
<Button variant="primary-dark">Entrar</Button>  // mesmo visual, para contextos escuros
<Button variant="icon">...</Button>
<Button href="/trilhas">Ver trilhas</Button>     // renderiza como <a>
```

**Tipografia**
```tsx
<Heading as="h1" size="heading-xl">Título</Heading>
<Body size="sm" muted>Texto secundário</Body>
<Eyebrow>Label pequeno em caps</Eyebrow>
<Label>Separador de seção</Label>
```

Escala de `Heading` com line-height por tamanho (definido em `src/tokens/typography.ts`):

| Tamanho | Font size | Line height |
|---|---|---|
| `display-xl` | 64–80px | 1.0 |
| `display-lg` | 48–70px | 1.0 |
| `heading-xl` | 40–56px | 1.05 |
| `heading-lg` | 28–36px | 1.15 |
| Body | — | 1.65 |

> Cada tamanho tem seu próprio `leading` — não use `leading-*` customizado em cima de `<Heading>`, pois o valor já está calibrado por tamanho.

### UI (`src/components/ui/`)

**Card** - componente central e reutilizável
```tsx
// Card estático com CTA
<Card
  index="01"
  headline="Gestão de Insumos"
  description="Controle de estoque integrado."
  ctaLabel="Saiba mais"
  href="/insumos"
/>

// Card inteiro clicável (para grids de navegação)
<Card
  cardHref="/design-system/colors"
  headline="Cores"
  description="Paleta e tokens de cor"
  ctaLabel="Ver"
/>

// Card com superfície escura
<Card surface="forest" headline="..." />
```

**Padrão de bordas em grids de cards:**
```tsx
// Container do grid
<div className="grid grid-cols-3 overflow-hidden border-t border-l border-border">
  <Card ... />  {/* border-r border-b automático */}
</div>
```

**CourseGrid** - grid de aulas para o Academy
```tsx
<CourseGrid lessons={[
  { id: '1', index: '01', title: 'Fundamentos do Solo', description: '...', href: '/aula/1' },
]} />
```

### shadcn (`src/components/shadcn/`)

29 componentes organizados em 6 categorias no design system:

| Categoria | Componentes |
|---|---|
| Inputs & Forms | Input, Textarea, Select, Checkbox, RadioGroup, Switch, Form, InputOTP, Slider |
| Data Display | Card, Table, Avatar, Badge, Progress |
| Feedback | Alert, AlertDialog, Sonner |
| Navigation | Tabs, Breadcrumb, Pagination, Command |
| Overlays | DropdownMenu, Popover, HoverCard, Calendar |
| Layout & Structure | Accordion, Collapsible, ScrollArea |

Cada componente tem sua própria página com exemplos visuais, descrição e **file path** no codebase. O registro centralizado está em `src/lib/components-registry.ts`.

---

## Telas (`src/screens/`)

Composições de tela completas - diferente de componentes, encapsulam layout e lógica de uma tela inteira.

### Home do Academy (`academy/home/`)

Tela principal do Academy. Composta por hero, seção de retomada de conteúdo, novidades e rows por trilha.

Acesse: `http://localhost:3000/design-system/screens/academy/home`

Dados mockados em `mock-data.ts` — nenhuma API é chamada.

#### Seções e lógica condicional

| Seção | Condição de exibição |
|---|---|
| Hero | Sempre visível |
| Continue assistindo | `CONTINUE_WATCHING_ITEMS.length > 0` (itens com `progress > 0 && < 100`) |
| Trilhas em andamento | `MOCK_TRAILS` com `status !== 'concluida' && progress > 0` |
| Novos conteúdos | `NEW_CONTENT_ITEMS.length > 0` (itens com `isNew: true`) |
| Rows por trilha | Trilhas com `status !== 'em-breve' && contents.length > 0` |
| Todos os conteúdos | Sempre visível |

#### Layout da seção de retomada (2 variantes)

**Variante A — usuário com trilhas em andamento:**
Layout de duas colunas separadas por divisor vertical. Esquerda (2/3): carousel "Continue assistindo". Direita (1/3): `ContinueTrailsCard` com progress bars das trilhas.

```
┌─────────────────────────────┬────────────────────┐
│  Continue assistindo        │ Trilhas em andamento│
│  [card] [card] [card] →     │ Trilha A ── 65%  → │
│                             │ Trilha B ── 55%  → │
│                             │ Trilha C ── 45%  → │
└─────────────────────────────┴────────────────────┘
```

**Variante B — usuário sem trilhas em andamento:**
`ContentRow` ocupa 100% da largura, sem divisor e sem `ContinueTrailsCard`.

#### ContinueTrailsCard

- Filtra trilhas com `status !== 'concluida' && progress > 0`
- Ordena por `progress DESC` (mais avançadas primeiro)
- Scroll interno limitado a ~5 itens visíveis; demais ficam ocultos
- Cada item: nome clicável com seta inline → navega para a trilha
- Progress bar usa `bg-planton-accent/10` no track (padrão do design system)

---

### Trilha (`academy/trail/`)

Tela de trilha com sidebar lateral (340px) e área de conteúdo.

- **Sidebar:** lista numerada de conteúdos com ícone de status (`concluido` / `visualizado` / pendente), Quiz e Certificado. Item ativo destacado com borda esquerda `planton-accent`.
- **Tipos de conteúdo:** `video` (MuxPlayer, aspect-ratio 16/9), `artigo` (texto centralizado), `podcast` (player de áudio em fundo colorido), `guia` (botão Abrir PDF no bloco de metadados)
- **Quiz:** navegação por questões com RadioGroup, progresso em `font-mono`, estado bloqueado/disponível/concluído
- **Certificado:** bloqueado até aprovação no quiz; ações de download PDF e compartilhar no LinkedIn
- **Progress bar:** usa `bg-planton-accent/10` no track para visibilidade em 0%

Acesse: `http://localhost:3000/design-system/screens/academy/trail/[id]`

IDs disponíveis nos mocks: `gestao-emissoes`, `fatores-emissao`, `relatorio-gee`

---

### Conteúdo (`academy/content/`)

Página standalone de conteúdo individual com comportamento por tipo:

| Tipo | Layout |
|---|---|
| `video` | MuxPlayer em cima + metadados abaixo |
| `podcast` | Player de áudio em fundo `planton-accent/10` + metadados abaixo |
| `artigo` | Metadados + corpo do artigo em sequência |
| `guia` | Metadados + botões "Abrir PDF" e "Continuar trilha" lado a lado |

- **TrailBadges:** usa `badgeVariants({ variant: 'outline' })` do design system, renderizado como `<Link>`
- **Fonte mono:** badges em Geist Mono (definido globalmente em `badgeVariants`)

Acesse: `http://localhost:3000/design-system/screens/academy/content/[id]`

IDs disponíveis: qualquer `id` dos `CONTENT_ITEMS` em `mock-data.ts`

---

### Fluxo de Autenticação (`academy/auth/`)

Fluxo multi-step completo com 12 steps gerenciados por `useState<AuthStep>` em `LoginFlow.tsx`.
O onboarding (vídeo de boas-vindas) foi movido para um Dialog na Home (`OnboardingDialog`).

| Step | Arquivo | Descrição |
|---|---|---|
| login | `LoginStep.tsx` | Login com e-mail + senha |
| access-denied | `AccessDeniedStep.tsx` | Domínio sem autorização (dead end) |
| forgot-password | `ForgotPasswordStep.tsx` | Solicitar recuperação de senha |
| reset-password-sent | `ResetPasswordSentStep.tsx` | Confirmação de envio |
| email-entry | `EmailEntryStep.tsx` | Dialog: e-mail corporativo + validação de domínio |
| domain-active | `DomainActiveStep.tsx` | Cenário A: empresa ativa → perfil |
| domain-inactive | `DomainInactiveStep.tsx` | Cenário B: empresa inativa → voucher |
| domain-unknown | `DomainUnknownStep.tsx` | Cenário C: empresa desconhecida (dead end) |
| profile-form | `ProfileFormStep.tsx` | Formulário de perfil (react-hook-form + zod) |
| set-password | `SetPasswordStep.tsx` | Definição de senha (react-hook-form + zod) |
| otp-verification | `OTPVerificationStep.tsx` | Código de 6 dígitos (InputOTP) |
| success | `SuccessStep.tsx` | Acesso liberado |

**Como testar o fluxo (sem backend)**

Acesse: `http://localhost:3000/design-system/screens/academy/login`

Todos os dados são simulados no frontend — nenhuma API é chamada.

---

#### Fluxo 1 — Login com credenciais inválidas

1. Digite qualquer texto que contenha a palavra `erro` no campo e-mail (ex: `erro@test.com`)
2. Digite qualquer senha
3. Clique em **Entrar**
4. ✅ Alert vermelho inline: *"E-mail ou senha incorretos"* — permanece na tela de login

---

#### Fluxo 2 — Login sem acesso autorizado

1. Digite qualquer texto que contenha a palavra `semacesso` no campo e-mail (ex: `semacesso@test.com`)
2. Digite qualquer senha
3. Clique em **Entrar**
4. ✅ Navega para **Acesso Negado** com opção de tentar outro e-mail

---

#### Fluxo 3 — Login bem-sucedido

1. Digite qualquer e-mail que não contenha `erro` nem `semacesso` (ex: `usuario@planton.com`)
2. Digite qualquer senha
3. Clique em **Entrar**
4. ✅ Navega direto para **Acesso liberado**

---

#### Fluxo 4 — Cadastro: Cenário A (domínio ativo)

1. Clique em **Criar novo cadastro** — abre o Dialog
2. Digite um e-mail terminando em `@empresa.com` (ex: `joao@empresa.com`)
3. Clique em **Verificar**
4. ✅ Navega para **Empresa encontrada** → redireciona automaticamente para o formulário de perfil
5. Preencha nome completo e cargo (obrigatórios) → **Continuar**
6. Defina uma senha (mín. 8 caracteres) e confirme → **Continuar**
7. Digite o código OTP `123456` → **Verificar**
8. ✅ Navega para **Acesso liberado**

---

#### Fluxo 5 — Cadastro: Cenário B (domínio inativo + voucher)

1. Clique em **Criar novo cadastro** — abre o Dialog
2. Digite um e-mail terminando em `@inativo.com` (ex: `maria@inativo.com`)
3. Clique em **Verificar**
4. ✅ Navega para **Ativar acesso** (empresa inativa)
5. Para testar **voucher válido**: digite `PLANTON-2026-ATIVO` → **Continuar** → segue para perfil
6. Para testar **voucher expirado**: digite `PLANTON-2026-EXPIRADO` → alert de código expirado
7. Para testar **voucher inválido**: digite qualquer outro valor → alert de código não associado

---

#### Fluxo 6 — Cadastro: Cenário C (domínio desconhecido)

1. Clique em **Criar novo cadastro** — abre o Dialog
2. Digite qualquer e-mail corporativo que não termine em `@empresa.com` ou `@inativo.com` (ex: `nome@outraempresa.com`)
3. Clique em **Verificar**
4. ✅ Navega para **Empresa não encontrada** (dead end) com link externo para o site

---

#### Fluxo 7 — Domínio genérico bloqueado

1. Clique em **Criar novo cadastro** — abre o Dialog
2. Digite um e-mail de provedor pessoal (ex: `usuario@gmail.com`, `contato@hotmail.com`)
3. ✅ Alert: *"Acesso exclusivo com e-mail corporativo"* — formulário não avança

---

#### Fluxo 8 — Recuperação de senha

1. Clique em **Esqueci minha senha**
2. Digite qualquer e-mail → **Enviar link**
3. ✅ Tela de confirmação com o e-mail digitado
4. Clique em **Voltar ao login**

---

#### Referência rápida de credenciais de teste

| Campo | Valor | Efeito |
|---|---|---|
| E-mail login | `erro@...` | Erro de credenciais |
| E-mail login | `semacesso@...` | Acesso negado |
| E-mail login | qualquer outro | Login direto (success) |
| E-mail cadastro | `@empresa.com` | Cenário A — domínio ativo |
| E-mail cadastro | `@inativo.com` | Cenário B — domínio inativo |
| E-mail cadastro | outro corporativo | Cenário C — domínio desconhecido |
| Voucher | `PLANTON-2026-ATIVO` | Ativa o acesso |
| Voucher | `PLANTON-2026-EXPIRADO` | Código expirado |
| Código OTP | `123456` | Verificação concluída → acesso liberado |

> **Em construção:** novos padrões serão adicionados conforme o desenvolvimento do Planton Academy V2, incluindo painel do Gestor Master e painel do Super Admin.

---

## Dark Mode

Implementado via `next-themes` com classe `.dark` no `<html>`. O toggle está disponível no design system.

- Títulos: `text-planton-forest` → branco no dark (via token CSS)
- Corpo: `text-planton-muted` → cinza claro no dark
- Fundos de card: `bg-card` adapta automaticamente
- Bordas: `border-border` adapta automaticamente

---

## Design System - páginas

| Rota | Conteúdo |
|---|---|
| `/design-system` | Índice com navegação para todas as seções |
| `/design-system/colors` | Paleta completa + tokens + dark mode |
| `/design-system/typography` | Escalas de fonte e hierarquia |
| `/design-system/logo` | Logo da marca, variações, produtos e download |
| `/design-system/components` | Índice de componentes por categoria |
| `/design-system/components/button` | Button (standalone) |
| `/design-system/components/inputs/*` | Input, Textarea, Select, Checkbox, etc. |
| `/design-system/components/data-display/*` | Card, Table, Avatar, Badge, Progress |
| `/design-system/components/feedback/*` | Alert, AlertDialog, Sonner |
| `/design-system/components/navigation/*` | Tabs, Breadcrumb, Pagination, Command |
| `/design-system/components/overlays/*` | DropdownMenu, Popover, HoverCard, Calendar |
| `/design-system/components/layout/*` | Accordion, Collapsible, ScrollArea |
| `/design-system/screens` | Índice de telas |
| `/design-system/screens/academy/login` | Fluxo de autenticação multi-step |
| `/design-system/screens/academy/home` | Home do Academy (hero + trilhas + conteúdos) |
| `/design-system/screens/academy/trail/[id]` | Tela de trilha com lista de conteúdos |
| `/design-system/screens/academy/content/[id]` | Player de conteúdo (vídeo, podcast, artigo) |

---

## Deploy

O projeto é deployado no **Vercel**. As rotas do design system são geradas estaticamente (`○ Static`).

> **Nota:** este repositório contém apenas o design system. O Planton Academy V2 em produção terá rotas dinâmicas com autenticação, painéis por empresa e dados em tempo real.

```bash
npm run build   # verificar antes do deploy
```