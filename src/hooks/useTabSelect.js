import { useCallback, useLayoutEffect, useRef } from "react"

// The fade a re-filtered list comes back on. Run from here rather than from CSS: the
// panel stays where it is and only its contents change, so there is nothing for a
// stylesheet to react to.
const FADE_MS = 350
const FADE_EASING = "ease-out"

// Everything a tab row does when its selection changes: currently just the fade that
// covers the swap for a panel that needs it.
//
// `panelRef` is optional, and only for a panel that stays put and swaps its CONTENTS,
// which is what the fade above is for. A row whose panels are separate elements would
// have a flip of its own to animate and would leave it out.
export function useTabSelect(activeTab, setActiveTab, { panelRef } = {}) {
    const selectTab = useCallback((id) => {
        if (id === activeTab) return
        setActiveTab(id)
    }, [activeTab, setActiveTab])

    useTabFade(panelRef, activeTab)

    return { selectTab }
}

// Fades `panelRef` back in from transparent whenever `tabId` changes.
//
// Nothing about that element changes when the tab does, so there's no moment for CSS to
// hang an animation off. Keyed off the committed tab rather than the click above: this
// has to run AFTER React puts the new cards in, and any other route to a new tab should
// still fade.
function useTabFade(panelRef, tabId) {
    const isFirstRun = useRef(true)

    useLayoutEffect(() => {
        const panel = panelRef?.current
        if (!panel) return

        // A switch fades; arriving on the page does not. Otherwise the grid fades itself
        // in on mount, on top of whatever brought the section on screen.
        if (isFirstRun.current) {
            isFirstRun.current = false
            return
        }

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

        // useLayoutEffect is the whole point: it runs after React commits the new cards
        // but before the browser paints them, so opacity is held at 0 in the same frame
        // the content lands. Under useEffect the new list paints at full opacity for one
        // frame — the fade would open with a flash of its subject.
        const fade = panel.animate(
            [{ opacity: 0 }, { opacity: 1 }],
            { duration: FADE_MS, easing: FADE_EASING }
        )

        // Why the Web Animations API: it never writes an inline style, and with fill
        // "none" it stops applying the moment it ends. Clicking through tabs faster than
        // the fade cancels the old one and the panel drops back to the stylesheet's
        // opacity rather than being stranded part-way.
        return () => fade.cancel()
    }, [panelRef, tabId])
}
