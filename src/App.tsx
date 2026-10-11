import { TempleFooter } from './components/TempleFooter'
import { TempleHeader } from './components/TempleHeader'
import { TempleHero } from './hero/TempleHero'
import { TempleBeforeAfter } from './sections/TempleBeforeAfter'
import { TempleConnected } from './sections/TempleConnected'
import { TempleContact } from './sections/TempleContact'
import { TempleFaq } from './sections/TempleFaq'
import { TempleHowWeWork } from './sections/TempleHowWeWork'
import { TempleIntro } from './sections/TempleIntro'
import { TempleOfferings } from './sections/TempleOfferings'
import { TempleTestimonial } from './sections/TempleTestimonial'
import { useReveal } from './useReveal'
import './styles/site.css'

export function App() {
  useReveal()
  return (
    <>
      <a className="skip-link" href="#institution">Skip the intro film</a>
      <TempleHeader />
      <main id="main">
        <TempleHero />
        <TempleIntro />
        <TempleBeforeAfter />
        <TempleConnected />
        <TempleOfferings />
        <TempleHowWeWork />
        <TempleTestimonial />
        <TempleFaq />
        <TempleContact />
      </main>
      <TempleFooter />
    </>
  )
}
