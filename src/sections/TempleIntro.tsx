import type { CSSProperties } from 'react'
import dashboard from '../assets/product/dashboard-laptop.webp'
import { ArrowIcon, CheckIcon } from '../components/Icons'
import { overviewPoints } from '../content'
import './TempleIntro.css'

export function TempleIntro() {
  return (
    <section id="institution" className="section intro" aria-labelledby="intro-title">
      <div className="wrap intro__grid">
        <div className="intro__copy">
          <p className="kicker" data-reveal>Overview</p>
          <h2 id="intro-title" className="statement" data-reveal style={{ '--d': 1 } as CSSProperties}>
            The work behind the worship, <em>in one place.</em>
          </h2>
          <p className="lede" data-reveal style={{ '--d': 2 } as CSSProperties}>
            ARAM ERP is one integrated platform for the office side of temple life.
          </p>
          <ul className="intro__points" data-reveal style={{ '--d': 3 } as CSSProperties}>
            {overviewPoints.map((point) => <li key={point}><CheckIcon />{point}</li>)}
          </ul>
          <a className="link intro__link" href="#platform" data-reveal style={{ '--d': 4 } as CSSProperties}>See the platform <ArrowIcon /></a>
        </div>

        <figure className="showcase" data-reveal style={{ '--d': 2 } as CSSProperties}>
          <img
            className="showcase__device"
            src={dashboard}
            width={1555}
            height={927}
            alt="ARAM ERP dashboard on a laptop: today’s panchangam, collections today and this month, active projects, sevas booked today and upcoming festivals."
            loading="lazy"
            decoding="async"
          />
          <p className="showcase__chip">
            <span className="showcase__dot" aria-hidden="true" />
            <span><strong>Records in sync</strong><small>One trusted view</small></span>
          </p>
        </figure>
      </div>
    </section>
  )
}
