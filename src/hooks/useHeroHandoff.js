import { useCallback } from "react"
import { buildExitTimeline } from "../helpers/handoff"
import { getSectionFlowTop } from "../helpers/sectionScroll"
import { useHandoff } from "./useHandoff"

// The exit for the handoff off the hero, which is the home page emptying out as the
// runway passes. The range, takeover and landing around it are useHandoff's:
//
//   the hero      sticky, so it holds the viewport instead of scrolling away
//   the runway    an empty spacer below it — the scroll where the hero is alone, and the
//                 anchor every trigger measures against
//   the next page mounted below the hero by the router, opaque and stacked above it, so
//                 it covers it — see Router
//
// That page arriving over the hero is layout, not animation; the only tween on it is the
// lag useHandoff gives every incoming page.

// Positions below are fractions of the runway — see buildExitTimeline for why.
//
// The h1's own lines leave as four planes rather than one sheet: each travels
// TRAVEL + index * STEP, so the stack spreads as it goes. Pixel amounts, since
// these are the original, small in-place nudges — unlike the work grid below,
// which needs to actually clear the viewport.
const LINE_TRAVEL = 40
const LINE_TRAVEL_STEP = 34
// The work grid is the whole right column rather than a line in the h1's stack,
// so it gets its own, much longer travel — a share of the viewport height, not
// pixels, so it actually clears the screen at any viewport size rather than
// nudging by a few dozen pixels.
const WORK_EXIT_TRAVEL_SHARE = 0.7
const LINE_EXIT_STAGGER = 0.1
const LINE_EXIT_DURATION = 0.45
// Splits the h1's lines along the alternation they already sit on — neon left,
// paper right. A small percentage, so the drift stays shorter than the gutter
// beside it and can't push a horizontal scrollbar onto the page.
//
// The work grid is excluded below: it only rises, since drifting the whole
// right column sideways reads as sliding off toward a corner instead of
// straight up.
const LINE_DRIFT = 3

// The outro sinks while the lines rise, so the hero parts down the middle rather
// than dimming as a block. Ends well inside the runway: the hero should already
// be empty by the time the next page's edge appears.
const OUTRO_START = 0.55
const OUTRO_DURATION = 0.25
const OUTRO_STAGGER = 0.08
const OUTRO_DRIFT = 44

// Its own catch-up, longer than the shared SCRUB_LAG every other handoff uses: a
// bigger lag means the exit keeps easing toward wherever the scroll currently is
// over this many seconds rather than snapping to match it, so a fast flick still
// only buys the same unhurried glide as a slow one — just a longer wait for it to
// catch up, not a faster one.
const EXIT_SCRUB_LAG = 2.5

// The hero's range: the top of the page to the runway's bottom edge meeting the foot of
// the viewport, which is where the next page's own top edge appears.
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

const buildHeroExitTimeline = ({ displayLines, outroLines, runway, range }) =>
    buildExitTimeline({ runway, range, scrub: EXIT_SCRUB_LAG })
        .to(displayLines, {
            opacity: 0,
            y: (index, _target, targets) =>
                index === targets.length - 1
                    ? -window.innerHeight * WORK_EXIT_TRAVEL_SHARE
                    : -(LINE_TRAVEL + index * LINE_TRAVEL_STEP),
            xPercent: (index, _target, targets) =>
                index === targets.length - 1 ? 0 : (index % 2 ? LINE_DRIFT : -LINE_DRIFT),
            duration: LINE_EXIT_DURATION,
            stagger: LINE_EXIT_STAGGER,
        }, 0)
        .to(outroLines, {
            opacity: 0,
            y: OUTRO_DRIFT,
            duration: OUTRO_DURATION,
            stagger: OUTRO_STAGGER,
        }, OUTRO_START)

export function useHeroHandoff({ displayLineRefs, outroLineRefs, runwayRef, nextSelector, isNextStaged }) {
    // Stable, because useHandoff builds every trigger off it — as in useSectionHandoff.
    const buildExit = useCallback(({ runway, range }) => {
        const lines = {
            displayLines: displayLineRefs.current.filter(Boolean),
            outroLines: outroLineRefs.current.filter(Boolean),
        }

        buildHeroExitTimeline({ ...lines, runway, range })

        return getExitEndShare(lines)
    }, [displayLineRefs, outroLineRefs])

    return useHandoff({
        runwayRef,
        nextSelector,
        isNextStaged,
        getExitRange,
        buildExit,
    })
}
