import { useCallback, useEffect, useRef, useState } from "react"
import gsap from "gsap"
import ScrollToPlugin from "gsap/ScrollToPlugin"
import { holdScroll } from "../helpers/scrollHold"
import { getSectionRestingScrollY } from "../helpers/sectionScroll"

gsap.registerPlugin(ScrollToPlugin)

// How long a scroll asked for by a nav item takes to cross the sequence it skips.
// Long, because every fade along the way is scrubbed off this scroll — rush it and
// they blur together.
const ASKED_FOR_DURATION = 2.4

// A scripted scroll to where a section comes to rest — a nav item asking for the page
// below, the handoff's takeover, and the ring back to the top of a page are all this.
//
// It drives the scroll and nothing else, so the pointer and wheel paths can't describe
// different sequences: everything scrubbed off the scroll plays as it would have.
// `isScrolling` is true while it runs, so whatever started it can retire for the
// duration — see the hero's cue, which is offering exactly what is already happening.
//
// `locked` decides what happens to the gestures that arrive mid-scroll:
//
//   interruptible  hands control back the moment the viewer scrolls for themselves — a
//                  scroll asked for is an offer, and nobody should have to fight it to
//                  the end.
//   locked         swallows them, which is holdScroll's job and the same hold a page
//                  swap takes. The takeover isn't an offer: a flick in the middle of
//                  it would strand the viewer between two pages.
export function useScriptedScroll(selector, { locked = false, duration = ASKED_FOR_DURATION } = {}) {
    const tweenRef = useRef(null)
    // Holds the last scroll's listeners, so unmounting mid-scroll doesn't leave them
    // on the window — or, locked, leave the page unable to scroll.
    const detachRef = useRef(null)
    const [isScrolling, setIsScrolling] = useState(false)
    useEffect(() => () => {
        tweenRef.current?.kill()
        detachRef.current?.()
    }, [])

    const scrollToTarget = useCallback(() => {
        if (tweenRef.current?.isActive()) return

        // No selector at all is a page with nowhere to go — the last of the chain, or
        // one whose next page the router has yet to mount.
        const target = selector && document.querySelector(selector)
        if (!target) return

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

        setIsScrolling(true)

        // Listening for the gestures rather than ScrollToPlugin's autoKill, which reads
        // iOS's collapsing toolbar as an unexpected delta and cancels on the spot, so
        // the scroll appears to do nothing.
        //
        // touchmove, not touchstart: the tap that starts the scroll would otherwise
        // count as one.
        const handBack = () => {
            const onGesture = () => {
                tweenRef.current?.kill()
                finish()
            }

            window.addEventListener("wheel", onGesture, { passive: true })
            window.addEventListener("touchmove", onGesture, { passive: true })

            return () => {
                window.removeEventListener("wheel", onGesture)
                window.removeEventListener("touchmove", onGesture)
            }
        }

        const detach = locked ? holdScroll() : handBack()

        const finish = () => {
            detach()
            setIsScrolling(false)
        }

        detachRef.current = detach

        tweenRef.current = gsap.to(window, {
            duration: prefersReducedMotion ? 0 : duration,
            ease: "power2.inOut",
            // The same landing the nav items use — flush to the viewport top put a
            // section's heading hard against the header bar.
            scrollTo: { y: getSectionRestingScrollY(target) },
            onComplete: finish,
            // A kill from anywhere else must not leave the page locked behind it.
            onInterrupt: finish,
        })
    }, [selector, locked, duration])

    return { scrollToTarget, isScrolling }
}
