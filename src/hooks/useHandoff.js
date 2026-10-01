import { useEffect, useState } from "react"
import gsap from "gsap"
import {
    ADVANCE_DURATION,
    buildIncomingRiseTween,
    buildTakeoverTrigger,
    getLandingScroll,
} from "../helpers/handoff"
import { useScriptedScroll } from "./useScriptedScroll"

// The handoff the homepage hands over on, in four parts:
//
//   the range     the scroll the outgoing page spends emptying out — its runway
//   the exit      whatever it does while it empties, scrubbed across that range
//   the takeover  where the exit has finished, the scroll is taken off the viewer and
//                 spent on the next page instead
//   the landing   the next page riding up from the end of the range to its resting
//                 place, where the takeover and a nav item's request both put it
//
// The exit is the caller's — the hero throws its lines off the screen, see
// useHeroHandoff — and everything around it is here, so a second page that wanted to
// hand over on the scroll would have only its own exit to describe.
//
// `buildExit({ runway, range })` builds its own timeline across the range and returns
// where in it the last fade lands: the point the takeover fires at. A share rather
// than a position, because the range is re-measured on every refresh while a
// timeline's proportions never change.
//
// The two halves are built separately — only one needs the next page to exist:
// - the exit is measured against its own runway, so it builds on mount; waiting
//   on the next page would mean the hero snapping to catch up once it arrived.
// - the landing and takeover are positions in the next page, so they wait for
//   `isNextStaged` — nothing to measure, or hand the scroll to, before then.
export function useHandoff({ runwayRef, nextSelector, isNextStaged, getExitRange, buildExit }) {
    // Where the exit's last fade lands, published by the effect that builds it so the
    // effect below can put the takeover there.
    const [exitEndsAt, setExitEndsAt] = useState(null)

    // What a nav item runs instead of a jump — an offer that hands control back the
    // moment the viewer scrolls themselves. See useAdvance, how the bar reaches it.
    const { scrollToTarget, isScrolling } = useScriptedScroll(nextSelector)

    // The takeover is the same scroll on opposite terms: it holds the page for its
    // duration, since the scroll triggers it rather than anyone asking.
    const { scrollToTarget: advance, isScrolling: isAdvancing } = useScriptedScroll(nextSelector, {
        locked: true,
        duration: ADVANCE_DURATION,
    })

    useEffect(() => {
        // No next page is no exit to play and no runway to measure it against —
        // see routes, where a page's `next` decides this; HomePage leaves it out.
        if (!nextSelector) return

        const mm = gsap.matchMedia()

        mm.add("(prefers-reduced-motion: no-preference)", () => {
            const runway = runwayRef.current
            // A function, not a measured-once value: re-resolved on every
            // ScrollTrigger refresh, so a resize — or the next page arriving —
            // moves the whole handoff together.
            const range = () => getExitRange(runway)

            setExitEndsAt(buildExit({ runway, range }))

            return () => setExitEndsAt(null)
        })

        // Under reduced motion nothing here builds and the runway collapses in the
        // markup, so the pages simply follow each other. The join still lands — the
        // router hands over the URL on position, not on the takeover.
        return () => mm.revert()
    }, [nextSelector, runwayRef, getExitRange, buildExit])

    useEffect(() => {
        if (!isNextStaged || !nextSelector || exitEndsAt === null) return

        const mm = gsap.matchMedia()

        mm.add("(prefers-reduced-motion: no-preference)", () => {
            const runway = runwayRef.current
            const range = () => getExitRange(runway)
            const landing = () => getLandingScroll(document.querySelector(nextSelector))

            // The next page is on its way from the moment the range runs out.
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
        })

        return () => mm.revert()
    }, [isNextStaged, nextSelector, exitEndsAt, runwayRef, getExitRange, advance])

    return {
        scrollToNext: scrollToTarget,
        // Either scroll retires the cue: what it offers is already happening.
        isScrollingToNext: isScrolling || isAdvancing,
    }
}
