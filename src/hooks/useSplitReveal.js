import { useLayoutEffect } from "react"
import gsap from "gsap"
import SplitText from "gsap/SplitText"

gsap.registerPlugin(SplitText)

const HIDDEN = { y: -30, opacity: 0 }

// Reveals the letters of every `[data-split]` element inside the container. While
// disabled the letters are held hidden, so a page can keep them back until it lands.
export function useSplitReveal(containerRef, { enabled = true } = {}) {
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const { chars } = SplitText.create("[data-split]", {
                type: "words,chars",
                tag: "span",
                wordsClass: "inline-block",
                charsClass: "inline-block",
                aria: "none",
            })
            if (!enabled) {
                gsap.set(chars, HIDDEN)
                return
            }
            gsap.from(chars, {
                ...HIDDEN,
                duration: 0.6,
                ease: "power2.out",
                stagger: 0.03,
            })
        }, containerRef)
        return () => ctx.revert()
    }, [containerRef, enabled])
}
