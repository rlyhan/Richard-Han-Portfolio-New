import { useEffect } from "react"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

// Attribute for revealable element: the reveal only cares where an item
// sits, not what it is.
const ITEM_SELECTOR = "[data-reveal]"

// The height in the viewport a row's top edge has to reach for its reveal to
// start, as a fraction from the top. One line rather than a start and an end:
// the scroll says WHEN a row goes, never how far along it is — from there the
// reveal runs on its own clock and always lands, whether or not the wheel keeps
// turning. A scrub welds progress to the scroll position, and that weld is what
// parks a row half-faded the moment the reader stops mid-flight.
//
// Low in the viewport, because the row still has its own run to make afterwards:
// by the time the last item lands the row is comfortably on screen.
const REVEAL_LINE = 0.85

// clamp() keeps rows near the document's foot from asking for a start past the
// maximum scroll — the line they can never reach, which would leave the last
// cards sitting at opacity 0 forever.
const REVEAL_START = `clamp(top ${REVEAL_LINE * 100}%)`

// How far below its resting place an item starts, in px. A transform rather than
// a `bottom` offset, which would need position:relative and a repaint per frame.
// Small on purpose: more distance reads as a carousel, not as surfacing. A
// default the caller can override — the lift is also what sets how far apart
// neighbours sit mid-flight, so a tightly staggered row needs more of it to keep
// the ladder between its items visible.
const ITEM_LIFT = 56

// One item's rise, in real seconds, and the gap between neighbours in a row.
// Both are wall-clock now rather than shares of a scroll range: the whole row
// takes duration + stagger * (count - 1) to finish, from wherever the reader
// happened to stop. Defaults the caller can override — the stagger is the knob
// for whether a row arrives as a run or as a block.
const ITEM_DURATION = 0.7
const ITEM_STAGGER = 0.12

// With the scroll no longer driving progress, the ease is the hook's own again:
// items come in quickly and settle, rather than sliding at one flat rate the way
// a scrubbed tween has to.
const ITEM_EASE = "power2.out"

// Fractional layout can report tops a hair apart, and a hundredth of a pixel
// shouldn't split a row of three into three rows of one.
const ROW_TOLERANCE = 2

// A resize arrives as a burst of events, and each rebuild throws away live
// ScrollTriggers — worth doing once the drag stops.
const RESIZE_SETTLE_MS = 200

// Items that share a top edge, in document order.
//
// Rows are measured rather than marked up: an implicit grid row has no element
// to point at, and the count per row changes with every breakpoint. Every rect
// is read in one tick, so the tops are comparable.
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

// Whether a layout puts one item on every row — a mobile grid, a column of
// full-width cards, a list of articles.
//
// Such a layout has no rows to reveal in turn, only a queue of them, and a queue
// makes the effect the whole experience of the page: every card the reader
// reaches announces itself. Collapsing it is what gives the reveal a place to
// stop.
const isStacked = (rows) => rows.every((row) => row.items.length === 1)

// Whether a row is already at or above the line by the time it is built —
// content on screen at load, or below the fold of a rebuild the reader has long
// since scrolled past.
//
// Such a row is left alone entirely: no from-state, no trigger, so it renders at
// rest. Building one anyway would blank it and fade it back in, which on the
// resize path means a whole page of settled cards re-announcing themselves.
const isPastRevealLine = (row) =>
    row[0].getBoundingClientRect().top <= window.innerHeight * REVEAL_LINE

// A row arriving as a run, its items a fixed beat apart.
//
// The visible offset between neighbours falls out of the same two numbers: with
// this ease they sit roughly `(stagger / duration) * lift` px apart early in the
// flight. Tighten the stagger without answering for that and the items travel as
// one flat block.
const buildRowTween = (items, { duration, stagger, lift }) =>
    gsap.fromTo(items,
        { opacity: 0, y: lift },
        {
            opacity: 1,
            y: 0,
            duration,
            stagger,
            ease: ITEM_EASE,
            scrollTrigger: {
                // The first item stands in for the row — there's no row element,
                // and sharing a top edge is what made them a row anyway.
                trigger: items[0],
                start: REVEAL_START,
                // Plays once and retires: nothing to reverse on the way back up,
                // and nothing left listening for a row that is done.
                once: true,
            },
        }
    )

