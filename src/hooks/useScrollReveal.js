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

// How long a row waits on its own shots before coming in without them, in ms. A
// request that never settles would otherwise leave the row blank for good — the
// reveal plays once and nothing comes back for it — and a tile whose picture is
// still in flight is still a tile worth reading.
const SHOT_WAIT_CAP_MS = 2000

// Resolves once every image inside `items` has pixels to paint, or the cap runs out.
//
// decode() over the load event: a decoded image paints next frame, where one that
// has merely arrived still turns up a frame or two late. It also frees an image
// still behind its lazy-load threshold — the case this is really for. A broken
// image rejects, which counts as ready.
//
// Waits on the row's shots together, not each item alone, so the run starts as one
// instead of being ordered by the network.
const whenShotsReady = (items) => {
    const decoded = items
        .flatMap((item) => Array.from(item.querySelectorAll("img")))
        .map((image) => image.decode().catch(() => {}))

    return Promise.race([
        Promise.all(decoded),
        new Promise((resolve) => setTimeout(resolve, SHOT_WAIT_CAP_MS)),
    ])
}

// A reveal, blanked at build time and played by its own trigger once the row has
// both reached the line and got something to show.
//
// The trigger is created beside the tween rather than handed to it: GSAP starts a
// tween the moment its trigger is crossed, and crossing the line is only half of
// what has to be true. The other half is the pictures — a project tile is mostly
// its shot, and a fade that starts while the shot is still in flight plays out
// around a hole the picture then drops into.
//
// `stagger`:
// - left off, a stack rises as one — the whole point of the stacked path. The
//   reveal is over by the time the reader is past the first item, and everything
//   below stays at rest however far the stack runs on, so the effect greets the
//   section rather than following the reader down it.
// - included, the row arrives as a run, its items a fixed beat apart; with this
//   ease they sit roughly `(stagger / duration) * lift` px apart early in the
//   flight. Tighten the stagger without answering for that and the items travel
//   as one flat block.
const buildReveal = (items, { duration, stagger, lift }, isLive) => {
    const tween = gsap.fromTo(items,
        { opacity: 0, y: lift },
        {
            opacity: 1,
            y: 0,
            duration,
            stagger,
            ease: ITEM_EASE,
            paused: true,
        }
    )

    ScrollTrigger.create({
        // The first item stands in for the row — there's no row element, and
        // sharing a top edge is what made them a row anyway.
        trigger: items[0],
        start: REVEAL_START,
        // Fires once and retires: nothing to reverse on the way back up, and
        // nothing left listening for a row that is done.
        once: true,
        onEnter: () => {
            whenShotsReady(items).then(() => {
                if (isLive()) tween.play()
            })
        },
    })
}

// Every `data-reveal` item inside `containerRef` fading up into place, on the
// scroll that brings it on screen — and, once it starts, running to its rest
// position under its own steam. Stopping the wheel mid-reveal doesn't stop the
// reveal.
//
// Multi-column layouts reveal a row at a time, each on its own trigger. A layout
// running one item per row — which is most of them on a phone — reveals in a
// single pass at the top instead, and is at rest from there down.
//
// Reaching the line is necessary but not sufficient: a row with images in it waits
// for them as well, so a picture fades in with the frame around it rather than
// landing part-way through the fade — see whenShotsReady for how long it waits.
//
// - `revealKey`: pass it for containers whose contents are swapped rather than
//   re-rendered — a re-filtering grid, a tab panel. Rows are measured once, so
//   anything changing WHICH elements are present has to say so.
// - `duration`, `stagger`, `lift`: how long one item takes, how far behind it the
//   next one follows, and how far each rises. Only `duration` and `lift` reach the
//   stacked path, which has no run to space out.
// - `enabled`: for a container mounted somewhere other than where it will live —
//   a page arriving by a swap is held to the viewport a screen below the fold
//   while it travels (see PageOutlet), and every row measured there reads as below
//   the line, so every row would be blanked and handed a trigger for a scroll
//   position that means nothing. Told to wait, the hook builds nothing and the
//   items render at rest; the caller flips it once the page is where it belongs,
//   and the rows are read from their real places. Not a key, because a key would
//   build the wrong thing first and then correct it, and the correction is a
//   page-worth of cards blinking.
export function useScrollReveal(
    containerRef,
    revealKey,
    { duration = ITEM_DURATION, stagger = ITEM_STAGGER, lift = ITEM_LIFT, enabled = true } = {},
) {
    useEffect(() => {
        const container = containerRef.current
        if (!container || !enabled) return

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

                // A row crossing the line can still be waiting on its shots when
                // this build is torn down — a filter press, a resize, the page
                // leaving. revert() has put its items back at rest by then, so the
                // wait has to know not to play what it was holding.
                let live = true
                const isLive = () => live

                const rows = groupIntoRows(items)

                // One trigger for the lot, or one per row. A grid row left holding
                // a single item (a trailing third card, say) still takes the row
                // path: a stagger across one target is a stagger across nothing.
                if (isStacked(rows)) {
                    if (!isPastRevealLine(items)) {
                        buildReveal(items, { duration, lift }, isLive)
                    }
                } else {
                    rows.forEach(({ items: row }) => {
                        if (isPastRevealLine(row)) return

                        buildReveal(row, { duration, stagger, lift }, isLive)
                    })
                }

                return () => {
                    live = false
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
    }, [containerRef, revealKey, duration, stagger, lift, enabled])
}
