import { describe, it, expect, vi, beforeEach } from "vitest"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { buildExitTimeline, buildIncomingRiseTween, buildTakeoverTrigger, getLandingScroll } from "./handoff"

// buildExitTimeline/buildTakeoverTrigger/buildIncomingRiseTween are the trigger
// wiring every handoff shares — the range each is measured against, and the guards
// that keep the takeover from firing over another scripted scroll or past where
// there's anything left to hand over. Mocking gsap/ScrollTrigger lets these tests
// assert on that wiring without a real scroll position or a real timeline.
const timelineMock = { to: vi.fn() }

vi.mock("gsap", () => ({
    default: {
        registerPlugin: vi.fn(),
        timeline: vi.fn(() => timelineMock),
        fromTo: vi.fn(),
        isTweening: vi.fn(() => false),
    },
}))

vi.mock("gsap/ScrollTrigger", () => ({
    default: { config: vi.fn(), maxScroll: vi.fn(), create: vi.fn() },
}))

function stubOffset(element, top) {
    Object.defineProperty(element, "offsetTop", { value: top, configurable: true })
    Object.defineProperty(element, "offsetParent", { value: null, configurable: true })
}

beforeEach(() => {
    vi.clearAllMocks()
    timelineMock.to.mockReturnValue(timelineMock)
    window.scrollY = 0
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

describe("buildExitTimeline", () => {
    it("scrubs the timeline against the runway, over the caller's range", () => {
        const runway = {}
        const range = vi.fn(() => ({ start: 10, end: 200 }))

        buildExitTimeline({ runway, range, scrub: 1, invalidateOnRefresh: true })

        const [config] = gsap.timeline.mock.calls[0]
        expect(config.scrollTrigger).toMatchObject({ trigger: runway, scrub: 1, invalidateOnRefresh: true })
        expect(config.scrollTrigger.start()).toBe(10)
        expect(config.scrollTrigger.end()).toBe(200)
        expect(range).toHaveBeenCalledTimes(2)
    })

    it("pins the timeline to unit length, so a position inside it is a fraction of the range", () => {
        buildExitTimeline({ runway: {}, range: () => ({ start: 0, end: 1 }), scrub: 1 })

        expect(timelineMock.to).toHaveBeenCalledWith({}, { duration: 1 }, 0)
    })

    it("returns the timeline, so a caller can add its own fades to it", () => {
        const result = buildExitTimeline({ runway: {}, range: () => ({ start: 0, end: 1 }), scrub: 1 })

        expect(result).toBe(timelineMock)
    })
})

describe("buildTakeoverTrigger", () => {
    function buildAndFireOnEnter(overrides = {}) {
        buildTakeoverTrigger({
            runway: {},
            start: 0,
            landing: vi.fn(() => 1000),
            advance: vi.fn(),
            ...overrides,
        })

        const [config] = ScrollTrigger.create.mock.calls[0]
        config.onEnter()
        return config
    }

    it("triggers off the runway, ending where the incoming page comes to rest", () => {
        const runway = {}
        const landing = vi.fn(() => 1000)

        buildTakeoverTrigger({ runway, start: 42, landing, advance: vi.fn() })

        const [config] = ScrollTrigger.create.mock.calls[0]
        expect(config).toMatchObject({ trigger: runway, start: 42, end: landing })
    })

    it("hands the scroll to the advance once the runway is crossed", () => {
        const advance = vi.fn()
        buildAndFireOnEnter({ advance })

        expect(advance).toHaveBeenCalledTimes(1)
    })

    it("never advances over the top of another scripted scroll already tweening the window", () => {
        vi.mocked(gsap.isTweening).mockReturnValue(true)
        const advance = vi.fn()

        buildAndFireOnEnter({ advance })

        expect(advance).not.toHaveBeenCalled()
    })

    it("never advances once a hard flick has already cleared the landing", () => {
        const advance = vi.fn()
        window.scrollY = 1000

        buildAndFireOnEnter({ advance, landing: () => 1000 })

        expect(advance).not.toHaveBeenCalled()
    })
})

describe("buildIncomingRiseTween", () => {
    it("carries the incoming section in on a trigger scrubbed against the runway", () => {
        const incoming = "#about"
        const runway = {}
        const start = () => 10
        const end = () => 400

        buildIncomingRiseTween({ incoming, runway, start, end })

        const [target, from, to] = gsap.fromTo.mock.calls[0]
        expect(target).toBe(incoming)
        expect(from).toEqual({ y: expect.any(Function) })
        expect(to).toMatchObject({
            y: 0,
            scrollTrigger: { trigger: runway, start, end, scrub: 1, invalidateOnRefresh: true },
        })
    })

    it("starts the incoming section a share of the viewport below its resting place", () => {
        window.innerHeight = 800

        buildIncomingRiseTween({ incoming: "#about", runway: {}, start: () => 0, end: () => 1 })

        const [, from] = gsap.fromTo.mock.calls[0]
        expect(from.y()).toBeCloseTo(800 * 0.12)
    })
})
