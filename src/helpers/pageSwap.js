import gsap from "gsap"

// The transition between two pages that share no scroll.
//
// Only the homepage hands over on the scroll — the hero empties out across a runway
// while About climbs over it, one document and one gesture (see useHandoff). Every
// other page ends where its content does, and the way on is the nav bar: a click, not
// a scroll, and so a transition on its own clock rather than one scrubbed off the
// wheel.
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

export const buildSwapTimeline = ({ outgoing, incoming, onComplete }) =>
    gsap.timeline({ defaults: { ease: "power2.inOut" }, onComplete })
        .to(outgoing, {
            y: () => -window.innerHeight * OUT_TRAVEL,
            opacity: 0,
            duration: OUT_DURATION,
        }, 0)
        // yPercent, because the incoming page is held to the viewport while it
        // travels: 100 is one screen down, wherever the page underneath is scrolled
        // to. See PageSwap.
        .fromTo(incoming,
            { yPercent: 100 },
            { yPercent: 0, duration: IN_DURATION, ease: "power3.out" },
            IN_START,
        )
