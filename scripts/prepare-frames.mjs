#!/usr/bin/env node
/**
 * Converts hero source material into optimised WebP frames for the camera journey.
 *
 *   frames-source/                     (not committed)
 *     sequence/*.jpg                   one continuous scroll sequence (preferred) →
 *                                      hero/sequence (2560w) + hero/mobile/sequence (9:16)
 *     anchors/01.png … 11.png          anchor stills (any of png/jpg/webp)
 *     transitions/01-02/*.png          frames extracted from the 01 → 02 clip, or
 *     transitions/01-02.mp4            the clip itself (needs ffmpeg on PATH)
 *     mobile/anchors/…  mobile/transitions/…   optional 9:16 versions, same layout
 *
 * Output: src/assets/hero/{desktop,mobile}/{anchors,transitions/NN-MM}/…webp
 *
 *   npm run frames                     convert everything
 *   npm run frames -- --fps 24         sample rate when extracting from video (default 24)
 *   npm run frames -- --step 2         keep every 2nd extracted frame
 *   npm run frames -- --quality 72     WebP quality (default 74)
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, extname, join } from 'node:path'
import sharp from 'sharp'

const args = process.argv.slice(2)
const option = (name, fallback) => {
  const index = args.indexOf(`--${name}`)
  return index >= 0 ? Number(args[index + 1]) : fallback
}
const fps = option('fps', 24)
const step = Math.max(1, option('step', 1))
const quality = option('quality', 74)

const SOURCE = 'frames-source'
const OUTPUT = 'src/assets/hero'
const IMAGE = /\.(png|jpe?g|webp|avif|tiff?)$/i
const VIDEO = /\.(mp4|mov|webm|m4v)$/i
const natural = (a, b) => a.localeCompare(b, undefined, { numeric: true })
const sizes = { desktop: { width: 1920, height: 1080 }, mobile: { width: 1080, height: 1920 } }

const hasFfmpeg = (() => { try { execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' }); return true } catch { return false } })()

// The grade is baked in here so the canvas never runs a per-frame filter (slow on phones).
async function convert(file, out, size, q = quality) {
  await sharp(file)
    .resize({ ...size, fit: 'cover', position: 'centre', withoutEnlargement: true })
    .linear(1.035, -4.5)
    .modulate({ saturation: 1.025 })
    .webp({ quality: q, effort: 5, smartSubsample: true })
    .toFile(out)
}

/** frames-source/sequence/* → one desktop (16:9) and one phone (9:16 centre crop) scroll sequence. */
async function processSequence() {
  const input = join(SOURCE, 'sequence')
  if (!existsSync(input)) return 0
  const files = readdirSync(input).filter((name) => IMAGE.test(name)).sort(natural)
  const targets = [
    [join(OUTPUT, 'sequence'), { width: 1920, height: 1080 }, quality],
    [join(OUTPUT, 'mobile', 'sequence'), { width: 720, height: 1280 }, quality - 6],
  ]
  for (const [out, size, q] of targets) {
    reset(out)
    for (const [index, file] of files.entries()) {
      await convert(join(input, file), join(out, `${String(index + 1).padStart(4, '0')}.webp`), size, q)
    }
    console.log(`  ${out}: ${files.length} frames`)
  }
  return files.length * targets.length
}

function reset(directory) {
  rmSync(directory, { recursive: true, force: true })
  mkdirSync(directory, { recursive: true })
}

async function processSet(set, root) {
  const size = sizes[set]
  let written = 0

  const anchorsIn = join(root, 'anchors')
  if (existsSync(anchorsIn)) {
    const out = join(OUTPUT, set, 'anchors')
    reset(out)
    for (const file of readdirSync(anchorsIn).filter((name) => IMAGE.test(name)).sort(natural)) {
      const id = basename(file, extname(file)).match(/\d+/)?.[0]?.padStart(2, '0')
      if (!id) continue
      await convert(join(anchorsIn, file), join(out, `${id}.webp`), size)
      written += 1
    }
  }

  const transitionsIn = join(root, 'transitions')
  if (existsSync(transitionsIn)) {
    for (const entry of readdirSync(transitionsIn).sort(natural)) {
      const match = entry.match(/^(\d{2})-(\d{2})/)
      if (!match) continue
      const name = `${match[1]}-${match[2]}`
      const path = join(transitionsIn, entry)
      let frames
      let cleanup = () => {}

      if (statSync(path).isDirectory()) {
        frames = readdirSync(path).filter((file) => IMAGE.test(file)).sort(natural).map((file) => join(path, file))
      } else if (VIDEO.test(entry)) {
        if (!hasFfmpeg) { console.warn(`  skipped ${entry}: install ffmpeg (brew install ffmpeg) or extract its frames into ${join(transitionsIn, name)}/`); continue }
        const temp = mkdtempSync(join(tmpdir(), 'aram-frames-'))
        execFileSync('ffmpeg', ['-loglevel', 'error', '-i', path, '-vf', `fps=${fps}`, join(temp, '%05d.png')])
        frames = readdirSync(temp).sort(natural).map((file) => join(temp, file))
        cleanup = () => rmSync(temp, { recursive: true, force: true })
      } else continue

      const out = join(OUTPUT, set, 'transitions', name)
      reset(out)
      const kept = frames.filter((_, index) => index % step === 0 || index === frames.length - 1)
      for (const [index, file] of kept.entries()) {
        await convert(file, join(out, `${String(index + 1).padStart(4, '0')}.webp`), size)
      }
      cleanup()
      written += kept.length
      console.log(`  ${set} ${name}: ${kept.length} frames`)
    }
  }
  return written
}

if (!existsSync(SOURCE)) {
  console.error(`No ${SOURCE}/ folder. See the header of scripts/prepare-frames.mjs for the expected layout.`)
  process.exit(1)
}
const sequence = await processSequence()
const desktop = await processSet('desktop', SOURCE)
const mobile = existsSync(join(SOURCE, 'mobile')) ? await processSet('mobile', join(SOURCE, 'mobile')) : 0
console.log(`Done: ${sequence} sequence, ${desktop} desktop and ${mobile} mobile images written to ${OUTPUT}/`)
