import { useRef } from "react"
import cn from "classnames"
import PageSection from "./layout/PageSection"
import ScrollCue from "./common/Buttons/ScrollCue"
import { useHeroToAboutHandoff } from "../hooks/useHeroToAboutHandoff"
import { useIsNearPageTop } from "../hooks/useIsNearPageTop"
import { useKeyShortcut } from "../hooks/useKeyShortcut"
import { useRollingDisplayLines } from "../hooks/useRollingDisplayLines"

// Each line renders both of its strings and rolls between them — see
// useRollingDisplayLines for why the pair has to share one grid cell.
const TEXT_LINES = {
    line1: ["Tailored to design", "Modern + legacy builds"],
    line2: ["Collaboration", "AI-empowered"],
    line3: ["Scalable architecture", "Agile development"],
    line4: ["User-focused", "SEO-optimised"]
}

// Scrolled less than this, the hero still owns the viewport, so the cue and its
// keyboard shortcut both still apply.
const NEAR_TOP_THRESHOLD = 40

const Home = () => {
    const displayLineRefs = useRef([])
    const outroLineRefs = useRef([])
    const runwayRef = useRef(null)

    const { scrollToAbout, isScrollingToAbout } = useHeroToAboutHandoff({
        displayLineRefs,
        outroLineRefs,
        runwayRef,
    })

    // The cue belongs to the top of the page: any scroll away from the hero
    // retires it, including the one the cue itself starts.
    const isCueVisible = useIsNearPageTop(NEAR_TOP_THRESHOLD) && !isScrollingToAbout

    // Space is the cue's gesture from the keyboard, and it is bound on exactly
    // the same terms: past the hero the page is being read, and space has to go
    // back to being page-down.
    useKeyShortcut("Space", scrollToAbout, { enabled: isCueVisible })

    useRollingDisplayLines(displayLineRefs)

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
                            ref={(el) => { displayLineRefs.current[i] = el }}
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
                    own beats — the same reason the display lines above stagger.

                    The bottom padding is clearance for the scroll cue, which is
                    centred at the foot of the viewport. Below 1280px the name
                    and the availability line wrap onto separate rows, spanning
                    the full width, and the cue lands on top of the availability
                    line; from there up they sit either side of it with the
                    centre free. */}
                <div className="w-full pb-16 xl:pb-0">
                    <div className="flex flex-wrap items-end justify-between">
                        <h1
                            ref={(el) => { outroLineRefs.current[0] = el }}
                            className="font-heading uppercase mb-10 line-height"
                        >
                            <span className="block text-neon text-3xl mr-2">Richard Han</span>
                            <span className="block text-paper text-xl sm:text-2xl">Front End | Full Stack Developer</span>
                        </h1>
                        <p
                            ref={(el) => { outroLineRefs.current[1] = el }}
                            className="text-mute text-sm sm:text-lg font-medium mb-10"
                        >
                            Open to opportunities | Currently based in: <span className="text-neon">Auckland, NZ</span>
                        </p>
                    </div>
                </div>
            </PageSection>

            {/* The runway: the stretch of scroll where the hero holds the
                viewport alone and empties out, before About's top edge appears.
                It carries no content, so its only job is height — and it is
                also what the handoff's two ScrollTriggers measure against, which
                is why the ref goes out to useHeroToAboutHandoff.

                Reduced motion collapses it to nothing: with the fades gone there
                is nothing to watch here, and it would read as a dead screen. */}
            <div ref={runwayRef} aria-hidden="true" className="h-[80svh] motion-reduce:h-0" />

            {/* Retired the moment the page leaves the hero, so it never floats over
                About as a stale invitation to a section already on screen. */}
            <ScrollCue onClick={scrollToAbout} visible={isCueVisible} />
        </>
    )
}

export default Home
