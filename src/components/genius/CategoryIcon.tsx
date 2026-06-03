import type { ComponentType } from 'react'
import type { LucideProps } from 'lucide-react'
import { CATEGORY_ICON_ANIM } from './categories'

export { CATEGORY_ICON_ANIM }

export type CategoryIconVariant = 'hover' | 'loop' | 'static'

type CategoryIconProps = {
  /** Componente de ícone a renderizar (lucide ou SVG custom; ex.: `cat.icon`). */
  icon: ComponentType<LucideProps>
  /** ID da categoria — seleciona a animação cinética correspondente. */
  categoryId: string
  size?: number
  /**
   * - `hover`  → anima no hover; requer ancestral com classe `.genius-chip`
   * - `loop`   → anima em loop infinito (usado no modal de sucesso)
   * - `static` → sem animação
   */
  variant?: CategoryIconVariant
  /** Classe extra aplicada ao wrapper (cor, etc.). */
  className?: string
}

/**
 * Ícone de categoria de emissão com animação cinética reutilizável.
 *
 * O wrapper `.genius-chip-icon` carrega a animação; o `variant` decide quando
 * ela dispara. A cor é controlada via `className` (ex.: `text-white/80`).
 *
 * Direção (upstream/downstream) é codificada no próprio ícone + animação
 * (ex.: caminhão vs van, decolagem vs pouso), não em badge.
 */
export function CategoryIcon({
  icon: Icon,
  categoryId,
  size = 15,
  variant = 'hover',
  className = '',
}: CategoryIconProps) {
  const anim = variant === 'static' ? '' : CATEGORY_ICON_ANIM[categoryId] ?? ''
  const kick = variant === 'loop' ? 'genius-success-kick' : ''
  return (
    <span className={`genius-chip-icon shrink-0 ${anim} ${kick} ${className}`.trim()}>
      <Icon size={size} />
    </span>
  )
}
