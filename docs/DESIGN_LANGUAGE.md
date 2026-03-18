# Planton Design Language - Extracted Foundations

> Reverse-engineered from the live product (March 2026).
> Source of truth for any new Design System built on top of this brand.

---

## Layer 1 - Surface UI (observations)

**Color** - The palette is minimal: a deep forest teal (`#145559`) dominates as the primary brand color across text, borders, and filled surfaces. An off-white warm cream (`#F7F3DB`) is the dominant background on dark surfaces (footer, mega menu). A light yellow-green accent (`#ADCF78`) appears exclusively as a highlight signal - CTAs, labels, author names, eyebrows, hover states. Sections alternate between white and near-black (`#0A2D30`) panels to create rhythm without introducing new hues.

**Typography** - Three faces do clearly separated jobs: a display/utility sans (Instrument Sans) handles body copy and UI labels; a geometric heading sans (Space Grotesk) handles all large headlines with tight negative tracking; a display serif/slab (Roca) appears only in testimonial quotes and the footer tagline - acting as an emotional voice layer. A monospace face (Geist Mono) appears in small-caps eyebrows, product index numbers, and utility labels.

**Borders** - Hard, 1px lines at low opacity (`black/20` on light surfaces, `white/10` on dark) define every section boundary, column split, and card edge. There are no shadows. The visual separation language is entirely border-based.

**Spacing** - Section internal padding follows a three-step scale: `p-8 → p-10 → p-12` (mobile → tablet → desktop), applied uniformly. Vertical section rhythm uses `py-24 → py-32`. This creates a consistent, breathable density.

**Radius** - Effectively absent at the page content level. Cards, grids, and panels are all sharp-cornered rectangles. The only softness appears on small utility elements (buttons are borderless rectangles, not rounded pills).

---

## Layer 2 - Design Patterns (recurring structures)

**The Grid Frame** - The most distinctive recurring pattern. A fixed max-width container (`1400px`) gains `border-l` and `border-r` at `black/20`. Inside, `border-b` and `border-t` horizontal rules separate rows. This creates a literal editorial grid structure - sections feel like cells in a newspaper layout. The border lines are structural, not decorative.

**Two-Column Content Split** - Most sections use a `1fr / 1fr` or `[160px / 1fr]` grid. Left carries a signal or label (quote icon, section number, chart), right carries the primary content. The dividing border is always rendered.

**The Eyebrow + Headline + Body hierarchy** - Every content section follows a three-tier stack:
1. Eyebrow in Geist Mono, uppercase, tracked, accent green - acts as a category signal.
2. Headline in Space Grotesk, 40–70px, tracking `-0.04em` to `-0.05em`, forest teal.
3. Body in Instrument Sans, 16–18px, relaxed line-height, same forest teal at lower visual weight.

**The Sweep CTA Button** - The primary button is a sharp rectangle with an `#ADCF78` border and text. On hover, the background fills with a horizontal sweep animation from left to right, turning text white. A diagonal shine passes over. Zero border-radius. This pattern is reused on icon navigation buttons too - completely consistent across the system.

**The Hover Indicator Bar** - Product cards and mega-menu rows reveal a 3px tall `#ADCF78` vertical strip on the left edge when hovered. The rest of the card darkens subtly via a texture overlay. This creates a tactile, precise "selected row" affordance.

**The Dark Band** - Alternating full-width dark sections (`#0A2D30` or `#145559` background) punctuate the page between light content sections. These dark bands use the same border grid language but inverted to `white/10`. The Planton Genius branding appears here - a subproduct label in accent green above a large serif-style headline.

**Testimonial Block** - A grid with a decorative quote glyph image isolated in a narrow left column (bordered), and the quote rendered in Roca Bold at a large, editorial size. Author name in accent green, role/company in forest teal at reduced opacity. Carousel navigated by the same sweep icon buttons.

---

## Layer 3 - Design Principles (underlying philosophy)

**Editorial layout, not app layout** - The interface is organized as a structured publication, not a product dashboard. The border grid language, column splits, and typeface hierarchy all recall print media - a sustainability company presenting itself with the authority of a financial newspaper.

**Color restraint as institutional signal** - Three meaningful colors and a near-absence of decorative hue. This constraint communicates precision and credibility - the register of certifications, protocols, and regulatory compliance, which is the company's domain. Adding color would undermine the tone.

