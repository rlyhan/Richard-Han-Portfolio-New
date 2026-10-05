import { useLayoutEffect } from "react"
import gsap from "gsap"
import { buildSwapTimeline } from "../helpers/pageSwap"
import { holdScroll } from "../helpers/scrollHold"

// How long a swap waits on the arriving page's pictures before going without them,
// in ms. Shorter than the reveal's wait: until the swap starts, the click looks like
// it did nothing.
const SHOT_WAIT_CAP_MS = 1000

// The arriving page's above-the-fold pictures — the ones it marks eager. A lazy one
// is below the fold, where nothing is watching for it during the swap.
const whenShotsReady = (page) => {
    const decoded = Array.from(page.querySelectorAll('img:not([loading="lazy"])'))
        .map((image) => image.decode().catch(() => {}))

    if (decoded.length === 0) return null

    return Promise.race([
        Promise.all(decoded),
        new Promise((resolve) => setTimeout(resolve, SHOT_WAIT_CAP_MS)),
    ])
}

// The transition between two pages that share no scroll: the page being left lifts
// and fades, the page asked for comes up from below the fold and takes the screen.
// See helpers/pageSwap for the timing, and RouterProvider's navigate for when this is
// what a page change is.
//
// Both halves of it are elements the outlet is already rendering — the arriving page
// in its own box, held to the viewport while it travels, and the leaving page's
// section. Nothing is mounted for the transition and nothing is unmounted by it: when
// it ends the router simply stops calling the arriving page an arrival, and the box
// it is already in becomes part of the document.
//
// That is the point of doing it here rather than inside a component of its own. A page
// rendered in one place while it travels and another once it lands is built twice,
// and everything it does on arrival — a reveal, a carousel, a measurement — happens
// twice with it.
export function useSwapTransition({ arrivingRef, leavingSelector, swapKey, onDone }) {
    useLayoutEffect(() => {
        if (!swapKey) return undefined

        const arriving = arrivingRef.current
        const leaving = leavingSelector && document.querySelector(leavingSelector)

        // The scroll is not the viewer's for the length of this: a gesture through
        // the middle of it would strand them between two pages.
        let released = false
        const release = holdScroll()

        const done = () => {
            // Whatever the timeline left on either element goes: the leaving page is
            // about to be dropped, and the arriving one keeps its box and becomes the
            // document, where a transform would be a page sitting off its own top.
            gsap.set([arriving, leaving].filter(Boolean), { clearProps: "all" })

            if (!released) {
                released = true
                release()
            }

            onDone()
        }

        let cancelled = false
        let timeline = null

        const start = () => {
            if (cancelled) return

            // Reduced motion asks for the change without the travel, which is the swap
            // with nothing left of it: the pages simply change.
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                done()
                return
            }

            timeline = buildSwapTimeline({ leaving, arriving, onComplete: done })
        }

        // A first visit mounts the page with its pictures still in flight, and the swap
        // would carry in a hole where each one goes. So it waits for them — but its box
        // covers the screen, so it waits a screen down, where the timeline starts from.
        const shotsReady = whenShotsReady(arriving)

        if (shotsReady) {
            gsap.set(arriving, { yPercent: 100 })
            shotsReady.then(start)
        } else {
            start()
        }

        return () => {
            cancelled = true
            timeline?.kill()

            if (!released) {
                released = true
                release()
            }
        }
    }, [swapKey, arrivingRef, leavingSelector, onDone])
}
