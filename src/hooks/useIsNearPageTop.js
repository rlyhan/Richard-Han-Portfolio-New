import { useEffect, useState } from "react"

// True while the page is scrolled within `threshold` pixels of the top.
//
// Reads are batched into a frame so the scroll handler itself never touches
// layout, and the position is sampled once on mount as well: a reload part-way
// down the page restores its scroll position without firing a scroll event.
export function useIsNearPageTop(threshold) {
    const [isNearPageTop, setIsNearPageTop] = useState(true)

    useEffect(() => {
        let frame = null

        const measure = () => {
            frame = null
            // Clamped, because overscroll can report a negative scrollY.
            setIsNearPageTop(Math.max(window.scrollY, 0) < threshold)
        }

        const onScroll = () => {
            if (frame === null) frame = requestAnimationFrame(measure)
        }

        window.addEventListener("scroll", onScroll, { passive: true })
        measure()

        return () => {
            window.removeEventListener("scroll", onScroll)
            if (frame !== null) cancelAnimationFrame(frame)
        }
    }, [threshold])

    return isNearPageTop
}
