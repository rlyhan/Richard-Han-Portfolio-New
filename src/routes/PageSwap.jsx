import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { EMPTY_SLOT, PageContext } from "./RouterContext"
import { buildSwapTimeline } from "../helpers/pageSwap"
import { holdScroll } from "../helpers/scrollHold"

// The page arriving by a swap, and the transition that brings it in.
//
// Held to the viewport rather than mounted in the flow of the document: the page it
// is replacing can be scrolled to anywhere, and what the viewer should see is the new
// page coming up from the bottom of the SCREEN. Fixed and clipped, it shows exactly
// the screenful the page will open at, so there is nothing to reconcile when the
// router commits — the page lands where the curtain already had it, and the scroll is
// seated at its top in the same frame.
//
// Above the pinned nav bar, which is the one piece of furniture that would otherwise
// be left sitting on top of a page sliding under it.
const PageSwap = (props) => {
    const { outgoingRef, onDone } = props
    // Read out under a capitalised name, which is what JSX needs to treat it as a
    // component rather than as an HTML tag.
    const Page = props.Page

    const curtainRef = useRef(null)

    useLayoutEffect(() => {
        let released = false
        const release = holdScroll()

        const done = () => {
            // The page being left keeps whatever the timeline put on it, and the
            // element it is on is about to hold the page arriving.
            gsap.set(outgoingRef.current, { clearProps: "all" })

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

        const timeline = buildSwapTimeline({
            outgoing: outgoingRef.current,
            incoming: curtainRef.current,
            onComplete: done,
        })

        return () => {
            timeline.kill()

            if (!released) {
                released = true
                release()
            }
        }
    }, [outgoingRef, onDone])

    return (
        <div ref={curtainRef} className="fixed inset-0 z-40 overflow-hidden">
            <PageContext.Provider value={EMPTY_SLOT}>
                <Page />
            </PageContext.Provider>
        </div>
    )
}

export default PageSwap
