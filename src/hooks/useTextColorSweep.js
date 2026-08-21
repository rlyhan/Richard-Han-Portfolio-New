import { useEffect } from "react"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import tailwindConfig from "../../tailwind.config.js"

gsap.registerPlugin(ScrollTrigger, SplitText)

// From the config rather than restated as hex, so the palette keeps one home.
const { paper, neon } = tailwindConfig.theme.extend.colors

// The height in the viewport that the turning word rides, as a fraction from the
// top. Everything else here exists to keep the boundary ON this line: it is read
// straight off where the LINES actually are, rather than off how far the block
// has travelled.
//
// The distinction matters because it is what a scrub cannot do. Spreading the
// characters evenly over the block's travel only approximates a line position:
// the count per line varies, and the margins between paragraphs carry no
// characters at all, so the boundary drifts above or below the mark by however
// far those two disagree.
const SWEEP_LINE = 0.5

// One letter's slot, and equally the gap to the letter behind it — the same
// number, so letters turn at even intervals with no overlap. Real seconds: the
// tail of a word turns at CHAR_STEP a letter whatever the scroll is doing.
const CHAR_STEP = 0.05

// Longest the sweep will spend closing the gap to the line it should be on. It
// is a fixed pace against an unbounded scroll, so on anything faster than a
// gentle drag it IS the pace, and the sweep runs this far behind the mark — the
// trailing that a scrub used to give, and the knob for how much of it there is.
//
// A cap rather than a rate, so a fling or an anchor jump still lands: the sweep
// ripples faster over the distance instead of trickling on for ten seconds after
// the page has stopped.
const MAX_CATCHUP = 0.6

// steps(1) makes each letter TURN rather than fade: the value jumps once, so no
// character is caught between the two colours, reading as a gradient wash.
//
// It also puts each letter's turn at the END of its slot, which is what lets the
// word and line boundaries below be read straight off a cumulative character
// count.
//
// duration: 0 looks equivalent and is a trap: a zero-duration staggered fromTo
// renders every target at its END value on creation and holds it through progress
// 0, so the whole block loads neon.
const CHAR_EASE = "steps(1)"

