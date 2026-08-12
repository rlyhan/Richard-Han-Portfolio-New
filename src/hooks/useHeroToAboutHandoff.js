import { useCallback, useEffect, useRef, useState } from "react"
import gsap from "gsap"
import ScrollToPlugin from "gsap/ScrollToPlugin"
import ScrollTrigger from "gsap/ScrollTrigger"
import { getSectionRestingScrollY } from "../helpers/sectionScroll"

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger)

// Mobile toolbars collapsing would otherwise re-measure both triggers mid-scroll.
// The layout is sized in svh, the smallest viewport height, so there is nothing
// to re-measure anyway.
ScrollTrigger.config({ ignoreMobileResize: true })

// The handoff from the hero to About, scrubbed off the scroll position.
//
//   the hero      sticky, so it holds the viewport instead of scrolling away
//   the runway    an empty spacer below it — the scroll where the hero is alone,
//                 and the anchor both triggers measure against
//   About         opaque and stacked above the hero, so it covers it
//
// About arriving over the hero is layout, not animation; the only tween on it is
// the lag that keeps it from riding the wheel exactly.
//
//   runway top → bottom edge     the hero alone on screen, emptying out
//   runway bottom → top edge     About climbing over the emptied hero

const ABOUT_SELECTOR = "#about"

// Seconds of catch-up between scroll and animation — what makes the hero trail
// the wheel and coast to a stop rather than being welded to the scrollbar.
const SCRUB_LAG = 1

// Positions below are fractions of the runway, which only holds while the
// timeline is pinned to this length: a scrub stretches whatever duration it has
// across the whole range, scaling away the quiet tail after the last fade.
const TIMELINE_LENGTH = 1

// The display lines leave as four planes rather than one sheet: each travels
// TRAVEL + index * STEP, so the stack spreads as it goes.
const LINE_TRAVEL = 40
const LINE_TRAVEL_STEP = 34
const LINE_EXIT_STAGGER = 0.1
const LINE_EXIT_DURATION = 0.45
// Splits the lines along the alternation they already sit on — neon left, paper
// right. A small percentage, so the drift stays shorter than the gutter beside
// it and can't push a horizontal scrollbar onto the page.
const LINE_DRIFT = 3

// The outro sinks while the lines rise, so the hero parts down the middle rather
// than dimming as a block. Ends well inside the runway: the hero should already
// be empty by the time About's edge appears.
const OUTRO_START = 0.55
const OUTRO_DURATION = 0.25
const OUTRO_STAGGER = 0.08
const OUTRO_DRIFT = 44

// About rides up just under the speed of the scroll carrying it, closing the gap
// as it lands. A share of the viewport, since the distance scales with the screen.
const ABOUT_LAG = 0.12

// How long the cue's shortcut takes to cross the sequence. Long, because every
// fade is scrubbed off this scroll — rush it and they blur together.
const CUE_SCROLL_DURATION = 2.4

// The hero emptying out, across the length of the runway. ease: "none" throughout,
// since the scroll is the ease.
const buildHeroExitTimeline = ({ displayLines, outroLines, runway }) => {
    const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
            trigger: runway,
            // The top of the page as an absolute scroll position, not "the
            // runway's top edge at the foot of the viewport". Those differ on
            // iOS, where innerHeight reports the large viewport while the hero is
            // sized in svh — the relative form resolves negative and the hero
            // loads already part-way through its exit.
            start: 0,
            // The runway's bottom edge at the foot of the viewport — About's top
            // edge arriving. Relative is fine here: a live measurement either way.
            end: "bottom bottom",
            scrub: SCRUB_LAG,
        },
    })

    return timeline
        // Empty tween, purely to pin the timeline to TIMELINE_LENGTH.
        .to({}, { duration: TIMELINE_LENGTH }, 0)
        .to(displayLines, {
            opacity: 0,
            y: (index) => -(LINE_TRAVEL + index * LINE_TRAVEL_STEP),
            xPercent: (index) => (index % 2 ? LINE_DRIFT : -LINE_DRIFT),
            duration: LINE_EXIT_DURATION,
            stagger: LINE_EXIT_STAGGER,
        }, 0)
        .to(outroLines, {
            opacity: 0,
            y: OUTRO_DRIFT,
            duration: OUTRO_DURATION,
            stagger: OUTRO_STAGGER,
        }, OUTRO_START)
}

