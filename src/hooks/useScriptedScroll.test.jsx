import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, act } from "@testing-library/react"
import gsap from "gsap"
import { holdScroll } from "../helpers/scrollHold"
import { useScriptedScroll } from "./useScriptedScroll"
import { mockMatchMedia, REDUCE_MOTION_QUERY } from "../test/matchMedia"

// useScriptedScroll's own job is the scroll it drives and what it does with the
// gestures that arrive mid-flight — not GSAP's tweening. Mocking gsap.to lets these
// tests assert on that contract (locked vs. interruptible, reduced motion, the single
// scroll-at-a-time guard) without a real scroll position ever running.
vi.mock("gsap", () => ({
    default: { registerPlugin: vi.fn(), to: vi.fn() },
}))

vi.mock("gsap/ScrollToPlugin", () => ({ default: {} }))

vi.mock("../helpers/scrollHold", () => ({ holdScroll: vi.fn() }))

// A fixed resting position, standing in for the real layout math sectionScroll.js
// already has its own tests for.
vi.mock("../helpers/sectionScroll", () => ({ getSectionRestingScrollY: vi.fn(() => 500) }))

function Harness({ selector, options, onApi }) {
    const api = useScriptedScroll(selector, options)
    onApi(api)
    return null
}

function renderScripted(selector, options) {
    let api
    const utils = render(<Harness selector={selector} options={options} onApi={(value) => { api = value }} />)
    return { ...utils, getApi: () => api }
}

let tween

beforeEach(() => {
    vi.clearAllMocks()
    tween = { isActive: vi.fn(() => false), kill: vi.fn() }
    gsap.to.mockReturnValue(tween)
    holdScroll.mockReturnValue(vi.fn())
    window.matchMedia = mockMatchMedia(null)
    document.body.innerHTML = '<div id="target"></div>'
})

describe("useScriptedScroll", () => {
    it("does nothing when the selector matches no element", () => {
        const { getApi } = renderScripted("#missing")

        act(() => getApi().scrollToTarget())

        expect(gsap.to).not.toHaveBeenCalled()
        expect(getApi().isScrolling).toBe(false)
    })

    it("ignores a second call while its own scroll is still running", () => {
        const { getApi } = renderScripted("#target")

        act(() => getApi().scrollToTarget())
        tween.isActive.mockReturnValue(true)
        act(() => getApi().scrollToTarget())

        expect(gsap.to).toHaveBeenCalledTimes(1)
    })

    it("scrolls to the target's resting position", () => {
        const { getApi } = renderScripted("#target")

        act(() => getApi().scrollToTarget())

        const [, vars] = gsap.to.mock.calls[0]
        expect(vars.scrollTo).toEqual({ y: 500 })
    })

    it("collapses the duration to zero under reduced motion", () => {
        window.matchMedia = mockMatchMedia(REDUCE_MOTION_QUERY)
        const { getApi } = renderScripted("#target", { duration: 2 })

        act(() => getApi().scrollToTarget())

        const [, vars] = gsap.to.mock.calls[0]
        expect(vars.duration).toBe(0)
    })

    it("is scrolling from the moment it starts until the tween completes", () => {
        const { getApi } = renderScripted("#target")

        act(() => getApi().scrollToTarget())
        expect(getApi().isScrolling).toBe(true)

        const [, vars] = gsap.to.mock.calls[0]
        act(() => vars.onComplete())

        expect(getApi().isScrolling).toBe(false)
    })

    it("hands control back to the viewer on a wheel gesture, interruptible by default", () => {
        const { getApi } = renderScripted("#target")

        act(() => getApi().scrollToTarget())
        act(() => window.dispatchEvent(new Event("wheel")))

        expect(tween.kill).toHaveBeenCalledTimes(1)
        expect(getApi().isScrolling).toBe(false)
    })

    it("locked mode holds the scroll instead, and does not hand back on a gesture", () => {
        const release = vi.fn()
        holdScroll.mockReturnValue(release)
        const { getApi } = renderScripted("#target", { locked: true })

        act(() => getApi().scrollToTarget())
        expect(holdScroll).toHaveBeenCalledTimes(1)

        act(() => window.dispatchEvent(new Event("wheel")))

        expect(tween.kill).not.toHaveBeenCalled()
        expect(release).not.toHaveBeenCalled()
        expect(getApi().isScrolling).toBe(true)
    })

    it("releases a locked hold once the tween completes", () => {
        const release = vi.fn()
        holdScroll.mockReturnValue(release)
        const { getApi } = renderScripted("#target", { locked: true })

        act(() => getApi().scrollToTarget())
        const [, vars] = gsap.to.mock.calls[0]
        act(() => vars.onComplete())

        expect(release).toHaveBeenCalledTimes(1)
    })

    it("kills the tween and detaches its listeners on unmount", () => {
        const release = vi.fn()
        holdScroll.mockReturnValue(release)
        const { getApi, unmount } = renderScripted("#target", { locked: true })

        act(() => getApi().scrollToTarget())
        unmount()

        expect(tween.kill).toHaveBeenCalledTimes(1)
        expect(release).toHaveBeenCalledTimes(1)
    })
})
