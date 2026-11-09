import cn from "classnames";
import NavMenu from "./layout/NavMenu";
import { useRouter } from "../routes/RouterContext";
import { useNavItems } from "../hooks/useNavLinks";
import { useRevealOnScrollUp } from "../hooks/useRevealOnScrollUp";
import { useNavHeightVar } from "../hooks/useNavHeightVar";

// The site's nav: a bar pinned to the foot of the viewport for every page but
// the ones that carry their own links. It replaces the bar that used to be fixed
// across the top — one piece of furniture for the whole site rather than two.
//
// It lives outside the pages, so a page change is not this bar being rebuilt: it
// stays exactly where it is while the document underneath it is handed over.
//
// A page opens with it up, goes down as the viewer reads forward, and comes
// back the moment they scroll against the page; see useRevealOnScrollUp for the
// direction rule, the opening state, and why nothing shows over a page that
// carries the links in its own layout.

// Hangs below the bar on a phone, off the viewport and behind Safari's see-through
// toolbar, to cover whatever shows there as the bar rises. Absolute rather than
// padding: useNavHeightVar's measurement is the room Footer reserves.
//
// A phone's bar slides without fading and stays solid while it's down, so a landing
// page's content has nothing to show through under the toolbar. Not over a page
// drawing its own links, where a solid bar would colour the toolbar for nothing.
const TOOLBAR_COVER_CLASS =
    "after:absolute after:inset-x-0 after:top-full after:h-32 after:bg-inherit md:after:hidden";

const SiteNav = () => {
    // Which page this bar is standing on decides whether it has a floor and where,
    // and the router is what knows: the hero carries the links in its own layout
    // and Contact draws a copy of this bar, and a page that does neither has
    // nothing to be drawn twice over.
    const { navFloorSelector, pageDrawsNav, navGround, layoutKey, swap } =
        useRouter();

    // The direction owns every moment after the first, and arriving is the first:
    // a page opens with the bar up, whichever page was left and however. Reading
    // forward is what puts it away.
    //
    // layoutKey tells it a page has changed, and so returns the bar to that
    // opening state — this bar is never unmounted, so nothing else would. See
    // useRevealOnScrollUp, which also keeps the hero out of it.
    const { isRevealed, isAboveFloor } = useRevealOnScrollUp(
        navFloorSelector,
        pageDrawsNav,
        layoutKey,
    );

    // Over the links the page carries itself — the only place the two are on
    // screen together, and the only reason any of this is conditional. A page
    // with no links of its own is never under this bar.
    const isOverOwnBar = pageDrawsNav && isAboveFloor;

    // The bar belongs to the page under it, and for the length of a swap there are
    // two: it goes down with the page being left — behind the page rising over it
    // from md up, over it on a phone, where it has to outrank that page to cover the
    // toolbar — and comes up with the one that arrives, which is the slide the viewer
    // sees. Uncovered in place when the curtain lifts, it appears rather than arrives.
    const isUp = isRevealed && !swap;

    const navItems = useNavItems();

    // The height the document reserves for this bar at its foot — see Footer.
    const barRef = useNavHeightVar();

    return (
        <div
            ref={barRef}
            className={cn(
                "fixed inset-x-0 bottom-0 z-60 md:z-30",
                !isOverOwnBar &&
                    "transition-[translate,opacity] duration-300 max-md:duration-600 ease-out motion-reduce:transition-none max-md:transition-[translate]",
                isUp
                    ? "translate-y-0 opacity-100 max-md:delay-150"
                    : "translate-y-full opacity-0 pointer-events-none",
                !isUp && !pageDrawsNav && "max-md:opacity-100",
            )}
            // As in the old header bar: a hidden bar full of links has to leave the
            // tab order too, and aria-hidden alone would hide them from a screen
            // reader while leaving them focusable. pointer-events-none above is the
            // fallback for browsers without inert.
            inert={!isUp}
        >
            <NavMenu
                items={navItems}
                ariaLabel="Site navigation"
                ground={navGround}
                className={TOOLBAR_COVER_CLASS}
            />
        </div>
    );
};

export default SiteNav;
