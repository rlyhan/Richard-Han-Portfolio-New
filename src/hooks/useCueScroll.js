import { useCallback, useEffect, useRef, useState } from "react"
import gsap from "gsap"
import ScrollToPlugin from "gsap/ScrollToPlugin"
import { getSectionRestingScrollY } from "../helpers/sectionScroll"
import { getLenis } from "./useLenis"

gsap.registerPlugin(ScrollToPlugin)

// How long a cue's shortcut takes to cross the sequence it skips. Long, because
// every fade along the way is scrubbed off this scroll — rush it and they blur
// together.
const CUE_SCROLL_DURATION = 2.4

// The keys the browser scrolls the page with. Lenis owns the wheel and nothing else,
// so a locked scroll has to answer for these itself.
const SCROLL_KEYS = new Set([
    "Space", "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End",
])

// A scripted scroll to where a section comes to rest — the cue's shortcut and the
// handoff's takeover are both this.
//
// It drives the scroll and nothing else, so the pointer, keyboard and wheel paths can't
// describe different sequences: everything scrubbed off the scroll plays as it would
// have. `isScrolling` is true while it runs, so whatever started it can retire for the
// duration.
//
// `locked` decides what happens to the gestures that arrive mid-scroll:
//
//   interruptible  hands control back the moment the viewer scrolls for themselves — the
//                  cue is an offer, and nobody should have to fight it to the end.
//   locked         swallows them. The takeover isn't an offer: a flick in the middle of
//                  it would strand the viewer between two sections.
export function useCueScroll(selector, { locked = false, duration = CUE_SCROLL_DURATION } = {}) {
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

        const target = document.querySelector(selector)
        if (!target) return

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

        setIsScrolling(true)

        const detach = () => {
            window.removeEventListener("wheel", onGesture)
            window.removeEventListener("touchmove", onGesture)
            window.removeEventListener("keydown", onKeyDown)
            if (locked) getLenis()?.start()
        }

        const finish = () => {
            detach()
            setIsScrolling(false)
        }

        // Listening for the gestures rather than ScrollToPlugin's autoKill, which reads
        // iOS's collapsing toolbar as an unexpected delta and cancels on the spot, so
        // the cue appears to do nothing.
        //
        // touchmove, not touchstart: the tap that starts the scroll would otherwise
        // count as one.
        const onGesture = (event) => {
            if (!locked) {
                tweenRef.current?.kill()
                finish()
                return
            }

            event.preventDefault()
        }

        const onKeyDown = (event) => {
            if (locked && SCROLL_KEYS.has(event.code)) event.preventDefault()
        }

        // Stopping Lenis is what closes the wheel, not preventing the event — Lenis binds
        // its own listener first and would scroll regardless. Touch is native (syncTouch
        // is off) and so are the keys, hence the listeners below, the wheel among them for
        // the reduced-motion case where Lenis was never constructed.
        //
        // Nothing here touches the body's overflow the way the modal's lock does: that
        // would take the scrollbar with it and shift the page sideways as it scrolls.
        if (locked) getLenis()?.stop()

        window.addEventListener("wheel", onGesture, { passive: !locked })
        window.addEventListener("touchmove", onGesture, { passive: !locked })
        window.addEventListener("keydown", onKeyDown)
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
