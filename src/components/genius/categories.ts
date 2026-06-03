import type { ComponentType } from 'react'
import {
  Truck, Flame, Zap, Snowflake, Plane, Trash2,
  Wheat, PlaneTakeoff, PlaneLanding, Helicopter, Anchor, Ship, Container,
  Droplets, Trees, Recycle, House, Car, Van,
  type LucideProps,
} from 'lucide-react'
import { CowIcon } from './icons/CowIcon'

/**
 * Catálogo de categorias de emissão do inventário GHG.
 *
 * Fonte única para:
 *  - ícone lucide de cada categoria
 *  - classe de animação cinética (`genius-icon-*`) — ver `src/app/globals.css`
 *
 * As 6 primeiras (escopo das telas atuais) já existiam no ChatScreen e estão
 * travadas (ícone + animação). As demais foram desenhadas para que cada família
 * (3 modos de transporte × upstream/downstream, 2 agrícolas) leia como conjunto
 * mas com cada membro distinto por ícone e/ou direção de movimento.
 */
export type EmissionScope = 1 | 2 | 3

export type CategoryDef = {
  id: string
  label: string
  scope: EmissionScope
  /** Componente de ícone — lucide ou SVG custom compatível ({@link LucideProps}). */
  icon: ComponentType<LucideProps>
  /** Classe de animação cinética — sufixo após `genius-icon-`/`genius-loop-`. */
  anim: string
  /** Direção de fluxo para categorias upstream/downstream. */
  direction?: 'up' | 'down'
}

export const EMISSION_CATEGORIES: CategoryDef[] = [
  // ── Escopo 1 ──────────────────────────────────────────────
  { id: 'agricola-fermentacao-enterica', label: 'Atividades Agrícolas (Fermentação Entérica)', scope: 1, icon: CowIcon,      anim: 'genius-icon-cow' },
  { id: 'agricola-manejo-solo',          label: 'Atividades Agrícolas (Manejo de Solo)',        scope: 1, icon: Wheat,        anim: 'genius-icon-wheat' },
  { id: 'combustao-estacionaria',        label: 'Combustão Estacionária',                       scope: 1, icon: Flame,        anim: 'genius-icon-flame' },
  { id: 'combustao-movel-aereo',         label: 'Combustão Móvel (Aéreo)',                      scope: 1, icon: Helicopter,   anim: 'genius-icon-heli' },
  { id: 'combustao-movel-hidroviario',   label: 'Combustão Móvel (Hidroviário)',                scope: 1, icon: Anchor,       anim: 'genius-icon-anchor' },
  { id: 'combustao-movel',               label: 'Combustão Móvel (Rodoviário)',                 scope: 1, icon: Car,          anim: 'genius-icon-car' },
  { id: 'efluentes-liquidos',            label: 'Efluentes Líquidos',                           scope: 1, icon: Droplets,     anim: 'genius-icon-droplets' },
  { id: 'emissoes-fugitivas',            label: 'Emissões Fugitivas',                           scope: 1, icon: Snowflake,    anim: 'genius-icon-snow' },
  { id: 'mudanca-uso-solo',              label: 'Mudança no Uso do Solo',                       scope: 1, icon: Trees,        anim: 'genius-icon-trees' },
  { id: 'residuos-compostagem',          label: 'Resíduos Sólidos (Compostagem)',               scope: 1, icon: Recycle,      anim: 'genius-icon-recycle' },

  // ── Escopo 2 ──────────────────────────────────────────────
  { id: 'energia-eletrica',              label: 'Aquisição de Energia Elétrica',                scope: 2, icon: Zap,          anim: 'genius-icon-zap' },

  // ── Escopo 3 ──────────────────────────────────────────────
  { id: 'emissoes-casa-trabalho',        label: 'Emissões Casa-Trabalho',                       scope: 3, icon: House,        anim: 'genius-icon-home-hop' },
  { id: 'residuos',                      label: 'Resíduos Gerados nas Operações',               scope: 3, icon: Trash2,       anim: 'genius-icon-trash' },
  { id: 'transporte-aereo-downstream',   label: 'Transporte Aéreo Downstream',                  scope: 3, icon: PlaneLanding,  anim: 'genius-icon-air-down',  direction: 'down' },
  { id: 'transporte-aereo-upstream',     label: 'Transporte Aéreo Upstream',                    scope: 3, icon: PlaneTakeoff, anim: 'genius-icon-air-up',    direction: 'up' },
  { id: 'transporte-hidro-downstream',   label: 'Transporte Hidroviário Downstream',            scope: 3, icon: Ship,         anim: 'genius-icon-ship-down', direction: 'down' },
  { id: 'transporte-hidro-upstream',     label: 'Transporte Hidroviário Upstream',              scope: 3, icon: Container,    anim: 'genius-icon-container', direction: 'up' },
  { id: 'transporte-rodo-downstream',    label: 'Transporte Rodoviário Downstream',             scope: 3, icon: Van,          anim: 'genius-icon-van',       direction: 'down' },
  { id: 'transporte-rodo-upstream',      label: 'Transporte Rodoviário Upstream',               scope: 3, icon: Truck,        anim: 'genius-icon-truck',     direction: 'up' },
  { id: 'viagens-negocios',              label: 'Viagens a Negócios',                           scope: 3, icon: Plane,        anim: 'genius-icon-plane' },
]

/**
 * Mapa categoria → classe de animação cinética.
 * Derivado de `EMISSION_CATEGORIES`. A mesma classe (`genius-icon-*`) dispara
 * dois comportamentos no CSS:
 *  - variant `hover`: anima 1x quando o ancestral `.genius-chip` recebe hover
 *  - variant `loop`:  combinada com `.genius-success-kick`, anima em loop infinito
 *    (usa o keyframe `genius-loop-<sufixo>`)
 */
export const CATEGORY_ICON_ANIM: Record<string, string> = Object.fromEntries(
  EMISSION_CATEGORIES.map((c) => [c.id, c.anim])
)
