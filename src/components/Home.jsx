import { useCallback, useEffect, useRef, useState } from "react"
import cn from "classnames"
import gsap from "gsap"
import ScrollToPlugin from "gsap/ScrollToPlugin"
import ScrollTrigger from "gsap/ScrollTrigger"
import PageSection from "./layout/PageSection"
import ScrollCue from "./common/Buttons/ScrollCue"

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger)

const TEXT_LINES = {
    line1: ["Tailored to design", "Modern + legacy builds"],
    line2: ["Collaboration", "AI-empowered"],
    line3: ["Scalable architecture", "Agile development"],
    line4: ["User-focused", "SEO-optimised"]
}

const ROLL_INTERVAL = 5
const ROLL_DURATION = 0.7
const ROLL_EASE = "power3.inOut"
// Offsetting each line keeps all four from flipping in lockstep.
const LINE_STAGGER = 0.12

// Seconds of catch-up between the scroll position and the animation, and the
// single most important number here: it is what makes the hero trail the wheel
// and coast to a stop after it, rather than being welded to the scrollbar.
const SCRUB_LAG = 1

// The display lines leave as four planes rather than one sheet. Each line
// travels TRAVEL + its index * STEP for the same scroll, so the stack spreads
// as it goes, and each starts STAGGER later than the one above it.
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
// instead of dimming as a block. It goes last and it goes quickly: the point
// is that the hero is already empty by the time About's edge appears.
const OUTRO_START = 0.55
const OUTRO_DURATION = 0.25
const OUTRO_STAGGER = 0.08
const OUTRO_DRIFT = 44

// About rides up at a fraction under the speed of the scroll carrying it and
// closes the gap exactly as it lands, so the cover has some weight behind it.
// A share of the viewport, not a pixel count: the distance it has to travel
// scales with the screen, so the lag has to as well.
const ABOUT_LAG = 0.12

// How long a click on the cue takes to cross the whole sequence. Long, because
// everything else here is scrubbed off this scroll — rush it and the fades
// arrive as a blur instead of as beats.
const CUE_SCROLL_DURATION = 2.4

// Under this the hero still owns the viewport, so the cue belongs on screen.
const CUE_VISIBLE_BELOW = 40