// A whole stack rising as one, on the scroll that brings its first item to the
// line.
//
// No stagger: the point is that the reveal is over by the time the reader is
// past the first item. Everything below it is already at rest and stays there,
// however far the stack runs on — so the effect greets the section rather than
// following the reader down it.
//
// A container of a single item takes this path too, which is what it always was:
// one item, no stagger, and nothing left behind it to wait for.
const buildStackTween = (items, { duration, lift }) =>
    gsap.fromTo(items,
        { opacity: 0, y: lift },
        {
            opacity: 1,
            y: 0,
            duration,
            ease: ITEM_EASE,
            scrollTrigger: {
                trigger: items[0],
                start: REVEAL_START,
                once: true,
            },
        }
    )

// Every `data-reveal` item inside `containerRef` fading up into place, on the
// scroll that brings it on screen — and, once it starts, running to its rest
// position under its own steam. Stopping the wheel mid-reveal doesn't stop the
// reveal.
//
// Multi-column layouts reveal a row at a time, each on its own trigger. A layout
// running one item per row — which is most of them on a phone — reveals in a
// single pass at the top instead, and is at rest from there down.
//
// Pass `revealKey` for containers whose contents are swapped rather than
// re-rendered — a re-filtering grid, a tab panel. Rows are measured once, so
// anything changing WHICH elements are present has to say so.
//
// `duration`, `stagger` and `lift` move how long one item takes, how far behind
// it the next one follows, and how far each rises. Only `duration` and `lift`
// reach the stacked path, which has no run to space out.
export function useScrollReveal(
    containerRef,
    revealKey,
    { duration = ITEM_DURATION, stagger = ITEM_STAGGER, lift = ITEM_LIFT } = {},
) {
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const build = () => {
            const mm = gsap.matchMedia()

            // Under reduced motion nothing is built or set, so items render in
            // place at full opacity. matchMedia so toggling the preference
            // mid-session tears the reveals down.
            mm.add("(prefers-reduced-motion: no-preference)", () => {
                const items = gsap.utils
                    .toArray(container.querySelectorAll(ITEM_SELECTOR))
                    // display:none measures at top 0, which would sweep every
                    // hidden item into one bogus row. Ordinary case: an inactive
                    // tab panel stays mounted.
                    .filter((item) => item.offsetParent !== null)

                if (items.length === 0) return

                const rows = groupIntoRows(items)

                // One trigger for the lot, or one per row — and within a grid, a
                // row left holding a single item (a trailing third card, say)
                // takes the stacked path too: there is nothing for it to
                // stagger against either.
                if (isStacked(rows)) {
                    if (!isPastRevealLine(items)) {
                        buildStackTween(items, { duration, lift })
                    }
                } else {
                    rows.forEach(({ items: row }) => {
                        if (isPastRevealLine(row)) return

                        row.length > 1
                            ? buildRowTween(row, { duration, stagger, lift })
                            : buildStackTween(row, { duration, lift })
                    })
                }
            })

            // This hook is called where the page has just changed shape, so
            // every other trigger's measurements are stale until refreshed.
            ScrollTrigger.refresh()

            return mm
        }

        let mm = build()

        // Rows stop being true the moment the grid reflows under a new width.
        // Width alone, not the resize event: mobile browsers fire resize when
        // their toolbar collapses mid-scroll.
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

        // revert() undoes every tween and trigger, and the values they set.
        return () => {
            clearTimeout(rebuild)
            window.removeEventListener("resize", onResize)
            mm.revert()
        }
    }, [containerRef, revealKey, duration, stagger, lift])
}
