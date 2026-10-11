import type { CSSProperties } from 'react'
import { testimonial } from '../content'
import './TempleTestimonial.css'

export function TempleTestimonial() {
  return (
    <section id="reviews" className="section section--tint reviews" aria-labelledby="reviews-title">
      <div className="wrap">
        <header className="section-head section-head--center">
          <p className="kicker" data-reveal>Reviews</p>
          <h2 id="reviews-title" className="statement" data-reveal style={{ '--d': 1 } as CSSProperties}>In daily use <em>at a temple office.</em></h2>
        </header>

        <figure className="review" data-reveal>
          <svg className="review__mark" width="40" height="30" viewBox="0 0 42 32" aria-hidden="true">
            <path fill="currentColor" d="M0 32V19.2C0 8.5 5.6 2.1 16.8 0l1.6 4.4C12.6 6 9.6 9.5 9.4 15H17v17zm22.6 0V19.2C22.6 8.5 28.2 2.1 39.4 0L41 4.4C35.2 6 32.2 9.5 32 15h7.6v17z" />
          </svg>
          <blockquote className="review__quote"><p>{testimonial.quote}</p></blockquote>

          <div className="review__foot">
            <figcaption className="review__who">
              <span className="review__avatar" aria-hidden="true">{testimonial.initials}</span>
              <span><strong>{testimonial.name}</strong><span>{testimonial.place}</span></span>
            </figcaption>

            <p className="review__stat">
              <span><small>Before</small><strong>{testimonial.before}</strong></span>
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none" role="img" aria-label="became">
                <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span><small>With ARAM ERP</small><strong>{testimonial.after}</strong></span>
            </p>
          </div>
        </figure>
      </div>
    </section>
  )
}