**Typography is the personality layer** - The switch from Space Grotesk (cool, geometric, modern) to Roca (expressive, humanist) is the most emotionally charged moment in any page. It only happens in testimonials and the footer tagline. This restraint makes those moments feel significant - when the brand speaks in Roca, it means it.

**Borders over shadows - structure over elevation** - There is no shadow vocabulary. Depth is not simulated; instead, structure is made explicit through hard lines. This communicates transparency and directness, qualities aligned with carbon reporting and ESG accountability.

**Accent green as an action signal, never a fill** - `#ADCF78` never appears as a background fill on large surfaces. It only appears at the edge of interaction: hover bars, button outlines, labels, author names. This keeps the accent as a meaningful signal rather than decoration.

**Micro-animation through restraint** - Hover interactions are precise and mechanical (sweep, vertical bar, opacity). Scroll reveals are subtle (translateY 12px, 0.4s). Nothing bounces, pulses, or loops. Motion communicates control, not enthusiasm.

---

# Design System Foundations

---

## 1. Color System

### Brand Palette

| Token | Value | Role |
|---|---|---|
| `forest` | `#145559` | Primary brand. Text, borders, surfaces, primary UI |
| `dark` | `#0A2D30` | Deep dark surface. Dark section backgrounds |
| `accent` | `#ADCF78` | Action signal. CTA borders, hover bars, labels, eyebrows |
| `cream` | `#F7F3DB` | On-dark text and background. Footer, mega menu |
| `ink` | `#191919` | Near-black body text on white surfaces |
| `muted` | `#6B7280` | Secondary body text, captions |

### Usage Rules

- **`forest`** is the primary text color on white/light backgrounds. It reads as "ink" but carries brand identity.
- **`accent`** (`#ADCF78`) is used **only as a signal**: borders, indicator bars, labels, and interactive highlights. Never as a large filled area. Never in small continuous body text.
- **`cream`** is the exclusive text and background color on `dark` and `forest` surfaces.
- White (`#FFFFFF`) is used as the content surface between dark bands. The page background is white.
- Opacity variants are first-class - `cream/80`, `forest/35`, `white/10` - used for hierarchy within surfaces.

### Surface Tokens

| Token | Value | Role |
|---|---|---|
| `surface-white` | `#FFFFFF` | Default content panels |
| `surface-card` | `#F0F4F0` | Subtle card fill (rarely used) |
| `surface-dark` | `#0A2D30` | Dark section bands |
| `surface-forest` | `#145559` | Forest-filled sections, footer, mega menu |

### Border Tokens

| Token | Value | Role |
|---|---|---|
| `border-light` | `rgba(0,0,0,0.2)` | All borders on white/light surfaces |
| `border-dark` | `rgba(255,255,255,0.1)` | All borders on dark/forest surfaces |

---

## 2. Typography System

### Typeface Roles

| Role | Typeface | Purpose |
|---|---|---|
| **Display / Heading** | Space Grotesk | All section headlines, hero titles, mega menu titles |
| **Body / UI** | Instrument Sans | Body copy, UI labels, nav links, form fields, footer links |
| **Editorial Voice** | Roca (slab serif) | Testimonial quotes, footer tagline - emotional register only |
| **Utility / Code** | Geist Mono | Eyebrows, product index numbers, CTA labels, login, status |

### Scale

| Step | Size range | Tracking | Font | Usage |
|---|---|---|---|---|
| `display-xl` | 64–80px | `-0.05em` | Space Grotesk | Hero H1 |
| `display-lg` | 48–70px | `-0.05em` | Space Grotesk | Page H1 |
| `heading-xl` | 40–56px | `-0.04em` | Space Grotesk | Section H2 |
| `heading-lg` | 28–36px | `-0.02em` | Space Grotesk | Card H3, subsection |
| `quote` | `clamp(1.4rem, 2vw, 1.9rem)` | `0` | Roca Bold | Testimonials |
| `tagline` | 48–72px | `0` | Roca Regular | Footer tagline |
| `body-lg` | 18px | `0` | Instrument Sans | Intro paragraphs |
| `body` | 16px | `0` | Instrument Sans | General body |
| `body-sm` | 14px | `0` | Instrument Sans | Card descriptions, captions |
| `eyebrow` | 11–12px | `+0.12em` | Geist Mono | Section eyebrows, uppercase |
| `label` | 12px | `+0.05em` | Geist Mono | Product numbers, CTA labels, utility |

