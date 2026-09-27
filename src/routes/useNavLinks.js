import { useMemo } from "react"
import { NAV_ROUTES } from "./routes"
import { useRouter } from "./RouterContext"

// A modified click belongs to the browser — a new tab, a new window, a download —
// and so does a click with any button but the first. Only a plain left click is the
// router's to answer.
const isPlainClick = (event) =>
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey

// The props that make an anchor a link to one of the site's pages.
//
// The href is the real destination and the handler only upgrades the jump: a modified
// click, and a page whose scripts never arrived, both still work. Where the page
// asked for is the one the current page hands over to, the router answers with that
// handoff rather than with a jump — see navigate in RouterProvider.
const buildLink = ({ to, isCurrent, navigate, prefetch }) => ({
    href: to,
    onClick: (event) => {
        if (!isPlainClick(event)) return

        event.preventDefault()
        navigate(to)
    },
    // Hovering or tabbing onto a link is as much warning as the router gets that a
    // page is wanted, and a chunk fetched by then is a page that opens on the click.
    onPointerEnter: () => prefetch(to),
    onFocus: () => prefetch(to),
    "aria-current": isCurrent ? "page" : undefined,
})

// One link, for anything that points at a page by name — the hero's spread pointing
// at the work, a line of copy pointing anywhere.
export function useNavLink(to) {
    const { path, navigate, prefetch } = useRouter()

    return useMemo(
        () => buildLink({ to, isCurrent: to === path, navigate, prefetch }),
        [to, path, navigate, prefetch],
    )
}

// The nav's items, built off the route table so the bar can't list a page the site
// hasn't got — or put them in an order the scroll doesn't run in. Both copies of the
// bar are built from this: the hero's own, and the one pinned to the viewport below
// it (see SiteNav).
export function useNavItems() {
    const { path, navigate, prefetch } = useRouter()

    return useMemo(
        () =>
            NAV_ROUTES.map((route) => ({
                id: route.sectionId,
                label: route.navLabel,
                link: buildLink({
                    to: route.path,
                    isCurrent: route.path === path,
                    navigate,
                    prefetch,
                }),
            })),
        [path, navigate, prefetch],
    )
}
