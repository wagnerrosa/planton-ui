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
| recharts | charts (engajamento, usage) |
| framer-motion | animações (StackingCards) |
| hls.js | streaming HLS (Mux videos) |

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
│   │   ├── AcademyFooter.tsx           # Footer do Academy (default + overlay variants)
│   │   └── ProfileSheet.tsx            # Sheet lateral de edição de perfil (avatar upload + form)
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
│   │   ├── StackingCards.tsx           # Efeito de empilhamento scroll-triggered (Framer Motion)
│   │   ├── Surface.tsx
│   │   ├── ThemeProvider.tsx
│   │   └── ThemeToggle.tsx
│   └── shadcn/                         # Componentes shadcn/ui (inclui chart.tsx para Recharts)
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
│       ├── components/
│       │   ├── AcademyHero.tsx         # Hero compartilhado (vídeo Mux + slides + dots de progresso)
│       │   └── AITutor/               # Tutor IA flutuante
│       │       ├── index.tsx           # Controlador principal (estado, roteamento por pathname)
│       │       ├── FloatingButton.tsx  # Botão flutuante bottom-right (glassmorphism)
│       │       ├── TutorPanel.tsx      # Painel 380px (frosted glass, header/messages/input)
│       │       ├── TutorHeader.tsx     # Header com avatar + logo + close
│       │       ├── TutorAvatar.tsx     # Avatar reutilizável (sm/md/lg)
│       │       ├── MessagesList.tsx    # Lista de mensagens + quick prompts + WhatsApp
│       │       ├── MessageBubble.tsx   # Bolha individual (text/list/highlight blocks)
│       │       ├── InputArea.tsx       # Input de mensagem + send button
│       │       ├── TypingIndicator.tsx # Indicador de digitação
│       │       ├── types.ts           # Tipos (Message, ContentBlock, QuickPrompt)
│       │       └── mock-data.ts       # Quick prompts + respostas mock (keyword matching)
│       ├── home/
│       │   ├── HomeScreen.tsx          # Home do Academy (hero + busca + filtros + conteúdos por tipo)
│       │   ├── mock-data.ts            # Dados mockados (trilhas, conteúdos, slides de hero)
│       │   └── components/
│       │       ├── ContentRow.tsx          # Row horizontal (Embla Carousel) com cards de conteúdo
│       │       ├── ContentCard.tsx         # Card streaming-style (4:5, overlay, hover scale, badges)
│       │       ├── ContentGrid.tsx         # Grid responsivo (2-6 cols) com "mostrar mais"
│       │       ├── ContentTypeIcon.tsx     # Ícone por tipo de conteúdo
│       │       ├── CertificationBanner.tsx # Banner fundo planton-forest com Textura_Forest.jpg e CTA
│       │       ├── SearchBar.tsx           # Barra de busca centralizada
│       │       ├── FilterChips.tsx         # Chips de filtro (tipo, tema, status)
│       │       ├── TrailGrid.tsx           # Grid de cards de trilha
│       │       ├── TrailCard.tsx           # Card de trilha (miniaturas, progress, metadata)
│       │       ├── ContinueTrailsCard.tsx  # Lista de trilhas em andamento com progress bars
│       │       └── OnboardingDialog.tsx    # Dialog de boas-vindas com vídeo (abre ao entrar na Home)
│       ├── trails/
│       │   ├── TrailsScreen.tsx        # Listagem de trilhas (hero + gutters laterais + cards)
│       │   └── TrailCard.tsx           # Card de trilha 2 colunas (info + imagem bioma + CTA overlay)
│       ├── trail/
│       │   ├── TrailScreen.tsx         # Tela de trilha (sidebar + player de conteúdo)
│       │   └── CertificatePreview.tsx  # Preview do certificado (16:9, container queries, fundo teal)
│       ├── content/
│       │   └── ContentScreen.tsx       # Player de conteúdo (vídeo/podcast/artigo)
│       ├── admin/                      # Painel Super Admin
│       │   └── dashboard/
│       │       ├── AdminDashboardScreen.tsx   # Dashboard plataforma (KPIs, clientes, vouchers, conteúdo, trilhas)
│       │       └── components/
│       │           └── AdminUsageChart.tsx    # Chart de engajamento (Recharts AreaChart, escala plataforma)
│       └── gm/                         # Painel Gestor Master
│           ├── GMDashboardScreen.tsx    # Dashboard empresa (KPIs, plano, colaboradores, trilhas, chart)
│           ├── components/
│           │   └── GMUsageChart.tsx     # Chart de engajamento (Recharts AreaChart, escala empresa)
│           └── mock-data.ts            # Dados mockados do painel GM
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
| `heading-md` | 20–24px | 1.2 |
| Body | , | 1.65 |

