import { useEffect } from "react"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

// Anything inside the container that should surface as the page reaches it: a
// skill card, a project card, an article. One attribute rather than one per
// component, because the reveal does not care what the thing is — only where it
// sits, and it reads that off the layout below.
const ITEM_SELECTOR = "[data-reveal]"

// The row's top edge entering from the foot of the viewport — the first frame
// where the reader can see the row is the first frame where an item starts to
// arrive, so nothing pops in already half-revealed.
//
// clamp() is what keeps the reveal honest at the ends of the page. Without it a
// row near the document's foot asks for an end position past the maximum scroll,
// and the reader runs out of page with the last cards still part-way through
// their fade — permanently, since there is no scroll left to finish them with.
// Clamping folds the range back inside what actually exists; the reveal gets
// shorter, which is the right trade against never completing.
const REVEAL_START = "clamp(top bottom)"
// Where the group finishes, stated against the first item in the row. Two
// constants rather than one because a row of several and a row of one are not
// the same shape: a third of a row is a small square well inside the viewport,
// while a full-width card is a large share of the screen.
//
// The row's top edge at the middle of the viewport, where the LAST item in the
// row lands. Everything below is arranged around that: the items share this one
// stretch of scroll between them, so the further apart their starts are, the
// less of it each one gets to move through.
const ROW_REVEAL_END = "clamp(top center)"
// A row of one finishes at 60% of the viewport height, which its top edge passes
// on the way up BEFORE the middle — so it is done a little sooner than a full
// row is. That is the point: an item with a whole row to itself is a wide one,
// and holding the last of its fade until dead centre leaves the reader looking
// at a card that is still arriving after it has filled their view.
const LONE_REVEAL_END = "clamp(top 60%)"

// How far below its resting place an item starts, in pixels. A transform, not a
// `bottom` offset: `bottom` on a static grid child does nothing without also
// making it relative, and once it is relative the browser is repainting a
// positioned box every frame instead of compositing a transform. The space is
// preserved either way — neither one is in the layout flow's way — but only the
// transform is free.
//
// Small on purpose. The item is fading in across the same distance, so the
// travel only has to suggest that it came from below; at any real distance it
// spends the fade visibly sliding, which reads as a carousel rather than as
// something surfacing.
const ITEM_LIFT = 56

// The share of the row's scroll range that ONE item takes to complete, with the
// rest of the range spent waiting for the items behind it. At 0.5 the first is
// done by the halfway point and the last is only starting — the row fills left
// to right with two moving at once, and never all three.
//
// Raising it tightens the row towards moving as a block; lowering it spreads the
// items further apart and leaves each one snapping through its own fade.
const ITEM_SHARE = 0.5

// Seconds of catch-up between the scroll position and the reveal, the same
// device (and the same reasoning) as the hero handoff's SCRUB_LAG: it is what
// keeps the items from being welded to the scrollbar, so they trail the wheel
// and settle a beat after it stops.
//
// Deliberately shorter than the 1s the handoff and the text sweep use. Those are
// long moves where the lag reads as weight; this one is a 56px lift, and at a
// full second of catch-up the row is still arriving well after the scroll that
// called for it has stopped — which reads as lateness, not as weight.
const REVEAL_LAG = 0.4

// How far apart two top edges can be and still count as the same row. Not zero:
// a grid row's items line up to the pixel, but a browser measuring them through
// a fractional layout can hand back tops a hair apart, and one stray hundredth
// of a pixel would split a row of three into three rows of one.
const ROW_TOLERANCE = 2

// How long the window has to hold still before the rows are measured again. A
// resize arrives as a burst of events across a drag, and each rebuild throws
// away live ScrollTriggers to build new ones — worth doing once the reader has
// stopped, and not worth doing sixty times on the way there.
const RESIZE_SETTLE_MS = 200

// Items that share a top edge, in document order.
//
// Rows are read off the rendered layout rather than marked up, because that is
// where the answer actually lives: an implicit grid row has no element to point
// at, the count per row changes at every breakpoint the grid does, and the same
// component is a row of three under one parent and a row of one under another.
// Measuring says all of that at once, and says it correctly for markup this hook
// has never seen.
//
// Every rect is read in the same tick, so the viewport-relative tops below are
// all against the same scroll position and comparable to each other.
const groupIntoRows = (items) =>
    items.reduce((rows, item) => {
        const top = item.getBoundingClientRect().top
        const openRow = rows[rows.length - 1]

        if (openRow && Math.abs(openRow.top - top) <= ROW_TOLERANCE) {
            openRow.items.push(item)
        } else {
            rows.push({ top, items: [item] })
        }

        return rows
    }, [])

