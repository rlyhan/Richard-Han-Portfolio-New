import { useLayoutEffect, useRef } from "react"

// The same fade the CSS `tab-fade-in` keyframe runs — keep the two in step by
// hand (tailwind.config.js), since a keyframe can't read a value from here.
const FADE_MS = 350
const FADE_EASING = "ease-out"

// Fades `panelRef` back in from transparent whenever `tabId` changes.
//
// For a panel that stays put and swaps its CONTENTS — the projects grid
// re-filtering one list. Tabs/TabContent doesn't need it: its panels are separate
// elements swapped via `display`, and that flip restarts a CSS animation itself.
//
// Nothing about this element changes when the tab does, so there's no moment for
// CSS to hang an animation off. Keyed off the tab, not the click: re-clicking the
// active tab is a no-op React skips, and any other route to a new tab still fades.
export function useTabFade(panelRef, tabId) {
    const isFirstRun = useRef(true)

    useLayoutEffect(() => {
        const panel = panelRef.current
        if (!panel) return

        // A switch fades; arriving on the page does not. Otherwise the grid fades
        // itself in on mount, on top of whatever brought the section on screen.
        if (isFirstRun.current) {
            isFirstRun.current = false
            return
        }

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

        // useLayoutEffect is the whole point: it runs after React commits the new
        // cards but before the browser paints them, so opacity is held at 0 in the
        // same frame the content lands. Under useEffect the new list paints at full
        // opacity for one frame — the fade would open with a flash of its subject.
        const fade = panel.animate(
            [{ opacity: 0 }, { opacity: 1 }],
            { duration: FADE_MS, easing: FADE_EASING }
        )

        // Why the Web Animations API: it never writes an inline style, and with
        // fill "none" it stops applying the moment it ends. Clicking through tabs
        // faster than the fade cancels the old one and the panel drops back to the
        // stylesheet's opacity rather than being stranded part-way.
        return () => fade.cancel()
    }, [panelRef, tabId])
}