> Cada tamanho tem seu próprio `leading` , não use `leading-*` customizado em cima de `<Heading>`, pois o valor já está calibrado por tamanho.

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

35 componentes organizados em 6 categorias no design system:

| Categoria | Componentes |
|---|---|
| Inputs & Forms | Input, Textarea, Select, Checkbox, RadioGroup, Switch, Form, InputOTP, Slider, Label |
| Data Display | Card, Table, Avatar, Badge, Progress, ContentCard, Skeleton |
| Feedback | Alert, AlertDialog, Sonner |
| Navigation | Tabs, Breadcrumb, Pagination, Command |
| Overlays | DropdownMenu, Popover, HoverCard, Calendar, Dialog, Sheet, Tooltip |
| Layout & Structure | Separator, Accordion, Collapsible, ScrollArea, AspectRatio, Carousel, ContentRow, Sidebar |

Cada componente tem sua própria página com exemplos visuais, descrição e **file path** no codebase. O registro centralizado está em `src/lib/components-registry.ts`.

---

## Telas (`src/screens/`)

Composições de tela completas - diferente de componentes, encapsulam layout e lógica de uma tela inteira.

### Home do Academy (`academy/home/`)

Tela principal do Academy. Layout em seções verticais com container `max-w-[1920px]`.

Acesse: `http://localhost:3000/design-system/screens/academy/home`

Dados mockados em `mock-data.ts` , nenhuma API é chamada.

#### Seções e layout

```
┌──────────────────────────────────────────────────────────┐
│  1. Hero (full-bleed)                                    │
├──────────────────────────────────────────────────────────┤
│  2. Continue assistindo (2/3)  │  CertificationBanner    │
│     [carousel de cards]        │  (texture + CTA trilhas)│
├──────────────────────────────────────────────────────────┤
│  3. SearchBar + FilterChips (bg-surface-elevated)        │
├──────────────────────────────────────────────────────────┤
│  4a. Sem filtro: seções por tipo com divisórias          │
│      Vídeos ── Artigos ── Podcasts ── Guias              │
│  4b. Com filtro: resultados filtrados + TrailGrid         │
└──────────────────────────────────────────────────────────┘
```

| Seção | Condição de exibição |
|---|---|
| Hero | Sempre visível |
| Continue assistindo + CertificationBanner | `CONTINUE_WATCHING_ITEMS.length > 0` (grid 3 colunas) |
| CertificationBanner solo | `CONTINUE_WATCHING_ITEMS.length === 0` |
| SearchBar + FilterChips | Sempre visível |
| Conteúdos por tipo | Sem filtros ativos |
| Resultados filtrados | Filtros ou busca ativos |

**Divisórias entre seções de conteúdo:** full-bleed (fora do `max-w` container), com espaçamento `py-10` simétrico.

#### CertificationBanner

Banner com fundo `bg-planton-forest` e texture pattern (`Textura_Forest.jpg`), CTA "Ver trilhas" e indicador verde no hover.

