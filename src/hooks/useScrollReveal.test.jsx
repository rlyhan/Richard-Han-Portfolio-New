import { useRef } from "react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render } from "@testing-library/react"
import { useScrollReveal } from "./useScrollReveal"
import { mockMatchMedia } from "../test/matchMedia"

const NO_PREFERENCE_QUERY = "(prefers-reduced-motion: no-preference)"

// useScrollReveal's own job is the decision taken at build time — which items count
// as a row, whether a row is already past the reveal line and left alone, and
// whether a layout has rows to stagger at all or is one item deep and gets a single
// pass instead. The tweens themselves are GSAP's, mocked out so these tests can
// assert on that decision without a real layout or a real scroll position.
//
// gsap.matchMedia's real contract: `.add(query, setup)` runs `setup()` once, right
// away, only if `query` currently matches, and calls whatever `setup` returned when
// `.revert()` runs — modeled the same way useHandoff's own tests model it.
function createMatchMediaMock() {
    return () => {
        const instance = { cleanups: [] }
        instance.add = vi.fn((query, setup) => {
            if (window.matchMedia(query).matches) instance.cleanups.push(setup())
        })
        instance.revert = vi.fn(() => {
            instance.cleanups.forEach((cleanup) => cleanup?.())
            instance.cleanups = []
        })
        return instance
    }
}

vi.mock("gsap", () => ({
    default: {
        registerPlugin: vi.fn(),
        matchMedia: vi.fn(),
        fromTo: vi.fn(),
        utils: { toArray: (list) => Array.from(list) },
    },
}))

vi.mock("gsap/ScrollTrigger", () => ({
    default: { refresh: vi.fn() },
}))

// getBoundingClientRect and offsetParent are what the hook reads a row's position
// and visibility from — jsdom never lays anything out, so both are stubbed directly,
// the same way sectionScroll.test.js stubs offsetTop.
function stubItem(item, { top, visible = true }) {
    item.getBoundingClientRect = () => ({ top })
    Object.defineProperty(item, "offsetParent", { value: visible ? document.body : null, configurable: true })
}

function buildContainer(specs) {
    const container = document.createElement("div")
    const items = specs.map(({ top, visible }) => {
        const item = document.createElement("div")
        item.setAttribute("data-reveal", "")
        stubItem(item, { top, visible })
        container.appendChild(item)
        return item
    })
    return { container, items }
}

function Harness({ container, revealKey, options }) {
    const containerRef = useRef(container)
    useScrollReveal(containerRef, revealKey, options)
    return null
}

function renderReveal(container, { revealKey, options } = {}) {
    return render(<Harness container={container} revealKey={revealKey} options={options} />)
}

let gsap

beforeEach(async () => {
    vi.clearAllMocks()
    window.innerHeight = 800
    window.matchMedia = mockMatchMedia(NO_PREFERENCE_QUERY)
    gsap = (await import("gsap")).default
    gsap.matchMedia.mockImplementation(createMatchMediaMock())
})

describe("useScrollReveal", () => {
    it("builds nothing while disabled, leaving items at rest", () => {
        const { container } = buildContainer([{ top: 900 }])

        renderReveal(container, { options: { enabled: false } })

        expect(gsap.matchMedia).not.toHaveBeenCalled()
        expect(gsap.fromTo).not.toHaveBeenCalled()
    })

    it("builds nothing when the container has no revealable items", () => {
        const container = document.createElement("div")

        renderReveal(container)

        expect(gsap.fromTo).not.toHaveBeenCalled()
    })

    it("excludes a hidden item from consideration", () => {
        const { container } = buildContainer([{ top: 900, visible: false }])

        renderReveal(container)

        expect(gsap.fromTo).not.toHaveBeenCalled()
    })

    it("reveals a one-item-per-row layout as a single stack, not a sequence of rows", () => {
        const { container, items } = buildContainer([{ top: 900 }, { top: 1000 }, { top: 1100 }])

        renderReveal(container)

        expect(gsap.fromTo).toHaveBeenCalledTimes(1)
        const [targets] = gsap.fromTo.mock.calls[0]
        expect(targets).toEqual(items)
    })

    it("reveals a multi-item row together, on its own trigger", () => {
        const { container, items } = buildContainer([{ top: 900 }, { top: 900 }])

        renderReveal(container)

        expect(gsap.fromTo).toHaveBeenCalledTimes(1)
        const [targets, , vars] = gsap.fromTo.mock.calls[0]
        expect(targets).toEqual(items)
        expect(vars.stagger).toBeDefined()
    })

    it("leaves a row already above the reveal line alone", () => {
        const { container } = buildContainer([{ top: 10 }])

        renderReveal(container)

        expect(gsap.fromTo).not.toHaveBeenCalled()
    })

    it("builds only the rows still below the reveal line, in a multi-row layout", () => {
        const { container, items } = buildContainer([
            { top: 10 }, // one row, already past the line
            { top: 900 }, { top: 900 }, // a second row, still below it
        ])

        renderReveal(container)

        expect(gsap.fromTo).toHaveBeenCalledTimes(1)
        const [targets] = gsap.fromTo.mock.calls[0]
        expect(targets).toEqual([items[1], items[2]])
    })

    it("passes duration, stagger and lift through to the row it builds", () => {
        const { container } = buildContainer([{ top: 900 }, { top: 900 }])

        renderReveal(container, { options: { duration: 1, stagger: 0.2, lift: 30 } })

        const [, from, vars] = gsap.fromTo.mock.calls[0]
        expect(from).toMatchObject({ opacity: 0, y: 30 })
        expect(vars).toMatchObject({ duration: 1, stagger: 0.2 })
    })

    it("rebuilds when revealKey changes, tearing the old reveal down first", () => {
        const { container } = buildContainer([{ top: 900 }])
        const { rerender } = renderReveal(container, { revealKey: "a" })

        const firstInstance = gsap.matchMedia.mock.results[0].value

        rerender(<Harness container={container} revealKey="b" />)

        expect(firstInstance.revert).toHaveBeenCalledTimes(1)
        expect(gsap.matchMedia).toHaveBeenCalledTimes(2)
    })

    it("tears the reveal down on unmount", () => {
        const { container } = buildContainer([{ top: 900 }])
        const { unmount } = renderReveal(container)

        const instance = gsap.matchMedia.mock.results[0].value
        unmount()

        expect(instance.revert).toHaveBeenCalledTimes(1)
    })
})
