import { useEffect, useRef, useState } from 'react'
import { nav } from '../content'
import { Brand } from './Brand'
import { ArrowIcon, MenuIcon } from './Icons'

export function TempleHeader() {
  const headerRef = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)

  // Light-on-dark while over the hero; written to the DOM directly, no re-render on scroll.
  useEffect(() => {
    const header = headerRef.current!
    let frame = 0
    const update = () => {
      frame = 0
      const hero = document.getElementById('top')
      const overHero = hero ? hero.getBoundingClientRect().bottom > header.offsetHeight + window.innerHeight * .4 : false
      header.dataset.tone = overHero ? 'dark' : 'light'
      header.classList.toggle('is-scrolled', window.scrollY > 8)
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(frame) }
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open])

  const close = () => setOpen(false)

  return (
    <header ref={headerRef} className={`site-header${open ? ' is-open' : ''}`} data-tone="dark">
      <div className="site-header__inner">
        <Brand />
        <nav id="site-nav" className="site-nav" aria-label="Main">
          <ul>
            {nav.map(([label, href]) => <li key={href}><a href={href} onClick={close}>{label}</a></li>)}
          </ul>
          <a className="button site-nav__cta" href="#contact" onClick={close}>Request a Demo <ArrowIcon /></a>
        </nav>
        <a className="button site-header__cta" href="#contact">Request a Demo</a>
        <button className="site-header__toggle" type="button" aria-expanded={open} aria-controls="site-nav" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>
          <MenuIcon open={open} />
        </button>
      </div>
    </header>
  )
}
