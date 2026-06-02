# Genius — Animation System

Reference for the motion vocabulary used across the **Genius** experience (chat + canvas) and, specifically, the **category chip** effects on the empty-state screen.

Use this doc to:

1. **Reuse** the chip effects (entrada, hover lift/glow, kinetic icons) in other surfaces.
2. **Add new emission categories** without losing the WOW.

All animations live in [`src/app/globals.css`](../src/app/globals.css). Screen wiring in [`src/screens/genius/chat/ChatScreen.tsx`](../src/screens/genius/chat/ChatScreen.tsx).

---

## 1. Shared motion vocabulary

Everything in Genius pulls from a small, consistent set of tokens so motion feels like one system.

| Token | Value | Use |
|---|---|---|
| **Easing — entrada** | `cubic-bezier(0.22, 1, 0.36, 1)` | Fades, slides, transitions. Calm, decelerating. |
| **Easing — bounce** | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Pops, kinetic icons. Slight overshoot, playful. |
| **Easing — split** | `cubic-bezier(0.76, 0, 0.24, 1)` | Symmetric in/out (e.g. painel expand). |
| **Accent** | `#ADCF78` → `--planton-accent` / `rgba(173, 207, 120, x)` | Glow, borda, shine. Brand green. |
| **Stagger step** | `70ms` | Delay between sequential elements. |

> **Regra**: novas animações reusam essas curvas + accent. Não inventar easing/cor por componente.

### Existing pre-chip animations (context)

`genius-enter-canvas`, `genius-enter-sidebar-left/right`, `genius-enter-grid`, `genius-split-expand`, `genius-btn-ready` (glow + shine sweep), `genius-btn-verify-ready`, `genius-dot-ready`. All in `globals.css`.

---

## 2. Category chip effects

Three layers, combináveis. Applied on the empty-state chips:

```
load → stagger pop (cada chip +70ms)
idle → estático
hover → lift + glow accent  +  ícone cinético por categoria
```

### Layer A — Entrada stagger pop

- Class **`.genius-chip`** → runs `@keyframes genius-chip-pop` (translateY + scale com overshoot).
- Chip começa `opacity: 0`; o pop revela.
- Delay vem **inline** por índice: `animationDelay: ${260 + i * 70}ms`.
  - `260ms` = espera logo/título assentarem antes dos chips entrarem.
  - `i * 70ms` = cascata.

### Layer B — Hover lift + glow

Embutido em `.genius-chip:hover`:

- `translateY(-3px)` (lift).
- Borda → `rgba(173,207,120,0.7)`.
- Glow → duplo `box-shadow` accent (drop + ring).
- `:active` → `translateY(-1px) scale(0.98)` (feedback tátil).
- Ícone → cor vira accent (`.genius-chip:hover .genius-chip-icon`).

### Layer C — Ícone cinético (por categoria)

Cada categoria tem keyframe próprio, dispara **só no hover** do chip pai:

| Categoria (`id`) | Ícone | Classe | Movimento |
|---|---|---|---|
| `combustao-movel` | Truck | `genius-icon-truck` | desliza no eixo X |
| `energia-eletrica` | Zap | `genius-icon-zap` | flash + scale pulse |
| `emissoes-fugitivas` | Snowflake | `genius-icon-snow` | gira 360° |
| `combustao-estacionaria` | Flame | `genius-icon-flame` | tremula (scale + rotate) |
| `viagens-negocios` | Plane | `genius-icon-plane` | voa diagonal |
| `residuos` | Trash2 | `genius-icon-trash` | pula (translateY + scaleY) |

Mapa id→classe vive no TSX:

```tsx
const CHIP_ICON_ANIM: Record<string, string> = {
  'combustao-movel': 'genius-icon-truck',
  'energia-eletrica': 'genius-icon-zap',
  'emissoes-fugitivas': 'genius-icon-snow',
  'combustao-estacionaria': 'genius-icon-flame',
  'viagens-negocios': 'genius-icon-plane',
  'residuos': 'genius-icon-trash',
}
```

### Markup (estrutura exigida)

O ícone precisa estar num `<span class="genius-chip-icon ...">` **dentro** do `.genius-chip` — a animação cinética e a cor de hover dependem dessa hierarquia.

```tsx
<button
  style={{ animationDelay: `${260 + i * 70}ms` }}
  className="genius-chip flex items-center gap-2.5 px-5 py-3 border border-border bg-background text-sm font-sans text-foreground"
>
  <span className={`genius-chip-icon shrink-0 text-muted-foreground ${iconAnim}`}>
    <Icon size={16} />
  </span>
  {cat.label}
</button>
```

> **Especificidade**: `.genius-chip:hover .genius-chip-icon` (0,2,0) vence a utility Tailwind `text-muted-foreground` (0,1,0) — por isso a cor accent aplica no hover.

### Acessibilidade

`@media (prefers-reduced-motion: reduce)` zera entrada, lift e ícone cinético. Manter ao adicionar efeitos novos.

---

## 3. Como adicionar uma nova categoria

Quando criar categoria nova em [`mock-data.ts`](../src/screens/genius/chat/mock-data.ts):

1. **Escolher ícone** lucide (ex. `Factory`), importar no `mock-data.ts` e setar `icon:`.
2. **Criar keyframe cinético** em `globals.css`, seguindo o padrão. Use easing bounce, duração 600–900ms, transform leve:

   ```css
   /* nova-categoria → fábrica solta fumaça */
   @keyframes genius-icon-factory {
     0%, 100% { transform: translateY(0); }
     40%      { transform: translateY(-2px) scale(1.06); }
     70%      { transform: translateY(0) scale(0.98); }
   }
   .genius-chip:hover .genius-icon-factory {
     animation: genius-icon-factory 650ms cubic-bezier(0.34, 1.56, 0.64, 1);
   }
   ```

3. **Mapear** no `CHIP_ICON_ANIM` do `ChatScreen.tsx`:

   ```tsx
   'nova-categoria': 'genius-icon-factory',
   ```

4. Pronto. Stagger + lift + glow aplicam automático (vêm de `.genius-chip`). Sem mapa cinético, o chip ainda ganha lift/glow — só o ícone fica parado (fallback `?? ''`).

**Princípio do movimento por ícone**: traduzir o *verbo* da categoria.
Combustão → calor/tremor · energia → pulso/flash · transporte → deslocamento · gás/fugitiva → rotação/dispersão · resíduo → queda/salto.

---

## 4. Reutilizar os efeitos fora do empty-state

- **Lift + glow** isolado: aplique `.genius-chip` em qualquer botão/card de seleção (cards de categoria, opções de wizard). Ganha entrada + hover de graça. Se não quiser stagger, sobrescreva `animation: none` ou omita `animationDelay`.
- **Ícone cinético** isolado: precisa do par `.genius-chip:hover .genius-icon-*`. Para reusar fora de chip, generalizar o seletor (ex. trocar `.genius-chip:hover` por um `.kinetic-host:hover`) antes.
- **Stagger pattern**: `animationDelay: ${base + i * 70}ms` num `.map()` funciona para qualquer lista que deva cascatear na entrada.

---

## Arquivos

| O quê | Onde |
|---|---|
| Keyframes + classes | [`src/app/globals.css`](../src/app/globals.css) (bloco "Empty-state category chips") |
| Mapa id→ícone + render | [`src/screens/genius/chat/ChatScreen.tsx`](../src/screens/genius/chat/ChatScreen.tsx) (`CHIP_ICON_ANIM`, empty-state) |
| Categorias / ícones | [`src/screens/genius/chat/mock-data.ts`](../src/screens/genius/chat/mock-data.ts) |
