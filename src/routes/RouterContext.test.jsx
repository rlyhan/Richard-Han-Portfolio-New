import { describe, it, expect, vi } from "vitest"
import { render } from "@testing-library/react"
import { RouterContext, PageContext, useAdvance } from "./RouterContext"

function Harness({ advance }) {
    useAdvance(advance)
    return null
}

function renderAdvance({ isFront, registerAdvance, advance }) {
    return render(
        <RouterContext.Provider value={{ registerAdvance }}>
            <PageContext.Provider value={{ isFront }}>
                <Harness advance={advance} />
            </PageContext.Provider>
        </RouterContext.Provider>,
    )
}

describe("useAdvance", () => {
    it("registers the callback while the page is the one in front", () => {
        const registerAdvance = vi.fn(() => vi.fn())
        const advance = vi.fn()

        renderAdvance({ isFront: true, registerAdvance, advance })

        expect(registerAdvance).toHaveBeenCalledWith(advance)
    })

    it("never registers for a page staged below, waiting to become the front page", () => {
        const registerAdvance = vi.fn(() => vi.fn())

        renderAdvance({ isFront: false, registerAdvance, advance: vi.fn() })

        expect(registerAdvance).not.toHaveBeenCalled()
    })

    it("unregisters the old callback and registers the new one when it changes", () => {
        const unregister = vi.fn()
        const registerAdvance = vi.fn(() => unregister)
        const advanceA = vi.fn()
        const advanceB = vi.fn()

        const { rerender } = render(
            <RouterContext.Provider value={{ registerAdvance }}>
                <PageContext.Provider value={{ isFront: true }}>
                    <Harness advance={advanceA} />
                </PageContext.Provider>
            </RouterContext.Provider>,
        )

        rerender(
            <RouterContext.Provider value={{ registerAdvance }}>
                <PageContext.Provider value={{ isFront: true }}>
                    <Harness advance={advanceB} />
                </PageContext.Provider>
            </RouterContext.Provider>,
        )

        expect(unregister).toHaveBeenCalledTimes(1)
        expect(registerAdvance).toHaveBeenLastCalledWith(advanceB)
    })

    it("unregisters when the page stops being the one in front", () => {
        const unregister = vi.fn()
        const registerAdvance = vi.fn(() => unregister)

        const { rerender } = renderAdvance({ isFront: true, registerAdvance, advance: vi.fn() })

        rerender(
            <RouterContext.Provider value={{ registerAdvance }}>
                <PageContext.Provider value={{ isFront: false }}>
                    <Harness advance={vi.fn()} />
                </PageContext.Provider>
            </RouterContext.Provider>,
        )

        expect(unregister).toHaveBeenCalledTimes(1)
    })

    it("unregisters on unmount", () => {
        const unregister = vi.fn()
        const registerAdvance = vi.fn(() => unregister)

        const { unmount } = renderAdvance({ isFront: true, registerAdvance, advance: vi.fn() })
        unmount()

        expect(unregister).toHaveBeenCalledTimes(1)
    })
})
