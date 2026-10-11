import { useEffect } from 'react'

/**
 * Adds `is-in` to each [data-reveal] element the first time it scrolls into view.
 * Mask reveals start fully clipped, which IntersectionObserver treats as invisible,
 * so those are triggered by their parent instead.
 */
export function useReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    document.documentElement.classList.add('js-reveal')
    const targets = new Map<Element, HTMLElement[]>()
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
      const watched = element.dataset.reveal === 'mask' ? element.parentElement ?? element : element
      targets.set(watched, [...(targets.get(watched) ?? []), element])
    })
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        targets.get(entry.target)?.forEach((element) => element.classList.add('is-in'))
        observer.unobserve(entry.target)
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: .1 })
    targets.forEach((_, element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])
}