- Título em `text-planton-cream`, subtítulo em `text-planton-cream/80`, CTA em `text-planton-accent`
- Conteúdo centralizado verticalmente (`justify-center`)
- No grid com "Continue assistindo": preenche toda a célula com `-my-10` (vertical) e `-mr-6` (borda direita)
- Texture: `absolute inset-0`, `opacity-[0.12]` repouso → `opacity-[0.18]` no hover
- Indicador esquerdo: `w-[3px]`, animação `cubic-bezier(0.16, 1, 0.3, 1)`

#### Busca e filtros

- **SearchBar:** input centralizado com ícone, fundo `bg-surface-elevated`
- **FilterChips:** três grupos (Tipo, Tema, Status) separados por dividers verticais
  - Tipo: Vídeo, Artigo, Podcast, Guia, Trilhas
  - Tema: ESG, Emissões, ISO, Sustentabilidade, Carbono, Clima
  - Status: Não iniciado, Em andamento, Concluído
- Chip ativo: `bg-planton-accent text-planton-ink`
- Chip inativo: `bg-planton-accent/10`, hover `bg-planton-accent/20`

#### ContentGrid

Grid responsivo (2-6 colunas) com botão "Mostrar mais" (incremento de 6 itens).

#### TrailCard

Card de trilha com miniaturas dos conteúdos, progress bar e metadata em `font-mono`.

- Miniaturas: 5 thumbnails pequenos (40x40) com ícone de tipo + contador `+N`
- Progress bar inline: `h-px`, track `bg-planton-accent/15`
- CTA: "Ver trilha" com seta animada no hover

#### ContentCard (streaming-style)

Cards com visual inspirado em plataformas de streaming (Netflix / Apple TV):

- **Aspect ratio:** 4:5 (portrait) — todas as informações dentro do thumbnail
- **Gradient overlay:** `from-black/70 via-black/10 to-transparent` para legibilidade do texto
- **Max width:** 220px (auto-contido, não depende do container)
- **Hover:** scale 1.04 + shadow-2xl + zoom 1.05 na imagem
- **GIF preview:** vídeos alternam thumbnail/GIF animado (MUX) no hover
- **Non-video cards:** usam imagens de biomas (`public/assets/`) como fallback, com brand tint (`bg-planton-accent/20 mix-blend-multiply`) e filtros visuais por tipo (podcast mais escuro, artigo dessaturado, guia com contraste)
- **Fallback sem repetição:** `getFallbackImage(type, id)` usa o `id` do conteúdo para alternar entre imagens do mesmo tipo

**Badges contextuais:**

| Badge | Posição | Condição |
|---|---|---|
| `Novo` | top-left | `content.isNew === true` |
| `X%` | top-right | `showProgress && progress > 0` |
| `Concluído` | top-right | `content.status === 'concluido'` |

**Props:**

| Prop | Tipo | Descrição |
|---|---|---|
| `content` | `ContentItem` | Dados do conteúdo |
| `showProgress` | `boolean` | Barra de progresso + badge % |
| `showTrail` | `boolean` | Label "Da trilha: X" |
| `linkToTrail` | `boolean` | Navega para trilha em vez de conteúdo |

#### ContentRow

- Usa Embla Carousel (`shadcn/carousel`) com `align: 'start'` e loop opcional
- Largura dos cards: `basis-[160px]` a `basis-[220px]` (responsivo)
- Header com título clicável (seta → trilha) quando `trailHref` é passado
- Botões prev/next visíveis a partir de `md`

---

### Hero compartilhado (`academy/components/AcademyHero`)

Componente de hero reutilizado na Home e na tela de Trilhas. Recebe um array de `AcademyHeroSlide` e renderiza:

- Vídeo de fundo em loop via HLS (Mux) com fallback para thumbnail
- Gradiente `from-black/90 via-black/50` à esquerda + `from-black/70` no rodapé
- Slide info: badge, eyebrow, título, meta (tipo + duração), descrição, pills temáticas, CTAs
- Dots de progresso animados (linear timer) quando há mais de 1 slide
- Transição entre slides: `opacity-0 translate-y-4` → `opacity-100 translate-y-0` (400ms)
- Altura: `h-[75vh] min-h-[520px]`

