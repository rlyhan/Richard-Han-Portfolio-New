import { afterEach } from "vitest"
import { cleanup } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"

afterEach(() => cleanup())

// jsdom has neither of these. Several effects under test schedule work with them, so a
// polyfill has to exist before any module under test loads, same as matchMedia below.
if (typeof window.requestAnimationFrame !== "function") {
    window.requestAnimationFrame = (callback) => setTimeout(() => callback(performance.now()), 0)
    window.cancelAnimationFrame = (id) => clearTimeout(id)
}

// jsdom has no matchMedia implementation at all. Everything in this codebase that
// reads `prefers-reduced-motion` calls this, so a default has to exist before any
// module under test loads — individual tests override it to flip the preference.
if (!window.matchMedia) {
    window.matchMedia = (query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
    })
}
