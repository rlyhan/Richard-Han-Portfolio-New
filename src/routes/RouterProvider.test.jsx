import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, act, waitFor } from "@testing-library/react"
import RouterProvider from "./RouterProvider"
import { useRouter } from "./RouterContext"
import { loadPage, getLoadedPage } from "./routes"

// GSAP/ScrollTrigger are mocked wholesale: these tests are about which state
// transition RouterProvider makes, not about GSAP's tweening or ScrollTrigger's
// measurements. Real timelines and triggers belong in the browser/E2E tests.
vi.mock("gsap", () => ({
    default: {
        registerPlugin: vi.fn(),
        killTweensOf: vi.fn(),
        set: vi.fn(),
        isTweening: vi.fn(() => false),
        matchMedia: vi.fn(() => ({ add: vi.fn(), revert: vi.fn() })),
        timeline: vi.fn(),
    },
}))

vi.mock("gsap/ScrollTrigger", () => ({
    default: {
        refresh: vi.fn(),
        clearScrollMemory: vi.fn(),
        config: vi.fn(),
        maxScroll: vi.fn(() => 100000),
        create: vi.fn(),
    },
}))

// A fake route table, standing in for the real one so a test controls exactly when
// a chunk resolves and can make one fail on demand — the real table's `load()`
// points at real page chunks with their own heavy dependency trees.
vi.mock("./routes", () => {
    const Home = () => null
    const About = () => null
    const Projects = () => null
    const Contact = () => null

    const ROUTES = {
        "/": { path: "/", sectionId: "home", title: "Home", ground: "bg-cream", next: "/about" },
        "/about": { path: "/about", sectionId: "about", title: "About", ground: "bg-cream" },
        "/projects": { path: "/projects", sectionId: "projects", title: "Projects", ground: "bg-carbon-900" },
        "/contact": { path: "/contact", sectionId: "contact", title: "Contact", ground: "bg-carbon-900" },
    }

    const components = { "/": Home, "/about": About, "/projects": Projects, "/contact": Contact }

    return {
        findRoute: vi.fn((path) => ROUTES[path] ?? null),
        nextRouteOf: vi.fn((route) => (route?.next ? ROUTES[route.next] : null)),
        sectionSelectorOf: vi.fn((route) => (route ? `#${route.sectionId}` : null)),
        resolvePath: vi.fn((pathname) => (ROUTES[pathname] ? pathname : "/")),
        getLoadedPage: vi.fn((route) => (route ? components[route.path] : null)),
        loadPage: vi.fn((route) => Promise.resolve(components[route.path])),
    }
})

function Capture({ onRender }) {
    onRender(useRouter())
    return null
}

function renderRouter() {
    let router
    const utils = render(
        <RouterProvider>
            <Capture onRender={(value) => { router = value }} />
        </RouterProvider>,
    )
    return { ...utils, getRouter: () => router }
}

beforeEach(() => {
    vi.clearAllMocks()
    window.history.pushState(null, "", "/")
    window.scrollTo = vi.fn()
})

describe("navigate", () => {
    it("scrolls to the top of the current page rather than staging or swapping anything", async () => {
        const { getRouter } = renderRouter()

        act(() => getRouter().navigate("/"))

        expect(window.scrollTo).toHaveBeenCalled()
        expect(getRouter().swap).toBeNull()
        expect(getRouter().path).toBe("/")
    })

    it("stages the page it hands its scroll to, without opening a swap", async () => {
        const { getRouter } = renderRouter()

        act(() => getRouter().navigate("/about"))

        await waitFor(() => expect(getRouter().pages.some((page) => page.key === "/about")).toBe(true))
        expect(getRouter().swap).toBeNull()
        expect(getRouter().path).toBe("/")
    })

    it("opens a swap for any other page", async () => {
        const { getRouter } = renderRouter()

        act(() => getRouter().navigate("/projects"))

        await waitFor(() => expect(getRouter().swap?.path).toBe("/projects"))
        expect(getRouter().pages[0]).toMatchObject({ key: "/projects", arriving: true })
    })

    it("ignores a second page asked for while a swap is already under way", async () => {
        const { getRouter } = renderRouter()

        act(() => getRouter().navigate("/projects"))
        await waitFor(() => expect(getRouter().swap?.path).toBe("/projects"))

        vi.mocked(loadPage).mockClear()
        act(() => getRouter().navigate("/contact"))

        expect(loadPage).not.toHaveBeenCalled()
        expect(getRouter().swap?.path).toBe("/projects")
    })

    it("does nothing for a path with no route", async () => {
        const { getRouter } = renderRouter()

        act(() => getRouter().navigate("/nowhere"))

        expect(getRouter().swap).toBeNull()
        expect(getRouter().path).toBe("/")
    })

    // jsdom's Location object is non-configurable and non-writable (as of jsdom 29),
    // so `window.location.assign` can't be spied on or stubbed here — confirming the
    // exact URL a real fallback navigates to belongs to the E2E suite. What's left to
    // check at this level is that the rejection is handled and the router isn't left
    // in a half-updated state because of it.
    it("recovers cleanly when the chunk can't be fetched, without leaving a broken swap behind", async () => {
        vi.mocked(loadPage).mockImplementationOnce(() => Promise.reject(new Error("chunk failed")))
        const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})
        const { getRouter } = renderRouter()

        let caught = null
        await act(async () => {
            try {
                getRouter().navigate("/projects")
                await Promise.resolve()
                await Promise.resolve()
            } catch (error) {
                caught = error
            }
        })

        expect(caught).toBeNull()
        expect(getRouter().swap).toBeNull()
        expect(getRouter().path).toBe("/")

        consoleError.mockRestore()
    })
})

