import { useEffect } from "react"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"

gsap.registerPlugin(ScrollTrigger, SplitText)

// A share of the letter's own height, not a pixel count, so one number reads as
// the same hop at every breakpoint.
const HOP_HEIGHT = -50

// One leg of a hop — up, or down — and also the gap between one letter starting
// and the next. A letter is at its apex exactly one leg after leaving the ground,
// so every letter is mid-air alongside exactly one other, one rising as one falls.
const HOP_LEG = 0.25
const HOP_RISE_EASE = "power2.out"
const HOP_FALL_EASE = "power2.in"
const HOP_REST = 3

// The letters of `containerRef` hopping up and down in turn, on a loop.
//
// Runs only while the text is on screen: this sits at the foot of the page, so a
// loop running from mount would be caught mid-wave by a reader who has just
// scrolled to it. Pausing means their first pass starts at the L.
export function useLetterHop(containerRef) {
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const mm = gsap.matchMedia()

        // Under reduced motion nothing is split or built. A looping animation is
        // the clearest case for honouring the preference — it never ends on its
        // own, so it bothers the reader for as long as the section is open.
        mm.add("(prefers-reduced-motion: no-preference)", () => {
            // smartWrap wraps each word's characters in a nowrap span. Without it
            // every character is its own inline-block, and the gap between two of
            // them is a break opportunity, so the heading splits mid-word.
            //
            // aria stays at its default: SplitText labels the element with its
            // original text, so it reaches the accessibility tree as one string.
            const split = SplitText.create(container, {
                type: "chars",
                smartWrap: true,
            })

            // paused, and started by the ScrollTrigger below.
            const hop = gsap.timeline({
                repeat: -1,
                repeatDelay: HOP_REST,
                paused: true,
            })

            // Positioned by absolute time rather than chained: neighbouring legs
            // overlap, which is what makes it a wave. Appending in sequence would
            // queue the letters to hop strictly one after another.
            //
            // Whitespace never becomes a char, so the wave crosses the gap between
            // words without a stumble.
            split.chars.forEach((char, i) => {
                const start = i * HOP_LEG

                hop.to(char, {
                    yPercent: HOP_HEIGHT,
                    duration: HOP_LEG,
                    ease: HOP_RISE_EASE,
                }, start)

                hop.to(char, {
                    yPercent: 0,
                    duration: HOP_LEG,
                    ease: HOP_FALL_EASE,
                }, start + HOP_LEG)
            })

            // Active for exactly as long as any part of the text is visible.
            const visibility = ScrollTrigger.create({
                trigger: container,
                start: "top bottom",
                end: "bottom top",
                onToggle: ({ isActive }) => (isActive ? hop.play() : hop.pause()),
            })

            // matchMedia reverts the timeline and trigger, but pausing mid-wave
            // would leave letters lifted; seek(0) puts them down first. The split
            // has to be undone here too.
            return () => {
                visibility.kill()
                hop.pause(0).kill()
                split.revert()
            }
        })

        return () => mm.revert()
    }, [containerRef])
}
