import type { CSSProperties } from 'react'
import { howWeWork } from '../content'
import './TempleHowWeWork.css'

export function TempleHowWeWork() {
  return (
    <section id="how" className="section how" aria-labelledby="how-title">
      <div className="wrap">
        <header className="section-head section-head--center">
          <p className="kicker" data-reveal>How we work</p>
          <h2 id="how-title" className="statement" data-reveal style={{ '--d': 1 } as CSSProperties}>Four simple steps <em>to go live.</em></h2>
        </header>

        <ol className="how__steps">
          {howWeWork.map((step, index) => (
            <li className="how__step" key={step.title} data-reveal style={{ '--d': index } as CSSProperties}>
              <span className="how__num">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="how__title">{step.title}</h3>
              <p className="how__text">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