// About trailing the scroll that carries it, and catching up as it lands.
//
// Triggered off the runway, not About itself: an element used as its own trigger
// is measured with this transform already applied.
const buildAboutRiseTween = ({ runway }) =>
    gsap.fromTo(ABOUT_SELECTOR,
        { y: () => window.innerHeight * ABOUT_LAG },
        {
            y: 0,
            ease: "none",
            scrollTrigger: {
                trigger: runway,
                start: "bottom bottom",
                end: "bottom top",
                scrub: SCRUB_LAG,
                // The lag is a share of the viewport, so a resize has to re-read it.
                invalidateOnRefresh: true,
            },
        }
    )


export function useHeroToAboutHandoff({ displayLineRefs, outroLineRefs, runwayRef }) {
    const cueScrollTweenRef = useRef(null)
    // Holds the last cue scroll's abandon listeners, so unmounting mid-scroll
    // doesn't leave them on the window.
    const detachRef = useRef(null)
    const [isScrollingToAbout, setIsScrollingToAbout] = useState(false)

    useEffect(() => {
        const mm = gsap.matchMedia()

        mm.add("(prefers-reduced-motion: no-preference)", () => {
            buildHeroExitTimeline({
                displayLines: displayLineRefs.current.filter(Boolean),
                outroLines: outroLineRefs.current.filter(Boolean),
                runway: runwayRef.current,
            })

            buildAboutRiseTween({ runway: runwayRef.current })
        })

        // Under reduced motion neither is built: the hero is simply covered.
        return () => mm.revert()
    }, [displayLineRefs, outroLineRefs, runwayRef])

    useEffect(() => () => {
        cueScrollTweenRef.current?.kill()
        detachRef.current?.()
    }, [])

    // The shortcut past all of the above. It drives the scroll and nothing else,
    // so the pointer and scroll paths can't describe different sequences.
    const scrollToAbout = useCallback(() => {
        if (cueScrollTweenRef.current?.isActive()) return

        const about = document.querySelector(ABOUT_SELECTOR)
        if (!about) return

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

        setIsScrollingToAbout(true)

        // Hands control back the moment the viewer scrolls for themselves —
        // nobody should have to fight a 2.4s scripted scroll to the end.
        // Listening for the gestures rather than ScrollToPlugin's autoKill, which
        // reads iOS's collapsing toolbar as an unexpected delta and cancels on
        // the spot, so the cue appears to do nothing.
        //
        // touchmove, not touchstart: the tap that starts the scroll would
        // otherwise cancel it.
        const detach = () => {
            window.removeEventListener("wheel", abandon)
            window.removeEventListener("touchmove", abandon)
        }

        const finish = () => {
            detach()
            setIsScrollingToAbout(false)
        }

        const abandon = () => {
            cueScrollTweenRef.current?.kill()
            finish()
        }

        window.addEventListener("wheel", abandon, { passive: true })
        window.addEventListener("touchmove", abandon, { passive: true })
        detachRef.current = detach

        cueScrollTweenRef.current = gsap.to(window, {
            duration: prefersReducedMotion ? 0 : CUE_SCROLL_DURATION,
            ease: "power2.inOut",
            // The same landing the nav items use — flush to the viewport top put
            // About's heading hard against the header bar.
            scrollTo: { y: getSectionRestingScrollY(about) },
            onComplete: finish,
        })
    }, [])

    return { scrollToAbout, isScrollingToAbout }
}
