import { useEffect, useRef } from 'react'
import { ArrowIcon } from '../components/Icons'
import { CameraJourney, type JourneyState } from './CameraJourney'
import { desktopFrames, mobileFrames, posterFor } from './frames'
import { anchors, beats, holdShare, transitionWeights } from './storyboard'
import './hero.css'

const lastAnchor = anchors.length - 1
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const portrait = window.matchMedia('(max-aspect-ratio: 4/5)').matches
const poster = posterFor(portrait ? mobileFrames : desktopFrames)
const journeyLabel = `Scroll-controlled view of Brihadisvara Temple in Thanjavur, following the provided frame sequence into the temple.`

export function TempleHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const devRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const section = sectionRef.current!
    const canvas = canvasRef.current!
    let frame = -1
    let source = ''

    // Runs inside requestAnimationFrame: write straight to the DOM, never to React state.
    const onUpdate = ({ progress, position, source: nextSource }: JourneyState) => {
      const sequenceProgress = position / lastAnchor
      section.style.setProperty('--p', sequenceProgress.toFixed(4))
      section.style.setProperty('--hold', Math.max(0, (progress - (1 - holdShare)) / holdShare).toFixed(3))
      const sequenceLength = desktopFrames.sequence?.length ?? anchors.length
      const nextFrame = Math.round(sequenceProgress * (sequenceLength - 1))
      if (nextFrame !== frame || nextSource !== source) {
        frame = nextFrame
        source = nextSource
        const anchor = anchors[Math.min(anchors.length - 1, Math.round(nextFrame / Math.max(1, sequenceLength - 1) * lastAnchor))]
        if (devRef.current) {
          devRef.current.hidden = source === 'sequence'
          devRef.current.textContent = `${source === 'placeholder' ? 'Placeholder' : 'Anchor still'} · Frame ${anchor.id} — ${anchor.title}`
        }
      }
    }

    const journey = new CameraJourney({
      section, canvas, onUpdate,
      desktop: desktopFrames, mobile: mobileFrames,
      weights: transitionWeights, holdShare,
      still: reducedMotion,
    })
    journey.start()
    return () => journey.destroy()
  }, [])

  return (
    <section ref={sectionRef} id="top" className="hero" data-static={reducedMotion || undefined} aria-labelledby="hero-title" style={{ '--hold-share': holdShare } as React.CSSProperties}>
      <span className="hero__pause" aria-hidden="true" />
      <div className="hero__stage">
        <div className="hero__media">
          {poster && <img className="hero__poster" src={poster} alt="" fetchPriority="high" decoding="async" />}
          <canvas ref={canvasRef} className="hero__canvas" role="img" aria-label={journeyLabel} />
          <div className="hero__shade" aria-hidden="true" />
        </div>

        <div className="hero__opening" aria-hidden="true">
          <p className="hero__place">Brihadisvara Temple <span>Thanjavur, Tamil Nadu</span></p>
          <p className="hero__cue"><span />Scroll to enter</p>
        </div>

        <div className="hero__beats" aria-hidden="true">
          {beats.map((beat, index) => (
            <article
              className="beat"
              key={beat.from}
              style={{ '--from': beat.from, '--to': beat.to } as React.CSSProperties}
            >
              <p className="hero__eyebrow">{String(index + 1).padStart(2, '0')} · The work behind the worship</p>
              <h2 className="beat__title">{beat.title}</h2>
              {beat.text && <p className="beat__text">{beat.text}</p>}
            </article>
          ))}
        </div>

        <div className="hero__finale">
          <p className="hero__eyebrow">A calmer way to care for every temple</p>
          <h1 id="hero-title" className="hero__title">Ancient institutions. <em>Modern management.</em></h1>
          <p className="hero__lede">Devotees, sevas, panchangam, annadhanam, cashbook, banking, finance and assets — managed from one integrated platform.</p>
          <div className="hero__actions">
            <a className="button button--light" href="#contact">Request a Demo <ArrowIcon /></a>
            <a className="link hero__link" href="#institution">Explore the platform <ArrowIcon /></a>
          </div>
        </div>

        <p ref={devRef} className="hero__dev" aria-hidden="true" />
      </div>
    </section>
  )
}
