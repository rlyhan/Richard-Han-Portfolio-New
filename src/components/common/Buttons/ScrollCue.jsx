import { useEffect, useRef } from "react"
import cn from "classnames"
import gsap from "gsap"
import ArrowDownIcon from "../../icons/ArrowDownIcon"

const BOUNCE_DISTANCE = 10
const BOUNCE_DURATION = 0.9
const FADE_DURATION = 0.35

// A floating hint at the foot of the hero that hands the viewer into the next
// section. The bounce lives on an inner element rather than on the button so
// the infinite y tween and the visibility fade never write to the same target.
const ScrollCue = ({ onClick, visible, label = "Scroll to the About section" }) => {
    const containerRef = useRef(null)
    const arrowRef = useRef(null)

    useEffect(() => {
        const mm = gsap.matchMedia()

        mm.add("(prefers-reduced-motion: no-preference)", () => {
            gsap.to(arrowRef.current, {
                y: BOUNCE_DISTANCE,
                duration: BOUNCE_DURATION,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
            })
        })

        return () => mm.revert()
    }, [])

    useEffect(() => {
        gsap.to(containerRef.current, {
            opacity: visible ? 1 : 0,
            duration: FADE_DURATION,
            ease: "power2.out",
            overwrite: "auto",
        })
    }, [visible])

    return (
        <div
            ref={containerRef}
            // Fixed rather than pinned to the hero: the cue has to hold its
            // place at the foot of the viewport on any hero height, and it is
            // the only thing on screen that should not move as the hero fades.
            className={cn(
                "fixed inset-x-0 bottom-6 z-40 flex justify-center",
                !visible && "pointer-events-none"
            )}
            // Matches the header's approach — the cue is a real button, so
            // hiding it visually has to take it out of the tab order too.
            inert={!visible}
        >
            <button
                type="button"
                onClick={onClick}
                aria-label={label}
                className="rounded-full border border-neon/40 bg-carbon-900/70 p-3 text-neon backdrop-blur-sm transition-colors hover:border-neon hover:bg-neon hover:text-carbon-950"
            >
                <span ref={arrowRef} className="block">
                    <ArrowDownIcon className="h-6 w-6" />
                </span>
            </button>
        </div>
    )
}

export default ScrollCue
