import { useCallback } from "react"
import { SCRUB_LAG, buildExitTimeline } from "../helpers/handoff"
import { getSectionFlowTop } from "../helpers/sectionScroll"
import { useHandoff } from "./useHandoff"

// The exit for the handoff from the hero to About. The range, takeover and landing around
// it are useHandoff's; this is the hero emptying out as the runway passes:
//
//   the hero      sticky, so it holds the viewport instead of scrolling away
//   the runway    an empty spacer below it — the scroll where the hero is alone, and the
//                 anchor every trigger measures against
//   About         opaque and stacked above the hero, so it covers it
//
// About arriving over the hero is layout, not animation; the only tween on it is the lag
// useHandoff gives every incoming section.

const ABOUT_SELECTOR = "#about"

// Positions below are fractions of the runway — see buildExitTimeline for why.
//
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

// The hero's range: the top of the page to the runway's bottom edge meeting the foot of
// the viewport, which is where About's own top edge appears.
//
// The start is absolute, not "the runway's top edge at the foot of the viewport". Those
// differ on iOS, where innerHeight reports the large viewport while the hero is sized in
// svh — and they differ on any viewport too short for the hero, which is sticky from the
// first pixel of scroll while its own height exceeds the screen.
const getExitRange = (runway) => ({
    start: 0,
    end: getSectionFlowTop(runway) + runway.offsetHeight - window.innerHeight,
})

// Where in that range the hero is empty: whichever of the two exits finishes last.
// Derived from the numbers the timeline is built from, so retiming a fade can't leave the
// takeover firing over content still on screen.
const getExitEndShare = ({ displayLines, outroLines }) => Math.max(
    LINE_EXIT_STAGGER * (displayLines.length - 1) + LINE_EXIT_DURATION,
    OUTRO_START + OUTRO_STAGGER * (outroLines.length - 1) + OUTRO_DURATION,
)

// No hold is raised: the hero's cue belongs to the top of the page rather than to this
// range, so Home decides when it is up — see useIsNearPageTop there.
const buildHeroExitTimeline = ({ displayLines, outroLines, runway, range }) =>
    buildExitTimeline({ runway, range, scrub: SCRUB_LAG })
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

export function useHeroToAboutHandoff({ displayLineRefs, outroLineRefs, runwayRef }) {
    // Stable, because useHandoff builds every trigger off it — as in useSectionHandoff.
    const buildExit = useCallback(({ runway, range }) => {
        const lines = {
            displayLines: displayLineRefs.current.filter(Boolean),
            outroLines: outroLineRefs.current.filter(Boolean),
        }

        buildHeroExitTimeline({ ...lines, runway, range })

        return getExitEndShare(lines)
    }, [displayLineRefs, outroLineRefs])

    const { scrollToNext, isScrolling } = useHandoff({
        runwayRef,
        nextSelector: ABOUT_SELECTOR,
        getExitRange,
        buildExit,
    })

    return { scrollToAbout: scrollToNext, isScrollingToAbout: isScrolling }
}