### Type Rules

- Headlines always use tight negative tracking (`-0.04` to `-0.05em`). This is non-negotiable - it's what makes the wordmark-quality of the headings.
- Line height for headings: `1.1`. For body: `1.6–1.7` (relaxed). For quotes: `1.3`.
- Eyebrow and utility labels in Geist Mono always uppercase with generous letter-spacing. They signal categories, not titles.
- Roca must never appear in functional UI. It exists exclusively in the "voice" register: quotes and brand taglines.

---

## 3. Spacing Philosophy

### Principle

Spacing is **consistent and generous**, not tight. The system uses a limited 3-step responsive scale for all internal padding.

### Internal Padding Scale (component/section level)

| Step | Mobile | Tablet | Desktop |
|---|---|---|---|
| `pad-sm` | 24px | 32px | 40px |
| `pad-md` | 32px | 40px | 48px |
| `pad-lg` | 48px | 56px | 64px |

### Section Vertical Rhythm

- Light sections: `py-96 / py-128` (24–32 equivalent in rem, roughly `py-24 lg:py-32`)
- Hero top padding: `pt-16 → pt-24` (below sticky nav)
- Between content blocks inside a section: `gap-4` (tight, 16px) or `gap-6` (24px)

### Layout Max-Width

- All content is constrained inside `max-w-[1400px]`, centered.
- No content bleeds outside this container except dark background fills.

### Density Strategy

Sections breathe. The system deliberately avoids packing multiple content blocks. Each unit of information - a headline, a paragraph, a feature list - occupies its own bordered row or cell. This low density is a trust signal.

---

## 4. Border / Editorial Grid Language

This is the most distinctive element of the design language.

### The Grid Frame

Every section optionally activates a **frame system**:
- The `max-width` container gains `border-left` and `border-right` at `border-light` (light surface) or `border-dark` (dark surface).
- Horizontal `border-bottom` lines separate rows within the frame.
- Column splits inside the grid have matching `border-right` on the left cell.

This creates a **letterpress / editorial grid** feeling. The borders are structural dividers, not decorative.

### Border Opacity

- On white: `rgba(0, 0, 0, 0.2)` - visible but not heavy
- On dark/forest: `rgba(255, 255, 255, 0.1)` - very subtle, barely visible

### No Shadows

Box shadows are absent from the design vocabulary. Elevation is communicated through bordered frames and background fills, not depth simulation.

### Border Radius

- Content-level cards and panels: `0` (sharp corners)
- Small utility UI only: `4–6px` may apply for form inputs or internal chips
- The border-radius zero rule is a deliberate expression of the brand's precision tone

---

## 5. Card Pattern

### Anatomy

A Planton card is a **bordered rectangle with consistent internal padding**, sharp corners, and the following optional layers:

1. **Index number** (top-left): Geist Mono, `xs`, accent green - indicates position in a set
2. **Headline**: Space Grotesk, `heading-lg`, forest teal - primary label
3. **Description**: Instrument Sans, `body-sm`, forest teal - supporting detail
4. **CTA label** (bottom): Geist Mono, `xs`, uppercase, tracked, accent green - "discover →"

### Interactive State

On hover a card reveals:
- A **3px vertical bar** in `#ADCF78` on the left edge, animated from `h-0` to `h-full`
- A **texture overlay** at reduced opacity (`~20%`) - a grain/noise texture in matching tonal range

No shadow, no scale transform, no color inversion. The hover state is **edge-marking**, not volumetric.

### Card Border Behavior

Cards live inside the grid frame. Their borders are part of the frame - `border-b border-r border-black/20`. Cards share borders with adjacent cells.

---

## 6. Motion Philosophy

### Principle: Mechanical Precision

Motion is restrained, directional, and short. It does not express joy or playfulness - it expresses control and accuracy.

### Entrance Animations

- **Reveal on scroll**: `translateY(12px) → translateY(0)` + `opacity: 0 → 1`, `0.4s ease-out`
- Delay stagger where applicable: `~100ms` per element
- No bounces, spring physics, or overshoots

### Hover Animations