describe("finishSwap", () => {
    it("enters the swapped-in page: current, title and ground all follow it, and swap clears", async () => {
        const { getRouter } = renderRouter()

        act(() => getRouter().navigate("/projects"))
        await waitFor(() => expect(getRouter().swap?.path).toBe("/projects"))

        act(() => getRouter().finishSwap())

        expect(getRouter().path).toBe("/projects")
        expect(getRouter().swap).toBeNull()
        expect(document.title).toBe("Projects")
        expect(document.body.classList.contains("bg-carbon-900")).toBe(true)
        expect(document.body.classList.contains("bg-cream")).toBe(false)
    })

    it("pushes a new history entry", async () => {
        const { getRouter } = renderRouter()

        act(() => getRouter().navigate("/projects"))
        await waitFor(() => expect(getRouter().swap?.path).toBe("/projects"))
        act(() => getRouter().finishSwap())

        expect(window.location.pathname).toBe("/projects")
    })
})

describe("popstate", () => {
    it("is a no-op when the path hasn't actually changed", async () => {
        const { getRouter } = renderRouter()

        act(() => window.dispatchEvent(new Event("popstate")))

        expect(loadPage).not.toHaveBeenCalled()
        expect(getRouter().path).toBe("/")
    })

    it("loads and enters a different path without pushing a new history entry", async () => {
        const { getRouter } = renderRouter()

        // The browser moves the address bar to the restored entry before popstate
        // fires — done here, outside the spy, so only the handler's own calls count.
        window.history.pushState(null, "", "/about")
        const pushSpy = vi.spyOn(window.history, "pushState")

        act(() => window.dispatchEvent(new Event("popstate")))

        await waitFor(() => expect(getRouter().path).toBe("/about"))
        expect(pushSpy).not.toHaveBeenCalled()

        pushSpy.mockRestore()
    })

    // Same jsdom limitation as the navigate() fallback test above: the exact
    // server-bound URL is an E2E concern here, so this checks the rejection is
    // handled without the app getting stuck or throwing.
    it("recovers cleanly when the target chunk can't be fetched", async () => {
        vi.mocked(loadPage).mockImplementationOnce(() => Promise.reject(new Error("chunk failed")))
        const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})
        renderRouter()

        window.history.pushState(null, "", "/about")

        let caught = null
        await act(async () => {
            try {
                window.dispatchEvent(new Event("popstate"))
                await Promise.resolve()
                await Promise.resolve()
            } catch (error) {
                caught = error
            }
        })

        expect(caught).toBeNull()

        consoleError.mockRestore()
    })
})

describe("unmounting", () => {
    it("does not throw when a cold-start chunk resolves after the router has already unmounted", async () => {
        vi.mocked(getLoadedPage).mockReturnValueOnce(null)
        let resolveLoad
        vi.mocked(loadPage).mockImplementationOnce(
            () => new Promise((resolve) => { resolveLoad = resolve }),
        )

        const { unmount } = renderRouter()
        unmount()

        let caught = null
        await act(async () => {
            try {
                resolveLoad(() => null)
                await Promise.resolve()
            } catch (error) {
                caught = error
            }
        })

        expect(caught).toBeNull()
    })
})

describe("a staged page that no longer matches the current next route", () => {
    it("is dropped once an interrupting navigation lands somewhere else", async () => {
        const { getRouter } = renderRouter()

        // Stage "/about" (home's `next`), but hold its chunk back so it resolves
        // only after the viewer has already gone somewhere else entirely.
        let resolveAbout
        vi.mocked(loadPage).mockImplementationOnce(
            () => new Promise((resolve) => { resolveAbout = resolve }),
        )
        act(() => getRouter().navigate("/about"))

        // Before that resolves, a swap to a page with no `next` of its own lands.
        act(() => getRouter().navigate("/contact"))
        await waitFor(() => expect(getRouter().swap?.path).toBe("/contact"))
        act(() => getRouter().finishSwap())
        expect(getRouter().path).toBe("/contact")

        // The stale "/about" stage now resolves, against a router that has moved on.
        await act(async () => {
            resolveAbout(() => null)
            await Promise.resolve()
        })

        expect(getRouter().pages.some((page) => page.key === "/about")).toBe(false)
    })
})

describe("registerAdvance", () => {
    it("ignores a stale cleanup left behind by an earlier registration", async () => {
        const { getRouter } = renderRouter()
        const advanceA = vi.fn()
        const advanceB = vi.fn()

        let unregisterA
        act(() => { unregisterA = getRouter().registerAdvance(advanceA) })
        act(() => { getRouter().registerAdvance(advanceB) })
        // A's own cleanup runs late — after B has already taken over — and must not
        // clear B's registration.
        act(() => unregisterA())

        act(() => getRouter().navigate("/about"))

        await waitFor(() => expect(advanceB).toHaveBeenCalledTimes(1))
        expect(advanceA).not.toHaveBeenCalled()
    })
})
