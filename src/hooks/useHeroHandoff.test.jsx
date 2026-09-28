import { useRef } from "react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render } from "@testing-library/react"
import { useHeroHandoff } from "./useHeroHandoff"
import { useHandoff } from "./useHandoff"
import { buildExitTimeline } from "../helpers/handoff"

// useHeroHandoff's own job is arithmetic and wiring: which lines animate, for how
// long, staggered by how much, and where the hero counts as empty. The scroll
// orchestration underneath it is useHandoff's, already covered in its own test file
// — mocked out here so these tests are only about the hero's numbers.
vi.mock("./useHandoff", () => ({
    useHandoff: vi.fn(() => ({ scrollToNext: vi.fn(), isScrollingToNext: false })),
}))

vi.mock("../helpers/handoff", () => {
    const timeline = { to: vi.fn() }
    timeline.to.mockReturnValue(timeline)
    return {
        buildExitTimeline: vi.fn(() => timeline),
    }
})

function stubOffset(element, { top, height }) {
    Object.defineProperty(element, "offsetTop", { value: top, configurable: true })
    Object.defineProperty(element, "offsetParent", { value: null, configurable: true })
    Object.defineProperty(element, "offsetHeight", { value: height, configurable: true })
}

function Harness({ isNextStaged, nextSelector, runway, displayLines, outroLines, onApi }) {
    const runwayRef = useRef(runway)
    const displayLineRefs = useRef(displayLines)
    const outroLineRefs = useRef(outroLines)
    const api = useHeroHandoff({ displayLineRefs, outroLineRefs, runwayRef, nextSelector, isNextStaged })
    onApi(api)
    return null
}

let runway

beforeEach(() => {
    vi.clearAllMocks()
    window.innerHeight = 800
    runway = document.createElement("div")
    stubOffset(runway, { top: 0, height: 1200 })
})

describe("useHeroHandoff", () => {
    it("delegates to useHandoff with the caller's staging state and a stable exit builder", () => {
        render(
            <Harness
                isNextStaged
                nextSelector="#about"
                runway={runway}
                displayLines={[]}
                outroLines={[]}
                onApi={() => {}}
            />,
        )

        expect(useHandoff).toHaveBeenCalledWith(
            expect.objectContaining({
                nextSelector: "#about",
                isNextStaged: true,
                runwayRef: expect.objectContaining({ current: runway }),
                getExitRange: expect.any(Function),
                buildExit: expect.any(Function),
            }),
        )
    })

    it("passes useHandoff's return value straight through", () => {
        const api = { scrollToNext: vi.fn(), isScrollingToNext: true }
        vi.mocked(useHandoff).mockReturnValueOnce(api)

        let captured
        render(
            <Harness
                isNextStaged={false}
                nextSelector="#about"
                runway={runway}
                displayLines={[]}
                outroLines={[]}
                onApi={(value) => { captured = value }}
            />,
        )

        expect(captured).toBe(api)
    })

    it("measures the hero's range from the top of the page to where the runway meets the foot of the viewport", () => {
        render(
            <Harness
                isNextStaged={false}
                nextSelector="#about"
                runway={runway}
                displayLines={[]}
                outroLines={[]}
                onApi={() => {}}
            />,
        )

        const { getExitRange } = useHandoff.mock.calls[0][0]

        // offsetTop 0 + offsetHeight 1200 - innerHeight 800 = 400
        expect(getExitRange(runway)).toEqual({ start: 0, end: 400 })
    })

    it("builds the hero's exit timeline scrubbed against its own, longer lag", () => {
        render(
            <Harness
                isNextStaged={false}
                nextSelector="#about"
                runway={runway}
                displayLines={[{}, {}]}
                outroLines={[{}]}
                onApi={() => {}}
            />,
        )

        const { buildExit } = useHandoff.mock.calls[0][0]
        const range = () => ({ start: 0, end: 400 })
        buildExit({ runway, range })

        expect(buildExitTimeline).toHaveBeenCalledWith({ runway, range, scrub: 2.5 })
    })

    it("filters out unset ref slots before animating the lines", () => {
        const lineA = {}
        const lineB = {}
        const outroA = {}

        render(
            <Harness
                isNextStaged={false}
                nextSelector="#about"
                runway={runway}
                displayLines={[lineA, null, lineB]}
                outroLines={[null, outroA]}
                onApi={() => {}}
            />,
        )

        const { buildExit } = useHandoff.mock.calls[0][0]
        buildExit({ runway, range: () => ({ start: 0, end: 400 }) })

        const timeline = buildExitTimeline.mock.results[0].value
        const [displayTargets, displayVars, displayPosition] = timeline.to.mock.calls[0]
        const [outroTargets, outroVars, outroPosition] = timeline.to.mock.calls[1]

        expect(displayTargets).toEqual([lineA, lineB])
        expect(displayVars).toMatchObject({ duration: 0.45, stagger: 0.1 })
        expect(displayPosition).toBe(0)

        expect(outroTargets).toEqual([outroA])
        expect(outroVars).toMatchObject({ duration: 0.25, stagger: 0.08 })
        expect(outroPosition).toBe(0.55)
    })

    it("sends the last display line further, as the work grid rather than a text line", () => {
        const lineA = {}
        const lineB = {}
        const lastLine = {}

        render(
            <Harness
                isNextStaged={false}
                nextSelector="#about"
                runway={runway}
                displayLines={[lineA, lineB, lastLine]}
                outroLines={[]}
                onApi={() => {}}
            />,
        )

        const { buildExit } = useHandoff.mock.calls[0][0]
        buildExit({ runway, range: () => ({ start: 0, end: 400 }) })

        const timeline = buildExitTimeline.mock.results[0].value
        const [targets, vars] = timeline.to.mock.calls[0]

        expect(vars.y(0, targets[0], targets)).toBe(-40)
        expect(vars.y(1, targets[1], targets)).toBe(-(40 + 34))
        // The last line clears the viewport instead of nudging by a few pixels.
        expect(vars.y(2, targets[2], targets)).toBe(-800 * 0.7)
        expect(vars.xPercent(2, targets[2], targets)).toBe(0)
    })

    it("returns the later of the two fades as the share of the runway where the hero is empty", () => {
        render(
            <Harness
                isNextStaged={false}
                nextSelector="#about"
                runway={runway}
                displayLines={[{}, {}, {}]}
                outroLines={[{}]}
                onApi={() => {}}
            />,
        )

        const { buildExit } = useHandoff.mock.calls[0][0]
        const share = buildExit({ runway, range: () => ({ start: 0, end: 400 }) })

        // display: 0.1 * (3 - 1) + 0.45 = 0.65
        // outro:   0.55 + 0.08 * (1 - 1) + 0.25 = 0.8
        expect(share).toBeCloseTo(0.8)
    })
})
