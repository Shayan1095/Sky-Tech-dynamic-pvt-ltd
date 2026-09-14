# SKY Tech — Design Direction

Committed direction for all 19 pages. Don't re-decide per page — extend this.
Motion/type specifics with exact values live in `ANIMATIONS-NEW.md`; this
file is the higher-level design language they serve.

## Concept: Technical Spec Sheet
The site presents like an engineering schematic, not a marketing brochure:
visible grid lines, bracketed corner-marks, tabular numerals. Reflects the
brand's own language ("clean code," "scalable architecture," "measurable
results") rather than generic agency polish.

## Color
- `primary` #006BB8 — structural blue (numerals, links, borders)
- `cta` #00C2FF — the one live/action accent (fills, brackets, hover, motion cues)
- `navy` #0B1F35 — deep anchor (footer; at most one full section per page)
- `surface` #F3F4F6 — default section ground
- `bg` #FFFFFF — panels/cards sitting ON the ground, never a whole section
- `text` #121212 — solid always; never faded/opacity for body or descriptions

Rule: every section carries blue in its ground OR its elements — never both, never neither.

## Type (see ANIMATIONS-NEW.md §1 for the full scale)
Three-tier system, not two:
- Space Grotesk — headings, nav logo, pricing tier names
- Manrope — body copy, form labels, buttons *(supersedes Urbanist — see migration note below)*
- JetBrains Mono — prices, stats/counters, package numbering — precision on the content where it matters most

## Layout
- Content sits in bracket/border-framed units — sharp corners, no soft
  rounded-card-with-shadow (that's the generic SaaS-card tell).
- Circular brand badge is the one deliberate exception to "sharp corners."
- Alternate grey/white/navy section grounds; don't repeat a tone twice running.
- Numbered markers (01/02/03) only for actual sequences (a process/timeline),
  never as decoration.
- Dense content (long FAQ/pricing/add-on lists) uses progressive disclosure —
  see ANIMATIONS-NEW.md §6. Never dump full markdown content inline.

## Motion (see ANIMATIONS-NEW.md §2–3 for exact values)
- Two curves only: `--ease-signature` (entrances) and `--ease-interact` (hover/focus). No bounce/overshoot anywhere — this is a B2B technical brand.
- Signature entrance = mask-reveal (`clip-path`) on every H1/H2, not opacity fade.
- Cards/bullets use simple opacity+8px-translateY, not the mask-reveal (reserved for headline moments).
- Prefer scroll-scrubbed (tied to real scroll position) over fire-once triggers where the effect is section-scale.
- Library ownership is fixed — see ANIMATIONS-NEW.md §6.5 (GSAP ScrollTrigger for pinned/scroll-linked, Motion stagger for entrance timing, Motion `animate` for accordions, plain CSS for simple hover).

## Hover & elevation — shadow, radius and gradient are permitted
**Revised (user directive, supersedes the previous "no shadows, anywhere" rule.)**
Rounded corners, drop shadows and gradients are part of the toolkit and should be
used *where they do work* — establishing elevation, separating a focused element
from its neighbours, or giving a surface depth. The bar is intent, not abstinence:

- **Radius** — consistent scale: `rounded-2xl` cards, `rounded-xl` inner wells,
  `rounded-full` pills and nodes. Do not mix arbitrary radii within one component.
- **Shadow** — two tiers only. A near-invisible resting shadow, and a deliberate
  focus/elevation shadow tinted toward the accent rather than neutral black.
  A shadow must mark a state change; decorative uniform shadows are still a tell.
- **Gradient** — low-contrast and directional (surface depth, an area fill under a
  data line, an accent wash on an active card). Still banned: giant gradient
  typography, glassmorphism, glowing blobs.

Gradients do not interpolate in CSS transitions — animate a stacked overlay's
opacity, never `background-image` itself.

## Content rule
`.md` files in `src/content/` are copy source only. Never mirror their
heading order 1:1 as page sections — design grouping/hierarchy independently.

## Signature element: Stacked Card Peel
One recurring signature interaction for every card collection (Services grid,
pricing tiers, future Portfolio) — see ANIMATIONS-NEW.md §5. Not a one-off.

## Avoid (generic tells)
Uniform decorative shadow applied to every card alike (shadow must mark state) ·
glassmorphism · glowing blobs · giant gradient typography · ALL-CAPS decorative eyebrows
(nav labels are exempt — user-directed) · middot/em-dash meta chrome ·
"→" appended to every link · monospace used as decoration rather than data.

## Known debt (pre-dates ANIMATIONS-NEW.md, needs retrofit on next touch)
- `ServicesGrid`, `WhySkyTech` (Home): retrofit to the two-tier shadow + radius scale above. (`ValueCard` is gone — replaced by `ApproachPillar`.)
- **Font migration**: Urbanist is currently wired into `layout.tsx`/`globals.css` as the body font. Needs swapping to Manrope, and JetBrains Mono needs adding for numeric content (Trust Bar counters, future pricing).
- `HeroCTAButtons`: its `hover:shadow-[...]` is now allowed, but should be re-tuned to the two-tier accent-tinted scale rather than the stock neutral shadow.

## Open trial: warm palette + brighter blue (scoped)

The Approach section (`ValuePropsSection`) runs a **scoped** palette trial under
`.sky-approach` in `globals.css` — warm neutrals (`#F8F6F1` / `#E8E2D8`) and a
brighter blue (`#008CE3`). Nothing outside that class reads these tokens.

Decision pending: if the warm ground and `#008CE3` are approved, move the five
custom properties into the global `@theme` block (replacing `--color-surface`
and `--color-accent`, and resolving `#008CE3` against the existing `#006bb8`
`--color-primary` — the site must not carry three near-identical blues). If
rejected, delete the `.sky-approach` block and swap the section to the standard
`bg-surface` / `text-text` / `primary` tokens.