```tsx
<AcademyHero slides={TRAILS_HERO_SLIDES} />
```

**AcademyHeroAction** — 3 variantes de CTA:
- `style: 'accent'` → retângulo sólido `bg-planton-accent text-planton-dark`
- `style: 'outline'` → borda `white/30`, hover `white`
- `variant: 'link'` → link inline `text-planton-accent`

---

### Trilhas (`academy/trails/`)

Tela de listagem de todas as trilhas disponíveis.

Acesse: `http://localhost:3000/design-system/screens/academy/trilhas`

```
┌──────────────────────────────────────────────────────────┐
│  1. AcademyHero (slides das trilhas)                     │
├──────────────────────────────────────────────────────────┤
│  2. Intro centralizada                                    │
│     "Avance no seu ritmo até a certificação"             │
├──────────────────────────────────────────────────────────┤
│  3. Separator full-bleed                                  │
├──┬───────────────────────────────────────────────────┬──┤
│  │  4. Grid de TrailCards (max-w-960px)              │  │
│  │     - TrailCard 1                                 │  │
│  │     - TrailCard 2                                 │  │
│  │     - ...                                         │  │
│G │                                                   │G │
│U │                                                   │U │
│T │                                                   │T │
│T │                                                   │T │
│E │                                                   │E │
│R │                                                   │R │
└──┴───────────────────────────────────────────────────┴──┘
```

- **Gutters laterais:** `w-16` (64px), `border-r`/`border-l border-border`, alinhados com a largura do botão hamburger da navbar. Somem no mobile (`hidden md:block`).
- Cada `TrailCard` linka para `/design-system/screens/academy/trail/[id]`
- Dados dos slides: `TRAILS_HERO_SLIDES` em `mock-data.ts`

#### TrailCard (trails/)

Card de trilha com layout de duas colunas (flex row em `md+`):

**Coluna esquerda (info):**
- Badge de status com ícone (Clock/PlayCircle/Award) e label mono (0.625rem)
- Título em heading xl/3xl, hover accent
- Descrição com `line-clamp-2`, max-w-448px
- Thumbnails dos conteúdos: 5 miniaturas 44x44px com ícone de tipo + badge CheckCircle2 para concluídos + contador `+N`
- Progress bar com percentual (mono, 0.625rem), visível apenas se `progress > 0`
- Meta footer: contagem de conteúdos + duração (mono)

**Coluna direita (imagem bioma):**
- Imagem full-height (275-325px), 5 biomas rotativos por ID (Mata Atlântica, Caatinga, Serra Sul, Pantanal, Pampa)
- **CTA overlay button** centralizado sobre a imagem: texto varia por status ("Começar"/"Continuar"/"Rever"), borda `white/70`, `backdrop-blur`
- Hover: brightness 0.85→1.0, scale 1.03

Fundo `bg-planton-forest`, sem border-radius, sem shadows.

---

### Trilha (`academy/trail/`)

Tela de trilha com sidebar lateral (340px) e área de conteúdo.

- **Sidebar:** lista numerada de conteúdos com ícone de status (`concluido` / `visualizado` / pendente), Quiz e Certificado. Item ativo destacado com borda esquerda `planton-accent`.
- **Tipos de conteúdo:** `video` (MuxPlayer, aspect-ratio 16/9), `artigo` (texto centralizado), `podcast` (player de áudio em fundo colorido), `guia` (botão Abrir PDF no bloco de metadados)
- **Quiz:** navegação por questões com RadioGroup, progresso em `font-mono`, estado bloqueado/disponível/concluído
- **Certificado:** bloqueado até aprovação no quiz; ações de download PDF e compartilhar no LinkedIn
- **CertificatePreview:** preview visual do certificado em 16:9 com container queries (cqw/cqh). Fundo `#145559` (teal), 3 faixas horizontais separadas por linhas: (1) logo Planton + selo B Corp + metadados mono, (2) nome do aluno em heading accent, (3) info da trilha + textura cidade. Texto responsivo via container queries.
- **Progress bar:** usa `bg-planton-accent/10` no track para visibilidade em 0%

