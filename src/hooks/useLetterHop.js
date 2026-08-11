import { useEffect } from "react"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"

gsap.registerPlugin(ScrollTrigger, SplitText)

// How far a letter rises, as a share of its own height rather than a pixel
// count. The line box a character sits in scales with the font size, so one
// number here reads as the same hop at every breakpoint — where a fixed pixel
// height would be a bounce at 2xl and a twitch at 4xl.
const HOP_HEIGHT = -50

// One leg of a hop: up, or down. The full hop is two of these, and it is also
// the gap between one letter starting and the next — which is the brief. A
// letter is at its apex exactly one leg after it leaves the ground, so starting
// the next letter one leg behind puts it under way at that moment. Every letter
// is therefore mid-air alongside exactly one other, one rising as one falls.
const HOP_LEG = 0.25

// Up decelerates, down accelerates: the pair of eases is the whole reason a hop
// reads as a hop and not as a letter being slid along a rail. Anything thrown
// spends the most time near the top of its arc, and these two are what put it
// there.
const HOP_RISE_EASE = "power2.out"
const HOP_FALL_EASE = "power2.in"

// The pause between the last letter landing and the first one leaving again.
// The wave is short enough that back-to-back passes would read as a permanent
// ripple; the gap is what makes each pass a separate gesture.
const HOP_REST = 3

// The letters of `containerRef` hopping up and down in turn, on a loop.
//
// Runs only while the text is on screen. Two reasons, and the second is the one
// that matters: an off-screen loop is frames spent on something nobody is
// looking at, and — since this sits at the foot of the page — a loop left
// running from mount would be caught mid-wave by a reader who has only just
// scrolled to it. Pausing means the first pass they see starts at the L.
export function useLetterHop(containerRef) {
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const mm = gsap.matchMedia()

        // Under reduced motion nothing is split and nothing is built: the text
        // renders exactly as it would without this hook. A looping animation is
        // the clearest case there is for honouring the preference — it never
        // ends on its own, so a reader who is bothered by it is bothered by it
        // for as long as the section is open.
        mm.add("(prefers-reduced-motion: no-preference)", () => {
            // smartWrap wraps each word's characters in a nowrap span. Without
            // it every character is its own inline-block, and the browser treats
            // the gap between two inline-blocks as a break opportunity — so the
            // heading would split mid-word on a narrow screen.
            //
            // aria stays at its default: SplitText labels the element with its
            // original text, so the text reaches the accessibility tree as one
            // string rather than as a pile of single-letter fragments.
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

            // Positioned by absolute time rather than chained, because the legs
            // of neighbouring letters overlap — the second letter's rise starts
            // while the first letter's fall is still running, which is what the
            // wave IS. Appending them in sequence would queue the letters up to
            // hop one strictly after another instead.
            //
            // Note the loop covers the characters SplitText made, and whitespace
            // never becomes one. The space between the words is skipped rather
            // than held for, so the wave crosses it without a stumble.
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

            // The whole element crossing the viewport, from its top edge
            // entering at the bottom to its bottom edge leaving at the top —
            // i.e. active for exactly as long as any part of the text is
            // visible.
            const visibility = ScrollTrigger.create({
                trigger: container,
                start: "top bottom",
                end: "bottom top",
                onToggle: ({ isActive }) => (isActive ? hop.play() : hop.pause()),
            })

            // matchMedia reverts the timeline and the trigger on its own, but
            // pausing mid-wave would leave the letters wherever they were lifted
            // to; seek(0) puts them back down first. The split is DOM surgery
            // matchMedia knows nothing about, so it has to be undone here too.
            return () => {
                visibility.kill()
                hop.pause(0).kill()
                split.revert()
            }
        })

        return () => mm.revert()
    }, [containerRef])
}
