import type { CSSProperties } from 'react'
import { offeringJourney } from '../content'
import './TempleOfferings.css'

export function TempleOfferings() {
  return (
    <section id="features" className="section section--tint offerings" aria-labelledby="offerings-title">
      <div className="wrap">
        <header className="offerings__head">
          <p className="kicker" data-reveal>Features</p>
          <h2 id="offerings-title" className="statement" data-reveal style={{ '--d': 1 } as CSSProperties}>From a devotee’s offering to a trustee’s report, <em>one record.</em></h2>
        </header>

        <ol className="ledger" data-reveal>
          {offeringJourney.map((item, index) => (
            <li className="ledger__entry" key={item.step} style={{ '--i': index } as CSSProperties}>
              <span className="ledger__num">{['I', 'II', 'III', 'IV', 'V'][index]}</span>
              <h3 className="ledger__step">{item.step}</h3>
              <p className="ledger__module">{item.module}</p>
              <p className="ledger__text">{item.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