const Home = () => {
    const lineRefs = useRef([])
    const outroPartRefs = useRef([])
    const runwayRef = useRef(null)
    const cueScrollRef = useRef(null)
    const [atTop, setAtTop] = useState(true)
    const [isRevealing, setIsRevealing] = useState(false)

    useEffect(() => {
        const mm = gsap.matchMedia()

        mm.add("(prefers-reduced-motion: no-preference)", () => {
            lineRefs.current.filter(Boolean).forEach((line, i) => {
                const [first, second] = line.children

                // The second string parks one full line below the clip edge.
                gsap.set(second, { yPercent: 100, opacity: 1 })

                const tl = gsap.timeline({
                    repeat: -1,
                    delay: ROLL_INTERVAL + i * LINE_STAGGER
                })

                // Empty tween pins the cycle at two intervals so the gap between
                // flips stays even across the repeat boundary. Every position below
                // is explicit: omitting one appends at the timeline's end, which
                // this tween has already pushed out to ROLL_INTERVAL * 2.
                tl.to({}, { duration: ROLL_INTERVAL * 2 }, 0)
                    // Flip 1 — first exits upward, second arrives from below.
                    .to(first, { yPercent: -100, duration: ROLL_DURATION, ease: ROLL_EASE }, 0)
                    .to(second, { yPercent: 0, duration: ROLL_DURATION, ease: ROLL_EASE }, 0)
                    // Reparked below the clip edge, ready to arrive on flip 2.
                    .set(first, { yPercent: 100 }, ROLL_DURATION)
                    // Flip 2 — the same move with the roles swapped, which returns
                    // both elements to their starting offsets for the next repeat.
                    .to(second, { yPercent: -100, duration: ROLL_DURATION, ease: ROLL_EASE }, ROLL_INTERVAL)
                    .to(first, { yPercent: 0, duration: ROLL_DURATION, ease: ROLL_EASE }, ROLL_INTERVAL)
                    .set(second, { yPercent: 100 }, ROLL_INTERVAL + ROLL_DURATION)
            })
        })

        return () => mm.revert()
    }, [])

    // The handoff itself, scrubbed off the scroll position. Both triggers are
    // anchored to the runway rather than to pixel counts, so the choreography is
    // stated in terms of the layout it belongs to:
    //
    //   runway top → bottom edge     the hero alone on screen, emptying out
    //   runway bottom → top edge     About climbing over the emptied hero
    //
    // Nothing here moves About into place: that is the sticky hero plus an
    // opaque section stacked above it, which is layout, not animation. The only
    // tween on About is the lag that keeps it off the wheel.
    useEffect(() => {
        const mm = gsap.matchMedia()

        mm.add("(prefers-reduced-motion: no-preference)", () => {
            const lines = lineRefs.current.filter(Boolean)
            const outroParts = outroPartRefs.current.filter(Boolean)

            const heroOut = gsap.timeline({
                // ease: "none" throughout — with a scrub the scroll is the ease,
                // and a second one layered on top only makes the mapping lie.
                defaults: { ease: "none" },
                scrollTrigger: {
                    trigger: runwayRef.current,
                    start: "top bottom",
                    end: "bottom bottom",
                    scrub: SCRUB_LAG,
                },
            })

            heroOut
                // Pins the timeline's length to 1 so every position below reads
                // as a fraction of the runway — and so the gap between the last
                // fade and the end survives as a beat of empty hero rather than
                // being stretched away, since a scrub maps whatever duration the
                // timeline happens to have across the whole scroll range.
                .to({}, { duration: 1 }, 0)
                .to(lines, {
                    opacity: 0,
                    y: (i) => -(LINE_TRAVEL + i * LINE_TRAVEL_STEP),
                    xPercent: (i) => (i % 2 ? LINE_DRIFT : -LINE_DRIFT),
                    duration: LINE_EXIT_DURATION,
                    stagger: LINE_EXIT_STAGGER,
                }, 0)
                .to(outroParts, {
                    opacity: 0,
                    y: OUTRO_DRIFT,
                    duration: OUTRO_DURATION,
                    stagger: OUTRO_STAGGER,
                }, OUTRO_START)

            // Held on the runway rather than on About: an element used as its own
            // trigger is measured with this transform already applied, which puts
            // the start and end it is measuring against out by the lag distance.
            gsap.fromTo("#about",
                { y: () => window.innerHeight * ABOUT_LAG },
                {
                    y: 0,
                    ease: "none",
                    scrollTrigger: {
                        trigger: runwayRef.current,
                        start: "bottom bottom",
                        end: "bottom top",
                        scrub: SCRUB_LAG,
                        // The lag is a share of the viewport, so a resize has to
                        // re-read it rather than keep the height it started with.
                        invalidateOnRefresh: true,
                    },
                }
            )
        })

        return () => mm.revert()
    }, [])

    // The cue's shortcut through all of the above. It drives the scroll and
    // nothing else — every fade above is scrubbed off that scroll, so this stays
    // one tween and the two paths can never describe different sequences.
    const revealAbout = useCallback(() => {
        if (cueScrollRef.current?.isActive()) return

        const runway = runwayRef.current
        if (!runway) return

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

        setIsRevealing(true)

        cueScrollRef.current = gsap.to(window, {
            duration: reduced ? 0 : CUE_SCROLL_DURATION,
            ease: "power2.inOut",
            // Measured off the runway rather than passing "#about" as the target:
            // About carries the lag transform, and ScrollToPlugin reads an
            // element's live position, so it would aim the lag distance too low.
            scrollTo: { y: window.scrollY + runway.getBoundingClientRect().bottom },
            onComplete: () => setIsRevealing(false),
        })
    }, [])

    // Space is the same gesture as the cue, from the keyboard. It is only taken
    // over while the hero still owns the viewport — past that the page is being
    // read, and space has to go back to being page-down.
    useEffect(() => {
        if (!atTop || isRevealing) return

        const onKeyDown = (e) => {
            if (e.code !== "Space") return
            // Held space is the browser paging through a document, not a press.
            if (e.repeat) return
            // Modifiers make it a different shortcut (shift+space pages back).
            if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return
            // Space already means something on a control that has focus — the
            // cue's own button included, which would otherwise fire twice.
            if (e.target.closest?.("button, a, input, textarea, select, [contenteditable]")) return

            // Without this the reveal and a native page-down both run.
            e.preventDefault()
            revealAbout()
        }

        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [atTop, isRevealing, revealAbout])

    // The cue belongs to the top of the page: any scroll away from the hero
    // retires it, including the one the cue itself starts.
    useEffect(() => {
        let frame = null

        const update = () => {
            frame = null
            setAtTop(Math.max(window.scrollY, 0) < CUE_VISIBLE_BELOW)
        }

        const onScroll = () => {
            if (frame === null) frame = requestAnimationFrame(update)
        }

        window.addEventListener("scroll", onScroll, { passive: true })
        // A reload part-way down the page restores the scroll position without
        // firing a scroll event, so the first read has to be taken directly.
        update()

        return () => {
            window.removeEventListener("scroll", onScroll)
            if (frame !== null) cancelAnimationFrame(frame)
        }
    }, [])

    useEffect(() => () => cueScrollRef.current?.kill(), [])

    // min-h rather than h: on a viewport too short for four display lines plus
    // the name block, the hero grows rather than clipping anything.
    //
    // sticky, so the hero holds the viewport while About scrolls up over it.
    // Its containing block is the wrapper it shares with About in App, which
    // ends the stickiness once About has fully covered it.
    return (
        <>
            <PageSection id="home" additionalClasses="sticky top-0 flex flex-col min-h-svh">
                <div className="flex-1 flex flex-col justify-center gap-2 py-8 sm:py-12">
                    {Object.entries(TEXT_LINES).map(([key, [first, second]], i) => (
                        <div
                            key={key}
                            ref={(el) => { lineRefs.current[i] = el }}
                            className={cn(
                                // 7vw fits the longest string, "Modern + legacy builds", at
                                // the narrowest viewport, where the 96px gutters take their
                                // biggest relative bite. The 118px ceiling is that same
                                // string against the 1184px max-w-7xl container, which vw
                                // would otherwise outgrow once the width stops scaling.
                                // nowrap is the backstop: on a platform whose system-ui runs
                                // wider than measured, the text overflows sideways instead of
                                // wrapping, which would double the cell and break the roll.
                                "grid overflow-hidden leading-none whitespace-nowrap text-[length:min(7vw,118px)]",
                                // The alternation is the hero: neon and paper trade off
                                // down the stack so the accent is structural here rather
                                // than a highlight, which is why it stays rare elsewhere.
                                i % 2 ? "text-right text-paper" : "text-neon"
                            )}
                        >
                            {/* Both strings share one grid cell, so the clip height is
                                the taller of the two and nothing shifts as they roll.
                                The bottom padding keeps leading-none from cropping
                                descenders against the clip edge. */}
                            <p className="col-start-1 row-start-1 pb-[0.12em]">{first}</p>
                            <p className="col-start-1 row-start-1 pb-[0.12em] opacity-0">{second}</p>
                        </div>
                    ))}
                </div>

                {/* The two halves are animated separately rather than as one
                    block, so the name and the availability line leave on their
                    own beats — the same reason the display lines above stagger. */}
                <div className="w-full">
                    <div className="flex flex-wrap items-end justify-between">
                        <h1
                            ref={(el) => { outroPartRefs.current[0] = el }}
                            className="font-heading uppercase mb-10 line-height"
                        >
                            <span className="block text-neon text-3xl mr-2">Richard Han</span>
                            <span className="block text-paper text-xl sm:text-2xl">Front End | Full Stack Developer</span>
                        </h1>
                        <p
                            ref={(el) => { outroPartRefs.current[1] = el }}
                            className="text-mute text-sm sm:text-lg font-medium mb-10"
                        >
                            Open to opportunities | Currently based in: <span className="text-neon">Auckland, NZ</span>
                        </p>
                    </div>
                </div>
            </PageSection>

            {/* The runway: the stretch of scroll where the hero holds the
                viewport alone and empties out, before About's top edge appears.
                It carries no content, so its only job is height — and it is also
                what both ScrollTriggers above measure themselves against.

                Reduced motion collapses it to nothing: with the fades gone there
                is nothing to watch here, and it would read as a dead screen. */}
            <div ref={runwayRef} aria-hidden="true" className="h-[80svh] motion-reduce:h-0" />

            {/* Retired the moment the page leaves the hero, so it never floats over
                About as a stale invitation to a section already on screen. */}
            <ScrollCue onClick={revealAbout} visible={atTop && !isRevealing} />
        </>
    )
}

export default Home