// A row arranged so its last item finishes exactly at `end`.
//
// The total length of a stagger is duration + stagger * (count - 1), so pinning
// that total to 1 is what puts the last item's landing on the trigger's end
// rather than somewhere past it. Derived from the count rather than written down
// as a number so a row of two or four keeps the same landing.
//
// A row of one needs none of that arithmetic and gets none: gap falls to 0,
// leaving a plain tween whose progress the scrub maps across the whole range.
const buildRevealTween = (items) => {
    const gap = items.length > 1 ? (1 - ITEM_SHARE) / (items.length - 1) : 0

    return gsap.fromTo(items,
        { opacity: 0, y: ITEM_LIFT },
        {
            opacity: 1,
            y: 0,
            duration: ITEM_SHARE,
            stagger: gap,
            // With a scrub the scroll is the ease, and a second one layered on
            // top only makes the mapping between the two lie.
            ease: "none",
            scrollTrigger: {
                // The first item stands in for the row. There is no row element
                // to point at — the row is a fact about the layout, not a box in
                // the markup — and pointing at any of them would measure the
                // same in any case, since sharing a top edge is what made them a
                // row in the first place.
                trigger: items[0],
                start: REVEAL_START,
                end: items.length > 1 ? ROW_REVEAL_END : LONE_REVEAL_END,
                scrub: REVEAL_LAG,
            },
        }
    )
}

// Every `data-reveal` item inside `containerRef` fading up into place, scrubbed
// off the scroll that brings its row onto the screen.
//
// `revealKey` is for containers whose contents are swapped rather than
// re-rendered in place — the projects grid re-filtering, a tab panel taking its
// turn on screen. Rows are measured once when the tweens are built, so anything
// that changes WHICH elements are in the container has to say so; pass the value
// the swap keys off and the reveal is rebuilt against what is now there. A
// container with fixed contents can leave it out.
export function useScrollReveal(containerRef, revealKey) {
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const build = () => {
            const mm = gsap.matchMedia()

            // Under reduced motion nothing is built and nothing is set, so the
            // items render exactly as they always have: in place, at full
            // opacity. matchMedia rather than a bare query check so that turning
            // the preference on mid-session tears the reveals down with it.
            mm.add("(prefers-reduced-motion: no-preference)", () => {
                const items = gsap.utils
                    .toArray(container.querySelectorAll(ITEM_SELECTOR))
                    // display:none has no layout, so a hidden item measures at a
                    // top of 0 and would be swept into one bogus row with every
                    // other hidden item. This is the ordinary case, not an edge
                    // one: a tab panel keeps its markup mounted while another
                    // panel is showing, and only the visible panel has rows.
                    .filter((item) => item.offsetParent !== null)

                groupIntoRows(items).forEach((row) => buildRevealTween(row.items))
            })

            // The triggers above were measured against the page as it stands,
            // and this hook is called in the places where that has just changed
            // — a taller tab panel has replaced a shorter one, the grid has
            // reflowed. Everything else scrubbed off this page was measured
            // before any of that, so it is stale until told otherwise.
            ScrollTrigger.refresh()

            return mm
        }

        let mm = build()

        // Which items share a row is a fact about the rendered layout, so it
        // stops being true the moment the grid reflows under a new width.
        // Width alone, not the resize event: mobile browsers fire resize when
        // their toolbar collapses mid-scroll, and rebuilding every trigger on
        // the page in the middle of a scroll is exactly what ScrollTrigger's
        // ignoreMobileResize is set elsewhere to avoid.
        let width = window.innerWidth
        let rebuild

        const onResize = () => {
            if (window.innerWidth === width) return
            width = window.innerWidth

            clearTimeout(rebuild)
            rebuild = setTimeout(() => {
                mm.revert()
                mm = build()
            }, RESIZE_SETTLE_MS)
        }

        window.addEventListener("resize", onResize)

        // revert() undoes every tween and trigger built above, and the opacity
        // and transform they set along the way.
        return () => {
            clearTimeout(rebuild)
            window.removeEventListener("resize", onResize)
            mm.revert()
        }
    }, [containerRef, revealKey])
}
