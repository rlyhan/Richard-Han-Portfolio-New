import gsap from "gsap"

// The transition between two pages that share no scroll.
//
// Only the homepage hands over on the scroll — the hero empties out across a
// runway while About climbs over it, one document and one gesture (see
// useHandoff). Every other page ends where its content does; the way on is the
// nav bar, a click rather than a scroll, so the transition runs on its own
// clock instead of one scrubbed off the wheel.
//
// It reads as the same move all the same, because it is the same move: the page being
// left lifts and fades, the page arriving comes up from below the fold and takes the
// screen. What the runway spends in scroll, this spends in time.

// The page being left rises by this share of the viewport. A lift rather than an
// exit — it is covered long before it would be gone, and a page that flew off the top
// would be racing the one arriving.
const OUT_TRAVEL = 0.12
const OUT_DURATION = 0.55

// The page arriving crosses the whole screen, so it gets the longer half of the
// timeline and an ease that arrives rather than glides to a stop.
const IN_DURATION = 0.75
const IN_START = 0.15

// See useSwapTransition.
// - `leaving`: the section of the page being left, not the box the pages sit in
//   — the arriving page is inside that box too now, and a box that moved would
//   take it along.
// - `arriving`: that page's own box, held to the viewport while it travels —
//   hence yPercent, where 100 is one screen down wherever the page underneath
//   happens to be scrolled to.
export const buildSwapTimeline = ({ leaving, arriving, onComplete }) => {
    const timeline = gsap.timeline({ defaults: { ease: "power2.inOut" }, onComplete })

    if (leaving) {
        timeline.to(leaving, {
            y: () => -window.innerHeight * OUT_TRAVEL,
            opacity: 0,
            duration: OUT_DURATION,
        }, 0)
    }

    return timeline.fromTo(arriving,
        { yPercent: 100 },
        { yPercent: 0, duration: IN_DURATION, ease: "power3.out" },
        IN_START,
    )
}
