import { useEffect, useRef } from "react"
import cn from "classnames"
import gsap from "gsap"
import ArrowDownIcon from "../../icons/ArrowDownIcon"

const BOUNCE_DISTANCE = 10
const BOUNCE_DURATION = 0.9
const FADE_DURATION = 0.35

// The cue sits on whichever section it is handing the viewer out of, and the two
// grounds on the page are opposites — hence a tone rather than one fixed palette.
// The focus ring comes with it: the page's neon default is all but invisible on the
// light ground, so that tone overrides the outline colour too.
const TONE_CLASSES = {
    neon: "border-neon/40 bg-carbon-900/70 text-neon hover:border-neon hover:bg-neon hover:text-carbon-950",
    ink: "border-ink/30 bg-cream/80 text-ink hover:border-ink hover:bg-ink hover:text-cream focus-visible:outline-ink",
}

// A floating hint at the foot of the hero, handing the viewer into the next section.
// The bounce lives on an inner element so the infinite y tween and the visibility
// fade never write to the same target.
//
// `positionClassName` is how far up from the foot of the viewport it sits: the
// default clears nothing in particular, and a section with its own furniture down
// there raises it.
const ScrollCue = ({
    onClick,
    visible,
    label = "Scroll to the About section",
    tone = "neon",
    positionClassName = "bottom-6",
}) => {
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
            // Fixed rather than pinned to the hero: it holds the foot of the viewport
            // at any hero height, and is the one thing that shouldn't move as the
            // hero fades.
            className={cn(
                "fixed inset-x-0 z-40 flex justify-center",
                positionClassName,
                !visible && "pointer-events-none"
            )}
            // As in the header: a real button, so hiding it visually has to take it
            // out of the tab order too.
            inert={!visible}
        >
            <button
                type="button"
                onClick={onClick}
                aria-label={label}
                className={cn(
                    "rounded-full border p-3 backdrop-blur-sm transition-colors",
                    TONE_CLASSES[tone]
                )}
            >
                <span ref={arrowRef} className="block">
                    <ArrowDownIcon className="h-6 w-6" />
                </span>
            </button>
        </div>
    )
}

export default ScrollCue
