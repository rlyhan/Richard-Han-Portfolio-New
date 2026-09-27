import { getLenis } from "../hooks/useLenis"

// The keys the browser scrolls the page with. Lenis owns the wheel and nothing else,
// so a held scroll has to answer for these itself.
const SCROLL_KEYS = new Set([
    "Space", "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End",
])

// Takes the scroll off the viewer until the returned release is called.
//
// For the moments the page owns rather than offers: a takeover spending the last of a
// runway, a swap carrying one page out and the next one in. Both put the viewer
// somewhere definite, and a gesture through the middle of either would strand them
// between two pages.
//
// Stopping Lenis is what closes the wheel, not preventing the event — Lenis binds its
// own listener first and would scroll regardless. Touch is native (syncTouch is off)
// and so are the keys, hence the listeners below, the wheel among them for the
// reduced-motion case where Lenis was never constructed.
//
// Nothing here touches the body's overflow the way the modal's lock does: that would
// take the scrollbar with it and shift the page sideways as it goes.
export function holdScroll() {
    const swallow = (event) => event.preventDefault()
    const onKeyDown = (event) => {
        if (SCROLL_KEYS.has(event.code)) event.preventDefault()
    }

    getLenis()?.stop()

    window.addEventListener("wheel", swallow, { passive: false })
    window.addEventListener("touchmove", swallow, { passive: false })
    window.addEventListener("keydown", onKeyDown)

    return () => {
        window.removeEventListener("wheel", swallow)
        window.removeEventListener("touchmove", swallow)
        window.removeEventListener("keydown", onKeyDown)
        getLenis()?.start()
    }
}
