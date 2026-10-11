import mark from '../assets/brand/aram-mark.png'

/** ARAM lotus-and-அ mark (drawn as a mask so it takes the current text colour) with the wordmark. */
export function Brand({ tagline = true }: { tagline?: boolean }) {
  return (
    <a className="brand" href="#top" aria-label="ARAM ERP for Temples — back to top">
      <span className="brand__mark" style={{ maskImage: `url(${mark})`, WebkitMaskImage: `url(${mark})` }} aria-hidden="true" />
      <span className="brand__word">
        ARAM ERP
        {tagline && <span className="brand__tag">for Temples</span>}
      </span>
    </a>
  )
}
