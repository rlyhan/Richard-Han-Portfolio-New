import { useRef } from "react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render } from "@testing-library/react"
import { useHandoff } from "./useHandoff"
import { buildIncomingRiseTween, buildTakeoverTrigger } from "../helpers/handoff"
import { useScriptedScroll } from "./useScriptedScroll"
import { mockMatchMedia, REDUCE_MOTION_QUERY } from "../test/matchMedia"

const NO_PREFERENCE_QUERY = "(prefers-reduced-motion: no-preference)"

// Only the sequencing decisions here are useHandoff's own: what gets built when,
// gated on motion preference and on the next page actually being staged. The
// triggers and tweens themselves are GSAP/ScrollTrigger's, mocked out so a real
// scroll position is never needed to exercise the wiring.
vi.mock("../helpers/handoff", () => ({
    ADVANCE_DURATION: 1.2,
    buildIncomingRiseTween: vi.fn(),
    buildTakeoverTrigger: vi.fn(),
    getLandingScroll: vi.fn(() => 0),
}))

vi.mock("./useScriptedScroll", () => ({
    useScriptedScroll: vi.fn(),
}))

// gsap.matchMedia's real contract: `.add(query, setup)` runs `setup()` once, right
// away, only if `query` currently matches, and calls whatever `setup` returned when
// `.revert()` runs. Modeled just far enough for these tests, which never change the
// preference mid-test.
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
    default: { matchMedia: vi.fn() },
}))

let interruptible
let locked

function Harness({ isNextStaged, nextSelector, getExitRange, buildExit, onApi }) {
    const runwayRef = useRef(document.createElement("div"))
    const api = useHandoff({ runwayRef, nextSelector, isNextStaged, getExitRange, buildExit })
    onApi(api)
    return null
}

function renderHandoff(props) {
    let api
    const utils = render(<Harness {...props} onApi={(value) => { api = value }} />)
    return { ...utils, getApi: () => api }
}

beforeEach(async () => {
    vi.clearAllMocks()
    window.matchMedia = mockMatchMedia(NO_PREFERENCE_QUERY)

    const gsap = (await import("gsap")).default
    gsap.matchMedia.mockImplementation(createMatchMediaMock())

    interruptible = { scrollToTarget: vi.fn(), isScrolling: false }
    locked = { scrollToTarget: vi.fn(), isScrolling: false }
    vi.mocked(useScriptedScroll).mockImplementation((_selector, options) =>
        options?.locked ? locked : interruptible,
    )
})

describe("useHandoff", () => {
    it("builds the exit on mount when motion is not reduced", () => {
        const getExitRange = vi.fn(() => ({ start: 0, end: 100 }))
        const buildExit = vi.fn(() => 0.5)

        renderHandoff({ isNextStaged: false, nextSelector: "#about", getExitRange, buildExit })

        expect(buildExit).toHaveBeenCalledTimes(1)
        const { runway, range } = buildExit.mock.calls[0][0]
        expect(runway).toBeInstanceOf(HTMLElement)
        expect(range()).toEqual({ start: 0, end: 100 })
    })

    it("never builds the exit under reduced motion", () => {
        window.matchMedia = mockMatchMedia(REDUCE_MOTION_QUERY)
        const buildExit = vi.fn(() => 0.5)

        renderHandoff({ isNextStaged: false, nextSelector: "#about", getExitRange: vi.fn(), buildExit })

        expect(buildExit).not.toHaveBeenCalled()
    })

    it("does not build the incoming rise or the takeover until the next page is staged", () => {
        renderHandoff({
            isNextStaged: false,
            nextSelector: "#about",
            getExitRange: vi.fn(() => ({ start: 0, end: 100 })),
            buildExit: vi.fn(() => 0.5),
        })

        expect(buildIncomingRiseTween).not.toHaveBeenCalled()
        expect(buildTakeoverTrigger).not.toHaveBeenCalled()
    })

    it("builds the incoming rise and the takeover once the next page is staged", () => {
        const { rerender } = render(
            <Harness
                isNextStaged={false}
                nextSelector="#about"
                getExitRange={() => ({ start: 0, end: 100 })}
                buildExit={() => 0.5}
                onApi={() => {}}
            />,
        )

        rerender(
            <Harness
                isNextStaged
                nextSelector="#about"
                getExitRange={() => ({ start: 0, end: 100 })}
                buildExit={() => 0.5}
                onApi={() => {}}
            />,
        )

        expect(buildIncomingRiseTween).toHaveBeenCalledTimes(1)
        expect(buildTakeoverTrigger).toHaveBeenCalledTimes(1)
    })

    it("hands the takeover the locked scripted scroll as its advance", () => {
        render(
            <Harness
                isNextStaged
                nextSelector="#about"
                getExitRange={() => ({ start: 0, end: 100 })}
                buildExit={() => 0.5}
                onApi={() => {}}
            />,
        )

        expect(useScriptedScroll).toHaveBeenCalledWith("#about")
        expect(useScriptedScroll).toHaveBeenCalledWith("#about", { locked: true, duration: 1.2 })
        expect(buildTakeoverTrigger).toHaveBeenCalledWith(
            expect.objectContaining({ advance: locked.scrollToTarget }),
        )
    })

    it("exposes the interruptible scroll as scrollToNext", () => {
        const { getApi } = renderHandoff({
            isNextStaged: false,
            nextSelector: "#about",
            getExitRange: vi.fn(() => ({ start: 0, end: 100 })),
            buildExit: vi.fn(() => 0.5),
        })

        expect(getApi().scrollToNext).toBe(interruptible.scrollToTarget)
    })

    it("is scrolling to next if either the offered or the takeover scroll is running", () => {
        interruptible.isScrolling = true
        const { getApi } = renderHandoff({
            isNextStaged: false,
            nextSelector: "#about",
            getExitRange: vi.fn(() => ({ start: 0, end: 100 })),
            buildExit: vi.fn(() => 0.5),
        })

        expect(getApi().isScrollingToNext).toBe(true)
    })

    it("is not scrolling to next when neither scroll is running", () => {
        const { getApi } = renderHandoff({
            isNextStaged: false,
            nextSelector: "#about",
            getExitRange: vi.fn(() => ({ start: 0, end: 100 })),
            buildExit: vi.fn(() => 0.5),
        })

        expect(getApi().isScrollingToNext).toBe(false)
    })

    it("reverts both match-media instances on unmount", async () => {
        const gsap = (await import("gsap")).default
        const { unmount } = renderHandoff({
            isNextStaged: true,
            nextSelector: "#about",
            getExitRange: vi.fn(() => ({ start: 0, end: 100 })),
            buildExit: vi.fn(() => 0.5),
        })

        const instances = gsap.matchMedia.mock.results.map((result) => result.value)
        unmount()

        instances.forEach((instance) => expect(instance.revert).toHaveBeenCalledTimes(1))
    })
})
