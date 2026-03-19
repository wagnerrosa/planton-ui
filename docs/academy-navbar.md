# AcademyNavbar

Navbar principal do Planton Academy. Aparece no topo de todas as páginas autenticadas do produto.

**Localização:** `src/components/navigation/AcademyNavbar.tsx`

---

## Anatomia

```
[ ☰  Logo Academy  |  Breadcrumb ]          [ 🔍  ☀  Avatar ▾ ]
```

### Esquerda
| Elemento | Descrição |
|---|---|
| Hamburger (`Menu`) | Toggle do sidebar lateral |
| Logo Academy | Troca entre versão forest (light) e branco (dark) |
| Separador `\|` | Aparece apenas quando há breadcrumbs |
| Breadcrumb | Navegação hierárquica dinâmica (ver seção abaixo) |

### Direita
| Elemento | Descrição |
|---|---|
| Campo de busca | Busca global — oculto em mobile (`hidden sm:flex`) |
| Theme toggle | Alterna entre light/dark via `next-themes` |
| Avatar + nome | Abre dropdown com Perfil (opcional) e Sair |

---

## Props

```tsx
interface AcademyNavbarProps {
  breadcrumbs?: BreadcrumbItem[]   // itens do breadcrumb (sem incluir Home)
  userName?: string                // nome exibido no avatar e dropdown
  userAvatarUrl?: string           // URL da foto; fallback para iniciais
  onMenuToggle?: () => void        // callback do hamburger
  onSearch?: (query: string) => void
  onLogout?: () => void
  onProfile?: () => void           // se ausente, item "Perfil" não aparece
}

interface BreadcrumbItem {
  label: string
  href?: string   // se ausente ou é o último item, renderiza como texto
}
```

---

## Breadcrumb — Regras

O breadcrumb reflete a localização atual do usuário dentro do produto.
O item ativo (último) é sempre renderizado como texto puro, sem link.
Itens intermediários recebem `href` e são clicáveis.

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

**Estratégia sugerida:**
1. Criar um `BreadcrumbProvider` (Context) que qualquer página/layout pode atualizar via `useBreadcrumb()`.
2. O `AcademyNavbar` lê do contexto em vez de receber via props.
3. Cada página chama `setBreadcrumbs([...])` no seu `useEffect` ou diretamente no layout de rota.

**Alternativa com Next.js App Router:**
- Usar `generateBreadcrumbs(pathname)` — função utilitária que mapeia segmentos de URL para labels legíveis.
- Registrar o mapa de rotas em `src/lib/breadcrumbs-map.ts`.

---

## Estilo e tokens

O navbar usa os mesmos tokens do `DesignSystemSidebar` para manter coerência visual:

| Token | Uso |
|---|---|
| `bg-sidebar` | Background do navbar |
| `border-sidebar-border` | Linha inferior |
| `text-sidebar-foreground` | Textos e ícones |
| `bg-sidebar-accent` | Hover de botões e input de busca |
| `text-planton-accent` | Estados ativos (futuro: item ativo no breadcrumb) |

Isso garante que navbar e sidebar "conversem" — mesma paleta, mesma densidade visual.
