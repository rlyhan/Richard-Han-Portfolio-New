import { createContext, useContext, useEffect } from "react"

// Two contexts, because there are two questions to ask and they have different
// answers depending on who is asking.
//
//   RouterContext  the site's own state: which page is up, how to get to another
//                  one. The chrome outside the pages reads this (see SiteNav), and
//                  so does anything building a nav item.
//   PageContext    one page's place in the chain. During a handoff two pages are
//                  mounted at once, and the one staged below is NOT the one the
//                  viewer is on: asking the site-wide context would tell it about
//                  the front page's next page rather than its own. So the router
//                  wraps each mounted page in its own provider, and a staged page
//                  is handed a slot with nothing in it — no next page to reach, and
//                  nothing to advance to, until it is the page in front.

export const RouterContext = createContext(null)

// What a page that isn't in front is told: it is not the page the viewer is on, so it
// has no next page and nothing to hand a scroll to. Also the default, so a page
// rendered outside the router — a test, a story — still works, with nowhere to go.
export const EMPTY_SLOT = {
    isFront: false,
    nextSelector: null,
    isNextStaged: false,
}

export const PageContext = createContext(EMPTY_SLOT)

export const useRouter = () => useContext(RouterContext)

export const usePage = () => useContext(PageContext)

// A page handing the router the scroll it leaves by, so a nav item anywhere on the
// site can ask for that rather than a jump: the router prefers this whenever the page
// being asked for is the one this page hands over to. See navigate in RouterProvider.
//
// The page in front registers, and a page staged below it does not: there is one
// advance for the site, and it belongs to the page the viewer is on. A staged page
// runs this hook all the same — it is about to be that page — and `isFront` is what
// keeps it from claiming the advance a moment early.
export function useAdvance(advance) {
    const { registerAdvance } = useRouter()
    const { isFront } = usePage()

    useEffect(() => {
        if (!isFront) return

        return registerAdvance(advance)
    }, [isFront, registerAdvance, advance])
}