// The paragraphs inside `containerRef` recolouring letter by letter, from body
// copy to the accent, with the turning word riding the middle of the viewport.
// Words turn whole: once the first letter of one goes, the rest follow it even if
// the scroll has stopped dead.
export function useTextColorSweep(containerRef) {
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const mm = gsap.matchMedia()

        // Under reduced motion nothing is split or built: the copy stays paper,
        // which is what it renders as anyway.
        mm.add("(prefers-reduced-motion: no-preference)", () => {
            let sweep, trigger, catchUp

            // Everything downstream of the split, rebuilt from scratch each time
            // the text re-wraps — the line boxes are the measuring stick here, and
            // a stale one points at the wrong place on the screen.
            const build = (split) => {
                sweep?.kill()
                trigger?.kill()
                catchUp?.kill()

                // The whole sweep as one paused timeline, played by hand below
                // rather than scrubbed. A scrub welds progress to the scroll
                // position; that weld is what parks the boundary mid-word when the
                // wheel stops, and what leaves it off the mark in between.
                sweep = gsap.timeline({ paused: true })
                sweep.fromTo(split.chars,
                    { color: paper },
                    {
                        color: neon.DEFAULT,
                        duration: CHAR_STEP,
                        ease: CHAR_EASE,
                        stagger: CHAR_STEP,
                    }
                )

                // Two readings of the same running character count, since letters
                // turn at the end of their slot: the word that ends on the Nth
                // character of the block ends at N steps, and so does the line.
                //
                // Words are where the sweep is allowed to REST; lines are how the
                // page position is converted into a time. The leading 0 is the
                // rest point for "not started" — without it the first flicker of
                // the head would carry the first word.
                const restPoints = [0]
                const lines = []
                let wordChars = 0

                split.words.forEach((word) => {
                    wordChars += word.querySelectorAll(".char").length
                    restPoints.push(wordChars * CHAR_STEP)
                })

                // Offsets within the container rather than viewport positions, so
                // one rect read per scroll frame converts the whole table.
                const measure = () => {
                    const top = container.getBoundingClientRect().top
                    let lineChars = 0
                    lines.length = 0
                    split.lines.forEach((line) => {
                        const rect = line.getBoundingClientRect()
                        const start = lineChars * CHAR_STEP
                        lineChars += line.querySelectorAll(".char").length
                        lines.push({
                            top: rect.top - top,
                            bottom: rect.bottom - top,
                            start,
                            end: lineChars * CHAR_STEP,
                        })
                    })
                }

                // Where the sweep belongs, in timeline seconds: the mark's depth
                // into the block, walked through the line table. A line's own
                // height is the stretch of scroll its letters turn over, which is
                // what carries the boundary ACROSS a line rather than firing the
                // whole line at once — and the gaps between paragraphs, holding no
                // characters, hold the sweep still as they pass.
                const timeAtMark = () => {
                    const mark = window.innerHeight * SWEEP_LINE - container.getBoundingClientRect().top
                    let time = 0
                    for (const line of lines) {
                        if (mark <= line.top) break
                        if (mark >= line.bottom) {
                            time = line.end
                            continue
                        }
                        const through = (mark - line.top) / (line.bottom - line.top)
                        time = line.start + (line.end - line.start) * through
                        break
                    }
                    return time
                }

                let target = 0

                const update = () => {
                    // Round UP to a rest point: the moment the mark lands anywhere
                    // inside a word, the whole of that word becomes the
                    // destination. Scrolling back does the same in reverse — a word
                    // un-colours as one unit once the mark drops below its first
                    // letter. The fallback covers the far end, where the mark can
                    // sit a float's hair past the last word's turn.
                    const time = timeAtMark()
                    const next = restPoints.find((rest) => rest >= time) ?? sweep.duration()
                    if (next === target) return
                    target = next

                    // Killed rather than overwritten, because a tweenTo tween is
                    // born outside this matchMedia context and so is not swept up
                    // by its revert; the one live tween is tracked by hand.
                    catchUp?.kill()
                    catchUp = sweep.tweenTo(target, {
                        duration: Math.min(Math.abs(target - sweep.time()), MAX_CATCHUP),
                        ease: "none",
                    })
                }

                // No start/end worth tuning any more: the trigger spans the block's
                // whole passage and only says WHEN to look, never how far along the
                // sweep should be. SWEEP_LINE alone decides that.
                trigger = ScrollTrigger.create({
                    trigger: container,
                    start: "top bottom",
                    end: "bottom top",
                    onUpdate: update,
                    // onUpdate stops at the edges, so a jump clean past the block
                    // — an anchor, a restored scroll position — would leave the
                    // sweep frozen wherever it was. Toggling settles it either way.
                    onToggle: update,
                    onRefresh: () => {
                        measure()
                        update()
                    },
                })

                measure()
                update()

                // Handed back so GSAP reverts the colours before re-splitting;
                // without it the fromTo's inline styles outlive their elements.
                return sweep
            }

            // autoSplit re-runs the split when the text re-wraps — a resize, a font
            // landing late. Line boxes are load-bearing here, and after a re-wrap
            // the old ones no longer describe where anything is.
            //
            // aria stays "auto": SplitText labels each paragraph with its original
            // text, so the spans never reach the accessibility tree separately.
            const split = SplitText.create(container.querySelectorAll("p"), {
                type: "lines,words,chars",
                // Named explicitly because SplitText applies no class by default,
                // and the counting above finds its characters by class.
                wordsClass: "word",
                charsClass: "char",
                autoSplit: true,
                onSplit: build,
            })

            // matchMedia collects nothing built inside onSplit, since that can fire
            // long after this function returns; the split is DOM surgery it knows
            // nothing about either.
            return () => {
                sweep?.kill()
                trigger?.kill()
                catchUp?.kill()
                split.revert()
            }
        })

        return () => mm.revert()
    }, [containerRef])
}
