import { useEffect } from "react"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import tailwindConfig from "../../tailwind.config.js"

gsap.registerPlugin(ScrollTrigger, SplitText)

// From the config rather than restated as hex, so the palette keeps one home.
const { paper, neon } = tailwindConfig.theme.extend.colors

// Measured against the paragraph BLOCK, not any one paragraph in it: a single `p`
// as the trigger is the FIRST one, so the sweep was scrubbed off the few hundred
// pixels that paragraph takes to cross the viewport and ended before the rest
// were on screen.
//
// "top 40%" means the first letter turns once the paragraphs largely fill the
// screen; anything lower starts while the block is still peeking in.
const SWEEP_START = "top 40%"
// The block's bottom edge mid-viewport — the last line sitting mid-screen as its
// final word turns. The bottom edge IS that last line: the container has no
// padding, so the last paragraph's mb-10 collapses out through it.
//
// This also paces the sweep, since letters spread evenly between START and END.
// The landing wins that trade-off; SWEEP_LAG is the knob for pacing.
const SWEEP_END = "bottom center"

// Seconds of catch-up between scroll and sweep, so the boundary trails the wheel
// and runs on for a beat after it stops. Changes the feel, not the rate — the
// same letters turn over any given stretch of scroll.
const SWEEP_LAG = 1

// One letter's slot, and equally the gap to the letter behind it — the same
// number, so letters turn at even intervals with no overlap. The value in
// isolation is arbitrary under a scrub; START/END against the character count is
// what paces them.
const CHAR_STEP = 0.05

// steps(1) makes each letter TURN rather than fade: the value jumps once, so no
// character is caught between the two colours — which under a scrub is where most
// of them would sit, reading as a gradient wash.
//
// duration: 0 looks equivalent and is a trap: a zero-duration staggered fromTo
// renders every target at its END value on creation and holds it through progress
// 0, so the whole block loads neon.
const CHAR_EASE = "steps(1)"

// The paragraphs inside `containerRef` recolouring letter by letter, from body
// copy to the accent, scrubbed off the scroll that carries them up the page.
export function useTextColorSweep(containerRef) {
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const mm = gsap.matchMedia()

        // Under reduced motion nothing is split or built: the copy stays paper,
        // which is what it renders as anyway.
        mm.add("(prefers-reduced-motion: no-preference)", () => {
            // smartWrap is required. Splitting to chars leaves each character its
            // own inline-block, and the gap between two inline-blocks is a break
            // opportunity — so words split mid-word at any width. smartWrap wraps
            // each word in a nowrap span instead.
            //
            // aria stays "auto": SplitText labels each paragraph with its original
            // text, so the spans never reach the accessibility tree separately.
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

            // matchMedia reverts the tween and trigger; the split is DOM surgery
            // it knows nothing about.
            return () => split.revert()
        })

        return () => mm.revert()
    }, [containerRef])
}
