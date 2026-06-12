import { useEffect, useState } from 'react'

// Anima um número de 0 até `target` com ease-out cúbico.
// Respeita prefers-reduced-motion (renderiza direto o alvo).
// Extraído de HeroSummary/DashboardTop (estava duplicado).
export function useCountUp(target: number, durationMs = 900) {
  const [value, setValue] = useState(target)
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    let started = false
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(eased * target))
      started = true
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      if (!started) setValue(target)
    }
  }, [target, durationMs])
  return value
}
