# ARAM ERP for Temples

Marketing site for ARAM ERP for Temples. React 19, TypeScript and Vite, with plain CSS and no UI or animation libraries.

```
npm install
npm run dev        # http://localhost:5173
npm run build
npm run frames     # convert hero source frames → optimised WebP
```

## The hero: a forward camera journey through Brihadisvara Temple

`src/hero/` holds the whole hero.

| File | Role |
|---|---|
| `storyboard.ts` | The 11 anchor frames, how much scroll each transition gets (`transitionWeights`), story beats and journey chapters. |
| `frames.ts` | Picks up whatever frames exist in `src/assets/hero/` (natural sort). |
| `CameraJourney.ts` | Scroll → camera engine: canvas, passive scroll listener, `requestAnimationFrame` easing, preloading that fetches frames nearest the playhead first, no React state on scroll, reverses smoothly. |
| `placeholder.ts` | An abstract placeholder showing the forward path, drawn wherever frames haven't been supplied. |
| `TempleHero.tsx` / `hero.css` | Sticky stage, beats, finale (the page's single `h1`), journey index, reduced-motion still. |

### Adding the cinematic frames

1. Put the source material in `frames-source/` (ignored by git):
   ```
   frames-source/sequence/*.jpg                   one continuous sequence (what the site uses now) →
                                                  hero/sequence (1920w) + hero/mobile/sequence (720×1280 crop)
   frames-source/anchors/01.png … 11.png          anchor stills
   frames-source/transitions/01-02/…png           frames from the 01→02 clip
   frames-source/transitions/02-03.mp4            …or the clip itself (needs ffmpeg)
   frames-source/mobile/…                         optional 9:16 versions, same layout
   ```
2. Run `npm run frames`. Options: `--fps 24`, `--step 2`, `--quality 74`.
3. Reload. Each transition upgrades on its own as material arrives:
   video frames → push between the two anchor stills → placeholder.
   You can supply transitions one at a time.

Without portrait frames, phones centre-crop the desktop frames. Because the camera moves straight forward, the vanishing point stays centred.

Pacing: adjust `transitionWeights` and `holdShare` in `storyboard.ts`, and `--runway` in `hero.css` (1000svh on desktop, 820svh on phones). `holdShare` (15%) is how long the final CTA stays pinned; `.hero__pause` adds a soft scroll-snap point at its start so scrolling settles on the CTA.

Current budget: 136 frames, about 17 MB on desktop and 8.4 MB on phones. Only the first frame blocks the first paint. The rest stream immediately, six requests at a time, from the frames just ahead of the playhead.

## Content rules

- Every capability in `src/content.ts` comes from the ARAM ERP for Temples brochure. The one testimonial (Sri Raghavendra Mutt) was supplied by the client. Don't add other customers, statistics, testimonials, certifications or capabilities beyond these.
- The contact form has no backend. Submitting it opens the visitor's email app with the message addressed to `contact.email`.
- `FramePlate` reuses hero anchor stills as section imagery, so the page stays in one visual world. It shows a marked placeholder until that still exists.
- Before launch: add the canonical URL, `og:url` and `og:image` in `index.html`.
