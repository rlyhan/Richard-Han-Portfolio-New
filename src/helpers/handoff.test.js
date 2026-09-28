import { describe, it, expect, vi, beforeEach } from "vitest"
import ScrollTrigger from "gsap/ScrollTrigger"
import { getLandingScroll } from "./handoff"

vi.mock("gsap", () => ({
    default: { registerPlugin: vi.fn() },
}))

vi.mock("gsap/ScrollTrigger", () => ({
    default: { config: vi.fn(), maxScroll: vi.fn() },
}))

function stubOffset(element, top) {
    Object.defineProperty(element, "offsetTop", { value: top, configurable: true })
    Object.defineProperty(element, "offsetParent", { value: null, configurable: true })
}

beforeEach(() => {
    vi.clearAllMocks()
})

describe("getLandingScroll", () => {
    it("lands at the section's resting position when the document scrolls that far", () => {
        const section = document.createElement("div")
        stubOffset(section, 500)
        ScrollTrigger.maxScroll.mockReturnValue(10000)

        expect(getLandingScroll(section)).toBe(500)
    })

    it("is capped at the document's maximum scroll, so a short viewport can still reach it", () => {
        const section = document.createElement("div")
        stubOffset(section, 5000)
        ScrollTrigger.maxScroll.mockReturnValue(800)

        expect(getLandingScroll(section)).toBe(800)
    })
})
