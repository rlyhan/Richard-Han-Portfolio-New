import { useLayoutEffect, useRef } from "react"

// The same fade the CSS `tab-fade-in` keyframe runs — keep the two in step by
// hand (tailwind.config.js), since a keyframe can't read a value from here.
const FADE_MS = 350
const FADE_EASING = "ease-out"

// Fades `panelRef` back in from transparent whenever `tabId` changes.
//
// For a panel that stays put and swaps its CONTENTS — the projects grid
// re-filtering one list. Tabs/TabContent doesn't need this: its panels are
// separate elements that swap via `display`, and that flip restarts a CSS
// animation on its own.
//
// Nothing about this element changes when the tab does, so there is no moment
// for CSS to hang an animation off and something has to say "replay now". It
// keys off the tab rather than off the click because the state change is the
// real event: clicking the tab you are already on is a no-op React skips
// entirely, and any other route to a new tab still fades.
export function useTabFade(panelRef, tabId) {
    const isFirstRun = useRef(true)

    useLayoutEffect(() => {
        const panel = panelRef.current
        if (!panel) return

        // A switch fades; arriving on the page does not. Without this the grid
        // fades itself in on mount, a second unasked-for entrance on top of
        // whatever brought the section on screen.
        if (isFirstRun.current) {
            isFirstRun.current = false
            return
        }

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

        // useLayoutEffect rather than useEffect, and this is the whole reason:
        // it runs after React commits the new cards but BEFORE the browser
        // paints them, so the animation's first frame holds opacity at 0 in the
        // same frame the new content lands. Under useEffect the new list paints
        // at full opacity for one frame first — the fade would open with a flash
        // of the very thing it is meant to be revealing.
        const fade = panel.animate(
            [{ opacity: 0 }, { opacity: 1 }],
            { duration: FADE_MS, easing: FADE_EASING }
        )

        // No cleanup of the element itself needed, which is the point of doing
        // this with the Web Animations API: the animation never writes an inline
        // style, and with the default fill of "none" it stops applying the
        // moment it ends. Clicking through tabs faster than the fade cancels the
        // old one, and the panel drops straight back to the stylesheet's opacity
        // rather than being stranded part-way.
        return () => fade.cancel()
    }, [panelRef, tabId])
}
