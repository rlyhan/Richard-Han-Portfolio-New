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
  `npx vite build`, `npx eslint .`. The only expected lint error is the pre-existing one
  in `Modal.jsx`.
- **Comments say why.** When the reason changes, rewrite the comment in the same commit.
  A comment naming something that has been deleted is a bug.
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

## Still outstanding

- Direct URLs need an SPA rewrite on the host: `/about` and the rest 404 without one.
- No prerendering, so those pages have no server-rendered HTML for crawlers.
