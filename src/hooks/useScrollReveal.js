import { useEffect } from "react"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

// Attribute for revealable element: the reveal only cares where an item
// sits, not what it is.
const ITEM_SELECTOR = "[data-reveal]"

// The row's top edge entering from the foot of the viewport. clamp() keeps rows
// near the document's foot from asking for an end past the maximum scroll, which
// would leave the last cards stuck part-way through their fade.
const REVEAL_START = "clamp(top bottom)"
// A full row finishes at the viewport middle; a stack finishes at 60%, a little
// sooner, because a one-per-row item is a wide one and shouldn't still be
// arriving after it fills the view. The row end is a default — see the hook's
// options — while the stack's is fixed: with nothing staggered against it there
// is no row to tighten.
const ROW_REVEAL_END = "clamp(top center)"
const STACK_REVEAL_END = "clamp(top 60%)"

// How far below its resting place an item starts, in px. A transform rather than
// a `bottom` offset, which would need position:relative and a repaint per frame.
// Small on purpose: more distance reads as a carousel, not as surfacing. A
// default the caller can override — the lift is also what sets how far apart
// neighbours sit mid-flight, so a tightly staggered row needs more of it to keep
// the ladder between its items visible.
const ITEM_LIFT = 56

// Share of the row's scroll range one item takes to complete; the rest is spent
// waiting for the items behind it. Raise to move the row as a block, lower to
// spread the items further apart. A default the caller can override, and the
// counterweight to a shortened row end: a shorter range at the same share would
// speed every item up, where a larger share over a shorter range holds each
// item's own pace and only closes the gaps between them.
const ITEM_SHARE = 0.5

// Seconds of catch-up between scroll and reveal, so items trail the wheel and
// settle after it. Shorter than the 1s the handoff and sweep use — over a 56px
// lift, a full second reads as lateness rather than weight.
const REVEAL_LAG = 0.4

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
// reaches is mid-fade, so nothing below is ever simply there. Collapsing it is
// what gives the reveal a place to stop.
const isStacked = (rows) => rows.every((row) => row.items.length === 1)

// A row arranged so its last item finishes exactly at `end`.
//
// A stagger's total length is duration + stagger * (count - 1); pinning that to
// 1 puts the last landing on the trigger's end.
//
// The visible offset between neighbours falls out of the same two numbers:
// with a linear ease they sit `(gap / itemShare) * lift` px apart while all are
// in flight. Tighten the row without answering for that and the items travel as
// one flat block.
const buildRowTween = (items, rowEnd, itemShare, lift) => {
    const gap = (1 - itemShare) / (items.length - 1)

    return gsap.fromTo(items,
        { opacity: 0, y: lift },
        {
            opacity: 1,
            y: 0,
            duration: itemShare,
            stagger: gap,
            // With a scrub the scroll is the ease; a second one would only make
            // the mapping between them lie.
            ease: "none",
            scrollTrigger: {
                // The first item stands in for the row — there's no row element,
                // and sharing a top edge is what made them a row anyway.
                trigger: items[0],
                start: REVEAL_START,
                end: rowEnd,
                scrub: REVEAL_LAG,
            },
        }
    )
}

// A whole stack rising as one, on the scroll that brings its first item in.
//
// No stagger: the point is that the reveal is over by the time the reader is
// past the first item. Everything below it is already at rest and stays there,
// however far the stack runs on — so the effect greets the section rather than
// following the reader down it.
//
// A container of a single item takes this path too, which is what it always was:
// one item, no stagger, and nothing left behind it to wait for.
const buildStackTween = (items, lift) =>
    gsap.fromTo(items,
        { opacity: 0, y: lift },
        {
            opacity: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
                trigger: items[0],
                start: REVEAL_START,
                end: STACK_REVEAL_END,
                scrub: REVEAL_LAG,
            },
        }
    )

// Every `data-reveal` item inside `containerRef` fading up into place, scrubbed
// off the scroll that brings it on screen.
//
// Multi-column layouts reveal a row at a time, each on its own trigger. A layout
// running one item per row — which is most of them on a phone — reveals in a
// single pass at the top instead, and is at rest from there down.
//
// Pass `revealKey` for containers whose contents are swapped rather than
// re-rendered — a re-filtering grid, a tab panel. Rows are measured once, so
// anything changing WHICH elements are present has to say so.
//
// `rowEnd`, `itemShare` and `lift` move where a multi-item row lands, how tightly
// it travels, and how far each item rises. A container wanting its rows done
// sooner has to raise the share as it pulls the end in, or the same animation
// just plays faster over less scroll — and then wants more lift, since a raised
// share is what flattens its items against one another. Only `lift` reaches the
// stacked path, which has no row to place or spread.
export function useScrollReveal(
    containerRef,
    revealKey,
    { rowEnd = ROW_REVEAL_END, itemShare = ITEM_SHARE, lift = ITEM_LIFT } = {},
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
                    buildStackTween(items, lift)
                } else {
                    rows.forEach(({ items: row }) =>
                        row.length > 1
                            ? buildRowTween(row, rowEnd, itemShare, lift)
                            : buildStackTween(row, lift)
                    )
                }
            })

            // This hook is called where the page has just changed shape, so
            // everything else scrubbed off it is stale until refreshed.
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
    }, [containerRef, revealKey, rowEnd, itemShare, lift])
}