Acesse: `http://localhost:3000/design-system/screens/academy/trail/[id]`

IDs disponíveis nos mocks: `trail-1`, `trail-2`, `trail-3`, `trail-4`

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

Todos os dados são simulados no frontend , nenhuma API é chamada.

---

#### Fluxo 1 , Login com credenciais inválidas

1. Digite qualquer texto que contenha a palavra `erro` no campo e-mail (ex: `erro@test.com`)
2. Digite qualquer senha
3. Clique em **Entrar**
4. ✅ Alert vermelho inline: *"E-mail ou senha incorretos"* , permanece na tela de login

---

#### Fluxo 2 , Login sem acesso autorizado

1. Digite qualquer texto que contenha a palavra `semacesso` no campo e-mail (ex: `semacesso@test.com`)
2. Digite qualquer senha
3. Clique em **Entrar**
4. ✅ Navega para **Acesso Negado** com opção de tentar outro e-mail

---

#### Fluxo 3 , Login bem-sucedido

1. Digite qualquer e-mail que não contenha `erro` nem `semacesso` (ex: `usuario@planton.com`)
2. Digite qualquer senha
3. Clique em **Entrar**
4. ✅ Navega direto para **Acesso liberado**

---

#### Fluxo 4 , Cadastro: Cenário A (domínio ativo)

1. Clique em **Criar novo cadastro** , abre o Dialog
2. Digite um e-mail terminando em `@empresa.com` (ex: `joao@empresa.com`)
3. Clique em **Verificar**
4. ✅ Navega para **Empresa encontrada** → redireciona automaticamente para o formulário de perfil
5. Preencha nome completo e cargo (obrigatórios) → **Continuar**
6. Defina uma senha (mín. 8 caracteres) e confirme → **Continuar**
7. Digite o código OTP `123456` → **Verificar**
8. ✅ Navega para **Acesso liberado**

---

#### Fluxo 5 , Cadastro: Cenário B (domínio inativo + voucher)

1. Clique em **Criar novo cadastro** , abre o Dialog
2. Digite um e-mail terminando em `@inativo.com` (ex: `maria@inativo.com`)
3. Clique em **Verificar**
4. ✅ Navega para **Ativar acesso** (empresa inativa)
5. Para testar **voucher válido**: digite `PLANTON-2026-ATIVO` → **Continuar** → segue para perfil
6. Para testar **voucher expirado**: digite `PLANTON-2026-EXPIRADO` → alert de código expirado
7. Para testar **voucher inválido**: digite qualquer outro valor → alert de código não associado

---

#### Fluxo 6 , Cadastro: Cenário C (domínio desconhecido)

1. Clique em **Criar novo cadastro** , abre o Dialog
2. Digite qualquer e-mail corporativo que não termine em `@empresa.com` ou `@inativo.com` (ex: `nome@outraempresa.com`)
3. Clique em **Verificar**
4. ✅ Navega para **Empresa não encontrada** (dead end) com link externo para o site

---

#### Fluxo 7 , Domínio genérico bloqueado

1. Clique em **Criar novo cadastro** , abre o Dialog
2. Digite um e-mail de provedor pessoal (ex: `usuario@gmail.com`, `contato@hotmail.com`)
3. ✅ Alert: *"Acesso exclusivo com e-mail corporativo"* , formulário não avança

---

