import { useEffect } from "react"
import { getLenis } from "./useLenis"

// Holds the page still while something on top of it — a modal — owns the scroll.
//
// Two locks, because there are two ways the page moves and neither covers the
// other:
//
// `overflow-hidden` on the body stops the browser scrolling the document, which
// is the whole of it on touch and under reduced motion, where Lenis is either
// bypassed (syncTouch is off, so touch stays native) or never constructed.
//
// It is not the whole of it on the wheel. Lenis cancels the wheel event and
// scrolls the document itself, and `overflow: hidden` only blocks user-initiated
// scrolling — a programmatic scrollTo goes through a hidden viewport unimpeded.
// So the body class alone leaves the wheel scrolling the page behind the modal;
// stopping Lenis is what closes that path. It also swallows the cancelled wheel
// events rather than passing them on, so the page does not move natively either.
//
// Anything meant to stay scrollable while locked needs `data-lenis-prevent`:
// Lenis checks for it before it checks whether it is stopped, so those subtrees
// keep their native wheel scrolling throughout.
export function useScrollLock(isLocked) {
    useEffect(() => {
        if (!isLocked) return

        document.body.classList.add("overflow-hidden")
        // Re-read the instance on each side rather than capturing it. Child
        // effects run before the parent's, so on the first pass there may be no
        // instance yet, and a remount replaces the one there was.
        getLenis()?.stop()

        return () => {
            document.body.classList.remove("overflow-hidden")
            getLenis()?.start()
        }
    }, [isLocked])
}
