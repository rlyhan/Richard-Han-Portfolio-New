import { useCallback } from "react";
import cn from "classnames";
import NavMenu from "./layout/NavMenu";
import BackToTop from "./common/Buttons/BackToTop";
import { useCueScroll } from "../hooks/useCueScroll";
import { useRevealOnScrollUp } from "../hooks/useRevealOnScrollUp";

// The site's nav: the hero's own bar, pinned to the foot of the viewport for the
// rest of the page. It replaces the bar that used to be fixed across the top —
// one piece of furniture for the whole site rather than two.
//
// It is down while the viewer reads forward and comes back up the moment they
// scroll against the page; see useRevealOnScrollUp for the direction rule and for
// why nothing is shown over the hero, which carries a copy of this bar in its own
// layout.
const SiteNav = () => {
    // #main, not #home: the hero is sticky, so resolving it as a target reads its
    // stuck position and scrolls nowhere. The main element starts at the first
    // pixel of the page and stays where it is, so it resolves to the top.
    const { scrollToTarget: scrollToTop } = useCueScroll("#main");
    const { scrollToTarget: scrollToAbout } = useCueScroll("#about");
    const { scrollToTarget: scrollToProjects } = useCueScroll("#projects");
    const { scrollToTarget: scrollToContact } = useCueScroll("#contact");

    const { isRevealed, isAboveFloor } = useRevealOnScrollUp("#about");

    // As in Home: the href is the real destination and this only upgrades the
    // jump, so modified clicks and a page without JS both still work.
    const handleNavClick = useCallback(
        (scroll) => (event) => {
            if (
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey ||
                event.button !== 0
            )
                return;
            event.preventDefault();
            scroll();
        },
        [],
    );

    const navItems = [
        { id: "about", label: "About", onSelect: handleNavClick(scrollToAbout) },
        { id: "projects", label: "Projects", onSelect: handleNavClick(scrollToProjects) },
        { id: "contact", label: "Contact", onSelect: handleNavClick(scrollToContact) },
    ];

    return (
        <div
            className={cn(
                // Over the page, under the hero's scroll cue: at the top of the
                // page the bar is stacked on the hero's own copy of itself, and
                // the cue belongs in the middle of that bar rather than behind
                // it. Under the modal's layer either way.
                "fixed inset-x-0 bottom-0 z-30",
                // No slide over the hero, which has this same bar in its own
                // layout: up there the two are stacked, and sliding one out from
                // under the other smears the pair apart for the length of the
                // slide. Off at once instead, under an identical bar that is
                // already drawn — and on the way in there is nothing to animate,
                // since the bar only ever arrives from below the floor.
                !isAboveFloor &&
                    "transition-[translate,opacity] duration-300 ease-out motion-reduce:transition-none",
                isRevealed
                    ? "translate-y-0 opacity-100"
                    : "translate-y-full opacity-0 pointer-events-none",
            )}
            // As in the old header bar: a hidden bar full of links has to leave the
            // tab order too, and aria-hidden alone would hide them from a screen
            // reader while leaving them focusable. pointer-events-none above is the
            // fallback for browsers without inert.
            inert={!isRevealed}
        >
            <NavMenu items={navItems} ariaLabel="Site navigation">
                {/* No ring over the hero: there is nowhere to go back to up
                    there, the hero's own bar has no ring in the middle of it, and
                    that slot belongs to the scroll cue. Dropping it also takes the
                    bar back to the hero's own two-column grid, so the pair sit
                    exactly on top of one another. */}
                {!isAboveFloor && <BackToTop onClick={scrollToTop} />}
            </NavMenu>
        </div>
    );
};

export default SiteNav;
