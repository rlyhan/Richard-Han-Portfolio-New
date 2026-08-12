import { useEffect } from "react"
import { getLenis } from "./useLenis"

// Holds the page still while something on top of it — a modal — owns the scroll.
//
// Two locks, because neither covers the other. `overflow-hidden` on the body stops
// the browser scrolling the document, which is the whole of it on touch and under
// reduced motion, where Lenis is bypassed or never constructed.
//
// On the wheel it isn't: Lenis cancels the wheel event and scrolls the document
// itself, and `overflow: hidden` only blocks user-initiated scrolling — a
// programmatic scrollTo goes through unimpeded. Stopping Lenis closes that path,
// and swallows the cancelled wheel events so the page doesn't move natively either.
//
// Anything meant to stay scrollable while locked needs `data-lenis-prevent`.
export function useScrollLock(isLocked) {
    useEffect(() => {
        if (!isLocked) return

        document.body.classList.add("overflow-hidden")
        // Re-read the instance on each side rather than capturing it: child effects
        // run before the parent's, so there may be none yet, and a remount replaces it.
        getLenis()?.stop()

        return () => {
            document.body.classList.remove("overflow-hidden")
            getLenis()?.start()
        }
    }, [isLocked])
}
