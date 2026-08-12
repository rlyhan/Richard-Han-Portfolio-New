import { useCallback, useEffect, useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import ScrollToPlugin from "gsap/ScrollToPlugin"
import { getSectionRestingScrollY } from "../helpers/sectionScroll"

gsap.registerPlugin(ScrollToPlugin)

// Short: the row is usually already on screen when it's clicked, so this is a
// correction rather than a journey. Long enough that the page is seen to move — a jump
// reads as the layout breaking under the click.
const SELECT_SCROLL_DURATION = 0.7

// Breathing room between the header bar and the row it lands under, in px.
const ROW_LANDING_GAP = 24

// The same fade the CSS `tab-fade-in` keyframe runs — keep the two in step by hand
// (tailwind.config.js), since a keyframe can't read a value from here.
const FADE_MS = 350
const FADE_EASING = "ease-out"

// Everything a tab row does when its selection changes: the scroll that repositions the
// page, and — for rows that need it — the fade that covers the swap.
//
// Both tab rows on the page route their buttons through `selectTab` and attach `rowRef`
// to the row, though they're built differently: About goes through Tabs, Projects lays
// its own row out beside the display-mode buttons and keeps the active id in its own
// state.
//
// `panelRef` is optional, and only for a panel that stays put and swaps its CONTENTS —
// the projects grid re-filtering one list. Tabs/TabContent omits it: its panels are
// separate elements swapped via `display`, and that flip restarts a CSS animation
// itself.
export function useTabSelect(activeTab, setActiveTab, { panelRef } = {}) {
    const rowRef = useRef(null)
    const tweenRef = useRef(null)

    // Unmounting mid-scroll must not leave a tween writing to the window.
    useEffect(() => () => tweenRef.current?.kill(), [])

    // A switch replaces everything below the row, and the panel arriving is as likely to
    // be taller as shorter than the one it replaced. Left where it was, the viewer is
    // dropped into the middle of content they haven't seen the start of — so the row
    // comes back to the top of the viewport and the panel opens beneath it.
    const scrollToRow = useCallback(() => {
        const row = rowRef.current
        if (!row) return

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

        // A second click mid-flight retargets rather than racing: two tweens on the
        // window scroll fight for the same property every frame.
        tweenRef.current?.kill()
        tweenRef.current = gsap.to(window, {
            duration: prefersReducedMotion ? 0 : SELECT_SCROLL_DURATION,
            ease: "power2.out",
            // The landing the nav items and cues use, plus the gap above, and off the
            // flow position rather than the live box: both rows sit inside a section's
            // park, which displaces them by up to the runway's height, and a measured
            // box would aim at wherever the hold had carried it.
            //
            // Clamped again after the gap comes off — the resting position is already
            // clamped at the top of the page, and this would take it past.
            scrollTo: { y: Math.max(getSectionRestingScrollY(row) - ROW_LANDING_GAP, 0) },
        })
    }, [])

    // Measured now, before the swap, but the row sits above the panel — only what is
    // below it changes height, so its position is the same either side of the switch.
    const selectTab = useCallback((id) => {
        if (id === activeTab) return
        setActiveTab(id)
        scrollToRow()
    }, [activeTab, setActiveTab, scrollToRow])

    useTabFade(panelRef, activeTab)

    return { rowRef, selectTab }
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
