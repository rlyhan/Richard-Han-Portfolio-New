import cn from "classnames";
import NavMenu from "./layout/NavMenu";
import { useRouter } from "../routes/RouterContext";
import { useNavItems } from "../hooks/useNavLinks";
import { useRevealOnScrollUp } from "../hooks/useRevealOnScrollUp";
import { useNavHeightVar } from "../hooks/useNavHeightVar";

// The site's nav: the hero's own bar, pinned to the foot of the viewport for the
// rest of the site. It replaces the bar that used to be fixed across the top —
// one piece of furniture for the whole site rather than two.
//
// It lives outside the pages, so a page change is not this bar being rebuilt: it
// stays exactly where it is while the document underneath it is handed over.
//
// A page opens with it up, goes down as the viewer reads forward, and comes
// back the moment they scroll against the page; see useRevealOnScrollUp for the
// direction rule, the opening state, and why nothing shows over a page that
// carries a copy of this bar in its own layout.
const SiteNav = () => {
    // Which page this bar is standing on decides whether it has a floor and where,
    // and the router is what knows: the hero and Contact draw a copy of this bar in
    // their own layout, and a page that doesn't has nothing to be drawn twice over.
    const { navFloorSelector, pageDrawsNav, layoutKey, swap } = useRouter();

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

    // Over the copy the page draws itself — the only place the two are stacked, and
    // the only reason any of this is conditional. A page that draws no copy is never
    // over anything.
    const isOverOwnBar = pageDrawsNav && isAboveFloor;

    // The bar belongs to the page under it, and for the length of a swap there are
    // two: it goes down with the page being left — behind the page rising over it,
    // so there's nothing to see — and comes up with the one that arrives, which is
    // the slide the viewer sees. Uncovered in place when the curtain lifts, it
    // appears rather than arrives.
    const isUp = isRevealed && !swap;

    const navItems = useNavItems();

    // The height the document reserves for this bar at its foot — see Footer.
    const barRef = useNavHeightVar();

    return (
        <div
            ref={barRef}
            className={cn(
                "fixed inset-x-0 bottom-0 z-30",
                !isOverOwnBar &&
                    "transition-[translate,opacity] duration-300 ease-out motion-reduce:transition-none",
                isUp
                    ? "translate-y-0 opacity-100"
                    : "translate-y-full opacity-0 pointer-events-none",
            )}
            // As in the old header bar: a hidden bar full of links has to leave the
            // tab order too, and aria-hidden alone would hide them from a screen
            // reader while leaving them focusable. pointer-events-none above is the
            // fallback for browsers without inert.
            inert={!isUp}
        >
            <NavMenu items={navItems} ariaLabel="Site navigation" />
        </div>
    );
};

export default SiteNav;
