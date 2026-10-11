import { anchors, type AnchorFrame } from './storyboard'

/*
 * Development placeholder for anchor frames that haven't been supplied yet.
 * Deliberately abstract — receding thresholds on a vanishing point — so it shows the
 * camera's forward path and the lighting journey without inventing any architecture.
 */

type Palette = { top: string; bottom: string; glow: string; glowAlpha: number; line: string; grid: number }

const palettes: Record<AnchorFrame['light'], Palette> = {
  exterior: { top: '#7a6450', bottom: '#2b231d', glow: '#f1d4a4', glowAlpha: .5, line: '#f3e6cf', grid: 0 },
  threshold: { top: '#4c3d31', bottom: '#1c1713', glow: '#f3d9ad', glowAlpha: .55, line: '#f0e1c8', grid: 0 },
  interior: { top: '#251f1a', bottom: '#100d0b', glow: '#cfac72', glowAlpha: .42, line: '#e8d6b8', grid: 0 },
  digital: { top: '#1d1915', bottom: '#0e0c0a', glow: '#c2a46f', glowAlpha: .32, line: '#e3cc9f', grid: 1 },
  product: { top: '#1a1613', bottom: '#0f0d0b', glow: '#a88a57', glowAlpha: .22, line: '#d9c39a', grid: .5 },
}

const hex = (value: string) => [1, 3, 5].map((offset) => Number.parseInt(value.slice(offset, offset + 2), 16))
const mix = (a: string, b: string, t: number) => {
  const [ar, ag, ab] = hex(a)
  const [br, bg, bb] = hex(b)
  return `rgb(${Math.round(ar + (br - ar) * t)} ${Math.round(ag + (bg - ag) * t)} ${Math.round(ab + (bb - ab) * t)})`
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const rgba = (value: string, alpha: number) => {
  const [r, g, b] = hex(value)
  return `rgb(${r} ${g} ${b} / ${alpha})`
}

export function drawPlaceholder(context: CanvasRenderingContext2D, width: number, height: number, position: number) {
  const index = Math.min(Math.floor(position), anchors.length - 2)
  const t = position - index
  const a = palettes[anchors[index].light]
  const b = palettes[anchors[index + 1].light]
  const vx = width / 2
  const vy = height * .5
  const unit = Math.min(height, width * 1.2)

  // Sky-to-ground light for the current stage.
  const background = context.createLinearGradient(0, 0, 0, height)
  background.addColorStop(0, mix(a.top, b.top, t))
  background.addColorStop(1, mix(a.bottom, b.bottom, t))
  context.fillStyle = background
  context.fillRect(0, 0, width, height)

  // Light at the end of the path.
  const glowColor = a.glow === b.glow ? a.glow : (t < .5 ? a.glow : b.glow)
  const glow = context.createRadialGradient(vx, vy, 0, vx, vy, unit * .7)
  glow.addColorStop(0, rgba(glowColor, lerp(a.glowAlpha, b.glowAlpha, t)))
  glow.addColorStop(1, rgba(glowColor, 0))
  context.fillStyle = glow
  context.fillRect(0, 0, width, height)

  const line = a.line
  const camera = position

  // Floor joints receding toward the vanishing point.
  context.lineWidth = 1
  for (let z = Math.ceil(camera * 4) / 4; z < camera + 8; z += .25) {
    const depth = z - camera
    if (depth < .08) continue
    const y = vy + (unit * .42) / depth
    if (y > height) continue
    context.strokeStyle = rgba(line, Math.min(.16, .5 / (depth * 4)))
    context.beginPath()
    context.moveTo(0, y)
    context.lineTo(width, y)
    context.stroke()
  }
  for (let lane = -4; lane <= 4; lane += 1) {
    context.strokeStyle = rgba(line, .06)
    context.beginPath()
    context.moveTo(vx, vy)
    context.lineTo(vx + lane * width * .22, height)
    context.stroke()
  }

  // Receding thresholds: the camera passes through one per anchor frame.
  for (let z = Math.ceil(camera * 2) / 2; z < camera + 7; z += .5) {
    const depth = z - camera
    if (depth < .06) continue
    const portalHeight = (unit * .78) / depth
    const portalWidth = portalHeight * .62
    const fadeIn = Math.min(1, (depth - .06) / .5)
    const fadeOut = Math.max(0, 1 - depth / 7)
    const major = Number.isInteger(z)
    context.strokeStyle = rgba(line, (major ? .55 : .2) * fadeIn * fadeOut)
    context.lineWidth = major ? 1.25 : 1
    context.strokeRect(vx - portalWidth / 2, vy + (unit * .42) / depth - portalHeight, portalWidth, portalHeight)
  }

  // Transformation stage: a faint measured lattice over the scene.
  const grid = lerp(a.grid, b.grid, t)
  if (grid > 0) {
    const step = Math.max(40, unit / 12)
    context.strokeStyle = rgba('#c9b48d', .07 * grid)
    context.lineWidth = 1
    context.beginPath()
    for (let x = vx % step; x < width; x += step) { context.moveTo(x, 0); context.lineTo(x, height) }
    for (let y = vy % step; y < height; y += step) { context.moveTo(0, y); context.lineTo(width, y) }
    context.stroke()
  }

  // Vignette.
  const vignette = context.createRadialGradient(vx, vy, unit * .35, vx, vy, Math.hypot(width, height) * .62)
  vignette.addColorStop(0, 'rgb(0 0 0 / 0)')
  vignette.addColorStop(1, 'rgb(0 0 0 / .55)')
  context.fillStyle = vignette
  context.fillRect(0, 0, width, height)
}
