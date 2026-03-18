# Planton Design System
## Implementation Guide - shadcn/ui + Storybook

> This document converts the Planton Design Language foundations into a concrete
> implementation specification. It is the source of truth for engineers and designers

---

## Design System Scope

This design system defines the **core UI language for all Planton products**.

It provides the shared visual and interaction foundations used across current
and future applications.

Included in this system:

• Design tokens (color, typography, spacing, motion, radius)  
• Core UI primitives (Button, Heading, Body, etc.)  
• shadcn/ui component overrides  
• Motion primitives and interaction rules  
• Storybook documentation and usage guidelines  

Not included in this system:

• Product‑specific workflows  
• Business logic components  
• Feature‑specific UI patterns  
• Application routing or layout architecture  

Individual products should build their own **feature components and patterns**
on top of this system without modifying the core primitives.

---

## Design Principles

These principles guide the visual and interaction language of Planton products.

**Sharp geometry**  
Content surfaces remain sharp and precise. Rounded corners are reserved only
for form controls and small UI elements.

**Editorial structure**  
Interfaces follow a structured editorial rhythm using borders, spacing,
and strong vertical alignment.

**Accent as signal**  
The accent color (`#ADCF78`) is used sparingly to signal actions, labels,
and important highlights - never as large background areas.

**Low‑motion interaction**  
Motion is subtle, purposeful, and never playful. Interactions communicate
precision rather than energy.

**Readable hierarchy**  
Typography establishes clear reading order with strong contrast between
headlines, body text, and utility labels.

---

---

## Table of Contents

