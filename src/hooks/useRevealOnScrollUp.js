import { useEffect, useState } from "react"
import { getSectionFlowTop } from "../helpers/sectionScroll"

// Jitter (trackpad drift, iOS rubber-banding), not a direction change — same
// threshold the old header bar used.
const SCROLL_DELTA = 6

// Larger than this share of the viewport isn't a gesture either — a page handoff
// moves the scroll a full page in one frame (see RouterProvider), which would
// otherwise read as the ask for a nav bar. No real scroll comes this close.
const JUMP_SHARE = 1

// Whether a bar pinned to the viewport is up, and whether the page is above the
// point it answers for.
//
// Direction, not position: going down the page the viewer is reading, and the bar
// is in the way; the moment they turn around they are looking for something, and
// that is what it is for.
//
// - `floorSelector`: the section this bar starts answering for, as the scroll
//   position where its top edge reaches the viewport's top. Gates arrival only —
//   above the floor the bar won't slide in, but one already up stays up.
//
// - `pageDrawsBar`: whether the page already has its own copy, and so whether a
//   floor exists at all. No copy, no floor (not zero — that would read a short
//   page's own top as past it). A copy takes its floor from `floorSelector`; no
//   match, or no selector, both read as a floor below everything.
//
// - `isAboveFloor`: the hero's join. It carries its own copy of the bar, so a
//   viewer scrolling back up already has one in hand — losing it there for the
//   hero's copy to fade in behind would be a flicker. Above the floor the hero's
//   bar already sits underneath, so the pinned one can leave at once instead of
//   sliding out from under an identical twin.
//
// - `measureKey`: re-reads the floor, and resets the bar's opening state for a
//   new page. Pages open with the bar UP, so there's a way off it before any
//   scroll happens — unless the page draws its own copy, where a second visible
//   bar would double the links in the accessibility tree, so it opens DOWN
//   instead (see SiteNav, same flag). The direction rule takes over from there.
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