#### Fluxo 8 , Recuperação de senha

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
| E-mail cadastro | `@empresa.com` | Cenário A , domínio ativo |
| E-mail cadastro | `@inativo.com` | Cenário B , domínio inativo |
| E-mail cadastro | outro corporativo | Cenário C , domínio desconhecido |
| Voucher | `PLANTON-2026-ATIVO` | Ativa o acesso |
| Voucher | `PLANTON-2026-EXPIRADO` | Código expirado |
| Código OTP | `123456` | Verificação concluída → acesso liberado |

---

### Tutor IA (`academy/components/AITutor/`)

Assistente de IA integrado que aparece como botão flutuante nas telas do Academy.

- **FloatingButton:** fixo bottom-right (`z-60`), pill glassmorphism (`backdrop-blur-2xl backdrop-saturate-150 bg-background/60`). Label "Tutor IA" + separator + "Powered by Genius" + favicon Planton. Hover: scale 1.02. Some quando o painel está aberto.
- **TutorPanel:** 380px largura, max 580px altura. Frosted glass (`backdrop-blur-2xl border-white/15`). Animação sweep na abertura (scale 0.95→1.0).
- **Mensagens:** 3 tipos de content block (text, list, highlight). Quick prompts pré-definidos. Respostas mock com keyword matching + delay 1200ms.
- **WhatsApp:** gera link com resumo das últimas 6 mensagens para escalar conversa com agente real.
- **Roteamento:** só aparece em rotas `/home`, `/trilhas`, `/trail/`, `/content/` via `usePathname()`.
- **Avatar:** componente reutilizável em 3 tamanhos (sm/md/lg) com favicon Planton.

---

### Gestor Master (`academy/gm/`)

Dashboard da empresa para o Gestor Master.

Acesse: `http://localhost:3000/design-system/screens/academy/gm`

```
┌──────────────────────────────────────────────────────────┐
│  1. Header (empresa + breadcrumb)                         │
├──────────────────────────────────────────────────────────┤
│  2. KPI Cards (4): usuários, ativos, horas, certificados │
├──────────────────────────────────────────────────────────┤
│  3. Timeline do plano (progress bar + dias restantes)     │
├──────────────────────────────────────────────────────────┤
│  4. Tabela colaboradores (busca + filtro status +         │
│     paginação + detalhe com KPIs individuais)             │
├────────────────────────────┬─────────────────────────────┤
│  5. Top trilhas            │  6. Chart de engajamento     │
└────────────────────────────┴─────────────────────────────┘
```

- **GMUsageChart:** AreaChart (Recharts) com dual metric (usuários ativos + horas assistidas) ao longo de 12 meses. Filtro por semestre. Gradientes com cores do design system.
- **Colaboradores:** tabela com zebra stripes, headers mono, busca, filtro de status (Ativo/Convite enviado/Nunca acessou), paginação (5/página), click-to-detail com KPIs e conteúdos do colaborador.
- **Timeline:** progress bar com urgência visual (vermelho se ≤30 dias restantes).
- **Dialog de convite:** formulário para convidar novo colaborador.
- Skeleton loading (800ms delay) em todas as seções.

---

### Super Admin (`academy/admin/`)

Dashboard da plataforma para o Super Admin.

- **AdminUsageChart:** mesmo padrão do GMUsageChart mas escala plataforma (10-15x maior).
- **Tabelas:** clientes, vouchers, conteúdos, trilhas — todas com zebra stripes, headers em `font-mono` (Geist Mono), pagination mono, actions dropdown.

---

### Padrão de tabelas

As tabelas (`src/components/shadcn/table.tsx`) usam:

- **Zebra stripes:** `[&_tr:nth-child(even)]:bg-muted/30` no `TableBody`
- **Headers em Geist Mono:** `font-mono` no `TableHead` (visual técnico/estruturado)
- **Body em Instrument Sans:** `font-sans` no `TableCell`
- **Hover:** `hover:bg-muted/40` com transição suave
- **Pagination:** números em `font-mono`

---