1. [Design System Scope](#design-system-scope)
2. [Design Principles](#design-principles)
3. [Repository Structure](#1-repository-structure)
4. [Design Tokens - CSS Variables](#2-design-tokens--css-variables)
5. [Tailwind Configuration](#3-tailwind-configuration)
6. [shadcn/ui Overrides](#4-shadcnui-overrides)
7. [Typography Components](#5-typography-components)
8. [Color & Surface Utilities](#6-color--surface-utilities)
9. [Component Catalogue](#7-component-catalogue)
10. [Motion Primitives](#8-motion-primitives)
11. [Storybook Structure](#9-storybook-structure)
12. [Do / Don't Reference](#10-do--dont-reference)

---

## 1. Repository Structure

```
src/
├── tokens/
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   └── motion.ts
│
├── components/
│   ├── primitives/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.stories.tsx
│   │   │   └── index.ts
│   │   ├── Heading/
│   │   ├── Body/
│   │   ├── Eyebrow/
│   │   ├── Label/
│   │   ├── Quote/
│   │   └── Tagline/
│   │
│   └── shadcn/
│       ├── Card/
│       ├── Input/
│       ├── Textarea/
│       ├── Dialog/
│       ├── Tabs/
│       └── Badge/
│
└── stories/
    ├── Introduction.mdx
    ├── Colors.stories.tsx
    ├── Typography.stories.tsx
    ├── Spacing.stories.tsx
    └── Motion.stories.tsx
```

---

## 2. Design Tokens - CSS Variables

These variables must be declared in `:root` and are the single source of truth.
shadcn/ui components are overridden to consume these instead of their defaults.

```css
:root {
  /* ── Brand Palette ──────────────────────────────────── */
  --planton-forest:        #145559;   /* Primary brand color */
  --planton-dark:          #0A2D30;   /* Deep dark surface */
  --planton-accent:        #ADCF78;   /* Action signal only */
  --planton-cream:         #F7F3DB;   /* On-dark text + bg */
  --planton-ink:           #191919;   /* Near-black body text */
  --planton-muted:         #6B7280;   /* Captions, secondary text */
  --planton-white:         #FFFFFF;   /* Content surface */

  /* ── Surface Tokens ─────────────────────────────────── */
  --surface-default:       #FFFFFF;
  --surface-card:          #F0F4F0;
  --surface-dark:          #0A2D30;
  --surface-forest:        #145559;

  /* ── Border Tokens ──────────────────────────────────── */
  --border-light:          rgba(0, 0, 0, 0.2);
  --border-dark:           rgba(255, 255, 255, 0.1);

  /* ── Typography ─────────────────────────────────────── */
  --font-heading:          'Space Grotesk', sans-serif;
  --font-body:             'Instrument Sans', sans-serif;
  --font-voice:            'Roca', serif;
  --font-utility:          'Geist Mono', monospace;

  /* ── Radius ─────────────────────────────────────────── */
  /* Content surfaces remain sharp by default. */
  /* Radius tokens exist only for form controls and chips. */
  --radius-none:           0px;
  --radius-form:           4px;
  --radius-chip:           6px;

  /* ── Motion ─────────────────────────────────────────── */
  --ease-sweep:            cubic-bezier(0.16, 1, 0.3, 1);
  --ease-lift:             cubic-bezier(0.22, 1, 0.36, 1);
  --duration-fast:         200ms;
  --duration-base:         300ms;
  --duration-sweep:        500ms;
  --duration-shine:        700ms;
  --duration-reveal:       400ms;

  /* ── shadcn/ui semantic overrides ───────────────────── */
  --background:            var(--planton-white);
  --foreground:            var(--planton-forest);
  --card:                  var(--planton-white);
  --card-foreground:       var(--planton-forest);
  --primary:               var(--planton-forest);
  --primary-foreground:    var(--planton-cream);
  --secondary:             var(--surface-card);
  --secondary-foreground:  var(--planton-forest);
  --muted:                 var(--surface-card);
  --muted-foreground:      var(--planton-muted);
  --accent:                var(--planton-accent);
  --accent-foreground:     var(--planton-ink);
  --border:                var(--border-light);
  --input:                 var(--border-light);
  --ring:                  var(--planton-accent);
  --radius:                0px;   /* Global default: sharp */
}
```

---

## 3. Tailwind Configuration

Extend Tailwind to expose the brand tokens as utility classes.

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        planton: {
          forest:  '#145559',
          dark:    '#0A2D30',
          accent:  '#ADCF78',
          cream:   '#F7F3DB',
          ink:     '#191919',
          muted:   '#6B7280',
        },
        surface: {
          default: '#FFFFFF',
          card:    '#F0F4F0',
          dark:    '#0A2D30',
          forest:  '#145559',
        },
      },
      fontFamily: {
        heading:  ['Space Grotesk', 'sans-serif'],
        body:     ['Instrument Sans', 'sans-serif'],
        voice:    ['Roca', 'serif'],
        utility:  ['Geist Mono', 'monospace'],
      },
      letterSpacing: {
        'heading-xl': '-0.05em',
        'heading-lg': '-0.04em',
        'heading-md': '-0.02em',
        'eyebrow':    '0.12em',
        'label':      '0.05em',
      },
      lineHeight: {
        'heading': '1.1',
        'quote':   '1.3',
        'body':    '1.65',
      },
      maxWidth: {
        frame: '1400px',
      },
      transitionTimingFunction: {
        'sweep': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'lift':  'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '500': '500ms',
        '700': '700ms',
      },
      borderColor: {
        'light': 'rgba(0,0,0,0.2)',
        'dark':  'rgba(255,255,255,0.1)',
      },
    },
  },
}
```

---

## 4. shadcn/ui Overrides

The following shadcn components require override to match the design language.
All others should use defaults unless a specific variant is needed.

### Button

The shadcn `Button` default must be **replaced entirely** by the Planton sweep button.
Do not use shadcn `Button` as-is - it has rounded corners and shadow vocabulary.

Variants to implement:

| Variant | Surface | Use case |
|---|---|---|
| `primary` | Light surface - transparent bg, accent border | Main CTA |
| `primary-dark` | Dark surface - transparent bg, cream border | CTA on dark band |
| `icon` | 40×40px square, accent border | Carousel, nav arrows |

All variants share:
- `border-radius: 0`
- Horizontal fill sweep on hover (left → right, 500ms `ease-sweep`)
- Diagonal shine on hover (700ms linear)
- `translateY(-1px)` lift (300ms `ease-lift`)

### Card

Override shadcn `Card` to remove:
- `rounded-xl` → `rounded-none`
- `shadow` → `shadow-none`
- Default border → `border-light`

### Input / Textarea

- `rounded-none`
- `border-light` (full border) or bottom-only border
- No focus ring shadow - use `outline: 1px solid var(--planton-accent)` instead

### Separator

- `bg-[var(--border-light)]` on light surfaces
- `bg-[var(--border-dark)]` on dark surfaces

---

## 5. Typography Components

These are thin wrappers that enforce the typographic system.
They should be used instead of raw `h1`, `p`, `span` tags wherever the design system applies.

### `<Heading>`

```tsx
// Props
type HeadingProps = {
  as?: 'h1' | 'h2' | 'h3' | 'h4'
  size?: 'display-xl' | 'display-lg' | 'heading-xl' | 'heading-lg'
  surface?: 'light' | 'dark'   // controls text color
  children: React.ReactNode
  className?: string
}
```

| Size | px range | Tracking | Line-height |
|---|---|---|---|
| `display-xl` | 64–80px | `-0.05em` | `1.1` |
| `display-lg` | 48–70px | `-0.05em` | `1.1` |
| `heading-xl` | 40–56px | `-0.04em` | `1.1` |
| `heading-lg` | 28–36px | `-0.02em` | `1.1` |

Font: always `Space Grotesk`.
Color: `planton-forest` on light / `planton-cream` on dark.

**Storybook stories:** Default, AllSizes, OnDarkSurface

---

### `<Eyebrow>`

```tsx
// Props
type EyebrowProps = {
  surface?: 'light' | 'dark'
  children: React.ReactNode
  className?: string
}
```

- Font: `Geist Mono`, 11–12px, uppercase, `letter-spacing: 0.12em`
- Color: always `planton-accent` (`#ADCF78`) regardless of surface
- No variation in size - the eyebrow is always the same scale

**Storybook stories:** Default, OnDarkSurface

---

### `<Body>`

```tsx
type BodyProps = {
  size?: 'lg' | 'base' | 'sm'
  surface?: 'light' | 'dark'
  muted?: boolean
  children: React.ReactNode
  className?: string
}
```

| Size | px | Line-height |
|---|---|---|
| `lg` | 18px | `1.65` |
| `base` | 16px | `1.65` |
| `sm` | 14px | `1.65` |

Font: `Instrument Sans`.
Color: `planton-forest` on light (muted: `planton-muted`).
On dark: `planton-cream` at 100% (muted: 80% opacity).

**Storybook stories:** AllSizes, OnDarkSurface, Muted

---

### `<Label>` (utility)

```tsx
type LabelProps = {
  surface?: 'light' | 'dark'
  children: React.ReactNode
  className?: string
}
```

- Font: `Geist Mono`, 12px, uppercase, `letter-spacing: 0.05em`
- Color: `planton-accent`
- Usage: product index numbers, CTA sub-labels, status indicators

---

### `<Quote>`

```tsx
type QuoteProps = {
  children: React.ReactNode
  className?: string
}
```

- Font: `Roca Bold`, `clamp(1.4rem, 2vw, 1.9rem)`, line-height `1.3`
- Color: `planton-forest`
- Restricted to testimonial context - never use as a heading or UI label

**Storybook stories:** Default

---

### `<Tagline>`

```tsx
type TaglineProps = {
  children: React.ReactNode
  className?: string
}
```

- Font: `Roca Regular`, 48–72px, line-height `1.1`
- Color: `planton-accent`
- Restricted to footer and brand statement context only

---

## 6. Color & Surface Utilities

### `<Surface>`

A layout primitive that sets background and applies the correct border color
to all children automatically.

```tsx
type SurfaceProps = {
  variant: 'white' | 'card' | 'forest' | 'dark'
  children: React.ReactNode
  className?: string
}
```

| Variant | Background | Role |
|---|---|---|
| `white` | `#FFFFFF` | Base reading surface |
| `card` | `#F0F4F0` | Slightly elevated surface for cards |
| `forest` | `#145559` | Brand surface for marketing blocks |
| `dark` | `#0A2D30` | Deep contrast band for emphasis |

**Rule:** Never manually specify border colors inside a `<Surface>`. Trust the context.

**Storybook stories:** AllVariants

---

### Color Palette Story

Storybook page that renders all brand colors as swatches with:
- Token name
- Hex value
- Usage note
- On-color contrast preview

Swatches to display:
`forest` / `dark` / `accent` / `cream` / `ink` / `muted` / `white`
`surface-card` / `surface-dark` / `surface-forest`
`border-light` / `border-dark`

---

## 7. Component Catalogue

### 7.1 `<Button>`

```tsx
type ButtonProps = {
  variant?: 'primary' | 'primary-dark' | 'icon'
  size?: 'default' | 'sm'
  children: React.ReactNode
  onClick?: () => void
  href?: string
  disabled?: boolean
  className?: string
}
```

**Anatomy:**
```
[container: sharp rect, overflow-hidden, border accent]
  [sweep layer: absolute, bg-accent, translateX(-101%) → 0 on hover]
  [shine layer: absolute, diagonal white gradient, slides on hover]
  [text: relative z-10, color accent → white on hover]
```

**Storybook stories:**
- `Primary` - default state
- `PrimaryHover` - use `play()` to trigger hover via userEvent
- `PrimaryDark` - on dark background decorator
- `Icon` - 40×40 with ChevronLeft / ChevronRight
- `Disabled`

---

### 7.2 `<Card>`

```tsx
type CardProps = {
  index?: string           // "01", "02" etc - optional Geist Mono label
  headline: string
  description?: string
  ctaLabel?: string
  href?: string
  surface?: 'white' | 'forest'
  className?: string
}
```

**Anatomy:**
```
[container: sharp rect, border-b border-r border-light, overflow-hidden, min-h-[260px]]
  [indicator bar: absolute left-0, w-[3px], h-0 → h-full on hover, bg-accent]
  [texture overlay: absolute inset, opacity-0 → opacity-20 on hover]
  [content: relative z-10, p-8→p-12, flex-col justify-between]
    [top: index + headline + description]
    [bottom: ctaLabel]
```

**Storybook stories:**
- `Default` - with all props
- `WithoutIndex` - no index number
- `OnForestSurface` - inverted palette (in development)
- `GridOf4` - 2×2 grid showing border sharing behavior

---

### shadcn Components

All remaining UI elements (inputs, dialogs, tabs, badges, selects, etc.)
should use the default shadcn/ui components.

Only apply the following adjustments when necessary:

• force `rounded-none` unless the component represents a form control  
• replace default colors with Planton design tokens  
• remove elevation shadows in favor of border-based separation  

The goal is to keep the system lean and avoid recreating primitives
that already exist in shadcn.

## 8. Motion Primitives

All motion constants should be imported from `tokens/motion.ts`.

```ts
// tokens/motion.ts

export const duration = {
  fast:    200,    // ms
  base:    300,
  reveal:  400,
  sweep:   500,
  shine:   700,
} as const

export const easing = {
  sweep:   'cubic-bezier(0.16, 1, 0.3, 1)',
  lift:    'cubic-bezier(0.22, 1, 0.36, 1)',
  default: 'ease-out',
} as const

export const reveal = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: 'easeOut' },
} as const
```

### Rules (enforced at review)

| Rule | Rationale |
|---|---|
| Never `transition: all` | Prevents unintended property transitions |
| No `scale()` on content elements | Scale feels playful; lift (`-1px`) is the brand idiom |
| No looping animations on static content | Loops distract from reading |
| No spring/bounce easing | Communicates precision, not energy |
| Stagger max: 100ms per element | Longer staggers read as broken, not designed |

---

## 9. Storybook Structure

### Navigation tree

```
Introduction
│
├── Foundations
│   ├── Colors
│   ├── Typography
│   ├── Spacing
│   └── Motion
│
├── Primitives
│   ├── Button
│   ├── Heading
│   ├── Body
│   ├── Eyebrow
│   ├── Label
│   ├── Quote
│   └── Tagline
│
└── shadcn
    ├── Card
    ├── Input
    ├── Textarea
    ├── Dialog
    └── Tabs
```

---

## 10. Patterns (Screens)

Patterns represent **real UI compositions** built using the design system.

They demonstrate how primitives and shadcn components combine to form
actual product interfaces.

Patterns are not reusable primitives. They are examples of how the
system is used inside real screens.

Typical pattern categories:

Auth
• Login screen
• Signup flow
• Password reset

Education Platform
• Course page layout
• Lesson card grid
• Video lesson view
• Quiz interface

Rules for patterns:

• Patterns may use primitives and shadcn components  
• Patterns should not introduce new design tokens  
• If a UI structure appears in **three or more places**, it should be
  extracted into a reusable component and moved to `components/`

Storybook navigation example:

```
Patterns
  Auth
    LoginPage
    SignupPage
  Education
    LessonPage
    CourseOverview
```

Patterns are intended to function as **living UI blueprints** for product teams.

---

### Storybook decorators

#### Surface Decorator

Wraps stories in the correct `<Surface>` context.
Apply to all dark-surface stories automatically via a parameter.

```tsx
// .storybook/decorators.tsx
export const withSurface = (surface: 'white' | 'forest' | 'dark') =>
  (Story: React.FC) => (
    <div
      style={{
        background: surfaceColor[surface],
        padding: '48px',
        minHeight: '200px',
      }}
    >
      <Story />
    </div>
  )
```

#### Font Decorator

Loads `Space Grotesk`, `Instrument Sans`, `Geist Mono` via Google Fonts.
`Roca` via Adobe Fonts (`use.typekit.net`).
Apply globally in `preview.ts`.

---

### Story conventions

```tsx
// Example: Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
The Planton primary CTA button. Sharp rectangle, accent border,
horizontal fill sweep on hover. Zero border-radius is mandatory.
See Motion tokens for sweep/shine durations.
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: { variant: 'primary', children: 'Fale com um especialista' },
}

export const PrimaryDark: Story = {
  args: { variant: 'primary-dark', children: 'Fale com um especialista' },
  decorators: [withSurface('forest')],
}

export const Icon: Story = {
  args: { variant: 'icon', children: <ChevronRight size={18} /> },
}
```

---

### MDX pages required

| Page | Purpose |
|---|---|
| `Introduction.mdx` | Brand overview, design target summary, link to DESIGN_LANGUAGE.md |
| `Colors.mdx` | Swatch grid + usage rules + what never to do |
| `Typography.mdx` | Specimen for each type role with usage rules inline |
| `EditorialGrid.mdx` | Visual explanation of the grid frame system with live examples |
| `Motion.mdx` | Animated demos for each hover and reveal interaction |
| `DoAndDont.mdx` | Side-by-side correct vs incorrect usage of key patterns |

---

## 11. Do / Don't Reference

### Color

| Do | Don't |
|---|---|
| Use `#ADCF78` for borders, labels, indicator bars | Use `#ADCF78` as a large background fill |
| Use `#ADCF78` for author names and eyebrows | Use `#ADCF78` in body copy paragraphs |
| Use `#145559` as the primary text color on white | Use `#22c55e` or any saturated green |
| Tier text opacity on dark surfaces (100% / 80% / 40–60%) | Add new brand colors beyond the defined 6 |

### Typography

| Do | Don't |
|---|---|
| Use Space Grotesk with negative tracking for all headlines | Use Roca for functional UI labels |
| Use Roca Bold only for testimonial quotes and taglines | Mix heading and body typefaces in the same tier |
| Use Geist Mono for eyebrows, index numbers, utility labels | Use Instrument Sans for eyebrows (wrong register) |
| Apply `line-height: 1.1` to all headings | Use default browser line-height on headings |

### Borders & Radius

| Do | Don't |
|---|---|
| Use `border-radius: 0` on all content cards and panels | Round button corners |
| Use `rgba(0,0,0,0.2)` for borders on white surfaces | Use `box-shadow` for elevation |
| Share borders between adjacent grid cells | Add individual card borders that double up |
| Use `rgba(255,255,255,0.1)` for borders on dark surfaces | Use solid white or solid black borders |

### Motion

| Do | Don't |
|---|---|
| Use `cubic-bezier(0.16, 1, 0.3, 1)` for sweep fill | Use spring physics or bounce easing |
| Animate only `opacity`, `transform`, `width`, `height` | Use `transition: all` |
| Keep entrance animations under `400ms` | Loop animations on static content elements |
| Stagger sequential reveals by `100ms` | Use `scale()` on hover for content cards |

### Layout

| Do | Don't |
|---|---|
| Constrain all content inside `max-w-[1400px]` | Let content columns exceed the frame width |
| Let backgrounds bleed full-width outside the frame | Clip dark band backgrounds to the frame |
| Use the 3-step padding scale (pad-sm / pad-md / pad-lg) | Invent new padding values per component |
| Leave intentional empty cells in the grid | Fill every available cell |
