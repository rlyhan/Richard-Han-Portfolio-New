import { useEffect } from "react"
import Lenis from "lenis"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import "lenis/dist/lenis.css"

gsap.registerPlugin(ScrollTrigger)

// The single root instance, or null when there is none — before App mounts, or
// under reduced motion. Module scope rather than context: there is exactly one
// scroller and consumers only reach it imperatively (see useScrollLock). Read it
// at the moment of use, never hold it — a remount replaces it.
let instance = null

export const getLenis = () => instance

// Smooth scrolling for the whole document, driven off GSAP's ticker rather than
// its own rAF loop. One loop, not two: Lenis writing the scroll position and
// ScrollTrigger reading it have to happen in a fixed order within a frame, or the
// triggers spend every other frame reading a position Lenis hasn't written yet.
//
// Call once, at the root. Lenis binds to the window, so a second instance is two
// smooth scrolls writing conflicting positions to the same scroller.
export function useLenis() {
    useEffect(() => {
        // Smooth scroll is exactly what this preference opts out of. Not covered
        // by Lenis's own respectReducedMotion, which only forces scrollTo() to
        // jump — wheel smoothing keeps running, so declining to construct the
        // instance is the only way to honour it.
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

        // autoRaf off — the ticker below is the loop.
        //
        // syncTouch stays false, so touch keeps native momentum and only the wheel
        // is smoothed: iOS momentum is familiar enough that overriding it reads as
        // breakage, and SCRUB_LAG supplies the trailing weight on mobile anyway.
        const lenis = new Lenis({ autoRaf: false })
        instance = lenis

        lenis.on("scroll", ScrollTrigger.update)

        // Lenis measures in milliseconds, the ticker reports seconds.
        const advance = (time) => lenis.raf(time * 1000)
        gsap.ticker.add(advance)

        // GSAP otherwise absorbs long frames by pretending less time passed. Right
        // for a timeline on its own clock, wrong for one scrubbed off scroll: the
        // page really did move that far.
        gsap.ticker.lagSmoothing(0)

        return () => {
            gsap.ticker.remove(advance)
            // Back to GSAP's defaults rather than off — the ticker outlives this hook.
            gsap.ticker.lagSmoothing(500, 33)
            lenis.destroy()
            instance = null
        }
    }, [])
}