## Padrões de UI

### Select com descrições nas opções

Quando um `Select` precisa mostrar descrições nas opções do dropdown mas exibir apenas o nome do item no trigger após a seleção, **não use `<SelectValue>`** — o Radix renderiza o conteúdo completo do item selecionado (incluindo a descrição) dentro do trigger. O `textValue` não resolve isso, serve apenas para busca e acessibilidade.

**Solução:** substituir `<SelectValue>` por um `<span>` condicional no trigger, usando o mapa de labels do componente.

```tsx
const STATUS_LABELS: Record<MyStatus, string> = {
  ativo: 'Ativo',
  expirado: 'Expirado',
  // ...
}

<Select value={filter} onValueChange={setFilter}>
  <SelectTrigger className="w-[180px]">
    {/* span condicional em vez de <SelectValue> */}
    <span>{filter === 'all' ? 'Todos' : STATUS_LABELS[filter as MyStatus]}</span>
  </SelectTrigger>
  <SelectContent className="w-[260px]">
    <SelectItem value="all">Todos</SelectItem>
    <SelectItem value="ativo" className="items-start">
      <span className="flex flex-col gap-0.5">
        <span>Ativo</span>
        <span className="text-xs text-muted-foreground font-normal normal-case tracking-normal">
          Descrição do status ativo
        </span>
      </span>
    </SelectItem>
  </SelectContent>
</Select>
```

> `SelectContent` com `className="w-[260px]"` (ou maior) para acomodar as descrições sem truncar. `SelectItem` com `className="items-start"` para alinhar o checkmark ao topo.

Aplicado em: `ClientsScreen`, `VouchersScreen`.

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
| `/design-system/components/inputs/*` | Input, Textarea, Select, Checkbox, Label, etc. |
| `/design-system/components/data-display/*` | Card, Table, Avatar, Badge, Progress, ContentCard, Skeleton |
| `/design-system/components/feedback/*` | Alert, AlertDialog, Sonner |
| `/design-system/components/navigation/*` | Tabs, Breadcrumb, Pagination, Command |
| `/design-system/components/overlays/*` | DropdownMenu, Popover, HoverCard, Calendar, Dialog, Sheet, Tooltip |
| `/design-system/components/layout/*` | Separator, Accordion, Collapsible, ScrollArea, AspectRatio, Carousel, ContentRow, Sidebar |
| `/design-system/screens` | Índice de telas |
| `/design-system/screens/academy/login` | Fluxo de autenticação multi-step |
| `/design-system/screens/academy/home` | Home do Academy (hero + trilhas + conteúdos) |
| `/design-system/screens/academy/trilhas` | Listagem de trilhas (hero + gutters + cards) |
| `/design-system/screens/academy/trail/[id]` | Tela de trilha com sidebar, player e certificado |
| `/design-system/screens/academy/content/[id]` | Player de conteúdo (vídeo, podcast, artigo) |
| `/design-system/screens/academy/gm` | Dashboard do Gestor Master (empresa) |
| `/design-system/screens/academy/admin` | Dashboard do Super Admin (plataforma) |
| `/design-system/screens/academy/admin/clients` | Tabela de clientes (empresas) |
| `/design-system/screens/academy/admin/clients/[id]` | Detalhe de cliente |
| `/design-system/screens/academy/admin/vouchers` | Tabela de vouchers |
| `/design-system/screens/academy/admin/content` | Tabela de conteúdos |
| `/design-system/screens/academy/admin/trails` | Tabela de trilhas |

---

## Deploy

O projeto é deployado no **Vercel**. As rotas do design system são geradas estaticamente (`○ Static`).

> **Nota:** este repositório contém o design system e protótipos de tela. O Planton Academy V2 em produção terá rotas dinâmicas com autenticação, APIs reais e dados em tempo real. Todos os dados exibidos nas telas são mockados.

```bash
npm run build   # verificar antes do deploy
```