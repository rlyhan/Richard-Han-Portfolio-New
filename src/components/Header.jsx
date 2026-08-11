import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

const NAV_ITEMS = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
];

// The bar never shows this close to the top, so the hero is seen uninterrupted
// on first load and a short scroll back up always clears it.
const HIDE_ABOVE = 80;
// Movement smaller than this is treated as jitter (trackpad drift, iOS
// rubber-banding) rather than a change of direction.
const SCROLL_DELTA = 6;

// A section's resting position in the document, summed from the layout rather
// than read off its live box. About carries a scroll-driven transform while it
// climbs over the hero, and a box-based target would aim that offset too low —
// landing its heading behind this bar.
const getSectionFlowTop = (element) => {
    let top = 0;
    for (let node = element; node; node = node.offsetParent) top += node.offsetTop;
    return top;
};

const Header = () => {
    const barRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const scrollToSection = useCallback((selector, isHome) => {
        const barHeight = barRef.current?.offsetHeight ?? 0;

        if (isHome) {
            window.dispatchEvent(new Event("vanta:suppress"));
            gsap.to(window, {
                duration: 1.2,
                ease: "power3.out",
                // The top of the page rather than #home: the hero is sticky, so
                // resolving it as a target reads its stuck position — which is
                // already at the viewport top — and scrolls nowhere.
                scrollTo: { y: 0 },
                onComplete: () => {
                    // Wait for the browser to paint the final scroll position,
                    // then add a short pause before fading Vanta back in.
                    requestAnimationFrame(() => {
                        gsap.delayedCall(0.25, () => window.dispatchEvent(new Event("vanta:show")));
                    });
                },
            });
        } else {
            const section = document.querySelector(selector);
            if (!section) return;

            window.dispatchEvent(new Event("vanta:hide"));
            // Wait for fade-out (0.3s) before scrolling
            gsap.delayedCall(0.3, () => {
                gsap.to(window, {
                    duration: 1.2,
                    ease: "power3.out",
                    // Measured when the scroll starts, not when the click lands,
                    // so a section whose height is still settling is read late
                    // rather than early.
                    scrollTo: { y: Math.max(getSectionFlowTop(section) - barHeight, 0) },
                });
            });
        }
    }, []);


    const handleNavClick = (id) => {
        setIsOpen(false);
        scrollToSection(`#${id}`, id === "home");
    };

    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    // Direction-driven: scrolling down slides the bar in, scrolling up slides
    // it back out. Reads are batched into a frame so the scroll handler itself
    // never touches layout.
    useEffect(() => {
        let frame = null;
        let lastY = window.scrollY;

        const update = () => {
            frame = null;
            // Clamped because overscroll can report a negative scrollY, which
            // would otherwise read as an upward move on the way back down.
            const y = Math.max(window.scrollY, 0);
            const delta = y - lastY;
            const atTop = y <= HIDE_ABOVE;

            // Below the delta threshold lastY is left alone, so a slow drag
            // accumulates into a direction instead of being discarded frame by
            // frame. Near the top there is no direction to read: hidden wins.
            if (!atTop && Math.abs(delta) < SCROLL_DELTA) return;
            lastY = y;

            const revealed = !atTop && delta > 0;
            setIsVisible(revealed);
            if (!revealed) setIsOpen(false);
        };

        const onScroll = () => {
            if (frame === null) frame = requestAnimationFrame(update);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            if (frame !== null) cancelAnimationFrame(frame);
        };
    }, []);

    return (
        <header
            // Translucent rather than solid: the bar has to sit over the hero's
            // full-bleed display lines, and a hard block cut a visible seam across
            // them. Borderless, so the blur and the shadow's falloff are what end
            // the bar instead of a hairline.
            // Tailwind v4's translate utilities set the standalone `translate`
            // property, not `transform` — transitioning `transform` here would
            // fade the bar in while snapping it into place.
            className={`fixed top-0 left-0 w-full z-50 bg-carbon-900/80 backdrop-blur-md shadow-bar transition-[translate,opacity] duration-300 ease-out motion-reduce:transition-none ${isVisible
                ? "translate-y-0 opacity-100"
                : "-translate-y-full opacity-0 pointer-events-none"
                }`}
            // `inert` rather than `aria-hidden`: the bar holds focusable
            // buttons, and aria-hidden would hide them from screen readers
            // while leaving them in the tab order. inert takes them out of
            // both. pointer-events-none above stays as the fallback for
            // browsers without inert.
            inert={!isVisible}
        >
            <nav ref={barRef} className="max-w-7xl mx-auto flex items-end justify-end px-6 py-4">
                {/* Desktop nav */}
                <ul className="hidden md:flex gap-6 text-sm">
                    {NAV_ITEMS.map((item) => (
                        <li key={item.id}>
                            <button
                                type="button"
                                onClick={() => handleNavClick(item.id)}
                                className="text-paper hover:text-neon transition-colors"
                            >
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>

                {/* Mobile hamburger */}
                <button
                    type="button"
                    className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-paper hover:text-neon transition-colors"
                    aria-label="Open menu"
                    aria-expanded={isOpen}
                    aria-controls="mobile-menu"
                    onClick={() => setIsOpen((v) => !v)}
                >
                    {/* Simple hamburger icon */}
                    <svg
                        className="h-6 w-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </nav>

            {/* Mobile menu panel */}
            <div
                id="mobile-menu"
                className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-200 ease-out ${isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <ul className="px-6 pb-4 pt-2 space-y-2">
                    {NAV_ITEMS.map((item) => (
                        <li key={item.id}>
                            <button
                                type="button"
                                onClick={() => handleNavClick(item.id)}
                                className="w-full text-left py-2 text-paper hover:text-neon transition-colors"
                            >
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </header>
    );
};

export default Header;
