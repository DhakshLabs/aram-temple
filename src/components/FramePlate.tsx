import { desktopFrames } from '../hero/frames'
import { anchors } from '../hero/storyboard'

type Props = { anchor: number; className?: string }

/**
 * A still from the hero journey reused as section imagery, so the page keeps one
 * visual world. Shows a marked placeholder until that anchor frame is supplied.
 */
export function FramePlate({ anchor, className = '' }: Props) {
  const frame = anchors[anchor]
  const src = desktopFrames.anchors[anchor]
  return (
    <figure className={`frame-plate ${className}`}>
      {src
        ? <img src={src} alt={frame.description} loading="lazy" decoding="async" />
        : <div className="frame-plate__pending" role="img" aria-label={`Placeholder for ${frame.description}`}><span>Frame {frame.id} · {frame.title} — pending</span></div>}
    </figure>
  )
}
