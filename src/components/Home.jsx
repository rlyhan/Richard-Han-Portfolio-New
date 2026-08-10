import { useCallback, useEffect, useRef, useState } from "react"
import cn from "classnames"
import gsap from "gsap"
import ScrollToPlugin from "gsap/ScrollToPlugin"
import PageSection from "./layout/PageSection"
import ScrollCue from "./common/Buttons/ScrollCue"

gsap.registerPlugin(ScrollToPlugin)

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

// The hero → About handoff, as one ordered sequence. The display lines empty
// out first and the outro block only starts leaving once they are most of the
// way gone, so the hero clears in two reads rather than dimming as one slab.
// The scroll is last: About should arrive over an already-empty hero.
const LINES_FADE = 0.9
const OUTRO_START = 0.5
const OUTRO_FADE = 0.6
const OUTRO_DRIFT = 32
const COVER_START = 0.8
const COVER_DURATION = 1.2

// Under this the hero still owns the viewport, so the cue belongs on screen.
const CUE_VISIBLE_BELOW = 40

const Home = () => {
    const lineRefs = useRef([])
    const rollingRef = useRef(null)
    const outroRef = useRef(null)
    const revealRef = useRef(null)
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

    // Drives the whole handoff off one click for now. The same ordering is what
    // a scrubbed ScrollTrigger will drive later, which is why every beat is a
    // position on one timeline rather than a chain of callbacks.
    const revealAbout = useCallback(() => {
        if (revealRef.current?.isActive()) return

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        // Reduced motion keeps the ordering but collapses every beat to zero, so
        // the sequence lands as a jump cut instead of being skipped outright.
        const t = (seconds) => (reduced ? 0 : seconds)

        setIsRevealing(true)

        revealRef.current = gsap.timeline({
            defaults: { ease: "power2.out" },
            onComplete: () => {
                // About covers the hero completely by now, so putting it back is
                // unseen — and it has to happen, or scrolling up finds it empty.
                gsap.set([rollingRef.current, outroRef.current], { opacity: 1, y: 0 })
                setIsRevealing(false)
            },
        })
            .to(rollingRef.current, { opacity: 0, duration: t(LINES_FADE) }, 0)
            .to(
                outroRef.current,
                { opacity: 0, y: OUTRO_DRIFT, duration: t(OUTRO_FADE) },
                t(OUTRO_START)
            )
            // The cover itself is layout, not a tween: the hero is sticky and
            // About is opaque and stacked above it, so moving the page is all it
            // takes for About to slide up over a hero that never moves.
            // autoKill is left off — a tween killed mid-scroll would never run
            // onComplete, stranding the hero at zero opacity.
            .to(
                window,
                {
                    duration: t(COVER_DURATION),
                    ease: "power2.inOut",
                    scrollTo: { y: "#about" },
                },
                t(COVER_START)
            )
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

    useEffect(() => () => revealRef.current?.kill(), [])

    // min-h rather than h: on a viewport too short for four display lines plus
    // the name block, the hero grows rather than clipping anything.
    //
    // sticky, so the hero holds the viewport while About scrolls up over it.
    // Its containing block is the wrapper it shares with About in App, which
    // ends the stickiness once About has fully covered it.
    return (
        <>
            <PageSection id="home" additionalClasses="sticky top-0 flex flex-col min-h-svh">
                <div ref={rollingRef} className="flex-1 flex flex-col justify-center gap-2 py-8 sm:py-12">
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

                <div ref={outroRef} className="w-full">
                    <div className="flex flex-wrap items-end justify-between">
                        <h1 className="font-heading uppercase mb-10 line-height">
                            <span className="block text-neon text-3xl mr-2">Richard Han</span>
                            <span className="block text-paper text-xl sm:text-2xl">Front End | Full Stack Developer</span>
                        </h1>
                        <p className="text-mute text-sm sm:text-lg font-medium mb-10">
                            Open to opportunities | Currently based in: <span className="text-neon">Auckland, NZ</span>
                        </p>
                    </div>
                </div>
            </PageSection>

            {/* Retired the moment the page leaves the hero, so it never floats over
                About as a stale invitation to a section already on screen. */}
            <ScrollCue onClick={revealAbout} visible={atTop && !isRevealing} />
        </>
    )
}

export default Home
