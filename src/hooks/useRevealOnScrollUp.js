import { useEffect, useState } from "react"
import { getSectionFlowTop } from "../helpers/sectionScroll"

// Smaller movement is jitter (trackpad drift, iOS rubber-banding), not a direction
// change. Same threshold the old header bar read direction with.
const SCROLL_DELTA = 6

// Larger movement than this share of the viewport is not a gesture either. A page
// handing over to the next one takes its own height off the scroll position in the
// frame it leaves the document (see RouterProvider), and travelling a page upward in
// one reading is what the viewer would otherwise appear to have done — which is
// exactly the ask for a nav bar. Nobody scrolls this far in a frame; a flick that
// comes close is still read on the frames either side of it.
const JUMP_SHARE = 1

// Whether a bar pinned to the viewport is up, and whether the page is above the
// point it answers for.
//
// Direction, not position: going down the page the viewer is reading, and the bar
// is in the way; the moment they turn around they are looking for something, and
// that is what it is for.
//
// `floorSelector` is the section it starts answering for — the floor being the
// scroll position where that section's top edge reaches the top of the viewport.
// The floor gates the bar arriving, not the bar staying: above it the bar will not
// slide in, but one already up rides all the way to the top rather than dropping
// away and being replaced.
//
// That asymmetry is the hero. It carries a copy of this bar in its own layout, so
// pinning a second one over it while the viewer is down there is the same furniture
// drawn twice — but a viewer travelling back up to it has the bar in hand already,
// and taking it away at the join, for the hero's identical copy to fade in behind,
// is a flicker rather than an arrival.
//
// `isAboveFloor` is that join, for the caller to animate around: above it the hero's
// own bar is underneath the pinned one, so a pinned bar going away there should go
// at once. Sliding it out from under an identical bar smears the two apart for as
// long as the slide lasts.
//
// `pageDrawsBar` is whether the page under this bar draws a copy of it in its own
// layout, and so whether there is a floor at all. A page that does not is a floor
// above everything: there is nothing down there for this bar to wait for. Not zero,
// which reads as the viewer being above the floor whenever they are at the top of the
// page — and on a page with barely a screen of scroll, the whole way back up lands
// there in a single frame, so the bar is never asked to come up.
//
// A page that does takes its floor from `floorSelector`, and on this site the element
// it names is a page the router has not necessarily mounted yet — so a selector
// matching nothing is a floor below everything rather than one at the top of the
// page: the section it answers for is still ahead. No selector at all is the same
// floor for a plainer reason — the page draws the bar itself and nothing follows it,
// so the pinned copy has nowhere to come up and stays down for the whole page.
//
// `measureKey` is what re-reads it, and — being the page the bar is standing on — is
// also what returns the bar to its opening state.
//
// A page opens with the bar UP, and reading forward is what puts it away. Arriving is
// the one moment the viewer has certainly not asked for anything yet, and a page that
// opens with no way off it asks them to scroll against it to find one. The direction
// rule above still owns every moment after that.
//
// The exception is a page that draws this bar in its own layout: there the pinned
// copy would be the same furniture drawn twice, and both copies would put their links
// in the accessibility tree. So the opening state falls out of `pageDrawsBar` — see
// SiteNav, which reads the same flag for the join below.
export function useRevealOnScrollUp(floorSelector, pageDrawsBar, measureKey) {
    const opensRevealed = !pageDrawsBar

    const [isRevealed, setIsRevealed] = useState(opensRevealed)
    const [isAboveFloor, setIsAboveFloor] = useState(true)

    // The page the bar is currently standing on. This bar outlives every page change
    // — that is the point of it living outside the pages — so there is no unmount to
    // return it to its opening state and it would otherwise inherit whatever the last
    // page left it in: put away by reading down About, and so missing on the page
    // About was left for.
    //
    // Adjusted during render rather than in an effect, which is what React asks for
    // when state has to follow a prop. An effect would paint the previous page's bar
    // for a frame first, and this bar is animated — a frame of the wrong state here is
    // a slide that starts from the wrong place.
    const [barPage, setBarPage] = useState(measureKey)

    if (barPage !== measureKey) {
        setBarPage(measureKey)
        setIsRevealed(opensRevealed)
    }

    useEffect(() => {
        let frame = null
        let lastY = Math.max(window.scrollY, 0)
        let floor = 0

        // Measured off the layout rather than a live box, as everywhere else that
        // resolves a section's position: the sections above this one carry
        // scroll-driven transforms, and a box read mid-flight is displaced by
        // however far the section has yet to travel.
        const measureFloor = () => {
            if (!pageDrawsBar) {
                floor = -Infinity
                return
            }

            const section = floorSelector
                ? document.querySelector(floorSelector)
                : null
            floor = section ? getSectionFlowTop(section) : Infinity
        }

        const update = () => {
            frame = null
            // Clamped: overscroll reports a negative scrollY, which would read as
            // an upward move on the way back down.
            const y = Math.max(window.scrollY, 0)
            const delta = y - lastY
            const aboveFloor = y <= floor

            // Ahead of the direction read below, which can return without ever
            // reaching it: which side of the floor the page is on is a position and
            // is true whether or not the viewer is moving.
            setIsAboveFloor(aboveFloor)

            // The document moved under the bar rather than the viewer moving through
            // it. Taken as the new resting point, so the next real gesture is read
            // against where the page now is.
            if (Math.abs(delta) > window.innerHeight * JUMP_SHARE) {
                lastY = y
                return
            }

            // Under the threshold lastY is left alone, so a slow drag accumulates
            // into a direction instead of being discarded a frame at a time.
            if (Math.abs(delta) < SCROLL_DELTA) return
            lastY = y

            setIsRevealed((wasRevealed) =>
                delta < 0 ? wasRevealed || !aboveFloor : false,
            )
        }

        const onScroll = () => {
            if (frame === null) frame = requestAnimationFrame(update)
        }

        // A layout position, so it moves whenever the window is resized.
        const onResize = () => {
            measureFloor()
            update()
        }

        measureFloor()
        update()

        window.addEventListener("scroll", onScroll, { passive: true })
        window.addEventListener("resize", onResize)

        return () => {
            window.removeEventListener("scroll", onScroll)
            window.removeEventListener("resize", onResize)
            if (frame !== null) cancelAnimationFrame(frame)
        }
    }, [floorSelector, pageDrawsBar, measureKey])

    return { isRevealed, isAboveFloor }
}
