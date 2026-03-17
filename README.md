# Planton UI

Design system do **Planton Academy V2** — plataforma educacional B2B focada em sustentabilidade, gestão de emissões de GEE e ESG.

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
│   │   ├── page.tsx          # Índice do design system
│   │   ├── colors/           # Paleta, tokens e dark mode
│   │   ├── typography/       # Escalas tipográficas
│   │   ├── components/       # 34 componentes documentados
│   │   └── patterns/         # Padrões de tela (em construção)
│   └── layout.tsx            # ThemeProvider + Toaster
│
├── components/
│   ├── navigation/           # Componentes de navegação do design system
│   │   └── DesignSystemSidebar.tsx
│   ├── primitives/           # Componentes próprios base
│   │   ├── Button.tsx
│   │   ├── Heading.tsx
│   │   ├── Body.tsx
│   │   ├── Eyebrow.tsx
│   │   └── Label.tsx
│   ├── ui/                   # Componentes UI compostos
│   │   ├── Card.tsx
│   │   ├── CourseGrid.tsx
│   │   ├── Surface.tsx
│   │   ├── ThemeProvider.tsx
│   │   └── ThemeToggle.tsx
│   └── shadcn/               # Componentes shadcn/ui
│
├── hooks/
│   └── use-mobile.tsx        # Hook para detecção de viewport mobile
│
├── lib/                      # Utilitários e helpers
│
├── patterns/
│   └── auth/
│       └── LoginScreen.tsx   # Padrão de tela completo
│
└── styles/
    ├── theme.css             # Tokens de design (cores, bordas, superfícies)
    └── globals.css           # Base CSS
```

---

## Tokens de design

Definidos em `src/styles/theme.css`, adaptam automaticamente entre light e dark mode.

### Cores da marca

| Token | Descrição |
|---|---|
| `planton-accent` | Verde lima — cor principal de destaque e CTAs |
| `planton-forest` | Verde escuro — texto principal no light mode |
| `planton-cream` | Creme — texto em superfícies escuras |
| `planton-muted` | Cinza — texto secundário |
| `planton-ink` | Tinta escura — texto sobre accent |

### Tokens semânticos

| Token | Light | Dark |
|---|---|---|
| `--background` | Branco puro | Cinza muito escuro |
| `--card` | Branco | Cinza escuro |
| `--border` | Cinza claro | Branco 10% |
| `--foreground` | `planton-forest` | Branco |

> **Regra:** sempre use tokens semânticos (`bg-card`, `border-border`, `text-foreground`) — nunca cores hardcoded como `bg-white` ou `border-gray-200`. Isso garante que o dark mode funcione automaticamente.

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

### UI (`src/components/ui/`)

**Card** — componente central e reutilizável
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

**CourseGrid** — grid de aulas para o Academy
```tsx
<CourseGrid lessons={[
  { id: '1', index: '01', title: 'Fundamentos do Solo', description: '...', href: '/aula/1' },
]} />
```

### shadcn (`src/components/shadcn/`)

34 componentes instalados e documentados: Badge, Button, Dialog, Input, Separator, Sheet, Sidebar, Skeleton, Tabs, Textarea, Tooltip, Form, InputOTP, Select, Checkbox, RadioGroup, Switch, Alert, AlertDialog, Sonner, Progress, Slider, Table, DropdownMenu, Pagination, ScrollArea, Avatar, HoverCard, Popover, Calendar, Command, Breadcrumb, Collapsible, Accordion.

---

## Padrões de tela (`src/patterns/`)

Composições de tela completas — diferente de componentes, encapsulam layout e lógica de uma tela inteira.

| Padrão | Arquivo | Descrição |
|---|---|---|
| LoginScreen | `auth/LoginScreen.tsx` | Tela de login com campos e-mail/senha |

> **Em construção:** novos padrões serão adicionados conforme o desenvolvimento do Planton Academy V2, incluindo fluxo de cadastro multi-etapas, onboarding, quiz, emissão de certificado, painel do Gestor Master e painel do Super Admin.

---

## Dark Mode

Implementado via `next-themes` com classe `.dark` no `<html>`. O toggle está disponível no design system.

- Títulos: `text-planton-forest` → branco no dark (via token CSS)
- Corpo: `text-planton-muted` → cinza claro no dark
- Fundos de card: `bg-card` adapta automaticamente
- Bordas: `border-border` adapta automaticamente

---

## Design System — páginas

| Rota | Conteúdo |
|---|---|
| `/design-system` | Índice com navegação para todas as seções |
| `/design-system/colors` | Paleta completa + tokens + dark mode |
| `/design-system/typography` | Escalas de fonte e hierarquia |
| `/design-system/components` | 34 componentes com exemplos contextualizados |
| `/design-system/patterns` | Padrões de tela em construção |

---

## Deploy

O projeto é deployado no **Vercel**. As rotas do design system são geradas estaticamente (`○ Static`).

> **Nota:** este repositório contém apenas o design system. O Planton Academy V2 em produção terá rotas dinâmicas com autenticação, painéis por empresa e dados em tempo real.

```bash
npm run build   # verificar antes do deploy
```