import { PageContext, useRouter } from "./RouterContext"

// Where the pages go.
//
// One relative wrapper around all of them, and it is what bounds a sticky page: the
// hero holds the viewport for exactly as long as this box does, so it stops painting
// behind the page that has covered it. During a handoff there are two pages in here,
// stacked in the order the scroll runs through them — see RouterProvider, which
// decides what is mounted and hands each one the slot it is in.
const PageOutlet = () => {
    const { pages } = useRouter()

    return (
        <div className="relative">
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
    )
}

export default PageOutlet
