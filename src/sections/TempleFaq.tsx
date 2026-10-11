import type { CSSProperties } from 'react'
import { faqs } from '../content'
import './TempleFaq.css'

export function TempleFaq() {
  return (
    <section id="faq" className="section faq" aria-labelledby="faq-title">
      <div className="wrap faq__grid">
        <header className="faq__head">
          <p className="kicker" data-reveal>Questions</p>
          <h2 id="faq-title" className="statement" data-reveal style={{ '--d': 1 } as CSSProperties}>What temple offices <em>ask us first.</em></h2>
          <p className="lede" data-reveal style={{ '--d': 2 } as CSSProperties}>Something not covered here? <a href="#contact">Write to us</a> and we will answer it in your walkthrough.</p>
        </header>

        <div className="faq__list" data-reveal>
          {faqs.map((item, index) => (
            <details className="faq__item" key={item.q} name="faq" open={index === 0}>
              <summary>
                <span className="faq__num">{String(index + 1).padStart(2, '0')}</span>
                <span className="faq__q">{item.q}</span>
                <span className="faq__toggle" aria-hidden="true" />
              </summary>
              <p className="faq__a">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
