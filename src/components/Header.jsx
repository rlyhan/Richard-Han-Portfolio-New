import { useCallback, useRef } from "react";
import gsap from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

const Header = () => {
    const headerRef = useRef(null)
    const scrollToSection = useCallback((selector) => {
        const header = headerRef.current;
        const headerOffset = header ? header.offsetHeight : 0;

        gsap.to(window, {
            duration: 1.6,
            ease: "power3.out",
            scrollTo: { y: selector, offsetY: headerOffset },
        });
    }, []);

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-black shadow-xl/20" ref={headerRef}>
            <nav className="max-w-7xl mx-auto flex items-center justify-end px-6 py-4">
                <ul className="flex gap-6 text-sm">
                    <li><button onClick={() => scrollToSection("#home")} className="text-white hover:text-gray-400">Home</button></li>
                    <li><button onClick={() => scrollToSection("#about")} className="text-white hover:text-gray-400">About</button></li>
                    <li><button onClick={() => scrollToSection("#projects")} className="text-white hover:text-gray-400">Projects</button></li>
                    <li><button onClick={() => scrollToSection("#contact")} className="text-white hover:text-gray-400">Contact</button></li>
                </ul>
            </nav>
        </header>
    )
}

export default Header