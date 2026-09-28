import { useLayoutEffect } from "react"
import gsap from "gsap"
import { buildSwapTimeline } from "../helpers/pageSwap"
import { holdScroll } from "../helpers/scrollHold"

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

        // Reduced motion asks for the change without the travel, which is the swap
        // with nothing left of it: the pages simply change.
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            done()
            return undefined
        }

        const timeline = buildSwapTimeline({ leaving, arriving, onComplete: done })

        return () => {
            timeline.kill()

            if (!released) {
                released = true
                release()
            }
        }
    }, [swapKey, arrivingRef, leavingSelector, onDone])
}
