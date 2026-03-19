import {
  TextCursorInput,
  LayoutGrid,
  MessageSquare,
  Navigation,
  Layers,
  PanelsTopLeft,
  MousePointer,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type ComponentMeta = {
  slug: string
  name: string
  description: string
  filePath: string
}

export type ComponentCategory = {
  slug: string
  label: string
  icon: LucideIcon
  components: ComponentMeta[]
}

export const componentCategories: ComponentCategory[] = [
  {
    slug: 'inputs',
    label: 'Inputs & Forms',
    icon: TextCursorInput,
    components: [
      { slug: 'input', name: 'Input', description: 'Campo de texto para entrada de dados.', filePath: 'src/components/shadcn/input.tsx' },
      { slug: 'textarea', name: 'Textarea', description: 'Campo de texto multilinha.', filePath: 'src/components/shadcn/textarea.tsx' },
      { slug: 'select', name: 'Select', description: 'Menu de seleção com opções.', filePath: 'src/components/shadcn/select.tsx' },
      { slug: 'checkbox', name: 'Checkbox', description: 'Caixa de seleção para escolhas múltiplas.', filePath: 'src/components/shadcn/checkbox.tsx' },
      { slug: 'radio-group', name: 'Radio Group', description: 'Grupo de opções mutuamente exclusivas.', filePath: 'src/components/shadcn/radio-group.tsx' },
      { slug: 'switch', name: 'Switch', description: 'Toggle on/off para estados binários.', filePath: 'src/components/shadcn/switch.tsx' },
      { slug: 'form', name: 'Form', description: 'Formulário com validação via react-hook-form + zod.', filePath: 'src/components/shadcn/form.tsx' },
      { slug: 'input-otp', name: 'Input OTP', description: 'Entrada de código de verificação.', filePath: 'src/components/shadcn/input-otp.tsx' },
      { slug: 'slider', name: 'Slider', description: 'Controle deslizante para seleção de valores.', filePath: 'src/components/shadcn/slider.tsx' },
    ],
  },
  {
    slug: 'data-display',
    label: 'Data Display',
    icon: LayoutGrid,
    components: [
      { slug: 'card', name: 'Card', description: 'Contêiner visual para agrupar informações.', filePath: 'src/components/ui/Card.tsx' },
      { slug: 'table', name: 'Table', description: 'Tabela para exibição de dados tabulares.', filePath: 'src/components/shadcn/table.tsx' },
      { slug: 'avatar', name: 'Avatar', description: 'Representação visual de um usuário.', filePath: 'src/components/shadcn/avatar.tsx' },
      { slug: 'badge', name: 'Badge', description: 'Etiqueta de status ou categoria.', filePath: 'src/components/shadcn/badge.tsx' },
      { slug: 'progress', name: 'Progress', description: 'Barra de progresso para indicar conclusão.', filePath: 'src/components/shadcn/progress.tsx' },
      { slug: 'content-card', name: 'ContentCard', description: 'Card de conteúdo com thumbnail, título, tipo e progresso. Usado na Home e trilhas do Planton Academy.', filePath: 'src/screens/academy/home/components/ContentCard.tsx' },
    ],
  },
  {
    slug: 'feedback',
    label: 'Feedback',
    icon: MessageSquare,
    components: [
      { slug: 'alert', name: 'Alert', description: 'Mensagem de aviso ou informação contextual.', filePath: 'src/components/shadcn/alert.tsx' },
      { slug: 'alert-dialog', name: 'Alert Dialog', description: 'Diálogo de confirmação para ações destrutivas.', filePath: 'src/components/shadcn/alert-dialog.tsx' },
      { slug: 'sonner', name: 'Sonner', description: 'Notificações toast efêmeras.', filePath: 'src/components/shadcn/sonner.tsx' },
    ],
  },
  {
    slug: 'navigation',
    label: 'Navigation',
    icon: Navigation,
    components: [
      { slug: 'tabs', name: 'Tabs', description: 'Navegação por abas para alternar entre seções.', filePath: 'src/components/shadcn/tabs.tsx' },
      { slug: 'breadcrumb', name: 'Breadcrumb', description: 'Trilha de navegação hierárquica.', filePath: 'src/components/shadcn/breadcrumb.tsx' },
      { slug: 'pagination', name: 'Pagination', description: 'Controle de paginação para listas longas.', filePath: 'src/components/shadcn/pagination.tsx' },
      { slug: 'command', name: 'Command', description: 'Paleta de comandos com busca.', filePath: 'src/components/shadcn/command.tsx' },
    ],
  },
  {
    slug: 'overlays',
    label: 'Overlays',
    icon: Layers,
    components: [
      { slug: 'dropdown-menu', name: 'Dropdown Menu', description: 'Menu suspenso de ações.', filePath: 'src/components/shadcn/dropdown-menu.tsx' },
      { slug: 'popover', name: 'Popover', description: 'Painel flutuante para conteúdo contextual.', filePath: 'src/components/shadcn/popover.tsx' },
      { slug: 'hover-card', name: 'Hover Card', description: 'Card exibido ao passar o mouse sobre um elemento.', filePath: 'src/components/shadcn/hover-card.tsx' },
      { slug: 'calendar', name: 'Calendar', description: 'Seletor de data em formato de calendário.', filePath: 'src/components/shadcn/calendar.tsx' },
    ],
  },
  {
    slug: 'layout',
    label: 'Layout & Structure',
    icon: PanelsTopLeft,
    components: [
      { slug: 'accordion', name: 'Accordion', description: 'Seções expansíveis e colapsáveis.', filePath: 'src/components/shadcn/accordion.tsx' },
      { slug: 'collapsible', name: 'Collapsible', description: 'Contêiner que pode ser expandido ou recolhido.', filePath: 'src/components/shadcn/collapsible.tsx' },
      { slug: 'scroll-area', name: 'Scroll Area', description: 'Área com scroll customizado.', filePath: 'src/components/shadcn/scroll-area.tsx' },
      { slug: 'aspect-ratio', name: 'Aspect Ratio', description: 'Container que mantém uma proporção fixa (ex: 16/9).', filePath: 'src/components/shadcn/aspect-ratio.tsx' },
      { slug: 'carousel', name: 'Carousel', description: 'Carrossel horizontal com navegação e snap.', filePath: 'src/components/shadcn/carousel.tsx' },
      { slug: 'content-row', name: 'ContentRow', description: 'Linha de carrossel com título e link de trilha. Usado na Home do Planton Academy para exibir coleções de conteúdo.', filePath: 'src/screens/academy/home/components/ContentRow.tsx' },
    ],
  },
]

// Button is a standalone item, not inside a category
export const buttonMeta: ComponentMeta = {
  slug: 'button',
  name: 'Button',
  description: 'Componente primitivo de ação. Suporta variantes primary, primary-dark e icon.',
  filePath: 'src/components/primitives/Button.tsx',
}

// Helper to find a component by category + slug
export function findComponent(categorySlug: string, componentSlug: string): ComponentMeta | undefined {
  const category = componentCategories.find((c) => c.slug === categorySlug)
  return category?.components.find((comp) => comp.slug === componentSlug)
}

// Helper to find category by slug
export function findCategory(categorySlug: string): ComponentCategory | undefined {
  return componentCategories.find((c) => c.slug === categorySlug)
}
