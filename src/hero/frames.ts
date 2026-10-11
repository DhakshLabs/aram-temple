import { anchors } from './storyboard'

/** Resolved URLs for one source set (desktop or mobile). */
export type FrameSet = {
  /** One entry per anchor frame; null where the still hasn't been supplied yet. */
  anchors: (string | null)[]
  /** One list per transition (01→02 … 10→11), naturally sorted; empty until supplied. */
  transitions: string[][]
  /** Optional unsegmented scroll sequence (one image per frame, in filename order). */
  sequence?: string[]
}

type UrlMap = Record<string, string>

// import.meta.glob needs literal patterns, so each set is listed explicitly.
const desktopAnchors = import.meta.glob('../assets/hero/desktop/anchors/*.{webp,avif,jpg,jpeg,png}', { eager: true, import: 'default' }) as UrlMap
const desktopTransitions = import.meta.glob('../assets/hero/desktop/transitions/*/*.{webp,avif,jpg,jpeg,png}', { eager: true, import: 'default' }) as UrlMap
const mobileAnchors = import.meta.glob('../assets/hero/mobile/anchors/*.{webp,avif,jpg,jpeg,png}', { eager: true, import: 'default' }) as UrlMap
const mobileTransitions = import.meta.glob('../assets/hero/mobile/transitions/*/*.{webp,avif,jpg,jpeg,png}', { eager: true, import: 'default' }) as UrlMap
const suppliedSequence = import.meta.glob('../assets/hero/sequence/*.{webp,avif,jpg,jpeg,png}', { eager: true, import: 'default' }) as UrlMap
const suppliedMobileSequence = import.meta.glob('../assets/hero/mobile/sequence/*.{webp,avif,jpg,jpeg,png}', { eager: true, import: 'default' }) as UrlMap

const natural = (a: string, b: string) => a.localeCompare(b, undefined, { numeric: true })
const fileName = (path: string) => path.split('/').pop()!.replace(/\.[^.]+$/, '')

function buildSet(anchorFiles: UrlMap, transitionFiles: UrlMap): FrameSet {
  const byId = new Map(Object.entries(anchorFiles).map(([path, url]) => [fileName(path).padStart(2, '0'), url]))
  const transitions: string[][] = anchors.slice(1).map(() => [])
  for (const path of Object.keys(transitionFiles).sort(natural)) {
    // Folder name "01-02" → transition index 0.
    const folder = path.split('/').at(-2) ?? ''
    const index = Number.parseInt(folder, 10) - 1
    if (index >= 0 && index < transitions.length) transitions[index].push(transitionFiles[path])
  }
  return { anchors: anchors.map((anchor) => byId.get(anchor.id) ?? null), transitions }
}

const isEmpty = (set: FrameSet) => !set.sequence?.length && set.anchors.every((url) => !url) && set.transitions.every((list) => !list.length)

const ordered = (files: UrlMap) => Object.entries(files).sort(([a], [b]) => natural(a, b)).map(([, url]) => url)
const sequence = ordered(suppliedSequence)
const mobileSequence = ordered(suppliedMobileSequence)
export const desktopFrames: FrameSet = sequence.length
  ? { anchors: [], transitions: [], sequence }
  : buildSet(desktopAnchors, desktopTransitions)
const mobileOnly = mobileSequence.length
  ? { anchors: [], transitions: [], sequence: mobileSequence }
  : buildSet(mobileAnchors, mobileTransitions)
/** Portrait set; falls back to the desktop set (centre-cropped) until portrait frames exist. */
export const mobileFrames = isEmpty(mobileOnly) ? desktopFrames : mobileOnly

/** First image the visitor will see — preloaded with high priority and used as the poster. */
export const posterFor = (set: FrameSet) => set.sequence?.[0] ?? set.anchors[0] ?? set.transitions[0]?.[0] ?? null
export const hasAnyFrames = (set: FrameSet) => Boolean(set.sequence?.length) || !isEmpty(set)
