import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useScriptedScroll } from "./useScriptedScroll"
import { holdScroll } from "../helpers/scrollHold"
import { getSectionRestingScrollY } from "../helpers/sectionScroll"
import gsap from "gsap"
import { mockMatchMedia, REDUCE_MOTION_QUERY } from "../test/matchMedia"

// The tween itself is GSAP's; what belongs to this hook is which mode a scroll runs
// in (interruptible vs. locked), what stops it early, and that it never doubles up
// or leaks a listener. Mocking gsap.to lets these tests drive that without a real
// animation ever running.
vi.mock("gsap", () => ({
    default: { registerPlugin: vi.fn(), to: vi.fn() },
}))

vi.mock("gsap/ScrollToPlugin", () => ({ default: {} }))

vi.mock("../helpers/scrollHold", () => ({
    holdScroll: vi.fn(),
}))

vi.mock("../helpers/sectionScroll", () => ({
    getSectionRestingScrollY: vi.fn(() => 500),
}))

let target
let tween

beforeEach(() => {
    vi.clearAllMocks()
    window.matchMedia = mockMatchMedia(null)
    holdScroll.mockReturnValue(vi.fn())

    target = document.createElement("div")
    target.id = "target-section"
    document.body.appendChild(target)

    tween = { isActive: vi.fn(() => false), kill: vi.fn() }
    gsap.to.mockImplementation((_target, config) => {
        tween.config = config
        return tween
    })
})

afterEach(() => {
    target.remove()
})

describe("useScriptedScroll", () => {
    it("does nothing when the selector matches no element", () => {
        const { result } = renderHook(() => useScriptedScroll("#missing"))

        act(() => result.current.scrollToTarget())

        expect(gsap.to).not.toHaveBeenCalled()
        expect(result.current.isScrolling).toBe(false)
    })

    it("tweens the window to the section's resting position and reports isScrolling", () => {
        const { result } = renderHook(() => useScriptedScroll("#target-section"))

        act(() => result.current.scrollToTarget())

        expect(gsap.to).toHaveBeenCalledWith(
            window,
            expect.objectContaining({ scrollTo: { y: 500 }, duration: 2.4 }),
        )
        expect(getSectionRestingScrollY).toHaveBeenCalledWith(target)
        expect(result.current.isScrolling).toBe(true)
    })

    it("runs at zero duration under reduced motion, rather than skipping the scroll", () => {
        window.matchMedia = mockMatchMedia(REDUCE_MOTION_QUERY)
        const { result } = renderHook(() => useScriptedScroll("#target-section"))

        act(() => result.current.scrollToTarget())

        expect(gsap.to).toHaveBeenCalledWith(window, expect.objectContaining({ duration: 0 }))
    })

    it("ignores a second call while the current tween is still active", () => {
        tween.isActive.mockReturnValue(true)
        const { result } = renderHook(() => useScriptedScroll("#target-section"))

        act(() => result.current.scrollToTarget())
        act(() => result.current.scrollToTarget())

        expect(gsap.to).toHaveBeenCalledTimes(1)
    })

    it("hands control back the moment the viewer scrolls, when interruptible", () => {
        const { result } = renderHook(() => useScriptedScroll("#target-section"))

        act(() => result.current.scrollToTarget())
        expect(holdScroll).not.toHaveBeenCalled()

        act(() => window.dispatchEvent(new Event("wheel")))

        expect(tween.kill).toHaveBeenCalledTimes(1)
        expect(result.current.isScrolling).toBe(false)
    })

    it("locks the scroll instead of handing it back, when locked", () => {
        const { result } = renderHook(() => useScriptedScroll("#target-section", { locked: true }))

        act(() => result.current.scrollToTarget())

        expect(holdScroll).toHaveBeenCalledTimes(1)

        act(() => window.dispatchEvent(new Event("wheel")))

        // Locked mode swallows the gesture via holdScroll rather than killing the
        // tween on it — a flick partway through a takeover must not cut it short.
        expect(tween.kill).not.toHaveBeenCalled()
        expect(result.current.isScrolling).toBe(true)
    })

    it("passes a caller-supplied duration through to the tween", () => {
        const { result } = renderHook(() => useScriptedScroll("#target-section", { locked: true, duration: 1.2 }))

        act(() => result.current.scrollToTarget())

        expect(gsap.to).toHaveBeenCalledWith(window, expect.objectContaining({ duration: 1.2 }))
    })

    it("finishes and releases the hold when the tween completes on its own", () => {
        const release = vi.fn()
        holdScroll.mockReturnValue(release)
        const { result } = renderHook(() => useScriptedScroll("#target-section", { locked: true }))

        act(() => result.current.scrollToTarget())
        act(() => tween.config.onComplete())

        expect(release).toHaveBeenCalledTimes(1)
        expect(result.current.isScrolling).toBe(false)
    })

    it("finishes and releases the hold when the tween is interrupted from elsewhere", () => {
        const release = vi.fn()
        holdScroll.mockReturnValue(release)
        const { result } = renderHook(() => useScriptedScroll("#target-section", { locked: true }))

        act(() => result.current.scrollToTarget())
        act(() => tween.config.onInterrupt())

        expect(release).toHaveBeenCalledTimes(1)
        expect(result.current.isScrolling).toBe(false)
    })

    it("kills the tween and detaches its listeners on unmount", () => {
        const release = vi.fn()
        holdScroll.mockReturnValue(release)
        const { result, unmount } = renderHook(() => useScriptedScroll("#target-section", { locked: true }))

        act(() => result.current.scrollToTarget())
        unmount()

        expect(tween.kill).toHaveBeenCalledTimes(1)
        expect(release).toHaveBeenCalledTimes(1)
    })
})
