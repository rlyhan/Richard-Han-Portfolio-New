import { useEffect } from "react"
import gsap from "gsap"

// The hero's display lines, each cycling between its two strings forever.
//
// Every line holds exactly two children stacked in one grid cell: they swap places
// through the cell's clip edge, and sharing the cell means nothing reflows.

const ROLL_INTERVAL = 5
const ROLL_DURATION = 0.7
const ROLL_EASE = "power3.inOut"
// Offsetting each line keeps all four from flipping in lockstep.
const ROLL_STAGGER = 0.12

const buildLineRollTimeline = (line, index) => {
    const [first, second] = line.children

    // The second string parks one full line below the clip edge.
    gsap.set(second, { yPercent: 100, opacity: 1 })

    const timeline = gsap.timeline({
        repeat: -1,
        delay: ROLL_INTERVAL + index * ROLL_STAGGER,
    })

    // Empty tween pins the cycle at two intervals, keeping the gap between flips
    // even across the repeat boundary. Positions are all explicit: omitting one
    // appends at the timeline's end, already pushed out to ROLL_INTERVAL * 2.
    return timeline
        .to({}, { duration: ROLL_INTERVAL * 2 }, 0)
        // Flip 1 — first exits upward, second arrives from below.
        .to(first, { yPercent: -100, duration: ROLL_DURATION, ease: ROLL_EASE }, 0)
        .to(second, { yPercent: 0, duration: ROLL_DURATION, ease: ROLL_EASE }, 0)
        // Reparked below the clip edge, ready to arrive on flip 2.
        .set(first, { yPercent: 100 }, ROLL_DURATION)
        // Flip 2 — the same move with the roles swapped, which returns both
        // elements to their starting offsets for the next repeat.
        .to(second, { yPercent: -100, duration: ROLL_DURATION, ease: ROLL_EASE }, ROLL_INTERVAL)
        .to(first, { yPercent: 0, duration: ROLL_DURATION, ease: ROLL_EASE }, ROLL_INTERVAL)
        .set(second, { yPercent: 100 }, ROLL_INTERVAL + ROLL_DURATION)
}

export function useRollingDisplayLines(displayLineRefs) {
    useEffect(() => {
        const mm = gsap.matchMedia()

        // Under reduced motion no timeline is built at all, so each line simply
        // keeps the string it rendered with.
        mm.add("(prefers-reduced-motion: no-preference)", () => {
            displayLineRefs.current.filter(Boolean).forEach(buildLineRollTimeline)
        })

        return () => mm.revert()
    }, [displayLineRefs])
}
