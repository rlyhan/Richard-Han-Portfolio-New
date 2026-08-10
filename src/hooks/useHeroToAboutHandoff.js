import { useCallback, useEffect, useRef, useState } from "react"
import gsap from "gsap"
import ScrollToPlugin from "gsap/ScrollToPlugin"
import ScrollTrigger from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger)

// The handoff from the hero to About, scrubbed off the scroll position.
//
// Three elements do the work, and only one of them is animated here:
//
//   the hero      sticky, so it holds the viewport instead of scrolling away
//   the runway    an empty spacer below it — the stretch of scroll where the
//                 hero is alone on screen, and the anchor both triggers below
//                 measure themselves against
//   About         opaque and stacked above the hero, so it covers what it
//                 passes over
//
// About arriving over the hero is therefore layout, not animation: scrolling
// the page is the whole of it. The only tween on About is the lag that keeps it
// from riding the wheel exactly.
//
//   runway top → bottom edge     the hero alone on screen, emptying out
//   runway bottom → top edge     About climbing over the emptied hero

const ABOUT_SELECTOR = "#about"

// Seconds of catch-up between the scroll position and the animation, and the
// single most important number here: it is what makes the hero trail the wheel
// and coast to a stop after it, rather than being welded to the scrollbar.
const SCRUB_LAG = 1

// Positions below are fractions of the runway, which only holds because the
// timeline is pinned to this length. A scrub stretches whatever duration a
// timeline happens to have across the whole scroll range, so without the pin
// the quiet tail after the last fade would be scaled away rather than kept.
const TIMELINE_LENGTH = 1

// The display lines leave as four planes rather than one sheet. Each travels
// TRAVEL + its index * STEP for the same scroll, so the stack spreads as it
// goes, and each starts STAGGER later than the one above it.
const LINE_TRAVEL = 40
const LINE_TRAVEL_STEP = 34
const LINE_EXIT_STAGGER = 0.1
const LINE_EXIT_DURATION = 0.45
// Splits the lines sideways along the alternation they already sit on — the
// neon lines leave left, the paper lines right. A percentage rather than a
// pixel count, and a small one: at 3% the drift is always shorter than the
// gutter beside it, so no line can push a horizontal scrollbar onto the page.
const LINE_DRIFT = 3

// The outro sinks while the lines rise, so the hero parts down the middle
// instead of dimming as a block. It goes last and it goes quickly, and it still
// ends well inside the runway: the point is that the hero is already empty by
// the time About's edge appears.
const OUTRO_START = 0.55
const OUTRO_DURATION = 0.25
const OUTRO_STAGGER = 0.08
const OUTRO_DRIFT = 44

// About rides up at a fraction under the speed of the scroll carrying it and
// closes the gap exactly as it lands, so the cover has some weight behind it.
// A share of the viewport, not a pixel count: the distance it has to travel
// scales with the screen, so the lag has to as well.
const ABOUT_LAG = 0.12

// How long the cue's shortcut takes to cross the whole sequence. Long, because
// every fade above is scrubbed off this scroll — rush it and they arrive as a
// blur instead of as beats.
const CUE_SCROLL_DURATION = 2.4

// The hero emptying out, across the length of the runway.
//
// ease: "none" throughout — with a scrub the scroll is the ease, and a second
// one layered on top only makes the mapping between the two lie.
const buildHeroExitTimeline = ({ displayLines, outroLines, runway }) => {
    const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
            trigger: runway,
            // The runway's top edge reaching the foot of the viewport, which is
            // the moment the hero stops being the only thing on screen…
            start: "top bottom",
            // …and its bottom edge reaching the same place, which is About's
            // top edge arriving.
            end: "bottom bottom",
            scrub: SCRUB_LAG,
        },
    })

    return timeline
        // Empty tween, purely to pin the timeline to TIMELINE_LENGTH. Same
        // device as the rolling headlines use to hold their cycle open.
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
// Triggered off the runway rather than off About itself: an element used as its
// own trigger is measured with this transform already applied, which puts the
// start and end it is measuring against out by the lag distance.
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
                // The lag is a share of the viewport, so a resize has to re-read
                // it rather than keep the height it started with.
                invalidateOnRefresh: true,
            },
        }
    )

// Where the page comes to rest with About exactly filling the viewport.
//
// Measured off the runway rather than off About: About carries the lag
// transform, and an element's live position includes it, so reading About would
// aim the lag distance too low.
const getAboutRestingScrollY = (runway) =>
    window.scrollY + runway.getBoundingClientRect().bottom

export function useHeroToAboutHandoff({ displayLineRefs, outroLineRefs, runwayRef }) {
    const cueScrollTweenRef = useRef(null)
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

        // Reverts both triggers and every value they touched. Under reduced
        // motion neither is built in the first place: the hero is simply covered.
        return () => mm.revert()
    }, [displayLineRefs, outroLineRefs, runwayRef])

    useEffect(() => () => cueScrollTweenRef.current?.kill(), [])

    // The shortcut past all of the above. It drives the scroll and nothing else
    // — every fade is scrubbed off that scroll, so this stays a single tween and
    // the pointer and scroll paths can never describe different sequences.
    const scrollToAbout = useCallback(() => {
        if (cueScrollTweenRef.current?.isActive()) return

        const runway = runwayRef.current
        if (!runway) return

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

        setIsScrollingToAbout(true)

        cueScrollTweenRef.current = gsap.to(window, {
            duration: prefersReducedMotion ? 0 : CUE_SCROLL_DURATION,
            ease: "power2.inOut",
            scrollTo: { y: getAboutRestingScrollY(runway) },
            onComplete: () => setIsScrollingToAbout(false),
        })
    }, [runwayRef])

    return { scrollToAbout, isScrollingToAbout }
}
