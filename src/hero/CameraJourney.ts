import type { FrameSet } from './frames'
import { drawPlaceholder } from './placeholder'

export type JourneyState = {
  /** Whole-hero scroll progress, 0–1 (includes the final hold). */
  progress: number
  /** Camera position along the anchors: 0 = frame 01, 10 = frame 11. */
  position: number
  /** What is currently drawn for this stretch of the journey. */
  source: 'sequence' | 'anchors' | 'placeholder'
}

type Options = {
  section: HTMLElement
  canvas: HTMLCanvasElement
  desktop: FrameSet
  mobile: FrameSet
  weights: number[]
  holdShare: number
  /** Zoom between consecutive anchor stills for the interim push (before videos exist). */
  anchorZoom?: number
  /** Called from requestAnimationFrame — never from React. */
  onUpdate: (state: JourneyState) => void
  /** Draw a single still and skip scroll handling (prefers-reduced-motion). */
  still?: boolean
}

type Slot = { url: string; at: number }

const CONCURRENCY = 6
const SMOOTHING_MS = 110
const LOOKAHEAD = 40
const PORTRAIT = '(max-aspect-ratio: 4/5)'

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max)
const smoothstep = (edge0: number, edge1: number, value: number) => {
  const t = clamp((value - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}

/**
 * Scroll-driven forward camera through the temple, drawn to a canvas.
 * Scroll is read in a passive listener; the camera eases toward it inside
 * requestAnimationFrame, so playback is smooth in both directions and React
 * never re-renders on scroll. Frames stream in nearest-to-the-playhead first.
 */
export class CameraJourney {
  private options: Required<Omit<Options, 'still'>> & { still: boolean }
  private context: CanvasRenderingContext2D
  private set: FrameSet
  private slots: Slot[] = []
  private images = new Map<string, HTMLImageElement>()
  private ready = new Set<string>()
  private inFlight = 0
  private queued = new Set<string>()
  private streaming = false
  private target = 0
  private current = 0
  private progress = 0
  private width = 0
  private height = 0
  private raf = 0
  private lastTime = 0
  private lastKey = ''
  private visible = true
  private drawn = false
  private cumulative: number[]
  private portrait: MediaQueryList
  private cleanups: (() => void)[] = []

  constructor(options: Options) {
    this.options = { anchorZoom: 1.55, still: false, ...options }
    this.context = options.canvas.getContext('2d', { alpha: false })!
    this.portrait = window.matchMedia(PORTRAIT)
    this.set = this.portrait.matches ? options.mobile : options.desktop
    const total = options.weights.reduce((sum, weight) => sum + weight, 0)
    let running = 0
    this.cumulative = [0, ...options.weights.map((weight) => (running += weight) / total)]
    this.buildSlots()
  }

  start() {
    const { section, canvas, still } = this.options
    const onScroll = () => this.readScroll()
    const onPortraitChange = () => {
      this.set = this.portrait.matches ? this.options.mobile : this.options.desktop
      this.buildSlots()
      this.load(this.nearestSlot(this.target), true)
      this.invalidate()
    }
    const resizeObserver = new ResizeObserver(() => this.resize())
    resizeObserver.observe(canvas)
    this.portrait.addEventListener('change', onPortraitChange)
    this.cleanups.push(() => resizeObserver.disconnect(), () => this.portrait.removeEventListener('change', onPortraitChange))

    this.resize()
    if (still) {
      this.load(this.nearestSlot(0), true)
      this.options.onUpdate({ progress: 1, position: 0, source: this.sourceAt(0) })
      return
    }

    const visibility = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting
      if (this.visible) this.readScroll()
      else this.cancel()
    })
    visibility.observe(section)
    window.addEventListener('scroll', onScroll, { passive: true })
    this.cleanups.push(() => visibility.disconnect(), () => window.removeEventListener('scroll', onScroll))

    this.readScroll()
    this.current = this.target
    // First frame at high priority, then the frames just ahead stream straight away so
    // the very first scroll already moves the camera.
    this.load(this.nearestSlot(this.target), true)
    this.streaming = true
    this.pump()
  }

  destroy() {
    this.cancel()
    this.cleanups.forEach((cleanup) => cleanup())
    this.cleanups = []
  }

  /** Scroll position (in px from the top of the document) at which the camera reaches an anchor. */
  scrollTopFor(anchorIndex: number) {
    const { section, holdShare } = this.options
    const journey = this.cumulative[clamp(anchorIndex, 0, this.cumulative.length - 1)]
    const distance = section.offsetHeight - window.innerHeight
    return section.getBoundingClientRect().top + window.scrollY + journey * (1 - holdShare) * distance
  }

  // ── Timeline ───────────────────────────────────────────────

  /** Journey (0–1, excluding the hold) → camera position along the anchors (0–10). */
  private positionFor(journey: number) {
    const { cumulative } = this
    for (let index = 0; index < cumulative.length - 1; index += 1) {
      if (journey <= cumulative[index + 1]) {
        return index + (journey - cumulative[index]) / (cumulative[index + 1] - cumulative[index])
      }
    }
    return cumulative.length - 1
  }

  private readScroll() {
    const { section, holdShare } = this.options
    const distance = Math.max(section.offsetHeight - window.innerHeight, 1)
    this.progress = clamp(-section.getBoundingClientRect().top / distance)
    this.target = this.positionFor(clamp(this.progress / (1 - holdShare)))
    if (this.progress > 0) this.streaming = true
    this.pump()
    this.request()
  }

  // ── Loading ────────────────────────────────────────────────

  private buildSlots() {
    if (this.set.sequence?.length) {
      this.slots = this.set.sequence.map((url, index) => ({ url, at: index / Math.max(1, this.set.sequence!.length - 1) * (this.options.weights.length) }))
      return
    }
    const slots: Slot[] = []
    this.set.anchors.forEach((url, index) => { if (url) slots.push({ url, at: index }) })
    this.set.transitions.forEach((frames, index) => {
      const last = Math.max(frames.length - 1, 1)
      frames.forEach((url, frame) => slots.push({ url, at: index + frame / last }))
    })
    this.slots = slots
  }

  private nearestSlot(position: number) {
    let best: Slot | undefined
    for (const slot of this.slots) {
      if (!best || Math.abs(slot.at - position) < Math.abs(best.at - position)) best = slot
    }
    return best
  }

  private load(slot: Slot | undefined, priority = false) {
    if (!slot || this.images.has(slot.url) || this.queued.has(slot.url)) return
    const image = new Image()
    image.decoding = 'async'
    if (priority) image.fetchPriority = 'high'
    this.images.set(slot.url, image)
    this.queued.add(slot.url)
    this.inFlight += 1
    image.onload = () => {
      const done = () => { this.inFlight -= 1; this.queued.delete(slot.url); this.ready.add(slot.url); this.invalidate(); this.pump() }
      image.decode().then(done, done)
    }
    image.onerror = () => { this.inFlight -= 1; this.queued.delete(slot.url); this.pump() }
    image.src = slot.url
  }

  /** Keep CONCURRENCY requests open, always for the unloaded frame nearest the playhead. */
  private pump() {
    if (!this.streaming || this.options.still) return
    const sequence = this.set.sequence
    if (sequence?.length) {
      // A window around the playhead, weighted ahead (the way the visitor is going).
      const frame = Math.round(clamp(this.target / Math.max(1, this.options.weights.length)) * (sequence.length - 1))
      for (let offset = 0; this.inFlight < CONCURRENCY && offset < LOOKAHEAD; offset += 1) {
        const ahead = sequence[frame + offset]
        const behind = offset < LOOKAHEAD / 4 ? sequence[frame - offset] : undefined
        for (const url of [ahead, behind]) {
          if (this.inFlight >= CONCURRENCY) break
          if (url) this.load({ url, at: 0 })
        }
      }
      return
    }
    while (this.inFlight < CONCURRENCY) {
      let next: Slot | undefined
      for (const slot of this.slots) {
        if (this.images.has(slot.url)) continue
        if (!next || Math.abs(slot.at - this.target) < Math.abs(next.at - this.target)) next = slot
      }
      if (!next) return
      this.load(next)
    }
  }

  private readyImage(url: string | null | undefined) {
    return url && this.ready.has(url) ? this.images.get(url)! : null
  }

  // ── Rendering ──────────────────────────────────────────────

  private request() {
    if (this.visible && !this.raf) this.raf = requestAnimationFrame((time) => this.frame(time))
  }

  private cancel() {
    if (this.raf) cancelAnimationFrame(this.raf)
    this.raf = 0
    this.lastTime = 0
  }

  private invalidate() {
    this.lastKey = ''
    this.request()
  }

  private resize() {
    const bounds = this.options.canvas.getBoundingClientRect()
    if (!bounds.width || !bounds.height) return
    // Sharp on dense displays without allocating an oversized backing canvas.
    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    this.width = bounds.width
    this.height = bounds.height
    this.options.canvas.width = Math.round(bounds.width * ratio)
    this.options.canvas.height = Math.round(bounds.height * ratio)
    this.context.setTransform(ratio, 0, 0, ratio, 0, 0)
    this.context.imageSmoothingQuality = 'high'
    this.invalidate()
  }

  private sourceAt(position: number): JourneyState['source'] {
    if (this.set.sequence?.length) return 'sequence'
    const index = Math.min(Math.floor(position), this.set.transitions.length - 1)
    if (this.set.transitions[index]?.length) return 'sequence'
    if (this.set.anchors[index] || this.set.anchors[index + 1]) return 'anchors'
    return 'placeholder'
  }

  private frame(time: number) {
    this.raf = 0
    const elapsed = this.lastTime ? Math.min(time - this.lastTime, 64) : 16
    this.lastTime = time
    this.current += (this.target - this.current) * (1 - Math.exp(-elapsed / SMOOTHING_MS))
    if (Math.abs(this.target - this.current) < 0.0005) this.current = this.target

    const drawn = this.draw(this.current)
    const source = drawn ?? this.sourceAt(this.current)
    if (drawn && !this.drawn) { this.drawn = true; this.options.canvas.classList.add('is-ready') }
    this.options.onUpdate({ progress: this.progress, position: this.current, source })

    if (this.current !== this.target) this.request()
    else this.lastTime = 0
  }

  private draw(position: number): JourneyState['source'] | null {
    if (!this.width) return null
    if (this.set.sequence?.length) {
      const sequence = this.set.sequence
      const progress = clamp(position / Math.max(1, this.options.weights.length))
      const wanted = Math.round(progress * (sequence.length - 1))
      let image = this.readyImage(sequence[wanted])
      for (let offset = 1; !image && offset < sequence.length; offset += 1) {
        image = this.readyImage(sequence[wanted - offset]) ?? this.readyImage(sequence[wanted + offset])
      }
      if (!image) return null
      const key = `q:${image.src}:${this.width}x${this.height}`
      if (key !== this.lastKey) { this.cover(image, 1); this.lastKey = key }
      return 'sequence'
    }
    const lastTransition = this.set.transitions.length - 1
    const index = Math.min(Math.floor(position), lastTransition)
    const t = position - index

    // 1. Extracted video frames: one whole frame at a time, never blended.
    const frames = this.set.transitions[index]
    if (frames.length) {
      const wanted = Math.round(t * (frames.length - 1))
      for (let step = 0; step < frames.length; step += 1) {
        const image = this.readyImage(frames[wanted - step]) ?? this.readyImage(frames[wanted + step])
        if (image) {
          const key = `s${index}:${image.src}:${this.width}x${this.height}`
          if (key !== this.lastKey) { this.cover(image, 1); this.lastKey = key }
          return 'sequence'
        }
      }
    }

    // 2. Interim forward push between anchor stills: A zooms toward the vanishing point
    //    while B — the closer view — resolves out of its centre.
    const from = this.readyImage(this.set.anchors[index])
    const to = this.readyImage(this.set.anchors[index + 1])
    if (from || to) {
      const zoom = this.options.anchorZoom
      this.lastKey = ''
      if (from) this.cover(from, zoom ** t)
      else if (to) this.cover(to, zoom ** (t - 1))
      if (from && to) {
        this.context.globalAlpha = smoothstep(0.3, 0.9, t)
        this.cover(to, zoom ** (t - 1), false)
        this.context.globalAlpha = 1
      }
      return 'anchors'
    }

    // Frames exist for this stretch but are still loading: keep what is on screen.
    if (this.sourceAt(position) !== 'placeholder') return null

    // 3. Procedural placeholder for frames not yet supplied.
    this.lastKey = ''
    drawPlaceholder(this.context, this.width, this.height, position)
    return 'placeholder'
  }

  /** Draw an image covering the canvas, scaled about the centre (the camera's vanishing point). */
  private cover(image: HTMLImageElement, scale: number, fill = true) {
    const base = Math.max(this.width / image.naturalWidth, this.height / image.naturalHeight) * scale
    const width = image.naturalWidth * base
    const height = image.naturalHeight * base
    if (fill && scale < 1) {
      this.context.fillStyle = '#14110f'
      this.context.fillRect(0, 0, this.width, this.height)
    }
    this.context.drawImage(image, (this.width - width) / 2, (this.height - height) / 2, width, height)
  }
}
