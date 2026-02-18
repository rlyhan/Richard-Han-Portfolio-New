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

const Header = () => {
    const headerRef = useRef(null);
    const barRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const scrollToSection = useCallback((selector) => {
        const barHeight = barRef.current?.offsetHeight ?? 0;

        gsap.to(window, {
            duration: 1.2,
            ease: "power3.out",
            scrollTo: { y: selector, offsetY: barHeight },
        });
    }, []);


    const handleNavClick = (id) => {
        setIsOpen(false);
        scrollToSection(`#${id}`);
    };

    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    return (
        <header
            ref={headerRef}
            className="fixed top-0 left-0 w-full z-50 bg-neutral-900"
        >
            <nav ref={barRef} className="max-w-7xl mx-auto flex items-end justify-end px-6 py-4">
                {/* Desktop nav */}
                <ul className="hidden md:flex gap-6 text-sm">
                    {NAV_ITEMS.map((item) => (
                        <li key={item.id}>
                            <button
                                type="button"
                                onClick={() => handleNavClick(item.id)}
                                className="text-white hover:text-gray-400"
                            >
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>

                {/* Mobile hamburger */}
                <button
                    type="button"
                    className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-white hover:text-gray-400"
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
                <ul className="px-6 pb-4 pt-2 space-y-2 border-t border-white/10">
                    {NAV_ITEMS.map((item) => (
                        <li key={item.id}>
                            <button
                                type="button"
                                onClick={() => handleNavClick(item.id)}
                                className="w-full text-left py-2 text-white hover:text-gray-400"
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
