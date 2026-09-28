import { describe, it, expect } from "vitest"
import { getSectionFlowTop, getSectionRestingScrollY } from "./sectionScroll"

// jsdom never lays anything out, so offsetTop/offsetParent are stubbed directly
// rather than produced by a real box model.
function stubOffset(element, top, parent) {
    Object.defineProperty(element, "offsetTop", { value: top, configurable: true })
    Object.defineProperty(element, "offsetParent", { value: parent, configurable: true })
}

describe("getSectionFlowTop", () => {
    it("is the element's own offset when it has no offset parent", () => {
        const el = document.createElement("div")
        stubOffset(el, 120, null)

        expect(getSectionFlowTop(el)).toBe(120)
    })

    it("sums offsets up the whole offsetParent chain", () => {
        const grandparent = document.createElement("div")
        const parent = document.createElement("div")
        const child = document.createElement("div")

        stubOffset(grandparent, 50, null)
        stubOffset(parent, 30, grandparent)
        stubOffset(child, 20, parent)

        expect(getSectionFlowTop(child)).toBe(100)
    })

    it("is unaffected by a transform on the element itself, since it never reads getBoundingClientRect", () => {
        const el = document.createElement("div")
        el.style.transform = "translateY(-999px)"
        stubOffset(el, 200, null)

        expect(getSectionFlowTop(el)).toBe(200)
    })

    it("is 0 for a null element", () => {
        expect(getSectionFlowTop(null)).toBe(0)
    })
})

describe("getSectionRestingScrollY", () => {
    it("is the same value as the flow top", () => {
        const el = document.createElement("div")
        stubOffset(el, 75, null)

        expect(getSectionRestingScrollY(el)).toBe(75)
    })
})
