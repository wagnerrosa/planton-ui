# AcademyNavbar

Navbar principal do Planton Academy. Aparece no topo de todas as páginas autenticadas do produto.

**Localização:** `src/components/navigation/AcademyNavbar.tsx`

---

## Anatomia

### Desktop (≥ 768px)

```
[ ☰  Logo Academy  |  Breadcrumb ]          [ 🔍 campo  ☀  Avatar ▾ ]
```

### Mobile (< 768px)

```
[ ☰  Logo Academy ]                         [ 🔍 ]
```

Theme toggle, avatar e ações do usuário ficam na **sidebar mobile** (`AcademySidebar`).

### Elementos — Esquerda

| Elemento | Desktop | Mobile |
|---|---|---|
| Hamburger (`Menu`) | Toggle do sidebar (push) | Toggle do sidebar (overlay Sheet) |
| Logo Academy | Troca entre forest (light) e branco (dark) | Idem |
| Breadcrumb | Trail completo com links clicáveis | Último item como título + botão voltar |

### Elementos — Direita

| Elemento | Desktop | Mobile |
|---|---|---|
| Campo de busca | Input expandido com atalho ⌘K | Ícone de lupa apenas |
| Theme toggle | Visível | Movido para sidebar mobile |
| Avatar + nome | Dropdown com Perfil e Sair | Movido para sidebar mobile |

---

## Props

```tsx
interface AcademyNavbarProps {
  breadcrumbs?: BreadcrumbItem[]   // itens do breadcrumb (sem incluir Home)
  userName?: string                // nome exibido no avatar e dropdown
  userAvatarUrl?: string           // URL da foto; fallback para iniciais
  onMenuToggle?: () => void        // callback do hamburger
  onSearch?: () => void            // callback do botão de busca (trigger ⌘K)
  onLogout?: () => void
  onProfile?: () => void           // se ausente, item "Perfil" não aparece
}

interface BreadcrumbItem {
  label: string
  href?: string   // se ausente ou é o último item, renderiza como texto
}
```

### Exports auxiliares

O componente também exporta `ThemeToggleButton` e `UserAvatar`, reutilizados pela sidebar mobile.

---

## Breadcrumb — Regras

O breadcrumb reflete a localização atual do usuário dentro do produto.
O item ativo (último) é sempre renderizado como texto puro, sem link.
Itens intermediários recebem `href` e são clicáveis.

### Comportamento responsivo

- **Desktop:** trail completo com chevrons entre itens
- **Mobile:** exibe apenas o último item como título. Se houver um item anterior com `href`, mostra um botão de voltar (ChevronLeft)

### Estrutura base

```
Home / Trilhas / [Nome da Trilha] / [Conteúdo]
```

### Casos mapeados

#### 1. Página inicial (Home)
Nenhum breadcrumb adicional — apenas o logo é exibido, sem separador.

```tsx
<AcademyNavbar breadcrumbs={[]} />
```

#### 2. Listagem de trilhas

```
Trilhas
```

```tsx
<AcademyNavbar breadcrumbs={[
  { label: 'Trilhas' }
]} />
```

#### 3. Conteúdo dentro de uma trilha

```
Trilhas / Gestão de Emissões / Aula 3
```

```tsx
<AcademyNavbar breadcrumbs={[
  { label: 'Trilhas', href: '/trilhas' },
  { label: 'Gestão de Emissões', href: '/trilhas/gestao-de-emissoes' },
  { label: 'Aula 3' },
]} />
```

Mobile: mostra `← Aula 3` (voltar leva para Gestão de Emissões)

#### 4. Conteúdo isolado (não pertence a uma trilha)

```
Conteúdos / Aula 3
```

```tsx
<AcademyNavbar breadcrumbs={[
  { label: 'Conteúdos', href: '/conteudos' },
  { label: 'Aula 3' },
]} />
```

#### 5. Quiz dentro de uma trilha

```
Trilhas / Gestão de Emissões / Quiz
```

```tsx
<AcademyNavbar breadcrumbs={[
  { label: 'Trilhas', href: '/trilhas' },
  { label: 'Gestão de Emissões', href: '/trilhas/gestao-de-emissoes' },
  { label: 'Quiz' },
]} />
```

#### 6. Certificado

```
Certificados / Gestão de Emissões
```

```tsx
<AcademyNavbar breadcrumbs={[
  { label: 'Certificados', href: '/certificados' },
  { label: 'Gestão de Emissões' },
]} />
```

---

## Implementação do breadcrumb dinâmico (TODO)

O breadcrumb atualmente é passado via props de forma estática em cada página.
A implementação dinâmica deve ser feita quando o roteamento real do Academy estiver definido.

**Implementação atual:** via `AcademyNavbarContext` + `AcademyNavbarSync`. Cada tela chama `<AcademyNavbarSync breadcrumbs={[...]} />` e o layout lê do Context.

**Estratégia futura:**
- Usar `generateBreadcrumbs(pathname)` — função utilitária que mapeia segmentos de URL para labels legíveis.
- Registrar o mapa de rotas em `src/lib/breadcrumbs-map.ts`.

---

## Sidebar mobile

A `AcademySidebar` em mobile (< 768px) renderiza como Sheet overlay com:

- Navegação (Home, Trilhas com sub-itens)
- Footer fixo na parte inferior com:
  - Avatar + nome do usuário + theme toggle (mesma linha)
  - Link para Perfil
  - Botão Sair (vermelho)

Fecha automaticamente ao clicar em qualquer link ou fora do sheet.

---

## Estilo e tokens

O navbar usa os mesmos tokens do `DesignSystemSidebar` para manter coerência visual:

| Token | Uso |
|---|---|
| `bg-sidebar` | Background do navbar |
| `border-sidebar-border` | Linha inferior e separadores |
| `text-sidebar-foreground` | Textos e ícones |
| `bg-sidebar-accent` | Hover de botões e input de busca |
| `text-planton-accent` | Estados ativos |

Breakpoint responsivo: `md` (768px), consistente com `useIsMobile` hook.
