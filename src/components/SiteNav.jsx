import cn from "classnames";
import NavMenu from "./layout/NavMenu";
import BackToTop from "./common/Buttons/BackToTop";
import { useRouter } from "../routes/RouterContext";
import { useNavItems } from "../routes/useNavLinks";
import { useScriptedScroll } from "../hooks/useScriptedScroll";
import { useRevealOnScrollUp } from "../hooks/useRevealOnScrollUp";

// The site's nav: the hero's own bar, pinned to the foot of the viewport for the
// rest of the site. It replaces the bar that used to be fixed across the top —
// one piece of furniture for the whole site rather than two.
//
// It lives outside the pages, so a page change is not this bar being rebuilt: it
// stays exactly where it is while the document underneath it is handed over.
//
// It is down while the viewer reads forward and comes back up the moment they
// scroll against the page; see useRevealOnScrollUp for the direction rule and for
// why nothing is shown over the hero, which carries a copy of this bar in its own
// layout.
const SiteNav = () => {
    // #main, not the page's own section: the hero is sticky, so resolving it as a
    // target reads its stuck position and scrolls nowhere. The main element starts at
    // the first pixel of the document and stays where it is, so it resolves to the
    // top of whichever page is in it.
    const { scrollToTarget: scrollToTop } = useScriptedScroll("#main");

    // Which page this bar is standing on decides where its floor is, and the router
    // is what knows: the hero draws a copy of this bar in its own layout, and a page
    // that doesn't has nothing for a pinned bar to be drawn twice over.
    const { navFloorSelector, layoutKey, swap } = useRouter();

    // Nothing but the direction decides this, on every page: arriving somewhere is
    // not asking for the nav, however you arrived. A page opens without the bar, and
    // scrolling against the page is what calls it up — see useRevealOnScrollUp.
    const { isRevealed, isAboveFloor } = useRevealOnScrollUp(navFloorSelector, layoutKey);

    // Over the hero's own copy of this bar — which is the one place the two are
    // stacked, and the only reason any of this is conditional. A floor belongs to a
    // page that draws the bar itself, so a page without one is never over anything.
    const isOverOwnBar = Boolean(navFloorSelector) && isAboveFloor;

    // The bar belongs to the page under it, and for the length of a swap there are
    // two. It goes down with the page being left — behind the page rising over it, so
    // there is nothing to see — and comes back up on the one that arrives, which is
    // the slide the viewer sees. Uncovering it in place when the curtain lifts is
    // what made it appear rather than arrive.
    const isUp = isRevealed && !swap;

    const navItems = useNavItems();

    return (
        <div
            className={cn(
                // Over the page and under the layers that take it over: the
                // modal's scrim, and the page a swap carries in — which is what
                // this bar goes down for, rather than being slid under.
                "fixed inset-x-0 bottom-0 z-30",
                // No slide over the hero, which has this same bar in its own
                // layout: up there the two are stacked, and sliding one out from
                // under the other smears the pair apart for the length of the
                // slide. Off at once instead, under an identical bar that is
                // already drawn — and on the way in there is nothing to animate,
                // since the bar only ever arrives from below the floor.
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
            <NavMenu items={navItems} ariaLabel="Site navigation">
                {/* No ring over the hero: there is nowhere to go back to up
                    there, and the hero's own bar has no ring in the middle of it.
                    Dropping it also takes the bar back to the hero's own
                    two-column grid, so the pair sit exactly on top of one
                    another. */}
                {!isOverOwnBar && <BackToTop onClick={scrollToTop} />}
            </NavMenu>
        </div>
    );
};

export default SiteNav;
