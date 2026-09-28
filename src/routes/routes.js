// The site's pages, in the order the scroll runs through them.
//
// One record per page, and everything else reads the list off this table: which
// chunk to fetch, what the nav says, which page the scroll continues into, what the
// tab is called. Adding a page is a record here and a component under src/pages —
// nothing else knows the list.
//
// Each page is its own chunk, which is the point of the split: the hero's spread,
// the project data and the modal no longer ship to someone who came to read About.
const ROUTES = [
    {
        path: "/",
        // The id the page's top-level section carries. Every handoff and every
        // scroll helper resolves a page by `#sectionId` rather than by its path —
        // they measure elements, and only the router deals in URLs.
        sectionId: "home",
        title: "Richard Han — Front End and Full Stack Developer",
        // Painted on the body the moment the route is entered, ahead of its chunk
        // arriving, so a page never opens over the ground of the one before it. The
        // sections paint their own besides this; it answers for the frame around
        // them and for the gap before the first paint.
        ground: "bg-cream",
        // The hero draws the site's nav bar inside its own layout, so the pinned
        // copy has to stay down while this page holds the screen, or the same
        // furniture is drawn twice — see SiteNav, which takes the page after this one
        // as the floor.
        hasOwnNav: true,
        // No navLabel: the name at the foot of the bar is the way back home, and a
        // "Home" item beside it would be that link drawn twice.
        //
        // `next` is the page this one hands the SCROLL to: the hero would empty out
        // across its runway and About climb over it, one document, one gesture.
        // Everywhere else the foot of the page is the foot of the document and the
        // nav bar is the way on — see RouterProvider, which plays those as a swap
        // rather than a scroll.
        //
        // TEMPORARILY OFF. The scroll-driven join left a gentle scroll stranded
        // part-way along the runway with a half-emptied hero, so until that is
        // settled this page hands over the way every other page does: a swap, on a
        // click. Restoring the line below is the whole switch back — the runway, the
        // hero's exit, the staging of About underneath and the takeover all follow
        // from it. See useHandoff, which builds nothing without it, and HomePage,
        // which leaves the runway out of the markup.
        // next: "/about",
        load: () => import("../pages/HomePage.jsx"),
    },
    {
        path: "/about",
        sectionId: "about",
        title: "About — Richard Han",
        ground: "bg-cream",
        navLabel: "About",
        load: () => import("../pages/AboutPage.jsx"),
    },
    {
        path: "/projects",
        sectionId: "projects",
        title: "Projects — Richard Han",
        ground: "bg-cream",
        navLabel: "Projects",
        load: () => import("../pages/ProjectsPage.jsx"),
    },
    {
        path: "/contact",
        sectionId: "contact",
        title: "Contact — Richard Han",
        ground: "bg-carbon-900",
        navLabel: "Contact",
        load: () => import("../pages/ContactPage.jsx"),
    },
]

const HOME_PATH = "/"

// Paths by section id, derived rather than restated — for the few places inside a page
// that link to one page by name instead of to whatever comes after them.
export const PATHS = Object.fromEntries(ROUTES.map((route) => [route.sectionId, route.path]))

// The items the nav bar lists, in table order — the numbering beside them is that
// order, so it can't drift from the order the scroll visits them in.
export const NAV_ROUTES = ROUTES.filter((route) => route.navLabel)

export const findRoute = (path) => ROUTES.find((route) => route.path === path) ?? null

export const nextRouteOf = (route) => (route?.next ? findRoute(route.next) : null)

// The page after this one in table order, which is not the same question as `next`:
// `next` is whether the SCROLL carries on into it, and this is simply what comes
// after. The pinned nav bar's floor asks this one — a page that draws the bar in its
// own layout keeps the pinned copy down until the page below it is reached, whether
// the two are joined by a scroll or by a swap.
export const routeAfter = (route) => {
    const index = ROUTES.indexOf(route)
    return index < 0 ? null : ROUTES[index + 1] ?? null
}

export const sectionSelectorOf = (route) => (route ? `#${route.sectionId}` : null)

// A pathname off the address bar, resolved to a path this table has. Trailing
// slashes are the same page, and anything unknown is home rather than an empty
// document — there is no 404 page to send it to.
export const resolvePath = (pathname) => {
    const trimmed = pathname.replace(/\/+$/, "") || HOME_PATH
    return findRoute(trimmed) ? trimmed : HOME_PATH
}

// The chunks already fetched, by path. Module scope rather than state: a chunk is
// fetched once per page load however many times the router is asked for it, and a
// page returned to a second time should mount without a wait.
const loaded = new Map()
const pending = new Map()

// The component for a route, if its chunk is already here. Lets the router mount a
// page in the same commit it decides to — a page swapped in on a frame where its
// component was still a promise is a blank screen, however short.
export const getLoadedPage = (route) => (route ? loaded.get(route.path) ?? null : null)

// Fetches a route's chunk, or hands back the fetch already in flight. Rejects if the
// chunk can't be had, which the router answers by leaving the URL to the server.
export const loadPage = (route) => {
    if (!route) return Promise.reject(new Error("No route to load"))

    const ready = loaded.get(route.path)
    if (ready) return Promise.resolve(ready)

    const inFlight = pending.get(route.path)
    if (inFlight) return inFlight

    const request = route
        .load()
        .then((module) => {
            loaded.set(route.path, module.default)
            pending.delete(route.path)
            return module.default
        })
        .catch((error) => {
            // Cleared, so a failure on a flaky connection can be retried by the
            // next thing that asks rather than being cached as broken.
            pending.delete(route.path)
            throw error
        })

    pending.set(route.path, request)
    return request
}
