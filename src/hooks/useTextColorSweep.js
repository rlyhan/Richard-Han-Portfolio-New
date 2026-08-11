import { useEffect } from "react"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import tailwindConfig from "../../tailwind.config.js"

gsap.registerPlugin(ScrollTrigger, SplitText)

// Pulled out of the config rather than restated as hex here, on the same
// principle index.css follows: the palette has one home, and a second copy of
// the accent living in JS is a copy that can drift out of step with it.
const { paper, neon } = tailwindConfig.theme.extend.colors

// Where the sweep starts and ends, both measured against the paragraph BLOCK
// rather than against any one paragraph in it. That distinction is the whole
// fix: a single `p` as the trigger is the FIRST paragraph, so the sweep across
// all of them was scrubbed off the few hundred pixels that paragraph one takes
// to cross the viewport — it was over before the rest were even on screen.
//
// "top 40%" is the block's top edge reaching the 40% line of the viewport, so
// by the time the first letter turns the reader is looking at a screen the
// paragraphs largely fill. Anything nearer the bottom of the viewport starts
// the sweep while the block is still only peeking in over the hero handoff.
const SWEEP_START = "top 40%"
// The block's bottom edge at the middle of the viewport, which is the last line
// of the last paragraph sitting mid-screen as its final word turns. The bottom
// edge IS that last line: every paragraph carries mb-10, but the container has
// no padding or border of its own, so the last one's bottom margin collapses
// out through it rather than adding height below the copy.
//
// This also paces the sweep — the letters are spread evenly over the scroll
// between START and END, so the later END sits the further apart they are. The
// two purposes pull against each other and the landing wins: taking END lower
// would stretch the sweep out, at the cost of finishing it further up the
// screen. SWEEP_LAG is the knob for making it feel less rushed, not this one.
const SWEEP_END = "bottom center"

// Seconds of catch-up between the scroll position and the sweep. The same
// device — and the same value — as the hero handoff's SCRUB_LAG: it is what
// stops the boundary being welded to the scrollbar, so it trails the wheel and
// runs on for a beat after the wheel stops rather than freezing with it.
//
// Note this changes the FEEL, not the rate: over any given stretch of scroll
// the same letters turn either way. What it buys is that they are no longer
// turning in lockstep with the gesture.
const SWEEP_LAG = 1

// One letter's slot: how long it holds its colour before turning, and equally
// the gap to the letter behind it. The two are the same number so the letters
// turn at even intervals with no overlap.
//
// The value in isolation is arbitrary — a scrub stretches the tween's total
// duration across the scroll range whatever that duration is, so this sets the
// spacing of the letters and nothing else. SWEEP_START/END against the
// character count is what actually paces them.
const CHAR_STEP = 0.05

// steps(1) is what makes each letter TURN rather than fade: the value jumps
// once, at the end of the letter's slot, so no character is ever caught
// part-way between the two colours. That in-between is what read as a gradient
// wash back when every letter crossed a real fade — under a scrub it is where
// most of them sit at any given moment.
//
// The obvious way to say the same thing is duration: 0, and it is a trap. A
// zero-duration staggered fromTo renders EVERY target at its END value the
// moment it is created, and holds them there through progress 0 and 1 alike —
// it only starts behaving once the scrub has driven it forward and back. The
// symptom is the whole block loading neon before a single letter is due to turn.
const CHAR_EASE = "steps(1)"

// The paragraphs inside `containerRef` recolouring letter by letter, from body
// copy to the accent, scrubbed off the scroll that carries them up the page.
//
// No ease anywhere: with a scrub the scroll is the ease, and with CHAR_FADE at
// zero there is nothing left for one to shape in any case.
export function useTextColorSweep(containerRef) {
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const mm = gsap.matchMedia()

        // Under reduced motion nothing is split and nothing is built: the copy
        // stays paper, which is what it renders as anyway.
        mm.add("(prefers-reduced-motion: no-preference)", () => {
            // smartWrap is not optional here. Splitting to chars alone leaves
            // every character as its own inline-block, and the gap between two
            // inline-blocks is a break opportunity as far as the browser is
            // concerned — so words split mid-word at the end of a line, at any
            // width. It wraps each word's characters in a white-space: nowrap
            // span instead, which puts the word back together as one unbreakable
            // run without changing what the tween below animates.
            //
            // aria is left at its default of "auto": SplitText labels each
            // paragraph with its original text, so the spans never reach the
            // accessibility tree as several hundred separate fragments.
            const split = SplitText.create(container.querySelectorAll("p"), {
                type: "chars",
                smartWrap: true,
            })

            gsap.fromTo(split.chars,
                { color: paper },
                {
                    color: neon.DEFAULT,
                    duration: CHAR_STEP,
                    ease: CHAR_EASE,
                    stagger: CHAR_STEP,
                    scrollTrigger: {
                        trigger: container,
                        start: SWEEP_START,
                        end: SWEEP_END,
                        scrub: SWEEP_LAG,
                    },
                }
            )

            // matchMedia reverts the tween and its trigger on its own; the split
            // is DOM surgery it knows nothing about, so it has to be undone here.
            return () => split.revert()
        })

        return () => mm.revert()
    }, [containerRef])
}
