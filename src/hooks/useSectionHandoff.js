import { useCallback } from "react"
import { buildExitTimeline } from "../helpers/handoff"
import { getSectionFlowTop } from "../helpers/sectionScroll"
import { useHandoff } from "./useHandoff"

// The exit for a handoff between two sections that both carry content — About to
// Projects, Projects to Contact. The range, takeover and landing around it are
// useHandoff's; this is the park it hands off from:
//
//   the content   held with its bottom edge at the middle of the viewport, so the section
//                 keeps the view instead of scrolling away, and dissolving as it waits
//   the runway    an empty spacer below it, inside the same section — the scroll the park
//                 is spent against, and the anchor every trigger measures
//
// The hold is a tween whose y climbs at the rate of the scroll, not `position: sticky`,
// which can only pull an element UP to a viewport edge: holding a block taller than the
// viewport with its BOTTOM edge part-way down needs an offset the size of the element.
// It is also the one thing here that isn't lagged — a hesitation that drifts isn't
// holding anything.

// Share of the park the content is held for. The rest lifts the transform back off, so
// the park ends with nothing displaced over the section arriving below — unseen, because
// the dissolve has finished by then and a runway taller than 50svh has carried the
// content's own position off the top of the screen.
const HOLD_SHARE = 0.85

// The dissolve: the sign the hesitation is progressing, and what empties the section
// before the next one is over it. Late and quick, so what's parked stays readable — and
// clickable — for most of the hold.
const FADE_START = 0.45
const FADE_DURATION = HOLD_SHARE - FADE_START

// The park's range: the content's bottom edge — which is the runway's top edge — reaching
// the middle of the viewport, until the runway beneath it has run out.
const getExitRange = (runway) => {
    const start = getSectionFlowTop(runway) - window.innerHeight / 2
    return { start, end: start + runway.offsetHeight }
}

// Held against the scroll, dissolving, then lifted away. The park is also the cue's
// welcome, so this trigger raises the hold rather than a second one measuring the same
// range.
const buildParkTimeline = ({ content, runway, range, onHold }) =>
    buildExitTimeline({
        runway,
        range,
        // Exact, not lagged — see the note on the hold above.
        scrub: true,
        // The hold's distance is the runway's height, so a resize has to re-read it.
        invalidateOnRefresh: true,
        onHold,
    })
        // The park itself: the runway's height IS the park's length in scroll, so this
        // share of one is that share of the other and the content sits still.
        .fromTo(content,
            { y: 0 },
            { y: () => runway.offsetHeight * HOLD_SHARE, duration: HOLD_SHARE },
            0
        )
        .to(content, { y: 0, duration: 1 - HOLD_SHARE }, HOLD_SHARE)
        .to(content, { opacity: 0, duration: FADE_DURATION }, FADE_START)

export function useSectionHandoff({ contentRef, runwayRef, nextSelector }) {
    // Stable, because useHandoff builds every trigger off it: an inline closure would
    // rebuild them on each render, one of which is the park raising its own hold.
    const buildExit = useCallback(({ runway, range, onHold }) => {
        const park = buildParkTimeline({ content: contentRef.current, runway, range, onHold })

        // A reload part-way down the page restores its scroll position without
        // ScrollTrigger crossing anything, so the hold is read once here.
        //
        // Compared against the trigger's bounds rather than read off its isActive, which
        // is undefined until the trigger first updates — and an undefined would leave here
        // as a cue that renders hidden while its Space shortcut, defaulting an absent
        // `enabled` to true, stays bound for the whole page.
        const trigger = park.scrollTrigger
        const scroll = trigger.scroll()
        onHold(scroll >= trigger.start && scroll < trigger.end)

        // The takeover waits for the dissolve: past it the hesitation has nothing left to
        // show, and everything after is the next section arriving.
        return FADE_START + FADE_DURATION
    }, [contentRef])

    const { scrollToNext, isHolding, isScrolling } = useHandoff({
        runwayRef,
        nextSelector,
        getExitRange,
        buildExit,
    })

    // The cue goes up with the park and retires with it, rather than floating over a
    // section already on its way in.
    return { scrollToNext, isCueVisible: isHolding && !isScrolling }
}
