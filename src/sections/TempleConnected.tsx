import { useMemo, useState, type CSSProperties } from 'react'
import { foundation, modules, type ModuleId } from '../content'
import './TempleConnected.css'

/** Colonnade order: from the ritual calendar, through devotees, to the books. */
const order: ModuleId[] = ['panchangam', 'projects', 'sevas', 'devotees', 'annadhanam', 'cashbook', 'banking', 'finance', 'assets', 'reports']
const columns = order.map((id) => modules.find((module) => module.id === id)!)
const indexOf = new Map(order.map((id, index) => [id, index]))

/** Every connection once, as [from, to] colonnade positions. */
const connections = (() => {
  const seen = new Set<string>()
  const pairs: [number, number][] = []
  for (const module of columns) {
    for (const link of module.links) {
      const pair = [indexOf.get(module.id)!, indexOf.get(link)!].sort((a, b) => a - b) as [number, number]
      const key = pair.join('-')
      if (!seen.has(key)) { seen.add(key); pairs.push(pair) }
    }
  }
  return pairs
})()

export function TempleConnected() {
  const [active, setActive] = useState<ModuleId>('cashbook')
  const current = columns[indexOf.get(active)!]

  // Arches spring from pillar to pillar: drawn in a 0–100 space along the colonnade (hidden on phones).
  const arches = useMemo(() => connections.map(([a, b]) => {
    const step = 100 / columns.length
    const from = (a + .5) * step
    const to = (b + .5) * step
    const rise = Math.min(96, (to - from) * 1.6 + 8)
    const path = `M ${from} 100 C ${from} ${100 - rise}, ${to} ${100 - rise}, ${to} 100`
    const lit = columns[a].id === active || columns[b].id === active
    return { key: `${a}-${b}`, path, lit }
  }), [active])

  const isLinked = (id: ModuleId) => current.links.includes(id)

  return (
    <section id="platform" className="section connected" aria-labelledby="connected-title">
      <div className="wrap">
        <header className="connected__head">
          <p className="kicker" data-reveal>The platform</p>
          <h2 id="connected-title" className="statement" data-reveal style={{ '--d': 1 } as CSSProperties}>Ten modules. <em>One foundation.</em></h2>
          <p className="lede" data-reveal style={{ '--d': 2 } as CSSProperties}>Each module carries its own work and connects to the rest. Choose one to see what it covers.</p>
        </header>

        <div className="colonnade" data-reveal="mask">
          <svg className="colonnade__arches" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {arches.map((arch) => <path key={arch.key} d={arch.path} className={arch.lit ? 'is-lit' : undefined} vectorEffect="non-scaling-stroke" />)}
          </svg>

          <ul className="colonnade__pillars">
            {columns.map((module, index) => (
              <li key={module.id}>
                <button
                  type="button"
                  className={`pillar${module.id === active ? ' is-active' : ''}${isLinked(module.id) ? ' is-linked' : ''}`}
                  aria-pressed={module.id === active}
                  aria-controls="module-detail"
                  onClick={() => setActive(module.id)}
                  onMouseEnter={() => setActive(module.id)}
                >
                  <span className="pillar__shaft" aria-hidden="true" />
                  <span className="pillar__num">{String(index + 1).padStart(2, '0')}</span>
                  <span className="pillar__name">{module.name}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="colonnade__foundation">
            <span>{foundation.name}</span>
            <span className="colonnade__foundation-text">{foundation.summary}</span>
          </div>
        </div>

        <div id="module-detail" className="module-detail" aria-live="polite">
          <h3 className="module-detail__name" key={current.id}>{current.name}</h3>
          <p className="module-detail__summary">{current.summary}</p>
          <ul className="module-detail__list">
            {current.details.map((detail) => <li key={detail}>{detail}</li>)}
          </ul>
          <p className="module-detail__links">
            <span>Works with</span> {current.links.map((id) => columns[indexOf.get(id)!].name).join(' · ')}
          </p>
        </div>
      </div>
    </section>
  )
}
