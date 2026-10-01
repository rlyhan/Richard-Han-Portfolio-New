import { getLenis } from "../hooks/useLenis"

// The keys the browser scrolls the page with. Lenis owns the wheel and nothing else,
// so a held scroll has to answer for these itself.
const SCROLL_KEYS = new Set([
    "Space", "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End",
])

// Takes the scroll off the viewer until the returned release is called.
//
// For moments the page owns rather than offers: a takeover spending the last of
// a runway, a swap carrying one page out and the next in. Both put the viewer
// somewhere definite, and a gesture through the middle would strand them between
// two pages. See useScriptedScroll, which takes this for its locked mode.
//
// Stopping Lenis closes the wheel — it binds its own listener first and would
// scroll regardless of preventDefault. Touch and the keys are already native, so
// the listeners below cover them too, the wheel included for when Lenis was
// never constructed (reduced motion).
//
// Doesn't touch the body's overflow the way the modal's lock does — that would
// take the scrollbar with it and shift the page sideways.
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