| Interaction | Behavior | Duration | Easing |
|---|---|---|---|
| Button CTA fill | Horizontal sweep, left → right | `500ms` | `cubic-bezier(.16,1,.3,1)` |
| Button shine | Diagonal white band, left → right | `700ms` | linear |
| Button lift | `translateY(-1px)` | `300ms` | `cubic-bezier(.22,1,.36,1)` |
| Card indicator bar | `h: 0 → 100%` left edge | `300ms` | `ease-out` |
| Card texture | `opacity: 0 → 0.20` | `500ms` | linear |
| Nav link underline | `width: 0 → 100%` on bottom | `200ms` | default |
| Mega menu | `opacity + translateY(-8px)` | `300ms` | default |

### Content Transitions

- Testimonial swap: `opacity + translateY(16px)`, `700ms ease-out`, crossfade with 400ms off delay
- Page/panel transitions: `300ms ease-out`

### Rules

- Never use indefinitely looping animations on content elements (only technical data visualizations may use them if meaningful).
- Never animate scale on content - lift via `translateY(-1px)` only.
- Avoid `transition: all` - always specify the property.

---

## 7. Interaction Patterns

### Primary CTA Button

- Shape: sharp rectangle, no border-radius
- Default: `#ADCF78` border + `#ADCF78` text on transparent background
- Hover: accent fill sweeps in from left, text turns white
- Font: Instrument Sans (body family), normal weight
- Padding: generous horizontal (`px-10 py-5` equivalent)
- Used for: primary conversions, contact forms, product pages

### Navigation Buttons (arrows, carousel controls)

- Same rectangle + sweep hover pattern as CTA, but `40×40px` icon containers
- Consistent design language - every interactive bordered rectangle behaves the same

### Links / Nav Items

- Instrument Sans, 15px
- Color: `dark` by default, transitions to `forest` on hover
- Hover decoration: 1px underline grows from left on hover

### Dropdowns and Mega Menus

- Background: `forest` (`#145559`) - creates a strong contrast shift from the white header
- Items are full-width rows with `border-top/bottom` at `white/10`
- Rows follow the card hover pattern (left indicator bar + texture)
- Eyebrow labels in Geist Mono accent green introduce context above items

### Form Inputs

- Used in CTA and newsletter contexts
- Sharp borders, no border-radius
- Minimal styling - border-bottom or full border in `border-light`
- Placeholder text in muted opacity

---

## 8. Visual Hierarchy Rules

### The Three-Tier Section Stack

Every content section follows:

```
[eyebrow: Geist Mono / uppercase / accent]
[headline: Space Grotesk / large / tight tracking / forest]
[body: Instrument Sans / relaxed / forest at body weight]
```

This stack is applied consistently, meaning information hierarchy is always readable without needing to inspect color - size and typeface alone carry the meaning.

### Color for Emphasis, Not Decoration

- `#ADCF78` appears where the eye should land to take an action or read a category.
- `forest` teal is the neutral reading color - not a highlight.
- White and cream are reserved for on-dark surfaces.

### The Silence Rule

Significant amounts of white space and blank grid cells are used intentionally. A section with a single centered heading - no content around it - reads as a transition or emphasis beat. Do not fill every cell.

### Hierarchy Inside Dark Sections

On dark backgrounds, text opacity tiers replace color tiers:
- Primary text: `cream` at `100%`
- Secondary text: `cream` at `80%`
- Metadata / footnotes: `cream` at `40–60%`

---

## 9. Brand Tone

### Summary Descriptor

**Precise authority with environmental soul.** The interface communicates like a regulatory document that believes in what it measures. It is serious without being cold, green without being naive.

### Visual Tone Words

- **Precise** - hard borders, exact type scales, no visual noise
- **Institutional** - the border-grid reads like a financial data table
- **Restrained** - color restraint, motion restraint, radius restraint
- **Credible** - the interface uses the same seriousness as the certifications it displays (GHG Protocol, CDP, B Corp)
- **Human at the edge** - warmth surfaces only in specific moments: the Roca serif, the `#ADCF78` green, testimonial quotes. It is never the default register.

### What to Never Do

- No playful rounded shapes or bubbly border-radii on content components
- No gradient fills on brand surfaces (gradients reserved for dark atmospheric hero images only)
- No saturated greens (`#22c55e` - explicitly excluded from the palette)
- No `#ADCF78` in running body text - it is an action/signal color, not a reading color
- No shadow vocabulary on components - borders define structure
- No type mixing within the same hierarchy tier (Roca must never be used for UI labels or functional text)

### Design Target

The product should feel like **a Goldman Sachs report redesigned by someone who grew up in a rainforest**. The rigor of institutional finance, the palette of canopy and earth.
