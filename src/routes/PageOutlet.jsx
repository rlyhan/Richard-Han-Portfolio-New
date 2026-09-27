import { useRef } from "react"
import PageSwap from "./PageSwap"
import { PageContext, useRouter } from "./RouterContext"

// Where the pages go.
//
// One relative wrapper around all of them, and it is what bounds a sticky page: the
// hero holds the viewport for exactly as long as this box does, so it stops painting
// behind the page that has covered it. During a handoff there are two pages in here,
// stacked in the order the scroll runs through them — see RouterProvider, which
// decides what is mounted and hands each one the slot it is in.
//
// overflow-anchor: none, because the router moves the scroll itself. A handover takes
// the page above out of the document and takes its height off the scroll position in
// the same frame; the browser's scroll anchoring answers a change like that by moving
// the scroll as well, which would double it. It is Chrome's alone besides, so leaving
// it on would make the join behave one way there and another in Safari.
//
// The swap is rendered outside that box rather than in it: the box is what the swap
// animates away, and the page arriving must not go with it.
const PageOutlet = () => {
    const { pages, swap, finishSwap } = useRouter()
    const documentRef = useRef(null)

    return (
        <>
        <div ref={documentRef} className="relative [overflow-anchor:none]">
            {pages.map((page) => {
                // Read out under a capitalised name, which is what JSX needs to treat
                // it as a component rather than as an HTML tag.
                const Page = page.Page

                return (
                    <PageContext.Provider key={page.key} value={page.slot}>
                        <Page />
                    </PageContext.Provider>
                )
            })}
        </div>

        {swap && (
            <PageSwap
                key={swap.path}
                Page={swap.Page}
                outgoingRef={documentRef}
                onDone={finishSwap}
            />
        )}
        </>
    )
}

export default PageOutlet
