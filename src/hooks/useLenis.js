import { useEffect } from "react"
import Lenis from "lenis"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import "lenis/dist/lenis.css"

gsap.registerPlugin(ScrollTrigger)

// Smooth scrolling for the whole document, driven off GSAP's ticker rather than
// its own rAF loop.
//
// One loop, not two: every scrubbed animation on the page is a ScrollTrigger, so
// Lenis advancing the scroll position and ScrollTrigger reading it have to happen
// in a fixed order within the same frame. Left on separate rAF callbacks the
// order is whichever registered first, and the triggers spend every other frame
// reading a position Lenis has not written yet.
//
// Call this once, at the root. Lenis binds to the window, so a second instance
// anywhere in the tree is not a second smooth scroll — it is two of them writing
// conflicting positions to the same scroller on the same frame.
export function useLenis() {
    useEffect(() => {
        // Smooth scroll is precisely the thing this setting opts out of: it
        // decouples the page from the wheel and keeps it moving after the
        // gesture stops. The handoff timeline already sits behind the same
        // query, so under reduced motion the page scrolls natively throughout.
        //
        // Not covered by Lenis's own respectReducedMotion, despite the name —
        // that option only forces scrollTo() to jump rather than tween. Wheel
        // smoothing is left running regardless, so declining to construct the
        // instance at all is the only way to actually honour the preference.
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

        // autoRaf off — the ticker below is the loop.
        //
        // syncTouch is left at its default of false, so touch devices keep
        // native momentum scrolling and only the wheel is smoothed. Deliberate:
        // iOS momentum is deeply familiar and overriding it reads as breakage,
        // and the handoff's SCRUB_LAG supplies the trailing weight on mobile
        // regardless. ScrollTrigger scrubs off native scroll events either way,
        // so nothing below depends on Lenis driving the position.
        const lenis = new Lenis({ autoRaf: false })

        lenis.on("scroll", ScrollTrigger.update)

        // Lenis measures in milliseconds, the ticker reports seconds.
        const advance = (time) => lenis.raf(time * 1000)
        gsap.ticker.add(advance)

        // GSAP otherwise absorbs long frames by pretending less time passed than
        // did, which is right for a timeline playing on its own clock and wrong
        // for one scrubbed off a scroll position: the scroll really did move that
        // far, and swallowing the difference leaves the animation behind the page.
        gsap.ticker.lagSmoothing(0)

        return () => {
            gsap.ticker.remove(advance)
            // Back to GSAP's defaults rather than off, since the ticker outlives
            // this hook.
            gsap.ticker.lagSmoothing(500, 33)
            lenis.destroy()
        }
    }, [])
}
