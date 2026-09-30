# Working on this site

Richard Han's portfolio. React 19 + Vite + Tailwind v4, GSAP/ScrollTrigger for motion,
Lenis for smooth scroll, and a hand-rolled router: every page is its own route, its own
chunk, and the only page in the document.

## The map

- `src/routes/routes.js` — the route table. Adding a page is a record here plus a
  component in `src/pages`; the nav, the titles, the grounds and the chunks all follow.
- `src/routes/RouterProvider.jsx` — one page at a time, the transitions between them,
  and the scroll position.
- `src/routes/PageOutlet.jsx` — where pages mount, and the box an arriving page wears
  while it travels.
- `src/routes/useSwapTransition.js`, `src/helpers/pageSwap.js` — the click-driven
  transition: the page being left lifts and fades, the page asked for comes up from
  below the fold.
- `src/hooks/useHandoff.js`, `useHeroHandoff.js`, `src/helpers/handoff.js` — the one
  scroll-driven join, homepage to About: the hero empties out across a runway while
  About climbs over it.
- `src/helpers/scrollHold.js` — taking the scroll off the viewer for the length of
  something that owns it.
- `src/components/SiteNav.jsx`, `Footer.jsx` — chrome that outlives page changes.

## Invariants

These four are not style preferences. Every expensive bug this code has had was one of
them being broken.

**1. The scroll position has one owner.** The router sets it (`seatScroll`) and nothing
else may. Four other things will try: Lenis easing out a gesture, ScrollTrigger's scroll
memory across a refresh, the browser restoring a history entry's position, and Chrome's
scroll anchoring. Each is neutralised where it happens rather than compensated for a
frame later. If a fix needs a second corrective guard, it is the wrong fix — replace the
first one.

**2. A page mounts once per visit, in its final parent.** A page rendered in one place
while it travels and another when it lands is built twice: CSS animations replay,
instances are rebuilt, and anything it worked out on the way in is thrown away. The
arriving page is in the outlet's list from the start and stays at index 0 — a node React
has to move between positions is disconnected on the way, and disconnecting cancels the
animations inside it.

**3. Layout-dependent measurements happen where the page will live.** A page arriving by
a swap is fixed to the viewport, a screen below the fold. Anything that *decides* from a
measurement — `useScrollReveal` choosing which rows to blank — has to wait for
`isArriving` to clear. A `ScrollTrigger.refresh()` can move a trigger afterwards; it
cannot unmake a decision taken from the wrong place.

**4. An animation dies before the DOM it describes changes.** The tween that carries a
page in belongs to the page being *left*, and React does not run a leaving page's
cleanup until it flushes passive effects — after the next paint. So the handover kills
it and clears its transform first. Same reason triggers are refreshed in the passive
effect that watches the mounted pages, never in the layout effect that re-seats the
scroll.

## Working rules

- **One purpose per commit**, and each commit builds and lints on its own:
  `npx vite build`, `npx eslint .`.
- **Comments say why.** When the reason changes, rewrite the comment in the same commit.
  A comment naming something that has been deleted is a bug.
- **No comments inside JSX markup.** None on the elements, none between them. When one
  has to come out, moving it to the line above the JSX block is not the default —
  most inline comments restate what the markup already shows, or explain a decision
  that's actually made and owned somewhere else: a hook's own doc comment, a value
  computed a few lines up, a sibling component. Delete those. Only what's left after
  that cut — something a reader would genuinely be stuck on, with nowhere else to
  learn it — moves above the block.
- **No file-header comment on a UI component** walking through what it is and how it's
  built. A component file opens on the import or the component itself. Non-obvious
  behaviour — the *why* behind a genuinely complicated piece of logic, like the
  animation timing and layering rules in `HomeProjectCard.jsx` — still deserves a
  comment, but prefer the fewest sentences that carry the reason, and when in doubt,
  cut rather than keep. `ProjectTile.jsx` is the calibration: one short paragraph on
  what it borrows from `HomeProjectCard` and one on why the title is a heading,
  nothing on the plate layout or the matting inset, because both are readable off the
  JSX or already decided in `ProjectsPage.jsx`. `HomeProjectCard.jsx`'s current
  comments are still more than the logic needs.
- **No dead code behind a refactor.** When something loses its last consumer it goes in
  the same change — exports, props, slot fields, CSS tokens and design tokens included.
- **Reproduce before fixing.** These bugs appear in `npm run dev` (StrictMode runs
  effects twice) and in real headed Chrome (compositing, scrollbar width), and not in
  headless. If it won't reproduce, say so rather than fixing the most plausible
  candidate.
- **Verification is Richard's.** When he says he will test something, stop testing it —
  no browser runs. Hand it over with what to look at and what would mean the fix missed.
- **Ask before building a join.** Whether a transition is scroll-driven or click-driven
  is a design decision, not an implementation detail. Settle it in words first — what
  moves, from where, how long for, what holds the scroll, and what the URL does.
- **Translating a design or existing HTML into Tailwind follows the same best
  practices a hand-written page would.** Semantic HTML over generic divs where an
  element exists for the job. No hard-coded values standing in for what should follow
  from content or a token — a line-height pinned to a magic number, a pill or button
  given a fixed height instead of sizing from its padding and line-height. A class
  combination repeated across the file becomes a variable (as `EYEBROW_CLASS` already
  does in `ProjectTile.jsx` and `HomeProjectCard.jsx`) instead of being retyped at
  each call site.
- **Format with Prettier before treating a change as done.** This project has no
  Prettier devDependency or config — formatting runs through the editor's Prettier
  extension on save, not a CLI script. Save through the editor (or otherwise trigger
  format-on-save) so the formatting matches what Richard's editor produces, rather than
  hand-formatting to a guess.

## Still outstanding

- Direct URLs need an SPA rewrite on the host: `/about` and the rest 404 without one.
- No prerendering, so those pages have no server-rendered HTML for crawlers.
