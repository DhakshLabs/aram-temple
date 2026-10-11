import type { CSSProperties } from 'react'
import { CheckIcon, CrossIcon } from '../components/Icons'
import { beforeAfter } from '../content'
import './TempleBeforeAfter.css'

export function TempleBeforeAfter() {
  return (
    <section id="before-after" className="section section--tint compare" aria-labelledby="compare-title">
      <div className="wrap">
        <header className="section-head section-head--center">
          <p className="kicker" data-reveal>Before &amp; after</p>
          <h2 id="compare-title" className="statement" data-reveal style={{ '--d': 1 } as CSSProperties}>From registers and receipt books <em>to one clear system.</em></h2>
        </header>

        <div className="compare__grid">
          <div className="compare__card compare__card--before" data-reveal>
            <h3 className="compare__label">Before <span>The old way</span></h3>
            <ul>{beforeAfter.map(({ before }) => <li key={before}><span className="compare__mark"><CrossIcon size={14} /></span>{before}</li>)}</ul>
          </div>
          <div className="compare__card compare__card--after" data-reveal style={{ '--d': 1 } as CSSProperties}>
            <h3 className="compare__label">After <span>With ARAM ERP</span></h3>
            <ul>{beforeAfter.map(({ after }) => <li key={after}><span className="compare__mark"><CheckIcon size={14} /></span>{after}</li>)}</ul>
          </div>
        </div>
      </div>
    </section>
  )
}
