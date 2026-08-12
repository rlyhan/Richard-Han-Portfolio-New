import { useEffect, useState } from "react"
import gsap from "gsap"
import {
    ADVANCE_DURATION,
    buildIncomingRiseTween,
    buildTakeoverTrigger,
    getLandingScroll,
} from "../helpers/handoff"
import { useCueScroll } from "./useCueScroll"

// Every handoff on the page is these four things:
//
//   the range     the scroll the outgoing section spends emptying out — its runway
//   the exit      whatever it does while it empties, scrubbed across that range
//   the takeover  where the exit has finished, the scroll is taken off the viewer and
//                 spent on the next section instead
//   the landing   the next section riding up from the end of the range to its resting
//                 place, where the cue's shortcut and the takeover both put it
//
// Only the exit differs between them — the hero throws its lines off the screen
// (useHeroToAboutHandoff), a section parks and dissolves (useSectionHandoff) — so that is
// all the two callers pass in, and the three handoffs can't drift apart.
//
// `buildExit({ runway, range, onHold })` builds its own timeline across the range and
// returns where in it the last fade lands: the point the takeover fires at. A share
// rather than a position, because the range is re-measured on every refresh while a
// timeline's proportions never change. It raises `onHold` if it has a hesitation worth
// offering the cue for.
export function useHandoff({ runwayRef, nextSelector, getExitRange, buildExit }) {
    const [isHolding, setIsHolding] = useState(false)

    // The cue's shortcut is an offer: it hands control back the moment the viewer scrolls
    // for themselves.
    const { scrollToTarget, isScrolling } = useCueScroll(nextSelector)

    // The takeover is the same scroll on the opposite terms — it holds the page for its
    // duration, since it fires from the scroll itself rather than from anyone asking.
    const { scrollToTarget: advance, isScrolling: isAdvancing } = useCueScroll(nextSelector, {
        locked: true,
        duration: ADVANCE_DURATION,
    })

    useEffect(() => {
        const mm = gsap.matchMedia()

        mm.add("(prefers-reduced-motion: no-preference)", () => {
            const runway = runwayRef.current
            // Read through functions, not measured once: every position is re-resolved on
            // each ScrollTrigger refresh, so a resize moves the whole handoff together.
            const range = () => getExitRange(runway)
            const landing = () => getLandingScroll(document.querySelector(nextSelector))

            const exitEndsAt = buildExit({ runway, range, onHold: setIsHolding })

            // The next section is on its way from the moment the range runs out.
            buildIncomingRiseTween({
                incoming: nextSelector,
                runway,
                start: () => range().end,
                end: landing,
            })

            buildTakeoverTrigger({
                runway,
                start: () => {
                    const { start, end } = range()
                    return start + (end - start) * exitEndsAt
                },
                landing,
                advance,
            })

            return () => setIsHolding(false)
        })

        // Under reduced motion none of it is built and the runway is collapsed in the
        // markup: the sections simply follow one another, with no hesitation to sit
        // through and nothing to take the scroll over.
        return () => mm.revert()
    }, [runwayRef, nextSelector, getExitRange, buildExit, advance])

    return {
        scrollToNext: scrollToTarget,
        isHolding,
        // Either scroll retires the cue: what it offers is already happening.
        isScrolling: isScrolling || isAdvancing,
    }
}
