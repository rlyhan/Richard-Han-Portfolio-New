import { describe, it, expect, vi } from "vitest"
import { findRoute, nextRouteOf, sectionSelectorOf, resolvePath, getLoadedPage, loadPage, PATHS } from "./routes"

describe("resolvePath", () => {
    it("leaves a known path alone", () => {
        expect(resolvePath("/about")).toBe("/about")
    })

    it("trims a trailing slash to the same route", () => {
        expect(resolvePath("/about/")).toBe("/about")
    })

    it("trims repeated trailing slashes", () => {
        expect(resolvePath("/about///")).toBe("/about")
    })

    it("leaves the root path alone", () => {
        expect(resolvePath("/")).toBe("/")
    })

    it("falls back to home for a path not in the table, rather than a 404", () => {
        expect(resolvePath("/nowhere")).toBe("/")
    })
})

describe("findRoute", () => {
    it("finds a route by its exact path", () => {
        expect(findRoute("/about")?.path).toBe("/about")
    })

    it("returns null for a path not in the table", () => {
        expect(findRoute("/nowhere")).toBeNull()
    })

    it("returns null for a nullish path", () => {
        expect(findRoute(null)).toBeNull()
    })
})

describe("nextRouteOf", () => {
    it("resolves the route the homepage hands its scroll to", () => {
        expect(nextRouteOf(findRoute("/"))?.path).toBe("/about")
    })

    it("is null for a route with nothing declared after it", () => {
        expect(nextRouteOf(findRoute("/about"))).toBeNull()
    })

    it("is null for a null route", () => {
        expect(nextRouteOf(null)).toBeNull()
    })
})

describe("sectionSelectorOf", () => {
    it("prefixes the route's section id with #", () => {
        expect(sectionSelectorOf(findRoute("/about"))).toBe("#about")
    })

    it("is null for a null route", () => {
        expect(sectionSelectorOf(null)).toBeNull()
    })
})

describe("PATHS", () => {
    it("maps every section id back to its path", () => {
        expect(PATHS.home).toBe("/")
        expect(PATHS.about).toBe("/about")
        expect(PATHS.projects).toBe("/projects")
        expect(PATHS.contact).toBe("/contact")
    })
})

// getLoadedPage/loadPage share one module-scoped cache keyed by path. Fabricated
// routes under paths no real page uses keep these tests from colliding with each
// other or with whatever the real route table has already loaded.
describe("loadPage / getLoadedPage", () => {
    const fakeRoute = (path, load) => ({ path, load })

    it("has nothing loaded for a route that has never been asked for", () => {
        expect(getLoadedPage(fakeRoute("/__unit_never_loaded__", vi.fn()))).toBeNull()
    })

    it("is null for a null route", () => {
        expect(getLoadedPage(null)).toBeNull()
    })

    it("resolves to the component the loader hands back, and remembers it", async () => {
        const Component = () => null
        const route = fakeRoute("/__unit_resolve__", vi.fn().mockResolvedValue({ default: Component }))

        await expect(loadPage(route)).resolves.toBe(Component)
        expect(getLoadedPage(route)).toBe(Component)
    })

    it("caches the component so a second call never calls the loader again", async () => {
        const Component = () => null
        const load = vi.fn().mockResolvedValue({ default: Component })
        const route = fakeRoute("/__unit_cache__", load)

        await loadPage(route)
        await loadPage(route)

        expect(load).toHaveBeenCalledTimes(1)
    })

    it("shares one in-flight request between calls that overlap", async () => {
        const Component = () => null
        let resolveLoad
        const load = vi.fn(() => new Promise((resolve) => { resolveLoad = resolve }))
        const route = fakeRoute("/__unit_dedupe__", load)

        const first = loadPage(route)
        const second = loadPage(route)
        resolveLoad({ default: Component })

        const [a, b] = await Promise.all([first, second])

        expect(a).toBe(Component)
        expect(b).toBe(Component)
        expect(load).toHaveBeenCalledTimes(1)
    })

    it("clears the pending request on failure so a retry can succeed", async () => {
        const Component = () => null
        const load = vi
            .fn()
            .mockRejectedValueOnce(new Error("network down"))
            .mockResolvedValueOnce({ default: Component })
        const route = fakeRoute("/__unit_retry__", load)

        await expect(loadPage(route)).rejects.toThrow("network down")
        await expect(loadPage(route)).resolves.toBe(Component)
        expect(load).toHaveBeenCalledTimes(2)
    })

    it("rejects rather than fetching when there is no route to load", async () => {
        await expect(loadPage(null)).rejects.toThrow()
    })
})
