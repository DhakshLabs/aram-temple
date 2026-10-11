/**
 * The Brihadisvara camera journey: 11 anchor frames, one continuous forward move.
 *
 * Assets (all optional — anything missing falls back gracefully):
 *   src/assets/hero/<set>/anchors/01.webp … 11.webp            one still per anchor frame
 *   src/assets/hero/<set>/transitions/01-02/0001.webp …         frames extracted from the
 *                                                               image-to-video clip 01 → 02
 * where <set> is `desktop` (16:9) or `mobile` (9:16; falls back to desktop, centre-cropped).
 *
 * Per transition the renderer uses, in order of preference:
 *   1. the extracted video frames (true camera motion, scrubbed by scroll),
 *   2. a forward push between the two anchor stills (interim, before videos exist),
 *   3. a procedural placeholder that shows the camera's forward path.
 * Run `npm run frames` to convert source material into these folders.
 */

export type AnchorFrame = {
  /** Two-digit id, matches asset file names. */
  id: string
  title: string
  /** Where the camera is — used for alt text and the journey index. */
  description: string
  /** Lighting stage for the placeholder renderer. */
  light: 'exterior' | 'threshold' | 'interior' | 'digital' | 'product'
}

export const anchors: AnchorFrame[] = [
  { id: '01', title: 'Establishing', light: 'exterior', description: 'Brihadisvara Temple, Thanjavur, seen from far away along the path that leads to it.' },
  { id: '02', title: 'Approach', light: 'exterior', description: 'The camera moves closer; the temple begins to fill the frame.' },
  { id: '03', title: 'Closer approach', light: 'exterior', description: 'Carved detail becomes visible as the temple rises above the path.' },
  { id: '04', title: 'Entrance', light: 'threshold', description: 'At the threshold, the entrance fills the view.' },
  { id: '05', title: 'Crossing', light: 'threshold', description: 'Passing through the entrance, sunlight gives way to stone.' },
  { id: '06', title: 'First interior', light: 'interior', description: 'Stone pillars and corridors surround the camera.' },
  { id: '07', title: 'Deep interior', light: 'interior', description: 'Deeper inside, light falls through architectural openings.' },
  { id: '08', title: 'Architectural reveal', light: 'interior', description: 'A monumental interior of pillars, depth, light and shadow.' },
  { id: '09', title: 'Deeper reveal', light: 'interior', description: 'A calm, timeless space further inside the temple.' },
  { id: '10', title: 'Transformation', light: 'digital', description: 'Faint geometry traces the stone; the architecture remains dominant.' },
  { id: '11', title: 'ARAM ERP', light: 'product', description: 'The temple journey resolves into ARAM ERP.' },
]

/**
 * Relative scroll length of each transition (01→02 … 10→11). Longer values give a
 * slower camera through that stretch. Tune once real footage is in place.
 */
export const transitionWeights = [1.1, 1, 1, 1.2, 1, 1, 1.2, 1, 1.1, 1]

/**
 * Share of the hero runway that holds on the final frame (the CTA) before the page
 * continues. hero.css also places a soft scroll-snap point at the start of this hold.
 */
export const holdShare = 0.15

/**
 * Story beats overlaid on the journey, positioned on the 0–1 journey timeline.
 * Copy is grounded in the ARAM ERP for Temples product brochure.
 */
export const beats = [
  { from: 0.035, to: 0.205, title: 'A living institution, through every age.', text: 'Since 1010 CE, Brihadisvara has been sustained by generations of care, service and stewardship.' },
  { from: 0.235, to: 0.405, title: 'Every ritual rests on thoughtful work.', text: 'Sevas to schedule. Offerings to receipt. Accounts to close. Valuables to safeguard.' },
  { from: 0.435, to: 0.605, title: 'A place for every devotee.', text: 'Keep families and devotees connected through festivals, services and daily temple life.' },
  { from: 0.635, to: 0.805, title: 'Care that reaches beyond the sanctum.', text: 'Coordinate annadhanam, people and operations with the same devotion brought to worship.' },
  { from: 0.825, to: 0.925, title: 'One clear view of temple life.', text: 'Bring records, finance and assets into a connected system, shaped for temple administration.' },
]

/** Journey index chapters shown beside the hero (anchor index each chapter starts at). */
export const chapters = [
  { label: 'Approach', anchor: 0 },
  { label: 'Threshold', anchor: 3 },
  { label: 'Interior', anchor: 5 },
  { label: 'Transformation', anchor: 9 },
  { label: 'ARAM ERP', anchor: 10 },
]
