import { useRef } from "react"
import { PageContext, useRouter } from "./RouterContext"
import { useSwapTransition } from "./useSwapTransition"

// A page on its way in, held to the viewport rather than laid out in the document:
// the page it's replacing can be scrolled anywhere, and what should come up from the
// bottom of the SCREEN is the new page's top. Fixed and clipped, it shows exactly the
// screenful the page will open at, so there's nothing to reconcile when it lands —
// the router seats the scroll at that page's top in the same frame this class goes.
// Over the pinned nav bar and the hero's cue, the furniture it arrives on top of.
const ARRIVING = "fixed inset-0 z-50 overflow-hidden"

// And a page in the document, which is no box at all. The div has to exist — it is
// what the arrival is animated by, and it has to survive the landing for the page
// inside it to survive with it — but a box here would become the containing block for
// anything sticky in the page, and the hero holds the viewport by being sticky
// against the outlet. `display: contents` leaves the node without leaving a box.
const SETTLED = "contents"

// Where the pages go.
//
// One relative wrapper around all of them, and it's what bounds a sticky page: the
// hero holds the viewport for exactly as long as this box does, so it stops painting
// behind the page that has covered it. During a handoff there are two pages in here,
// stacked in the order the scroll runs through them; during a swap there are two
// again, one over the top of the other. See RouterProvider, which decides what's
// mounted and what part each one plays.
//
// overflow-anchor: none, since the router moves the scroll itself. A handover takes
// the page above out of the document and its height off the scroll position in the
// same frame; scroll anchoring answers a change like that by moving the scroll too,
// doubling it — and it's Chrome's alone, so leaving it on would make the join behave
// one way there and another in Safari.
const PageOutlet = () => {
    const { pages, leavingSelector, swapKey, finishSwap } = useRouter()
    const arrivingRef = useRef(null)

    useSwapTransition({ arrivingRef, leavingSelector, swapKey, onDone: finishSwap })

    return (
        <div className="relative [overflow-anchor:none]">
            {pages.map((page) => {
                // Read out under a capitalised name, which is what JSX needs to treat
                // it as a component rather than as an HTML tag.
                const Page = page.Page

                return (
                    <div
                        key={page.key}
                        ref={page.arriving ? arrivingRef : null}
                        className={page.arriving ? ARRIVING : SETTLED}
                    >
                        <PageContext.Provider value={page.slot}>
                            <Page />
                        </PageContext.Provider>
                    </div>
                )
            })}
        </div>
    )
}

export default PageOutlet
