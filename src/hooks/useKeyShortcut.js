import { useEffect } from "react"

// Where the key already means something: a page-level shortcut mustn't fire on
// top of a focused control's own behaviour, or a button bound to the same key
// answers the press twice.
const INTERACTIVE_ELEMENTS = "button, a, input, textarea, select, [contenteditable]"

// Runs `handler` on a bare press of `code`, page-wide, and only while `enabled` —
// the listener isn't bound otherwise, so a shortcut that no longer applies can't
// intercept the key.
//
// Narrow about what counts as a press: a held key is the browser's own repeat, and
// any modifier makes it a different shortcut. The default is prevented.
//
// `handler` should be stable (useCallback), or the listener rebinds each render.
export function useKeyShortcut(code, handler, { enabled = true } = {}) {
    useEffect(() => {
        if (!enabled) return

        const onKeyDown = (event) => {
            if (event.code !== code || event.repeat) return
            if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return
            if (event.target.closest?.(INTERACTIVE_ELEMENTS)) return

            event.preventDefault()
            handler()
        }

        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [code, handler, enabled])
}
