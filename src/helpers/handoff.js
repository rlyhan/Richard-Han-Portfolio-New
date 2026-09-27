import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { getSectionRestingScrollY } from "./sectionScroll"

gsap.registerPlugin(ScrollTrigger)

// Mobile toolbars collapsing would otherwise re-measure every handoff's triggers
// mid-scroll. The layout is sized in svh, the smallest viewport height, so there
// is nothing to re-measure anyway.
ScrollTrigger.config({ ignoreMobileResize: true })

// The parts a handoff is built from. useHandoff assembles them, and is the one place to
// read to understand any of the three handoffs on the page.
//
// Every position here is an absolute scroll offset rather than "this edge against that
// one": the sections carry scroll-driven transforms, and a relative position measured
// while one is displaced anchors itself to the displacement.

// Seconds of catch-up between scroll and animation — what makes a section trail the
// wheel and coast to a stop rather than being welded to the scrollbar.
export const SCRUB_LAG = 1

// How far an incoming section trails the scroll carrying it. A share of the viewport,
// since the distance scales with the screen.
const INCOMING_LAG = 0.12

// How long a takeover takes. Shorter than the scroll a nav item asks for, which crosses
// the whole runway: a takeover starts where most of it has already been spent.
export const ADVANCE_DURATION = 1.2

// Where an incoming page comes to rest: the same landing the nav items scroll to. Capped at the maximum scroll, since the last handoff can rest past it on a
// tall viewport — an end that can never be reached would leave the section stuck
// part-way through its rise.
export const getLandingScroll = (section) =>
    Math.min(getSectionRestingScrollY(section), ScrollTrigger.maxScroll(window))

// The empty timeline both exits are built on, scrubbed across the handoff's range, so
// all either exit has to describe is its own fades.
//
// Pinned to unit length, which is what makes a position inside an exit a fraction of its
// range: a scrub stretches whatever duration a timeline has across the whole range, so an
// unpinned one would scale away the quiet tail after the last fade.
//
// Triggered off the runway, never off what is being animated — an element used as its own
// trigger is measured with its own transform already applied.
export const buildExitTimeline = ({ runway, range, scrub, invalidateOnRefresh }) =>
    gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
            trigger: runway,
            start: () => range().start,
            end: () => range().end,
            scrub,
            invalidateOnRefresh,
        },
    }).to({}, { duration: 1 }, 0)

// The outgoing section has emptied, so the scroll stops being the viewer's to spend and
// is handed to the next page: `advance` is a locked scripted scroll, see useCueScroll.
//
// onEnter only, so it answers a downward crossing and nothing else — coming back up out
// of the next section crosses this same point, and being pulled forwards there would
// trap the viewer.
export const buildTakeoverTrigger = ({ runway, start, landing, advance }) =>
    ScrollTrigger.create({
        trigger: runway,
        start,
        end: landing,
        onEnter: () => {
            // Never over the top of another scripted scroll: a nav item asking for the
            // page below tweens the window past this point on its way there.
            if (gsap.isTweening(window)) return

            // A hard flick can clear the landing inside one frame, and from below it
            // there is nothing left to hand over.
            if (window.scrollY >= landing()) return

            advance()
        },
    })

// The incoming section trailing the scroll that carries it, and catching up as it lands.
//
// Note what this transform costs, since it stays on the element at y: 0: the section
// becomes the containing block for any `position: fixed` inside it, which would then
// size itself against the section rather than the viewport. Anything fixed — a modal —
// belongs outside the sections a handoff moves.
export const buildIncomingRiseTween = ({ incoming, runway, start, end }) =>
    gsap.fromTo(incoming,
        { y: () => window.innerHeight * INCOMING_LAG },
        {
            y: 0,
            ease: "none",
            scrollTrigger: {
                trigger: runway,
                start,
                end,
                scrub: SCRUB_LAG,
                // The lag is a share of the viewport, so a resize has to re-read it.
                invalidateOnRefresh: true,
            },
        }
    )
