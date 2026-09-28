import { describe, it, expect, vi, beforeEach } from "vitest"
import gsap from "gsap"
import { buildSwapTimeline } from "./pageSwap"

// buildSwapTimeline's job is sequencing decisions — what gets animated, in what
// order, overlapping by how much — not GSAP's tweening engine. Mocking gsap.timeline
// lets these tests assert on that contract without a real animation ever running.
const timelineMock = {
    to: vi.fn(),
    fromTo: vi.fn(),
}

vi.mock("gsap", () => ({
    default: { timeline: vi.fn(() => timelineMock) },
}))

beforeEach(() => {
    vi.clearAllMocks()
    timelineMock.to.mockReturnValue(timelineMock)
    timelineMock.fromTo.mockReturnValue(timelineMock)
})

describe("buildSwapTimeline", () => {
    it("builds the timeline with the caller's onComplete", () => {
        const onComplete = vi.fn()
        buildSwapTimeline({ leaving: null, arriving: {}, onComplete })

        expect(gsap.timeline).toHaveBeenCalledWith(expect.objectContaining({ onComplete }))
    })

    it("lifts and fades the leaving section starting at the head of the timeline", () => {
        const leaving = {}
        buildSwapTimeline({ leaving, arriving: {}, onComplete: vi.fn() })

        expect(timelineMock.to).toHaveBeenCalledWith(
            leaving,
            expect.objectContaining({ opacity: 0, duration: 0.55 }),
            0,
        )
    })

    it("skips the leaving animation entirely when there is nothing to lift", () => {
        buildSwapTimeline({ leaving: null, arriving: {}, onComplete: vi.fn() })

        expect(timelineMock.to).not.toHaveBeenCalled()
    })

    it("always brings the arriving page up from below the fold", () => {
        const arriving = {}
        buildSwapTimeline({ leaving: null, arriving, onComplete: vi.fn() })

        expect(timelineMock.fromTo).toHaveBeenCalledWith(
            arriving,
            { yPercent: 100 },
            expect.objectContaining({ yPercent: 0, duration: 0.75 }),
            0.15,
        )
    })

    it("starts the arriving page's rise before the leaving page has finished lifting, so the two overlap", () => {
        buildSwapTimeline({ leaving: {}, arriving: {}, onComplete: vi.fn() })

        const [, leavingOpts] = timelineMock.to.mock.calls[0]
        const [, , arrivingOpts, arrivingStart] = timelineMock.fromTo.mock.calls[0]

        expect(arrivingStart).toBeLessThan(leavingOpts.duration)
        expect(arrivingOpts.duration).toBeGreaterThan(leavingOpts.duration)
    })

    it("returns the timeline itself, so an interrupted swap can kill it", () => {
        const result = buildSwapTimeline({ leaving: null, arriving: {}, onComplete: vi.fn() })

        expect(result).toBe(timelineMock)
    })
})
