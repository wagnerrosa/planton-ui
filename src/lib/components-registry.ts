import {
  TextCursorInput,
  LayoutGrid,
  MessageSquare,
  Navigation,
  Layers,
  PanelsTopLeft,
  MousePointer,
  BarChart2,
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
      { slug: 'input', name: 'Input', description: 'Text field for data entry.', filePath: 'src/components/shadcn/input.tsx' },
      { slug: 'textarea', name: 'Textarea', description: 'Multi-line text field.', filePath: 'src/components/shadcn/textarea.tsx' },
      { slug: 'select', name: 'Select', description: 'Selection menu with options.', filePath: 'src/components/shadcn/select.tsx' },
      { slug: 'checkbox', name: 'Checkbox', description: 'Checkbox for multiple choices.', filePath: 'src/components/shadcn/checkbox.tsx' },
      { slug: 'radio-group', name: 'Radio Group', description: 'Mutually exclusive option group.', filePath: 'src/components/shadcn/radio-group.tsx' },
      { slug: 'switch', name: 'Switch', description: 'On/off toggle for binary states.', filePath: 'src/components/shadcn/switch.tsx' },
      { slug: 'form', name: 'Form', description: 'Form with validation via react-hook-form + zod.', filePath: 'src/components/shadcn/form.tsx' },
      { slug: 'input-otp', name: 'Input OTP', description: 'Verification code input.', filePath: 'src/components/shadcn/input-otp.tsx' },
      { slug: 'slider', name: 'Slider', description: 'Slider control for value selection.', filePath: 'src/components/shadcn/slider.tsx' },
      { slug: 'label', name: 'Label', description: 'Accessible label for form fields.', filePath: 'src/components/shadcn/label.tsx' },
    ],
  },
  {
    slug: 'data-display',
    label: 'Data Display',
    icon: LayoutGrid,
    components: [
      { slug: 'card', name: 'Card', description: 'Visual container for grouping information.', filePath: 'src/components/ui/Card.tsx' },
      { slug: 'table', name: 'Table', description: 'Table for displaying tabular data.', filePath: 'src/components/shadcn/table.tsx' },
      { slug: 'avatar', name: 'Avatar', description: 'Visual representation of a user.', filePath: 'src/components/shadcn/avatar.tsx' },
      { slug: 'badge', name: 'Badge', description: 'Status or category label.', filePath: 'src/components/shadcn/badge.tsx' },
      { slug: 'progress', name: 'Progress', description: 'Progress bar to indicate completion.', filePath: 'src/components/shadcn/progress.tsx' },
      { slug: 'content-card', name: 'ContentCard', description: 'Streaming-style card (4:5) with text overlay, gradient, badges (New/Completed/%), hover scale and GIF preview. Used in Academy Home.', filePath: 'src/screens/academy/home/components/ContentCard.tsx' },
      { slug: 'skeleton', name: 'Skeleton', description: 'Animated placeholder to indicate content loading.', filePath: 'src/components/shadcn/skeleton.tsx' },
    ],
  },
  {
    slug: 'feedback',
    label: 'Feedback',
    icon: MessageSquare,
    components: [
      { slug: 'alert', name: 'Alert', description: 'Warning or contextual information message.', filePath: 'src/components/shadcn/alert.tsx' },
      { slug: 'alert-dialog', name: 'Alert Dialog', description: 'Confirmation dialog for destructive actions.', filePath: 'src/components/shadcn/alert-dialog.tsx' },
      { slug: 'sonner', name: 'Sonner', description: 'Ephemeral toast notifications.', filePath: 'src/components/shadcn/sonner.tsx' },
      { slug: 'top-notification-bar', name: 'TopNotificationBar', description: 'Sticky banner at the top of the page for trial, billing and system messages. Variants: default, warning, danger, success, accent.', filePath: 'src/components/ui/TopNotificationBar.tsx' },
    ],
  },
  {
    slug: 'navigation',
    label: 'Navigation',
    icon: Navigation,
    components: [
      { slug: 'tabs', name: 'Tabs', description: 'Tab navigation to switch between sections.', filePath: 'src/components/shadcn/tabs.tsx' },
      { slug: 'breadcrumb', name: 'Breadcrumb', description: 'Hierarchical breadcrumb navigation.', filePath: 'src/components/shadcn/breadcrumb.tsx' },
      { slug: 'pagination', name: 'Pagination', description: 'Pagination control for long lists.', filePath: 'src/components/shadcn/pagination.tsx' },
      { slug: 'command', name: 'Command', description: 'Command palette with search.', filePath: 'src/components/shadcn/command.tsx' },
    ],
  },
  {
    slug: 'overlays',
    label: 'Overlays',
    icon: Layers,
    components: [
      { slug: 'dropdown-menu', name: 'Dropdown Menu', description: 'Dropdown action menu.', filePath: 'src/components/shadcn/dropdown-menu.tsx' },
      { slug: 'popover', name: 'Popover', description: 'Floating panel for contextual content.', filePath: 'src/components/shadcn/popover.tsx' },
      { slug: 'hover-card', name: 'Hover Card', description: 'Card displayed on hover over an element.', filePath: 'src/components/shadcn/hover-card.tsx' },
      { slug: 'calendar', name: 'Calendar', description: 'Calendar-style date picker.', filePath: 'src/components/shadcn/calendar.tsx' },
      { slug: 'dialog', name: 'Dialog', description: 'Modal window for contextual content or forms.', filePath: 'src/components/shadcn/dialog.tsx' },
      { slug: 'sheet', name: 'Sheet', description: 'Sliding side panel for secondary content.', filePath: 'src/components/shadcn/sheet.tsx' },
      { slug: 'tooltip', name: 'Tooltip', description: 'Floating hint displayed on hover over an element.', filePath: 'src/components/shadcn/tooltip.tsx' },
    ],
  },
  {
    slug: 'layout',
    label: 'Layout & Structure',
    icon: PanelsTopLeft,
    components: [
      { slug: 'separator', name: 'Separator', description: 'Horizontal or vertical divider line. Also used as a full-width section border — a Planton brand visual pattern.', filePath: 'src/components/shadcn/separator.tsx' },
      { slug: 'accordion', name: 'Accordion', description: 'Expandable and collapsible sections.', filePath: 'src/components/shadcn/accordion.tsx' },
      { slug: 'collapsible', name: 'Collapsible', description: 'Container that can be expanded or collapsed.', filePath: 'src/components/shadcn/collapsible.tsx' },
      { slug: 'scroll-area', name: 'Scroll Area', description: 'Area with custom scrollbar.', filePath: 'src/components/shadcn/scroll-area.tsx' },
      { slug: 'aspect-ratio', name: 'Aspect Ratio', description: 'Container that maintains a fixed aspect ratio (e.g. 16/9).', filePath: 'src/components/shadcn/aspect-ratio.tsx' },
      { slug: 'carousel', name: 'Carousel', description: 'Horizontal carousel with navigation and snap.', filePath: 'src/components/shadcn/carousel.tsx' },
      { slug: 'content-row', name: 'ContentRow', description: 'Horizontal carousel (Embla) of ContentCards with title, trail link and navigation. Controls responsive card width.', filePath: 'src/screens/academy/home/components/ContentRow.tsx' },
      { slug: 'sidebar', name: 'Sidebar', description: 'Structural sidebar component with mobile support (sheet) and expanded/collapsed states.', filePath: 'src/components/shadcn/sidebar.tsx' },
      { slug: 'stacking-cards', name: 'StackingCards', description: 'Scroll-triggered stacking card effect via Framer Motion. Container (StackingCards) + item (StackingCardItem) with progressive scale-down as the user scrolls.', filePath: 'src/components/ui/StackingCards.tsx' },
    ],
  },
  {
    slug: 'data-viz',
    label: 'Data & Charts',
    icon: BarChart2,
    components: [
      { slug: 'chart', name: 'Chart', description: 'Recharts wrapper with design system integration. ChartContainer, ChartConfig, ChartTooltipContent and ChartLegendContent with automatic light/dark theme support via CSS variables.', filePath: 'src/components/shadcn/chart.tsx' },
    ],
  },
]

// Button is a standalone item, not inside a category
export const buttonMeta: ComponentMeta = {
  slug: 'button',
  name: 'Button',
  description: 'Primitive action component. Variants: primary, primary-dark, secondary, outline, ghost and icon.',
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
