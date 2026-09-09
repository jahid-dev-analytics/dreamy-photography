# Design spec — reverse-engineered from jesperlandberg-2.mp4

Source: 59s screen recording, 1920x1080. Reference is Jesper Landberg's portfolio:
a 3D curved carousel of project cards floating over a black grid plane, with
detail views that open as large white panels.

## Feeling in 3 words
**Weightless · cinematic · exacting**

## Structure observed
- **Stage:** pure black void, faint perspective grid on the floor, no horizon line.
- **Cards:** 16:10-ish panels arranged on a cylinder, curved via mesh distortion,
  each with its title bottom-left and a circular arrow button bottom-right.
- **Chrome:** four micro-labels pinned to the viewport corners
  (`JESPER LANDBERG` / `PROFILE` / `FEATURED / FULL` / `NEWSLETTER`). Never a nav bar.
- **Detail view:** white panel, ~36px inset from viewport, 24px radius. Two columns —
  a static left text column (title, 2-3 line description, pill metadata) and a
  scrolling right media column. Circular black close button top-right.
- **Zero decoration.** No icons beyond the arrow/close, no dividers, no gradients on
  chrome. All colour in the composition comes from the imagery itself.

## Palette (sampled)
| Role | Hex | Note |
|---|---|---|
| void | `#000000` | true black, not near-black |
| grid line | `#FFFFFF` @ 7% | 1px, perspective-scaled |
| surface | `#FFFFFF` | detail panel |
| surface-inset | `#EFEFEE` | metadata pills |
| ink | `#0B0B0B` | headings + body on white |
| ink-muted | `#6E6E6E` | secondary / labels |
| on-void | `#FFFFFF` | card titles |
| on-void-muted | `#8A8A8A` | inactive corner labels ("FULL") |
| hairline | `#000000` @ 8% | on white |

The reference is **achromatic by design** — no brand hue anywhere. Proposed single
accent for our build (Swiss brief wants one, used sparingly): **`#E23A18`** vermilion —
darkroom-safelight red. Focus rings, the active filter, one word in the hero. Nothing else.

## Type
Single geometric grotesk, no pairing. Glyph tells: double-storey `a` with straight
tail, straight-legged `k`, near-circular `o`, tall x-height, horizontal `e` bar —
this is Aeonik / PP Neue Montreal territory.
- Free substitute: **Schibsted Grotesk** (closest), fallback **Inter Tight**.
- Headings: Regular (400) only — never bold. Tracking `-0.02em`.
- Micro-labels: same family, uppercase, 500, tracking `+0.10em`.
- Body: 400, line-height 1.45, measure capped at ~46ch.

Observed ratio: title ≈ 2.9x body. Micro-label ≈ 0.65x body.

## Scale (ratio 1.25, base 16px, one dramatic jump)
`micro 11` (off-scale, deliberate) · `body 16` · `lead 20` · `h4 25` · `h3 31` ·
`h2 39` · **skip 49** · `h1 61` · `display 95 → clamp(3.5rem, 12vw, 8rem)`

The skipped step is what makes hierarchy survive a squint test.

## Spacing — 8-point
`2, 4, 8, 16, 24, 32, 48, 64, 96, 128, 192`
Rhythm observed: 32px panel inset, 24px title→body, 64px body→metadata,
96px+ between media blocks. Whitespace is asymmetric — left column is ~40% and
mostly empty below the fold.

## Radius
`0` images · `2` media blocks · `24` panels · `999` pills and circular buttons.
Note: sharp-cornered media *inside* a rounded panel. That contrast is the whole trick.

## Shadow
Effectively none. Depth is the black void plus perspective. Only two:
- contact shadow under floating cards: `0 40px 80px -20px rgba(0,0,0,.6)`
- hairline on white: `0 1px 0 rgba(0,0,0,.06)`

## Motion (from the recording)
- Carousel drifts continuously, inertial — never snaps.
- Card→detail is a shared-element expand, ~600ms.
- Everything eased out hard, nothing linear.
- Working curve: `cubic-bezier(0.22, 1, 0.36, 1)`, durations 200–500ms
  (600ms for the panel transition), scroll-reveal 16px lift, 60ms stagger.
