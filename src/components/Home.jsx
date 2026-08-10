import { useEffect, useRef } from "react"
import cn from "classnames"
import gsap from "gsap"
import PageSection from "./layout/PageSection"

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

const Home = () => {
    const lineRefs = useRef([])

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

    // min-h rather than h: on a viewport too short for four display lines plus
    // the name block, the page scrolls rather than clipping anything.
    return (
        <PageSection id="home" additionalClasses="flex flex-col min-h-svh">
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
                            i % 2 ? "text-right text-neutral-700" : "text-white"
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

            <div className="w-full">
                <div className="flex flex-wrap items-end justify-between">
                    <h1 className="font-heading uppercase mb-10 line-height">
                        <span className="block text-white text-3xl mr-2">Richard Han</span>
                        <span className="block text-neutral-700 text-xl sm:text-2xl">Front End | Full Stack Developer</span>
                    </h1>
                    <p className="text-white/85 text-sm sm:text-lg font-medium mb-10">
                        Open to opportunities | Currently based in: <span className="text-neutral-700">Auckland, NZ</span>
                    </p>
                </div>
            </div>
        </PageSection>
    )
}

export default Home
