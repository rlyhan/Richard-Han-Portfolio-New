import { useSyncExternalStore } from "react"

const DARK_QUERY = "(prefers-color-scheme: dark)"

// Read before first paint by the inline script in index.html, under the same key.
const STORAGE_KEY = "theme"

// The scheme lives on <html> rather than in React state: the inline script sets it
// before the app exists, and every copy of the nav bar has to agree on it.
const subscribe = (onChange) => {
    const media = window.matchMedia(DARK_QUERY)
    const observer = new MutationObserver(onChange)

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
    })
    media.addEventListener("change", onChange)

    return () => {
        observer.disconnect()
        media.removeEventListener("change", onChange)
    }
}

const getScheme = () =>
    document.documentElement.dataset.theme ??
    (window.matchMedia(DARK_QUERY).matches ? "dark" : "light")

export function useColorScheme() {
    const scheme = useSyncExternalStore(subscribe, getScheme)

    const toggleScheme = () => {
        const next = scheme === "dark" ? "light" : "dark"
        document.documentElement.dataset.theme = next
        try {
            localStorage.setItem(STORAGE_KEY, next)
        } catch {
            // Storage blocked: the choice still holds for this visit.
        }
    }

    return [scheme, toggleScheme]
}
