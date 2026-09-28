import { useRef } from "react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, act } from "@testing-library/react"
import { useSwapTransition } from "./useSwapTransition"
import { buildSwapTimeline } from "../helpers/pageSwap"
import { holdScroll } from "../helpers/scrollHold"
import { mockMatchMedia, REDUCE_MOTION_QUERY } from "../test/matchMedia"

vi.mock("gsap", () => ({
    default: { set: vi.fn() },
}))

vi.mock("../helpers/pageSwap", () => ({
    buildSwapTimeline: vi.fn(),
}))

vi.mock("../helpers/scrollHold", () => ({
    holdScroll: vi.fn(),
}))

function Harness({ leavingSelector, swapKey, onDone }) {
    const arrivingRef = useRef(null)
    useSwapTransition({ arrivingRef, leavingSelector, swapKey, onDone })

    return (
        <>
            <div id="leaving-page" />
            <div data-testid="arriving-page" ref={arrivingRef} />
        </>
    )
}

beforeEach(() => {
    vi.clearAllMocks()
    holdScroll.mockReturnValue(vi.fn())
    window.matchMedia = mockMatchMedia(null)
})

describe("useSwapTransition", () => {
    it("does nothing while there is no swap in flight", () => {
        render(<Harness leavingSelector="#leaving-page" swapKey={null} onDone={vi.fn()} />)

        expect(buildSwapTimeline).not.toHaveBeenCalled()
        expect(holdScroll).not.toHaveBeenCalled()
    })

    it("under reduced motion, finishes the swap immediately without building a timeline", () => {
        window.matchMedia = mockMatchMedia(REDUCE_MOTION_QUERY)
        const onDone = vi.fn()

        render(<Harness leavingSelector="#leaving-page" swapKey="/about" onDone={onDone} />)

        expect(buildSwapTimeline).not.toHaveBeenCalled()
        expect(onDone).toHaveBeenCalledTimes(1)
    })

    it("holds the scroll for a reduced-motion swap too, and releases it once done", () => {
        window.matchMedia = mockMatchMedia(REDUCE_MOTION_QUERY)
        const release = vi.fn()
        holdScroll.mockReturnValue(release)

        render(<Harness leavingSelector="#leaving-page" swapKey="/about" onDone={vi.fn()} />)

        expect(holdScroll).toHaveBeenCalledTimes(1)
        expect(release).toHaveBeenCalledTimes(1)
    })

    it("builds a timeline and only finishes the swap once it completes", () => {
        let onComplete
        buildSwapTimeline.mockImplementation((args) => {
            onComplete = args.onComplete
            return { kill: vi.fn() }
        })
        const onDone = vi.fn()

        render(<Harness leavingSelector="#leaving-page" swapKey="/about" onDone={onDone} />)

        expect(buildSwapTimeline).toHaveBeenCalledTimes(1)
        expect(onDone).not.toHaveBeenCalled()

        act(() => onComplete())

        expect(onDone).toHaveBeenCalledTimes(1)
    })

    it("releases the scroll hold exactly once when the timeline completes", () => {
        let onComplete
        buildSwapTimeline.mockImplementation((args) => {
            onComplete = args.onComplete
            return { kill: vi.fn() }
        })
        const release = vi.fn()
        holdScroll.mockReturnValue(release)

        render(<Harness leavingSelector="#leaving-page" swapKey="/about" onDone={vi.fn()} />)
        act(() => onComplete())

        expect(release).toHaveBeenCalledTimes(1)
    })

    it("kills the in-flight timeline and releases the hold when a new swap interrupts it", () => {
        const killFirst = vi.fn()
        const killSecond = vi.fn()
        buildSwapTimeline.mockImplementationOnce(() => ({ kill: killFirst }))
        buildSwapTimeline.mockImplementationOnce(() => ({ kill: killSecond }))
        const releaseFirst = vi.fn()
        const releaseSecond = vi.fn()
        holdScroll.mockReturnValueOnce(releaseFirst).mockReturnValueOnce(releaseSecond)
        const onDone = vi.fn()

        const { rerender } = render(<Harness leavingSelector="#leaving-page" swapKey="/about" onDone={onDone} />)
        rerender(<Harness leavingSelector="#leaving-page" swapKey="/projects" onDone={onDone} />)

        expect(killFirst).toHaveBeenCalledTimes(1)
        expect(killSecond).not.toHaveBeenCalled()
        expect(releaseFirst).toHaveBeenCalledTimes(1)
        expect(onDone).not.toHaveBeenCalled()
    })

    it("never releases the scroll hold twice when unmounted after the timeline already completed", () => {
        let onComplete
        buildSwapTimeline.mockImplementation((args) => {
            onComplete = args.onComplete
            return { kill: vi.fn() }
        })
        const release = vi.fn()
        holdScroll.mockReturnValue(release)

        const { unmount } = render(<Harness leavingSelector="#leaving-page" swapKey="/about" onDone={vi.fn()} />)
        act(() => onComplete())
        unmount()

        expect(release).toHaveBeenCalledTimes(1)
    })
})
