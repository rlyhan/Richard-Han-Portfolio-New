import { useEffect } from "react"

// Controls where the key already means something. A page-level shortcut must
// not fire on top of a focused control's own behaviour, or both run — a button
// bound to the same key would answer the press twice.
const INTERACTIVE_ELEMENTS = "button, a, input, textarea, select, [contenteditable]"

// Runs `handler` on a bare press of `code`, page-wide, and only while `enabled`
// — the listener is not even bound otherwise, so a shortcut that has stopped
// applying cannot intercept the key.
//
// Deliberately narrow about what counts as a press: a held key is the browser
// doing its own repeat, and any modifier makes it a different shortcut
// altogether. The default is prevented, so the key's native behaviour does not
// run alongside the handler.
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
